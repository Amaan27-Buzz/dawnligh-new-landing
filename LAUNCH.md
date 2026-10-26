# Dawnlight launch handoff

Updated 26 October 2026. The existing Dawnlight palette, supplied SVG masters, fonts and project layouts are preserved.

## Import into Vercel

1. Import the repository into your Vercel account. Set **Root Directory** to `dawnlight-new-landing` if importing its parent repository, or leave it at the repository root if this folder is the repository. The directory containing `package.json` and `vercel.json` is the build root.
2. Use Node.js **24.x**. `package.json` pins the major version. Framework, install, build and output settings are committed in `vercel.json`: Astro, `npm ci`, content checks + type checks + build, output `dist`.
3. Open the project's **Analytics** tab and enable **Web Analytics**, then deploy or redeploy. The integration is installed; enabling the dashboard feature is still required. No analytics secret or public API key is needed. Keep Vercel's system environment variables available to builds so `VERCEL_ENV` distinguishes production and preview.
4. Connect `dawnlightlabs.com` as the primary production domain. Canonicals and robots currently use that domain. If using another primary domain, update `astro.config.mjs` and `assets/robots.txt` before publishing. Configure any `www` alias to redirect directly to the primary domain in Vercel.
5. Vercel supplies HTTPS certificates and redirects HTTP to HTTPS. The configuration adds HSTS, anti-framing, MIME-sniffing protection, a referrer policy, disabled camera/microphone/geolocation access and limited CSP directives. It does not use a catch-all rewrite that turns missing pages into successful homepage responses. Hashed Astro assets receive immutable caching.

