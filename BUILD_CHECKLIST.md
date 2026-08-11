# Zaritzki landing-page build checklist

This checklist is updated after every task and phase. Phase transitions require user review and confirmation.

## Approved pre-flight resolutions

- [x] Pin the application to Next.js 15 instead of using an unbounded `@latest` scaffold.
- [x] Use genuine RED/GREEN ordering for behavioral work; tests must fail for the intended missing behavior.
- [x] Remove unconfirmed insurer-reimbursement and signature-gated-treatment claims; unresolved wording remains visibly pending.
- [x] Use the supported Next.js 15 locale-root layout: `[locale]/layout.tsx` owns `<html lang>` and `<body>`, while middleware redirects `/` to the development default locale.
- [x] Treat the later handoff sentence requiring a from-price column as stale; the binding rule is no price column.

## Phase 1 — Foundation

- [x] Task 1 — Repository, scaffold, and test harness
- [x] Task 2 — Port design tokens and load fonts
- [x] Task 3 — Locale routing and message layer
- [x] Phase 1 verification complete
- [x] User approved Phase 1

## Phase 2 — Data and state

- [x] Task 4 — Pending facts and practice data
- [x] Task 5 — Location context and booking resolution
- [x] Phase 2 verification complete
- [x] User approved Phase 2

## Phase 3 — Chrome

- [x] Task 6 — Button and pending-fact marker
- [x] Task 7 — Header and switches
- [x] Task 8 — Sticky booking bar
- [x] Task 9 — Footer
- [x] Phase 3 verification complete
- [ ] User approved Phase 3

## Phase 4 — The walk

- [ ] Task 10 — Hero and past-hero sentinel
- [ ] Task 11 — Step-rail navigation
- [ ] Task 12 — Reveal primitive and split section
- [ ] Phase 4 verification complete
- [ ] User approved Phase 4

## Phase 5 — Content sections

- [ ] Task 13 — Treatment schedule
- [ ] Task 14 — Cost and insurance panel
- [ ] Task 15 — Proof, practices, and closing CTA
- [ ] Task 16 — Compose the page
- [ ] Phase 5 verification complete
- [ ] User approved Phase 5

## Phase 6 — Assets, search, and verification

- [ ] Task 17 — Source and verify photography
- [ ] Task 18 — Structured data and metadata
- [ ] Task 19 — End-to-end behavior, accessibility, and guards
- [ ] Task 20 — Detector, finish review, and documentation
- [ ] Phase 6 verification complete
- [ ] User approved Phase 6

## Pre-flight findings queued for their owning phases

- [x] Phase 3: preserve phone access on mobile and externalize footer copy.
- [ ] Phase 4: create `StepRail` before consumers; keep no-JavaScript content visible; implement rail release behavior.
- [ ] Phase 5: keep translation data serializable across the server/client boundary; type every unresolved fact.
- [ ] Phase 6: strengthen interaction/reduced-motion/contrast verification; replace the Unicode star; use safe temporary image outputs; pass the complete finish-review packet.
