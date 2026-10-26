# Dawnlight Labs — Corporate website

Research-first, static Astro website for **Dawnlight Labs**.

## Run locally

Requires Node.js 22.23.4 or later, or Node.js 24.

~~~powershell
git pull origin main
npm install
npm run dev
~~~

Open http://localhost:4321


## Windows: Rolldown native binding missing

If `npm run dev` fails with "Cannot find native binding" or mentions
`@rolldown/binding-wasm32-wasi`, npm may have skipped the Windows x64
native optional dependency. This is a local dependency installation issue,
not an Astro source error.

From the project root in PowerShell:

~~~powershell
node -v
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache verify
npm install --include=optional
npm run dev
~~~

Use Node.js 24 (or at least 22.23.4). The commands only remove generated
dependencies and the local npm lockfile, not project source or assets.

If the error persists on Windows x64, explicitly install the **matching**
Rolldown native binding version:

~~~powershell
$rolldownVersion = node -p "require('./node_modules/rolldown/package.json').version"
npm install --no-save --include=optional "@rolldown/binding-win32-x64-msvc@$rolldownVersion"
npm run dev
~~~

Also check `npm config get omit`; it must not exclude `optional`.
On Windows, inspect Microsoft Defender's Protection history if a native
`.node` binary was quarantined. Do not install a mismatched binding version.

Upstream reference: https://rolldown.rs/guide/troubleshooting

## Quality checks

~~~powershell
npm run test:content
npm run check
npm run build
npm run preview
npm run test:browser
~~~

The site outputs to dist/. There is no server-side application or database.

Browser tests use the installed Chrome (Playwright channel: chrome). Run npm run build before npm run test:browser; the tests auto-start Astro's production preview when necessary.

## Implementation layout

The design language and reasons for it are documented in [DESIGN.md](DESIGN.md).

- src/styles/global.css — active typography, palette, curved fields, layouts, illustrations, and responsive rules
- src/components/ProjectSketch.astro — four project-specific explanatory sketches
- src/components/ProjectGallery.astro — project compositions shared by Home and Projects
- src/scripts/sketches.ts — voice selection, circuit manipulation, command examples, and review interaction
- src/scripts/site.ts — mobile navigation, clipboard, back-to-top, opening crescent, and final sun/orb composition
- src/data/projects.ts — public project descriptions and statuses
- tests/site.spec.ts, tests/motion-visual.spec.ts, tests/completion.spec.ts — browser QA and review captures

Legacy atlas, artwork, and motion files are retained but are not imported by the redesigned pages. The practical homepage footer precedes the final brand sequence.

## Pages

- / — corporate introduction, animated original orb, research, project gallery and sun-mark closing
- /research — research interests, readable questions, and approach
- /projects — four project-specific explanatory interactions
- /projects/oscar, /projects/kinetable, /projects/takokit, /projects/aish — project overviews
- /about — Dawnlight philosophy and founders
- /contact — the single general inbox
- /404 — custom missing-page response
- /sitemap.xml and /robots.txt — discoverable approved routes

## Asset handling

The original assets/ directory is used as Astro's publicDir. **Do not rewrite or replace the approved SVG masters.** The original images and custom fonts retain their filenames; assets are exposed at the site root. Source content stays in src/ and the internal Foundation Kit at repository root is not included in the output.

The selected fonts were provided by the owner; verify redistribution and commercial embedding rights before a public production launch.

## Public disclosure

Approved public research areas live in src/data/research.ts. approvedPrograms intentionally starts empty and only renders after explicitly approved entries have been added. Projects and statuses live in src/data/projects.ts. Planned project sites and future GitHub destinations must not be shown as live until verified.

No internal research architecture, proposed governance, ownership details or unpublished results belong on this website.

## Website completion and release readiness

The corporate website is implemented as a modular Astro static site:
- Full-page opening animation and scroll-linked closing composition using the supplied original Dawnlight identity.
- Six readable research interests and questions; public research programs appear only with disclosure approval.
- Individual project compositions and clearly labelled illustrative interactions for all four projects.
- About page with verified founder names and roles; Contact page with one general mailbox.
- Native scrolling, restrained content entrances and scroll-linked daybreak artwork, with visible content even if scripts fail.
- Accessible mobile navigation, reduced-motion presentation, responsive layouts, sitemap, robots.txt and 404 page.
- Playwright smoke and interaction tests plus CI-captured page screenshots.

### Actual public launch blockers

Do not interpret a successful CI run as permission to deploy:
1. **The repository may be public and still contains the INTERNAL Foundation Kit**, including history. Restrict repository visibility and review or purge confidential history with owner approval before sharing the source.
2. Verify commercial web-embedding/redistribution rights for **AZONIX, Neuhade and DM Mono**.
3. Obtain appropriate legal/privacy review for the selected hosting environment. Do not add invented privacy or legal guarantees.
4. Review the accuracy of each project claim, whether any repository/subdomain is truly live, and any future public research programs.
5. Configure a production host and DNS only with the owner's chosen account/domain, then test the deployed site.

The site's code is completed and validated by its test suite, while production release and public-content approvals remain separate.

## Brand

Original identity: blue orb primary; sun composition secondary. Colours and typography follow the Dawnlight Foundation Kit v0.1. Public positioning: **Technology built around people.**

## Vercel deployment

See [LAUNCH.md](LAUNCH.md) for import settings, Web Analytics activation, production verification and the completion audit. Privacy, Terms and Questions are available at `/privacy`, `/terms` and `/faq`.
