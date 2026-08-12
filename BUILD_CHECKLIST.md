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
- [x] User approved Phase 3

## Phase 4 — The walk

- [x] Task 10 — Hero and past-hero sentinel
- [x] Task 11 — Step-rail navigation
- [x] Task 12 — Reveal primitive and split section
- [x] Phase 4 verification complete
- [x] User approved Phase 4

## Phase 5 — Content sections

- [x] Task 13 — Treatment schedule
- [x] Task 14 — Cost and insurance panel
- [x] Task 15 — Proof, practices, and closing CTA
- [x] Task 16 — Compose the page
- [x] Phase 5 verification complete
- [x] User approved Phase 5 (2026-08-11, explicit)

## Phase 6 — Assets, search, and verification

- [x] Phase 5 explicitly approved and execution budget confirmed before starting (2026-08-11)
- [x] Task 17 — Source and verify photography (12 images + CREDITS.md; 2 fix rounds; attribution independently verified, no fabricated credits; `photography` remains an open fact)
- [x] Task 18 — Structured data and metadata (two `Dentist` records, no `aggregateRating`/`review`; E2E 22/22)
- [x] Task 19 — End-to-end behavior, accessibility, and guards (E2E 52/52; user ruling applied: `--text-gold` → cognac-deep for WCAG AA on light grounds; one latent `conversion.spec.ts` timing flake left open and carried forward)
- [ ] Task 20 — Detector, finish review, and documentation
- [ ] Reproduce and resolve the user-reported smaller-display hero issue with TDD and independent review
- [ ] Phase 6 verification complete
- [ ] User approved Phase 6

## Pre-flight findings queued for their owning phases

- [x] Phase 3: preserve phone access on mobile and externalize footer copy.
- [x] Phase 4: create `StepRail` before consumers; keep no-JavaScript content visible; implement rail release behavior.
- [x] Phase 5: keep translation data serializable across the server/client boundary; type every unresolved fact.
- [ ] Phase 6: strengthen interaction/reduced-motion/contrast verification; reproduce and fix the smaller-display hero issue; replace the Unicode star; use safe workspace image outputs and sequential captures; pass the complete finish-review packet.
