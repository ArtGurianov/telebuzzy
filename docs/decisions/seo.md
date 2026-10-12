# SEO

## Scope

- One indexable page: the landing page `/`. Everything else is an API (`/api/*`, disallowed in `robots.txt`) or an overlay on the landing page (`/billing`, `noindex, follow` and no canonical, left crawlable so the `noindex` is seen)
- Login/logout query states (`?loggedIn`, `?loggedOut`) render the landing page and carry the same canonical

## Where it lives

- `telebuzzy-frontend/src/config/site.ts` — site name, title, description, OG image, theme color, and the site origin (`SITE.url`) from `APP_DOMAIN`. `APP_DOMAIN` must therefore be the deployment's public `https://` origin: canonical URLs, Open Graph URLs, `robots.txt` and the sitemap are built from it
- `src/app/layout.tsx` — `metadata` (`metadataBase`, title template `%s · Telebuzzy`, description, canonical `/`, Open Graph, Twitter `summary_large_image`, robots) and `viewport` (theme color)
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/manifest.ts` — `robots.txt`, `sitemap.xml`, `manifest.webmanifest`
- `src/app/(main)/page.tsx` — schema.org JSON-LD (`Organization`, `WebSite`, `WebApplication` with the free LITE offer). PRO prices are read from the contract at checkout, so no PRO price is published in structured data
- `public/og-image.jpg` — 1200×630 social preview: `tt-bg` and `tt-logo` composed with the hero headline in Fredoka (see design contract §3.4)
- Icons: `src/app/favicon.ico`, `icon.png`, `apple-icon.png` (design contract §3.2)

## Indexing gate

- `isSiteIndexable` is true only when `NEXT_PUBLIC_APP_ENV=production` and `VERCEL_ENV` is unset or `production`. Otherwise `robots.txt` disallows everything and pages render `noindex, nofollow`, so Vercel previews and local builds never get indexed
- `robots.txt` and the sitemap are static and computed at build time; a deployment's env at build decides them

## After deploying

- Submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools
- Check the preview card with a social debugger (Facebook Sharing Debugger, LinkedIn Post Inspector); they cache the image, so re-scrape after changing `og-image.jpg`