The site remains statically rendered HTML. Search crawlers receive page content without running JavaScript; a server runtime is unnecessary for this site. See [Vercel analytics setup](https://vercel.com/docs/analytics/quickstart), [HTTPS](https://vercel.com/docs/cdn-security/encryption), and [project configuration](https://vercel.com/docs/project-configuration).

## Completion audit and fixes

Locations below refer to the resulting source. Legacy styles/components remain in the repository but are not imported by the current pages.

| Finding | Change and location |
| --- | --- |
| Two competing orbit tracks | One temporary track; it fades away before the final mark. `src/components/SunClosing.astro:14`, `src/scripts/site.ts:83`. The source sun/orb SVG geometry remains unchanged. |
| Little movement outside the opening/finale | Scroll-linked daybreak layers and research light, short entrances for project compositions and reading groups. `src/scripts/motion.ts:1`. No scroll hijacking or pin spacers. Default content remains visible, and reduced motion skips these animations. |
| Decorative colored left rules | Removed from the research list and OSCAR Worker descriptions. `src/styles/global.css:61`, `src/styles/global.css:103`. |
| Small mobile illustration text | Captions and runtime text now at least 12px. `src/styles/global.css:289`, `src/styles/global.css:296`. |
| Low-contrast Takokit caption | Removed caption opacity reduction; text now passes automated contrast checks. `src/styles/global.css:91`. |
| Middle-dot contact separator | Replaced with a natural comma. `src/pages/contact.astro:6`. |
| Missing legal/help destinations | `/privacy`, `/terms`, `/faq`, linked in footer and sitemap. `src/components/Footer.astro:4`, `src/pages/sitemap.xml.ts:5`. Policies reflect website behavior and the Foundation Kit's no-sale and explicit training-consent principles. |
| SVG-only social preview | Added a compressed 1200×630 PNG, image dimensions/alt, Twitter card, OG URL/site name and Apple touch icon. `src/layouts/SiteLayout.astro:27`. Social image is approximately 30 KB; the supplied vector artwork remains vector. |
| Missing breadcrumb context on project pages | Added Home / Projects / project navigation. `src/pages/projects/[slug].astro:18`. |
| Missing analytics | Vercel Web Analytics only on production builds, excluding 404. URL queries/fragments are stripped; Do Not Track prevents loading. `src/scripts/analytics.ts:1`, `src/layouts/SiteLayout.astro:8`. No custom event tracking. |
| Preview indexing and missing-page indexing | Preview builds and 404 carry `noindex, follow`; production content remains indexable. `src/layouts/SiteLayout.astro:8`. |
| Deployment defaults undocumented | `vercel.json`, Node 24, lockfile installs in CI, `.vercelignore` excluding internal kit and local output from CLI uploads. The Foundation Kit is also absent from `dist`. |

Interaction changes for review: reading groups now enter briefly, decorative light responds to scroll, the duplicate orbit is gone, project pages have breadcrumbs, and the footer links to three new pages. Existing sketch controls, menu, keyboard movement and email actions remain functional.

## Checklist items intentionally not added

- **Cookie banner:** the website sets no optional cookies or browser storage. Vercel Web Analytics is cookieless. A banner that asks for meaningless consent would add friction. Reassess applicable requirements if adding other tracking, embeds or optional storage; cookieless does not automatically settle every jurisdiction's consent rules.
- **Forms, spam protection, thank-you page and skeletons:** there is no submission form, account, remote product loading or payment flow. Contact opens the visitor's email client. The existing clipboard action has success and failure messages.
- **Sticky mobile CTA:** the primary homepage action is already clear. An additional floating action would compete with navigation and the project illustrations. On small screens it remains early in the page.
- **Radix palette, system fonts, a four-size limit or universal 0.5px borders:** these would replace the approved identity or reduce useful hierarchy. The original colors/fonts, high-contrast text and deliberate display/reading/caption roles remain.
- **WebP conversion of logos:** SVG is already the smaller, sharper format. Large unused supplied PNGs are not requested by the page. The new raster social image is compressed.
- **FAQ rich-result markup:** answers are visible on `/faq`. Google deprecated FAQ rich results in May 2026; do not add schema just to satisfy an old checklist. See [Google's Search updates](https://developers.google.com/search/updates). Basic website/organization structured data is supplied without invented corporate details.
- **Postal address:** no verified public mailing address was supplied. The site publishes the supplied email address and India; it does not invent an office or registration details.
- **Backlinks and Search Console submission:** these require a live domain and owner access. After domain verification, submit `https://dawnlightlabs.com/sitemap.xml` in Search Console. No indexing or ranking claim is made.

## Verification

- Static production build and Astro checks pass without warnings or errors. Content checks preserve supplied brand facts and disclosure boundaries.
- Browser coverage includes 320, 390, 768, 1024, 1440 and 1920px, all 13 pages, internal links/anchors, image loading, metadata, mobile navigation, keyboard/pointer controls, clipboard, no-JavaScript and reduced-motion behavior.
- Automated WCAG A/AA checks, including color contrast, pass across all pages at 390 and 1440px. This is not a complete manual accessibility certification.
- Browser checks sample the opening crescent and scroll motion. Finale checks at four widths confirm the original orb's identity transform at the true page end, the wordmark's full opacity and no header overlap.
- Vercel production and preview builds were exercised locally: production enables analytics, preview disables it and applies noindex. A mocked SDK request verifies URL redaction and Do Not Track. Live analytics ingestion has not been tested.
- Credential-pattern scan of 58 source/output text files found no matches for the tested API-key/private-key patterns. This does not inspect Git history or constitute a full security audit. `dist` does not contain the Foundation Kit.
- Local mobile Lighthouse report: **99/100**, first contentful paint **1.4s**, largest contentful paint **1.9s**, total blocking time **50ms**, layout shift **0**. Report: `output/lighthouse-character-mobile.json`. These are simulated local measurements, not a production speed guarantee. Lighthouse wrote a valid report but its CLI exited with a Windows temporary-profile cleanup permission error afterwards.

## Remaining hosted checks

After importing: verify HTTPS and headers, direct canonical redirects, real 404 status, custom-domain URLs, Web Analytics events in the dashboard, and live mobile performance. Confirm that the public contact mailbox receives messages; delivery was not tested.

Have the policy drafts reviewed for the actual operator, jurisdiction and provider arrangements before a public launch. The Foundation Kit leaves incorporation and related legal choices unresolved, so the pages do not fabricate a company type, governing court or registered office. Verify the supplied fonts' web-embedding rights. Keep confidential source material private: `.vercelignore` prevents CLI uploads of the internal kit, but does not remove it from repository history or change repository visibility.

No deployment, DNS change, source publication or Search Console submission was performed.


## Current visual and architecture follow-up

The earlier paper-and-blue visual direction is restored. The hero remains an inset curved field with a complete, unclipped orb; light, contours and orb move subtly with native scroll. The research preview preserves the split layout, now linking to all six fields. Short project highlights link to the full interactive gallery and detail pages. Homepage projects no longer duplicate all demo controls. The footer and closing sequence share sky blue.

The native scrollbar has a transparent track and a simple blue indicator. The replacement scroll widget is no longer rendered or initialized. All Pause motion controls and autonomous illustration loops are removed. Voice and Worker signals follow scroll position; reduced motion restores static compositions. The approved About light-field artwork and its scroll motion remain unchanged, with a regression check.

New content architecture:
- `/notes`: archive preview with research-paper, technical-article and field-note anchors.
- Three `/notes/[slug]` previews: local voice runtime, efficient intelligence and understanding circuits. All content is clearly draft, without invented publication facts.
- `/research/programs`: draft scopes for three focused investigations.
- `/site-map`: human-readable directory of all 19 pages, research-field links, publication categories and planned future pages.

All six review/draft pages use noindex and disable analytics; they are excluded from the production XML sitemap. They are accessible through relevant internal links for content review. Updates, Open Source, Careers, Press and Security remain planned destinations; no empty live pages or broken placeholder links are added.

Verification: static build and content checks pass. Astro reports zero errors, warnings or hints. The 33-test browser suite passes across all 19 pages at six widths, with accessibility checks at two widths, metadata/internal-link checks, no-JavaScript and reduced-motion coverage. An additional About wave regression and targeted hero/scrollbar checks verify the final visual correction. Desktop/mobile screenshots were inspected directly. Earlier Lighthouse results predate this follow-up; no new performance score is claimed here.

No deployment or DNS changes were performed. Publication and program content needs final editorial approval before indexing or launch. The hosted checks listed above still apply.

Scrollbar follow-up: verified the sky finale and mixed paper/blue About boundary in the actual Windows sidebar. Native scrollbar backing follows section colors; no replacement control or inset rail is rendered.

## Research and project craft verification

Research has six compact fields and three draft writing links. Publications & Notes has functional category and text filters. Draft articles are readable previews without invented authors, results or publication claims; draft routes remain noindex. Takokit has a sliding Listen/Speak selection and finite wave gestures. OSCAR, KineTable and AiSH use revised wide illustrations and matching homepage previews. The homepage hero, approved About wave and native scrollbar remain in place.

The 39-test browser suite passes across all 19 pages at six widths, including accessibility, reduced motion, no-JavaScript content, search/filter behavior and rapid voice-mode switching. Astro check reports zero errors, warnings or hints; the static build and content checks pass. Local desktop and mobile screenshots were reviewed. These checks do not establish live product functionality, physical-device acceptance or hosted deployment readiness. No deployment or DNS change was performed.

## Continuous Takokit flow

Takokit now has continuous input signals and a live output waveform in Speak mode, with eased amplitude changes between modes. Rendering stops off screen and in hidden tabs; reduced motion restores static paths. The updated mobile output alignment and icon-only animated navigation are retained. Local generated captures remain in ignored output/, outside the source commit.

Final local verification before GitHub push: all 41 browser tests pass, Astro reports zero errors/warnings/hints, and static build/content checks pass. Tests include continuous voice motion, off-screen suspension, reduced-motion reset, rapid mode switching, icon-only mobile navigation, and narrow-screen alignment. Hosted deployment and physical-phone checks remain unverified.
