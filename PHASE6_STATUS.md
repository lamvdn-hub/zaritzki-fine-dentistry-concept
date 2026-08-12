# Phase 6 status — resume point for the next agent

**Written:** 2026-08-12, after the Task 20 hero-gate independent review.
**Read this, then `HANDOFF.md`, then `IMPLEMENTATION_PLAN.md`'s "Continuation handoff — after Phase 5", its Global Constraints, and the Phase 6 binding note, then `BUILD_CHECKLIST.md`.**
**The durable record of every finding is `.superpowers/sdd/IMPLEMENTATION_PLAN/progress.md` (the SDD ledger). It is tracked in git. Trust it and `git log` over any recollection.**

---

## Verified state

| | |
|---|---|
| Branch | `feat/zaritzki-landing-page` |
| HEAD | see `git log -1` — hero fix is `8e959da`; status/ledger docs may sit on top |
| Worktree | clean except untracked `site/screenshots/` (diagnostics — deliberately not committed) |
| Port 3000 | no listener |
| Unit tests | 94 passing |
| E2E | 62 passing (desktop 31 / mobile 31) |
| Lint / build / TypeScript | clean |
| Direction seed `2c7cb46c` | present in built server output |
| Token mirrors | all five `site/styles/tokens/*.css` byte-identical to root `tokens/` |
| Open facts | still exactly four: `clinicians`, `sharedTeam`, `selfPayWording`, `photography` |

Phase 5 was explicitly approved by the user and Phase 6 authorized (recorded in `8ef8d07`).

---

## Resume point

**Task 20 hero gate is complete.** Independent review of `b35c99e..8e959da` returned spec ✅ / quality Approved, 0 Critical, 0 Important, 4 deferred minors. The detector is now authorized.

**Next action:** Task 20 remaining — detector → sequential screenshots → inspect/fix one batch → `impeccable-finish-reviewer` → `impeccable-documenter` → client checklist. Then stop for explicit Phase 6 user approval.

---

## Phase 6 progress

- [x] **Task 17** — photography. 12 images + `CREDITS.md`. Two fix rounds. Attribution independently verified, **no fabricated credits**. `photography` deliberately still an open fact.
- [x] **Task 18** — structured data. Two `Dentist` records, no `aggregateRating`/`review`.
- [x] **Task 19** — E2E conversion / a11y / no-JS / voice guards. One fix round.
- [x] **Task 20 gate** — hero bug: reproduced ✅, fixed ✅ (`8e959da`), independent review ✅ (spec / quality Approved; 4 deferred minors)
- [ ] **Task 20** — detector → screenshots → `impeccable-finish-reviewer` → `impeccable-documenter` → client checklist ⬅ resume here
- [ ] Phase 6 verification + visual review
- [ ] **STOP for explicit user approval of Phase 6.** Do nothing beyond Phase 6 without it.

---

## What the hero bug actually was

The user reported only: *"The hero section still bugs on smaller displays."* No viewport, no symptom.

Reproduced unambiguously. **`Hero.tsx:26` wrote `data-past-hero` from `String(!entry.isIntersecting)`, which conflates "sentinel above the viewport (scrolled past)" with "sentinel below the viewport (not reached yet)."** On any viewport where `headerHeight + heroHeight > viewportHeight`, the observer's first callback wrote `"true"` at scroll position 0, so the sticky booking bar painted over the hero and **fully covered the hero's own CTA** — the page's single conversion action. Measured on iPhone 13 / WebKit at 390×664: `barTop=559`, CTA 598–652, `ctaFullyCovered: true`. It never self-corrected.

Failed at 320×568 through 768×1024 portrait and landscape, plus 1440×600; clean at 861×800, 1024×768, 1440×900. Both practices, both engines. **It is geometric, not width-based.**

Two further defects were fixed in the same commit:
- `conversion.spec.ts:12` **passed falsely** — it asserted pre-hydration SSR state because `data-past-hero` is `null` until ~+500ms. `conversion.spec.ts:6` used `toBeInViewport()`, which tests geometry not occlusion, so a fully covered button passed.
- Hero copy over the **Charlottenburg** photo failed WCAG AA at narrow widths (eyebrow median **3.90:1** at 320px) because the scrim is a *horizontal* gradient. Fixed with a narrow-width-only scrim strengthening; desktop left exactly as approved. Now 6.42:1.

Full evidence: `.superpowers/sdd/IMPLEMENTATION_PLAN/task-20-hero-diagnosis.md` and `task-20-hero-fix-report.md` (both gitignored — on disk only).

---

## Open items to carry forward

1. **Latent flake in the acceptance gate.** ~1 full-suite run in 9–15 previously failed on a timing-dependent `conversion.spec.ts` assertion (seen as both `toBeInViewport` and `toHaveAttribute`), caused by IntersectionObserver/rAF starvation under worker contention. The hero fix touches that chain; 826 executions since were clean, but the implementer explicitly does **not** claim it is fixed. Do not claim it either without evidence.
2. **Pre-existing IntersectionObserver limitation** — a teleporting `scrollTo` can skip the 1px sentinel entirely. Demonstrated on the *unfixed* build too, so it is not introduced by the fix.
3. **`a11y.spec.ts:140-143` comment is wrong** and must be corrected to "may reach, timing-dependent". The walk reaches the sticky-bar controls only sometimes — measured `visited ∈ {20, 21, 22}` across 13 runs. This claim has now been stated wrongly in *both* directions; fix it once, accurately. Report `§2 Addition / §6 / §8.6` need the same correction.
4. **Hero image reads as a hotel door.** The shipped Mitte hero has electronic keycard locksets and convention-hotel carpet. The desktop crop hides both; the mobile crop keeps them. Judged material but non-blocking. Flag it at the finish review and the user's visual review.
5. **`tokens/fonts.css` was never mirrored** into `site/styles/tokens/` (five of six ported). Pre-existing; fonts load via `next/font`. Confirm intentional at the final review.
6. `site/screenshots/` holds 106 untracked diagnostic captures. Task 20 Step 2 wants `site/screenshots/desktop.png` and `mobile.png` specifically.

---

## Standing rules — do not violate

- **Never invent or assume uncertain facts.** Ask the user. Exactly four facts remain unresolved (above); sourcing Task 17 stock images did **not** resolve `photography`.
- **No prices, ever.** No price column. The practice publishes none, by design.
- Keep the no-price decision, the truth boundaries, the restrained voice, and the approved espresso/brass direction intact.
- One fresh implementation subagent and one fresh independent reviewer **per task**. Genuine RED/GREEN TDD.
- Update `BUILD_CHECKLIST.md` and the SDD ledger after every task and phase, and commit each completed task.
- **Windows/npm:** use `npm.cmd` / `npx.cmd`, never bare `npm`/`npx`, never `pnpm`. `C:\tmp` returns `EPERM` — stay in the repo.
- **Build trap:** `tests/e2e/global-setup.ts` serves the existing `.next/` and never rebuilds, and there is no `webServer` block. A bare `npx.cmd playwright test` after a source change tests a **stale build**. Run `npm.cmd run build` first. `npm.cmd run test:e2e` is safe.
- Run Playwright captures **sequentially** — concurrent processes have stalled the server. Before a full-page capture, scroll the real page so every `Reveal` observer has fired, and keep a separate untouched first-viewport capture.
- Read-only: root `tokens/`, `components/`, `guidelines/`, `ui_kits/`, `assets/`. `site/styles/tokens/*.css` must stay byte-identical to root `tokens/`.
- `DIRECTION_CONTRACT` in `site/app/[locale]/layout.tsx` carries seed `2c7cb46c` and must survive unedited.
