# AdSense publishing setup

Primary site: https://vanshxrastogi.github.io/

This is publisher monetization: other advertisers can show ads on eligible pages. It does not create a paid Google Ads campaign. No ad account, payment account or publisher ID has been invented. Ads are currently disabled.

## Already prepared

- Searchable service pages, two filmmaking guides, a visible author/about section, contact details, privacy information and copyright terms.
- Canonical metadata, social previews, existing individual video pages, ordinary sitemap and video sitemap.
- Noindex for the enquiry thank-you page.
- A build-time AdSense configuration in `dist/monetization.json`.

## Connect the real account

1. In the owner's AdSense account, add `https://vanshxrastogi.github.io/` and use the publisher identifier supplied by Google. If the account UI does not accept the hosting address, use an owned custom domain and update the Pages domain and canonical URL mapping.
2. Set `publisherId` in `dist/monetization.json` to the owner's real `ca-pub-` identifier. Keep `enableAds`, `approvedSite` and `consentConfigured` false.
3. Push to `main`. The Pages build adds the ownership meta tag and generates the root `ads.txt` record for that account. No ad script loads in this verification state.
4. Verify ownership in AdSense and request the site review. Resolve any issues shown by Google. Do not mark `approvedSite` true unless the account actually shows Ready.
5. Review all content rights and Google's publisher policies. Brand and character concepts require special care; excluded film pages do not become eligible merely because other pages are approved. The initial ad allowlist contains only the two text guides. Do not place ads in the intro, film player, enquiry form, resume controls or empty/utility pages.
6. Configure the required privacy messages and consent platform in AdSense. For the EEA, UK and Switzerland, use the current Google-certified CMP requirements. Update the site's privacy text to describe the real deployed setup. A configuration flag alone does not implement consent.
7. Only after approval, content review and consent setup, set `approvedSite`, `consentConfigured` and `enableAds` to true. Enable the desired formats in AdSense. The build then loads the unmodified official AdSense loader on `adPaths` only. Start with restrained in-page formats; inspect the real preview before enabling anchors, vignettes or other overlays.
8. Check the live pages, ads.txt status, consent behavior and AdSense Policy center. Do not click your own ads or ask visitors to click them.

## Limits and remaining work

- No AdSense sign-in, publisher ID, review approval or live revenue has been verified.
- A portfolio, added pages or a valid script does not guarantee approval, ranking, impressions or earnings.
- Existing uploaded videos were preserved. Ownership/usage rights and advertiser suitability need owner review.
- Search Console verification requires the owner's account/verification value. No fake verification tag is installed.
- The existing contact form still uses FormSubmit. Google Sheets automation remains blocked on completing the owner's Google sign-in from the earlier task; it is not claimed active.
- Confirm FormSubmit email activation and delivery before relying on contact submissions.

## Verification commands

`SITE_URL=https://vanshxrastogi.github.io python3 scripts/build_pages.py`

Inspect the output in `_site`. With the supplied disabled configuration, there must be no AdSense loader, fake publisher tag or ads.txt seller entry.
