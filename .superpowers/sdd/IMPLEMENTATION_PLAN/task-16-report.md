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
