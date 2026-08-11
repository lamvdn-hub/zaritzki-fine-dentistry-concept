# Task 16 implementation report

## Status

Complete. The `/[locale]` server route now assembles the approved visit flow through a client-owned `PageShell`, while the footer remains server-rendered.

## TDD evidence

### RED

Before creating or modifying any production composition file, added `site/tests/e2e/page.spec.ts` and ran:

`npx playwright test tests/e2e/page.spec.ts --project=desktop`

Result: **3 failed**, as intended against the existing empty `<main>`:

- assembled-flow test could not find the hero heading;
- valid Charlottenburg seed test could not find the location radio;
- inherited-key rejection test could not find the default Mitte radio.

These failures demonstrated missing page composition rather than missing Task 17 assets or a server lifecycle problem.

### GREEN

After the minimum implementation and a production build, reran:

`npx playwright test tests/e2e/page.spec.ts --project=desktop`

Result: **3 passed**. The focused behavior covers:

- successful composed render and ordered section anchors;
- `?praxis=charlottenburg` seeding the client location state and imagery;
- `?praxis=constructor` being rejected in favor of the default Mitte state.

## Implementation

- Added `PageShell` as the complete client-owned provider/chrome/content tree.
- Constructed `translator(messages)` inside the client boundary.
- Added location-aware lounge, talk, and room wrappers in `StepSections.tsx`.
- Kept `SiteFooter` outside `PageShell`, using a separate translator created in the server route.
- Validated `praxis` using `Object.prototype.hasOwnProperty.call(PRACTICES, praxis)`.
- Passed only serializable `messages`, `locale`, and optional `initialLocation` from the server route into `PageShell`.

## Verification

- Focused desktop E2E: **3 passed**
- Unit suite: **18 files, 93 tests passed**
- Full desktop/mobile E2E: **12 passed**
- `npx tsc --noEmit`: **passed**
- `npm run lint`: **passed, no warnings or errors**
- `npm run build`: **passed**
- `git diff --check`: **passed**

## Self-review

- No translator function, React children, server component output, or other function crosses from the server route into `PageShell`.
- `messages` is the imported JSON-shaped record; `locale` and `initialLocation` are string unions, so the boundary props are serializable.
- The full ordered tree is inside `<main id="content">`; the header and sticky booking bar share the same `LocationProvider` state outside the main landmark.
- `constructor` and other inherited object keys cannot pass the own-property guard.
- No facts, prices, claims, or copy were added.

## Concerns

The image optimizer logs expected invalid/missing-resource warnings because Task 17 has not supplied the referenced stock assets yet. The behavior tests deliberately do not treat those missing assets as Task 16 failures.

## Anchor-occlusion debugging addendum

### Root-cause measurements and hypothesis

Measured against the production build before changing the regression test or production CSS:

- Desktop `#step-talk` after clicking its real rail link: sticky header `0â€“67px`; fixed rail `62â€“136.296875px`; target eyebrow `96â€“112.5px`.
- Desktop `#step-leaving` after clicking its real rail link: sticky header `0â€“67px`; fixed rail `62â€“136.296875px`; target eyebrow `96.59375â€“113.09375px`.
- Mobile direct `#practices`: wrapping sticky header `0â€“145px`; rail remained non-fixed/offscreen; target eyebrow `96.421875â€“112.921875px`.

Precise hypothesis: native hash navigation aligns each target section to the viewport without reserving space for the sticky/fixed chrome. Because the document defines neither `scroll-padding-top` nor `scroll-margin-top`, the desktop fixed rail covers the first eyebrow and the taller mobile header covers the direct `#practices` eyebrow. A shared responsive scroll clearance on the document scroller, sized to the measured bottom edge of the active occluding chrome, should fix both paths without changing section layout.

### Regression RED

Added two real-browser behaviors before production CSS changes:

- click the actual `a[href="#step-talk"]` rail link and compare its eyebrow with every visible fixed/sticky chrome edge;
- load `/en#practices` directly and make the same geometry assertion for the non-rail anchor.

Ran `npx playwright test tests/e2e/page.spec.ts` across both configured projects. Result: **2 failed, 8 passed**. The intended failures were:

- desktop rail anchor clearance: **-40.296875px**;
- mobile direct practices clearance: **-48.6875px**.

Desktop direct practices and mobile rail navigation already passed, which matched the measured difference in active chrome.

### Minimal fix and GREEN

Added one shared document-scroller rule in `app/globals.css`:

- mobile `scroll-padding-top: 145px`, matching the measured wrapped header bottom;
- desktop `scroll-padding-top: 137px`, rounding the measured fixed rail bottom of `136.296875px` up to the next CSS pixel.

No content, section layout, motion, imagery, or component behavior changed.

The first post-change run remained unchanged because the incremental `.next` output had not incorporated the new global declaration; inspection proved `scroll-padding` and both values were absent from the emitted CSS. After deleting only the generated `.next` directory, a clean production build emitted the rule. The clean build needed network permission once to refetch the configured Google fonts.

Reran `npx playwright test tests/e2e/page.spec.ts`. Result: **10 passed** across desktop and mobile.

### Regression verification

- Focused desktop/mobile page E2E: **10 passed**
- Unit suite: **18 files, 93 tests passed**
- Full desktop/mobile E2E: **16 passed**
- `npx tsc --noEmit`: **passed**
- `npm run lint`: **passed, no warnings or errors**
- Clean and subsequent production builds: **passed**
- Expected Task 17 missing-image warnings remain unchanged.
