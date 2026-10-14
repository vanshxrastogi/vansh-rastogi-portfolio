# Vansh Rastogi — The Future of Filmmaking
Production-ready static portfolio, with no framework dependencies. The brief allows choosing technology for maintainability: native modules and CSS keep this media-first portfolio fast and portable. Serve dist/ with any static server. Netlify publish directory: dist. No build command. All four navigation destinations use stable hash routes; films use #project/slug. This preview contains no invented films, portrait, or resume.

## Edit content
Edit dist/content.json. Authentic files go in dist/media/. Set hero.video, hero.mobileVideo, hero.poster, profile.portrait and profile.resume (original PDF). Instagram has been enabled at the owner’s request. Configure showreel as an object with title and video; featuredProjectId must refer to an approved published project.

Project shape:
```json
{"id":"unique-film-slug","title":"Actual title","category":"AI COMMERCIALS","role":"Actual role","year":2026,"duration":"00:30","aspectRatio":"16:9","video":"/media/film.mp4","poster":"/media/film.jpg","description":"Approved description","status":"draft"}
```
Only status published is shown. Supported categories: AI COMMERCIALS, BRAND FILMS, ORIGINAL FILMS, CGI & PRODUCT, REELS. Filters come from actual published records. Native controls provide playback, mute, seeking and fullscreen; aspect ratio is preserved. External HTTPS media URLs work as well. Large video libraries should use dedicated media storage instead of Git (GitHub has file size limits). Preserve original masters separately; do not silently recompress user footage.

## Chat-to-site update workflow
1. Attach film, optional poster and project title/category/role.
2. Inspect duration and dimensions with ffprobe; extract an authentic frame using ffmpeg if no poster is supplied.
3. Add a draft record; retain existing records.
4. Preview on an isolated draft branch or owner-private preview, temporarily including the draft for review.
5. Ask owner approval; only then set published, commit and update production.
6. Verify media URL, duration, aspect ratio and sound in the deployed player.

## GitHub / Netlify
The Sites source repository is distinct from your own GitHub account. No private GitHub repository has been created without account access and authorization. Import this folder into a new private GitHub repository. Connect that repository in Netlify with publish directory dist, no build command. netlify.toml is included. Never include credentials or .env files. Confirm the real production domain before adding canonical URLs and a sitemap; this preview intentionally has no invented canonical domain or project SEO records. Add actual project metadata when approved films arrive.

## Verification
Run node --check dist/app.js and python3 scripts/validate.py. Browser QA and real video/resume tests require preview access and actual media. Responsive rules cover narrow screens, keyboard navigation, focus states, reduced motion, mobile navigation, native dialog focus management and semantic HTML.

Update: animated orbital hero, scroll reveals with reduced-motion support, orientation filters, nine service rows, creative toolkit and WhatsApp enquiry form. The supplied resume upload contains HTML rather than PDF and was deliberately not attached. Replace profile.resume only after a valid original PDF is supplied.

Hero media: original 10-second 1280×720 H.264 clip preserved byte-for-byte, muted autoplay loop, original audio retained. Resume: original DOCX preserved; two-page PDF conversion visually checked. Toolkit: supplied resume tools with locally stored available logos; wordmarks used when logo acquisition is unavailable. Linktree hub included; extracted social targets must be verified before replacement.


Portfolio update: The Last Bus and Vice City Dreams are independent vertical AI creative reels. Pre-Wedding remains in All and its category. Film shelves support horizontal scroll, snap and previous/next controls. 720p footage receives a Lanczos 1080p presentation export with gentle sharpening; this does not restore missing source detail.

Contact enquiries POST to FormSubmit for vanshrastogimvm@gmail.com. One-time recipient activation is required after the first submission. CAPTCHA remains enabled. Delivery and browser interactions remain unverified in managed QA.


SEO and monetization preparation (14 October 2026):
- Static film detail pages in dist/films, a crawlable homepage film directory, canonical metadata, Person/ProfilePage/WebSite and VideoObject JSON-LD.
- sitemap.xml lists homepage, legal pages and all published film pages. robots.txt allows public crawling and excludes the enquiry thank-you page.
- Privacy and Terms/Copyright describe actual form processing and distinguish third-party trademarks/concept work.
- No AdSense or Analytics tags are enabled. Add only the owner's real publisher/measurement IDs. Search Console verification needs the owner-provided verification token or verified account. ads.txt must use the actual publisher ID. Do not put dummy IDs into public files.
- AdSense review, content rights, consent requirements and Google indexing must be checked before monetization. These checks cannot be satisfied by metadata alone.
- New projects must regenerate film pages and sitemap when their descriptions or files change.
- The newly attached AD.mp4 is Navyug Public School, 96 seconds, 1920x1080. No bag UGC attachment was provided in this turn.


GitHub backup: full static website in `dist/`. Netlify publish directory: `dist`; build command: none. No credentials are stored. Keep media paths unchanged when updating.
