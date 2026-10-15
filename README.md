# Vansh Rastogi — AI Filmmaking Portfolio

Complete source and local assets for the portfolio. This public repository is the GitHub copy used for future updates and external deployment.

## GitHub Pages

Pushes to `main` deploy automatically through `.github/workflows/pages.yml`. `scripts/build_pages.py` prepares `_site` with the current Pages URL for media paths, canonical/OG metadata, JSON-LD, sitemap and the contact redirect. Set Pages source to GitHub Actions. The repository name `vanshxrastogi.github.io` serves the portfolio at the root URL.

## Run or deploy

This is a buildless static website. Publish the `dist` directory. No dependency install or build command is required.

- Netlify: connect this repository, choose branch `main`, leave build command empty, and set publish directory to `dist`. `netlify.toml` is included.
- Local preview: `python3 -m http.server 8000 --directory dist`.
- Other static hosts: upload the contents of `dist` while preserving all paths.

## File mapping

| Path | Purpose |
| --- | --- |
| `dist/index.html` | Main portfolio and contact form |
| `dist/style.css` | Visual design, layout and responsive styles |
| `dist/app.js` | Gallery filters, modal player, portrait and music |
| `dist/content.json` | Owner profile, projects, services and toolkit |
| `dist/media` | Actual videos, photos, covers, audio and PDF resume |
| `dist/logos` | Local tool logos |
| `dist/films` | Individual film pages with VideoObject structured data |
| `dist/privacy.html`, `dist/terms.html` | Legal information |
| `dist/sitemap.xml`, `dist/robots.txt` | Search-engine crawling configuration |
| `scripts/validate.py` | Basic content/navigation checks |
| `.openai/hosting.json` | Existing ChatGPT Sites identity; not required by Netlify |

## Future updates

Edit the source and project metadata together. When adding a film, preserve the original aspect ratio, add its video and cover to `dist/media`, add the project to `dist/content.json`, and update its film page and sitemap. Keep GitHub commits in `main` synchronized with authorized site edits. This is a source backup, not a background sync service.

Current Sites project: `appgprj_6acf0970201481919c9d1084debee296`.
Primary GitHub Pages site: https://vanshxrastogi.github.io/
Original Sites deployment: https://vansh-rastogi-film.unscriptedstorylab.chatgpt.site/
GitHub: https://github.com/vanshxrastogi/vanshxrastogi.github.io

Before switching to a new live domain, update canonical/OG URLs, JSON-LD, sitemap/robots URLs and the contact form `_next` destination. The contact form sends through FormSubmit to `vanshrastogimvm@gmail.com`; one-time email activation is required.

## Checks

`node --check dist/app.js`

`python3 scripts/validate.py`

## SEO and monetization

Static film pages, metadata, structured data and legal pages are included. Google indexing and AdSense approval are not guaranteed. AdSense/Analytics scripts are not enabled. Use only the owner's real publisher/measurement IDs and review applicable rights and consent requirements before enabling them.

No passwords, tokens, `.env` files, Git credentials or dependency folders are included. Third-party marks and media retain their respective rights.
