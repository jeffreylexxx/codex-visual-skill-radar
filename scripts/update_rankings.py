#!/usr/bin/env python3
"""Refresh GitHub metrics, discover relevant skills, rank them, and retain history.

Uses only the Python standard library. In GitHub Actions, GITHUB_TOKEN raises API
limits. When the API is unavailable, cached metrics remain valid and the site is
still regenerated with a transparent source-status notice.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import pathlib
import re
import time
import urllib.error
import urllib.parse
import urllib.request


ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
CANDIDATES_PATH = DATA_DIR / "candidates.json"
RANKINGS_PATH = DATA_DIR / "rankings.json"
HISTORY_PATH = DATA_DIR / "history.json"

SEARCH_QUERIES = [
    'codex skill poster in:name,description,readme',
    'agent skill graphic design poster in:name,description,readme',
    'gpt-image-2 skill poster in:name,description,readme',
]

RELEVANT_RE = re.compile(
    r"poster|graphic design|image generation|imagegen|gpt.image|brand|visual|"
    r"risograph|zine|editorial|infographic|海报|视觉|生图",
    re.IGNORECASE,
)


def load_json(path: pathlib.Path, default):
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_json(path: pathlib.Path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    temporary.replace(path)


def save_javascript(path: pathlib.Path, variable: str, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(payload, ensure_ascii=True, separators=(",", ":"))
    path.write_text(f"window.{variable}={serialized};\n", encoding="utf-8", newline="\n")


class GitHubClient:
    def __init__(self, token: str | None, offline: bool = False):
        self.token = token
        self.offline = offline
        self.errors: list[str] = []
        self.remaining = None

    def get(self, path_or_url: str):
        if self.offline:
            raise RuntimeError("offline mode")
        url = (
            path_or_url
            if path_or_url.startswith("https://")
            else "https://api.github.com" + path_or_url
        )
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "Codex-Visual-Skill-Radar",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        request = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                remaining = response.headers.get("X-RateLimit-Remaining")
                if remaining is not None:
                    self.remaining = int(remaining)
                return json.load(response)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
            message = f"{url}: {getattr(exc, 'code', type(exc).__name__)}"
            self.errors.append(message)
            raise


def clamp(value, low=0, high=100):
    return max(low, min(high, value))


def parse_date(value: str | None) -> dt.datetime:
    if not value:
        return dt.datetime(1970, 1, 1, tzinfo=dt.timezone.utc)
    return dt.datetime.fromisoformat(value.replace("Z", "+00:00"))


def maintenance_score(pushed_at: str | None, now: dt.datetime) -> float:
    days = max(0, (now - parse_date(pushed_at)).days)
    if days <= 7:
        return 100
    if days <= 30:
        return 100 - (days - 7) * 0.43
    if days <= 90:
        return 90 - (days - 30) * 0.30
    if days <= 180:
        return 72 - (days - 90) * 0.19
    if days <= 365:
        return 55 - (days - 180) * 0.11
    return max(15, 35 - (days - 365) * 0.025)


def adoption_score(stars: int, forks: int, scope_factor: float) -> float:
    effective_stars = max(0, stars * scope_factor)
    effective_forks = max(0, forks * scope_factor)
    return clamp(
        18 * math.log10(effective_stars + 1)
        + 8 * math.log10(effective_forks + 1)
    )


def calculate(candidate: dict, now: dt.datetime) -> dict:
    metrics = candidate.get("metrics", {})
    manual = candidate.get("manual", {})
    stars = int(metrics.get("stars") or 0)
    forks = int(metrics.get("forks") or 0)
    scope_factor = float(candidate.get("scope_factor") or 1)
    adoption = adoption_score(stars, forks, scope_factor)
    evidence = float(manual.get("evidence_quality") or 35)
    feedback = 0.55 * evidence + 0.45 * adoption
    maintenance = maintenance_score(metrics.get("pushed_at"), now)
    design_fit = float(manual.get("design_fit") or 65)
    codex_fit = float(manual.get("codex_fit") or 65)
    docs = float(manual.get("docs_examples") or 55)
    score = (
        design_fit * 0.30
        + codex_fit * 0.25
        + feedback * 0.20
        + maintenance * 0.15
        + docs * 0.10
    )
    feedback_count = len(candidate.get("feedback", []))
    confidence = clamp(evidence * 0.65 + docs * 0.20 + feedback_count * 4)
    result = dict(candidate)
    result["score"] = round(score, 1)
    result["confidence"] = round(confidence)
    result["score_breakdown"] = {
        "design_fit": round(design_fit),
        "codex_fit": round(codex_fit),
        "public_feedback": round(feedback),
        "maintenance": round(maintenance),
        "docs_examples": round(docs),
        "adoption_proxy": round(adoption),
    }
    return result


def refresh_repo_metrics(client: GitHubClient, candidate: dict):
    repo = candidate.get("repo")
    if not repo:
        return
    try:
        data = client.get(f"/repos/{repo}")
    except Exception:
        return
    candidate.setdefault("metrics", {}).update(
        {
            "stars": data.get("stargazers_count", 0),
            "forks": data.get("forks_count", 0),
            "open_issues": data.get("open_issues_count", 0),
            "pushed_at": data.get("pushed_at"),
            "license": (data.get("license") or {}).get("spdx_id") or "Unknown",
            "archived": bool(data.get("archived")),
        }
    )


def root_has_skill(client: GitHubClient, repo: str) -> bool:
    try:
        contents = client.get(f"/repos/{repo}/contents")
    except Exception:
        return False
    names = {item.get("name", "") for item in contents if isinstance(item, dict)}
    if "SKILL.md" in names:
        return True
    return "skills" in names or ".codex" in names or ".agents" in names


def classify_discovery(repo_data: dict, today: str) -> dict:
    name = repo_data["name"].replace("-", " ").title()
    text = " ".join(
        [repo_data.get("name") or "", repo_data.get("description") or ""]
    ).lower()
    if "zine" in text or "riso" in text:
        focus = "自动发现：Zine / Riso 海报"
        styles = ["Zine", "Riso", "编辑海报"]
        design_fit = 87
    elif "academic" in text or "research" in text or "cvpr" in text:
        focus = "自动发现：学术与研究海报"
        styles = ["学术", "研究可视化", "信息密集"]
        design_fit = 84
    elif "brand" in text:
        focus = "自动发现：品牌视觉"
        styles = ["品牌", "视觉识别", "商业设计"]
        design_fit = 82
    elif "poster" in text:
        focus = "自动发现：海报设计"
        styles = ["海报", "图像生成"]
        design_fit = 84
    else:
        focus = "自动发现：通用图像生成"
        styles = ["通用", "图像生成"]
        design_fit = 70
    codex_fit = 90 if "codex" in text else 76
    repo = repo_data["full_name"]
    return {
        "id": re.sub(r"[^a-z0-9]+", "-", repo.lower()).strip("-"),
        "name": name,
        "repo": repo,
        "skill_path": "SKILL.md / skills directory",
        "download_url": repo_data["html_url"],
        "focus": focus,
        "style": styles,
        "designer": "需要先人工复核的新技能探索者",
        "summary": repo_data.get("description") or "由每日 GitHub 搜索自动发现，等待人工研究补全。",
        "scenarios": ["新技能试用", "视觉方向探索"],
        "tips": ["安装前阅读完整 SKILL.md", "先用低风险样例验证输出", "检查许可证与外部 API 依赖"],
        "cases": [{"label": "GitHub 仓库", "url": repo_data["html_url"]}],
        "feedback": [
            {
                "type": "discovery",
                "label": "自动发现，待复核",
                "summary": "项目由每日检索找到；Stars/Forks 仅作采用度代理，尚无独立用户反馈结论。",
                "url": repo_data["html_url"],
                "strength": 1,
            }
        ],
        "compatibility": "发现到 SKILL.md 结构；Codex 桌面端兼容性待人工验证",
        "metric_scope": "auto-discovered",
        "scope_factor": 0.8,
        "first_seen": today,
        "auto_discovered": True,
        "metrics": {
            "stars": repo_data.get("stargazers_count", 0),
            "forks": repo_data.get("forks_count", 0),
            "open_issues": repo_data.get("open_issues_count", 0),
            "pushed_at": repo_data.get("pushed_at"),
            "license": (repo_data.get("license") or {}).get("spdx_id") or "Unknown",
        },
        "manual": {
            "design_fit": design_fit,
            "codex_fit": codex_fit,
            "evidence_quality": 30,
            "docs_examples": 55,
        },
    }


def discover(client: GitHubClient, existing_repos: set[str], today: str, limit=8):
    found = []
    inspected = 0
    for query in SEARCH_QUERIES:
        if inspected >= limit:
            break
        encoded = urllib.parse.quote(query)
        try:
            payload = client.get(
                f"/search/repositories?q={encoded}&sort=stars&order=desc&per_page=12"
            )
        except Exception:
            break
        for item in payload.get("items", []):
            repo = item["full_name"]
            if repo in existing_repos or inspected >= limit:
                continue
            haystack = f'{item.get("name", "")} {item.get("description", "")}'
            if not RELEVANT_RE.search(haystack):
                continue
            inspected += 1
            if not root_has_skill(client, repo):
                continue
            candidate = classify_discovery(item, today)
            found.append(candidate)
            existing_repos.add(repo)
    return found


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--offline", action="store_true", help="Use cached metrics")
    parser.add_argument("--no-discovery", action="store_true")
    args = parser.parse_args()

    now = dt.datetime.now(dt.timezone.utc)
    today = now.date().isoformat()
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    client = GitHubClient(token=token, offline=args.offline)

    catalog = load_json(CANDIDATES_PATH, {"schema_version": 1, "candidates": []})
    candidates = catalog.get("candidates", [])
    previous = load_json(RANKINGS_PATH, {"items": []})
    previous_by_id = {item["id"]: item for item in previous.get("items", [])}

    if not args.offline:
        for index, candidate in enumerate(candidates):
            refresh_repo_metrics(client, candidate)
            if token and index % 20 == 19:
                time.sleep(0.2)

        if not args.no_discovery and token:
            repos = {candidate.get("repo") for candidate in candidates}
            newly_found = discover(client, repos, today)
            if newly_found:
                candidates.extend(newly_found)
                catalog["candidates"] = candidates
                save_json(CANDIDATES_PATH, catalog)

    ranked = [calculate(candidate, now) for candidate in candidates]
    ranked.sort(
        key=lambda item: (
            item["score"],
            item["confidence"],
            item.get("metrics", {}).get("stars", 0),
        ),
        reverse=True,
    )

    previous_ranks = {item["id"]: item.get("rank") for item in previous.get("items", [])}
    previous_top10 = {
        item["id"] for item in previous.get("items", []) if item.get("rank", 999) <= 10
    }
    for rank, item in enumerate(ranked, start=1):
        old_rank = previous_ranks.get(item["id"])
        item["rank"] = rank
        item["previous_rank"] = old_rank
        item["rank_delta"] = 0 if old_rank is None else old_rank - rank
        item["new_entry"] = old_rank is None
        item["new_top10"] = rank <= 10 and item["id"] not in previous_top10
        old = previous_by_id.get(item["id"], {})
        item["first_seen"] = item.get("first_seen") or old.get("first_seen") or today
        item["ever_top10"] = bool(rank <= 10 or old.get("ever_top10"))
        item["last_top10_at"] = today if rank <= 10 else old.get("last_top10_at")

    status = "offline-cache" if args.offline else "github-api"
    if client.errors:
        status = "partial-cache"
    rankings = {
        "schema_version": 1,
        "updated_at": now.isoformat().replace("+00:00", "Z"),
        "ranking_date": today,
        "source_status": status,
        "api_errors": client.errors[:8],
        "rate_limit_remaining": client.remaining,
        "methodology": catalog.get("methodology", {}),
        "stats": {
            "tracked": len(ranked),
            "top10": min(10, len(ranked)),
            "ever_top10": sum(1 for item in ranked if item.get("ever_top10")),
            "auto_discovered": sum(1 for item in ranked if item.get("auto_discovered")),
        },
        "items": ranked,
    }
    save_json(RANKINGS_PATH, rankings)

    history = load_json(HISTORY_PATH, {"schema_version": 1, "snapshots": []})
    snapshots = [
        snapshot
        for snapshot in history.get("snapshots", [])
        if snapshot.get("date") != today
    ]
    snapshots.append(
        {
            "date": today,
            "updated_at": rankings["updated_at"],
            "source_status": status,
            "top10": [item["id"] for item in ranked[:10]],
            "ranks": {item["id"]: item["rank"] for item in ranked},
            "scores": {item["id"]: item["score"] for item in ranked},
        }
    )
    history["snapshots"] = sorted(snapshots, key=lambda item: item["date"])
    save_json(HISTORY_PATH, history)
    save_javascript(DATA_DIR / "rankings.js", "__RADAR_DATA__", rankings)
    save_javascript(DATA_DIR / "history.js", "__RADAR_HISTORY__", history)
    print(
        f"Updated {len(ranked)} skills for {today} ({status}); "
        f"top: {ranked[0]['name'] if ranked else 'none'}"
    )


if __name__ == "__main__":
    main()
