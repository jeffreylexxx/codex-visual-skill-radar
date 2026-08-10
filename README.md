# Codex Visual Skill Radar

An evidence-aware, daily-updated ranking of GitHub skills for graphic design, posters, brand systems, editorial visuals, image-first presentations, and visual-production workflows in Codex.

The site is a static application. It requires no framework, package install, database, API key, or server at viewing time. GitHub Actions refreshes public repository signals once a day, keeps every historical top-ten entry, commits the resulting data snapshot, and deploys the site to GitHub Pages.

## Publish on GitHub Pages

1. Upload everything in this folder to the root of a new GitHub repository. Preserve `.github/workflows/daily-refresh-pages.yml`.
2. Open **Settings > Pages** in the repository.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Open **Actions > Daily skill ranking and Pages** and run **Run workflow** once.
5. After deployment, the public URL appears in the workflow's `deploy` job and in **Settings > Pages**.

The scheduled refresh runs at 01:20 UTC, which is 09:20 in Asia/Shanghai. Change the cron expression in `.github/workflows/daily-refresh-pages.yml` if you prefer a different time.

## What updates every day

`scripts/update_rankings.py` performs four operations:

1. Refreshes stars, forks, open issues, latest push time, archive state, and license from the GitHub API.
2. With the workflow token, searches GitHub for newly relevant skill repositories and conservatively adds valid-looking discoveries to the permanent candidate catalog.
3. Recalculates every score and continuous rank, including positions 11, 12, 13, and onward.
4. Appends one snapshot per calendar day to `data/history.json`. A second run on the same day replaces that day's snapshot instead of creating a duplicate.

The generated `rankings.js` and `history.js` mirror the JSON data. They allow the site to work when `index.html` is opened directly from disk, where browser `fetch()` calls are often blocked.

## Ranking method

| Lane | Weight | Meaning |
| --- | ---: | --- |
| Design fit | 30% | Direct usefulness for poster, brand, editorial, advertising, presentation, or adjacent visual design |
| Codex fit | 25% | Valid skill structure, native tools, installation clarity, and Desktop compatibility |
| Public feedback | 20% | Independent reviews, showcases, community discussions, registry installs, and scoped adoption proxies |
| Maintenance | 15% | Recency of repository activity, with gradual decay rather than deletion |
| Docs and examples | 10% | Installation, workflows, examples, constraints, and quality checks |

Stars and forks are explicitly treated as adoption proxies, not satisfaction. The ranking applies a `scope_factor` to host repositories containing many unrelated skills so their total popularity does not overwhelm a focused standalone skill.

The manual research fields remain curated. Daily automation updates objective signals and conservative discoveries; it does not invent qualitative user feedback.

## Add or refine a skill

Edit `data/candidates.json` and add a unique record. The minimum useful fields are:

- `id`, `name`, `repo`, `skill_path`, and `download_url`
- `focus`, `style`, `designer`, and `summary`
- `scenarios`, `tips`, `cases`, and `feedback`
- `compatibility`, `metric_scope`, and `scope_factor`
- manual 0-100 ratings for `design_fit`, `codex_fit`, `evidence_quality`, and `docs_examples`

Then run:

```bash
python scripts/update_rankings.py --offline
python scripts/validate_site.py
```

Use the normal refresh command when a GitHub token or unauthenticated API quota is available:

```bash
python scripts/update_rankings.py
```

## Local preview

You can double-click `index.html`, or use a local server:

```bash
python -m http.server 8000
```

Then open `http://127.0.0.1:8000`.

## Evidence and limitations

- OpenAI's official skill documentation defines the compatibility baseline: <https://learn.chatgpt.com/docs/build-skills>.
- Each qualitative statement links to its originating review, issue, showcase, registry, analytics page, or repository.
- A high score does not guarantee that generated artwork matches a particular designer's taste.
- Automated discoveries are visibly marked and receive conservative evidence and documentation ratings until manually reviewed.
- GitHub scheduled workflows can occasionally start later than the exact cron minute. The freshness badge shows the date and whether the current build used live API signals or cached data.

## License

Site code and ranking scripts are available under the MIT License. Linked projects retain their own licenses.
