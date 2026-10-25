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

## Pages

- / — corporate introduction, animated original orb, research, project gallery and sun-mark closing
- /research — approved broad research fields and research culture
- /projects — four distinct cinematic project visuals
- /projects/oscar, /projects/kinetable, /projects/takokit, /projects/aish — project overviews
- /about — Dawnlight philosophy and founders
- /contact — the single general inbox

## Asset handling

The original assets/ directory is used as Astro's publicDir. **Do not rewrite or replace the approved SVG masters.** The original images and custom fonts retain their filenames; assets are exposed at the site root. Source content stays in src/ and the internal Foundation Kit at repository root is not included in the output.

The selected fonts were provided by the owner; verify redistribution and commercial embedding rights before a public production launch.

## Public disclosure

Approved public research areas live in src/data/research.ts. approvedPrograms intentionally starts empty and only renders after explicitly approved entries have been added. Projects and statuses live in src/data/projects.ts. Planned project sites and future GitHub destinations must not be shown as live until verified.

No internal research architecture, proposed governance, ownership details or unpublished results belong on this website.

## Implementation status

This is an initial code implementation, not a claim of a launched or fully verified website. Check opening and closing motion on a GPU-enabled Chrome browser; verify responsive behavior, reduced motion, keyboard navigation, copy and release claims before deploying.

## Brand

Original identity: blue orb primary; sun composition secondary. Colours and typography follow the Dawnlight Foundation Kit v0.1. Public positioning: **Technology built around people.**
