#!/usr/bin/env python3
import json
import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]
errors = []


def load(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


required = [
    "index.html",
    "styles.css",
    "app.js",
    "data/candidates.json",
    "data/rankings.json",
    "data/rankings.js",
    "data/history.json",
    "data/history.js",
]
for name in required:
    if not (ROOT / name).exists():
        errors.append(f"Missing required file: {name}")

catalog = load(ROOT / "data/candidates.json")
ranking = load(ROOT / "data/rankings.json")
history = load(ROOT / "data/history.json")

ids = [item["id"] for item in catalog["candidates"]]
if len(ids) != len(set(ids)):
    errors.append("Candidate ids are not unique")

ranked_ids = [item["id"] for item in ranking["items"]]
if set(ids) != set(ranked_ids):
    errors.append("Candidate and ranking item sets differ")

ranks = [item["rank"] for item in ranking["items"]]
if ranks != list(range(1, len(ranks) + 1)):
    errors.append("Ranks are not sequential")

for item in ranking["items"]:
    if not 0 <= item["score"] <= 100:
        errors.append(f"Score out of range: {item['id']}")
    if not item["download_url"].startswith("https://"):
        errors.append(f"Non-HTTPS download URL: {item['id']}")
    if item["rank"] <= 10 and not item.get("ever_top10"):
        errors.append(f"Top-ten item not marked ever_top10: {item['id']}")

dates = [snapshot["date"] for snapshot in history.get("snapshots", [])]
if dates != sorted(set(dates)):
    errors.append("History dates are not unique and sorted")

html = (ROOT / "index.html").read_text(encoding="utf-8")
javascript = (ROOT / "app.js").read_text(encoding="utf-8")
for asset in ["styles.css", "app.js", "data/rankings.js", "data/history.js"]:
    if asset not in html:
        errors.append(f"index.html does not reference {asset}")
if "scrollIntoView" in javascript:
    errors.append("Forbidden scrollIntoView usage found")
if re.search(r"const\s+styles\s*=", javascript):
    errors.append("Unsafe global styles object found")

if errors:
    print("Validation failed:")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print(
    f"Validation passed: {len(ranking['items'])} ranked skills, "
    f"{len(history.get('snapshots', []))} daily snapshots."
)
