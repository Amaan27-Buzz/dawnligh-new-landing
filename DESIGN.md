# Dawnlight — light, within reach

The identity connects the crescent's curved edge with the idea of making complex technology understandable. It uses the selected brand assets, palette, and typefaces. Typesafe and Anthropic informed the commitment to a consistent visual language; their typography, illustration styles, and layouts are not templates for this site.

## Composition

Warm paper is the reading surface. Blue establishes Dawnlight; a single broad curve opens a field or illustration. Sky carries light between sections. Avoid surrounding the logo with more rings, glows, satellite dots, or grids. The electronics sketch has a grid because positioning components is its subject.

Headings use Neuhade Light with comfortable line spacing. Regular Neuhade handles reading and navigation. Azonix names the laboratory and projects. DM Mono is reserved for actual commands. Plain sentence-case context labels replace section numbers and technical eyebrows.

Links name their destination. Selection controls show selection. Arrows, counters, scanlines, and fake status lights are not a general decoration system. Use the browser's native scrollbar with a transparent track and a simple blue indicator. Do not reintroduce an inset rail, progress badge, replacement scroll widget or extra motion controls. The sticky header has an opaque reading surface; the mobile menu preserves every destination.

## Project illustrations

- OSCAR: a request, delegated work, and review by the person who asked.
- Takokit: multiple voice paths, one local runtime, speech/text direction. Sage is its field; sky, yellow, paper, and a lighter terracotta line distinguish signals.
- KineTable: recognizable, movable components with connections that follow. Blue carries connections; a soft yellow field follows the LED. No circuit behavior is simulated.
- AiSH: a concrete request and visible command, with explanation, approval, and dismissal. Commands never execute. A paper command sheet sits on a sky field, with blue approval controls.

Every illustration describes its limits. Project status comes from the existing public project data. Do not imply releases, destinations, live research, real inference, or connected product instances without evidence.

Desktop project spreads scale to the window height as well as its width, keeping the heading, copy, illustration and controls together. Mobile layouts retain natural reading flow. The gallery shares a wide title-and-art rhythm, while each project keeps its own scene. Detail pages extend those same project illustrations rather than introducing a second visual language.

## Motion

The opening uses the supplied crescent mask and reveals Dawnlight. The finale uses the supplied sun SVG and moves the orb into its exact final composition, with one temporary orbit track that disappears before the final frame. The practical footer precedes the finale so the homepage actually ends with only the mark and Dawnlight. The finale continues the footer sky field with a blue wordmark, letting the original sun and orb supply the color.

Reading content has brief entrances from an already-visible default. The clipped daybreak artwork shifts with native scroll, and the approved About light field opens as it enters view. Avoid pointer tilt, animated reading backgrounds, auto-switching research selectors and hiding content until an animation runs. Worker packets follow scroll; Takokit signals flow continuously while visible. Keep decoration scroll-driven except Takokit's explicitly requested continuous voice flow. Do not add Pause motion buttons. Direction changes and example results use brief transitions. Reduced motion shows complete static marks and retains functional controls. Without JavaScript, content, navigation, and the final identity remain available.

## Implementation

`src/styles/global.css` owns the shared presentation; `styles/research.css` and `styles/project-craft.css` refine the research and project pages. `ProjectSketch.astro` and `scripts/sketches.ts` own the illustrative interactions. `scripts/site.ts` handles navigation, copying, and the two brand sequences. `scripts/motion.ts` owns the shared scroll and illustration choreography. `styles/scrollbar.css` styles the native scrollbar. The former replacement scrollbar is not imported. Legacy atlas, artwork, and motion files are retained but are not imported into the redesigned pages.

Check new work against these relationships rather than adding another visual effect. A new colour or shape needs a specific content role.


## Approved direction and page architecture

Preserve the inset hero composition with its broad curved edge. The full orb must remain inside the artwork at every breakpoint; size the art around the available height rather than clipping it. Keep the paper-and-blue split research preview and the established project panels. Homepage project descriptions are short routes to full interactive gallery/detail pages.

The About page's layered blue and sky light field is explicitly approved. Preserve its curves, palette and scroll motion. Do not replace it in later design passes.

Publications & Notes has an archive, category anchors and three individual editorial templates. Program scopes and all publication entries are clearly draft placeholders, excluded from indexing and analytics until approved. No authors, dates, citations, DOI, accepted papers or results are fabricated. Navigation stays focused; draft content is reachable from the footer and research page. Future Updates, Open Source, Careers, Press and Security destinations remain architecture only until useful content exists. `/site-map` is the human-readable review directory, not the XML sitemap.

Classic Windows scrollbar backing follows the visible section colors through `scripts/scrollbar-surface.ts`; its track stays transparent and the browser retains native scrolling, dragging and keyboard behavior. This avoids exposing the paper canvas beside blue and sky sections.

Homepage chapters use spacing, existing curved artwork and coordinated scroll entrances instead of horizontal rules. The paper background and hero composition remain intact. Native proximity snapping settles at the three chapter entrances on desktop windows at least 900px wide and 650px tall, after the introduction. Mobile, reduced-motion and no-JavaScript reading retain free scrolling; no wheel interception, mandatory snapping or additional controls are used.

## Research and project craft follow-up

Research now introduces six fields directly, then links to the shared writing archive. Notes supports category filtering and text search; the three entries contain readable draft material and remain noindex. Programs is a planning preview of specific questions, removed from routine footer navigation.

Takokit keeps its sage composition. Its selection pill glides between modes, and continuous input waves settle into a more active speech output when switching modes. Motion suspends outside the viewport, in hidden tabs, and for reduced motion. OSCAR uses a branching coordination scene; KineTable uses bespoke movable component artwork; AiSH places a reviewable command on a paper sheet. The same artwork language carries into the concise homepage previews. Preserve the homepage hero and About light field.
