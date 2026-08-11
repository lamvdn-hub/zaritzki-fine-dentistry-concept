# Handoff — Zaritzki Fine Dentistry landing page

**Written:** 2026-08-10, at the end of the design session, before any application code was written.
**Updated:** 2026-08-11 — the client supplied both Doctolib URLs, the full treatment list, equipment, and the principal's name, and confirmed that no prices are published. See §5.6–§5.8.
**Purpose:** carry the judgment that lives in a conversation into a build that will not have that conversation.

This file exists because the build will run through **subagent-driven development**, where each task gets a worker that starts cold. Those workers will read `IMPLEMENTATION_PLAN.md` and know *what* to do. This file is *why*, and it is the difference between the design surviving and quietly reverting to a generic clinic page.

---

## 1. Read in this order

| # | File | What it is |
|---|---|---|
| 1 | **`HANDOFF.md`** (this file) | Judgment, rationale, and the traps |
| 2 | **`PRODUCT.md`** | Confirmed product truth. Users, positioning, both practices' real data, regulatory context |
| 3 | **`docs/superpowers/specs/2026-08-10-zaritzki-landing-page-design.md`** | The approved design spec |
| 4 | **`docs/design/approved-comp-page-flow.html`** | **The approved composition.** Open it in a browser. This is the target |
| 5 | **`IMPLEMENTATION_PLAN.md`** | 20 tasks, 6 phases, test-first, with real code |
| 6 | `DESIGN_SYSTEM_REFERENCE.md` + `tokens/*.css` | The binding visual system. Read, never edit |

Also present, as decision history rather than instruction:
- `docs/design/rejected-comp-specification-vs-visit.html` — the two candidate first viewports. The left-hand one ("The Specification") was **rejected**; do not reintroduce it.
- `docs/design/decision-locations.html` — the three location strategies. Option 1 won.

---

## 2. Current state

**Nothing has been built.** There is no `site/` directory, no `package.json`, no git repository. Task 1 of the plan creates all of it.

What exists: the design system handoff bundle (tokens, component contracts, guidelines, a reference UI kit), `PRODUCT.md`, the spec, the approved comp, and the plan.

The `ui_kits/website/` React screens are **the previous designer's reference mock, not the target.** `HomeScreen.jsx.txt` in particular is the arrangement this work deliberately replaces. Read it as an anti-reference.

---

## 3. How to run the build

Use **`superpowers:subagent-driven-development`**. One fresh subagent per task, reviewed between tasks.

**Every task packet must include:**

1. The task's full section from `IMPLEMENTATION_PLAN.md`, verbatim.
2. The plan's **Global Constraints** section, verbatim — it is not optional context, it is part of every task's requirements.
3. This file's §5 (Decisions and why) and §6 (Traps).
4. For any task touching UI: the path to `docs/design/approved-comp-page-flow.html` and an instruction to open it.

**Checkpoints:** review after each phase, not each task, unless a phase's output looks wrong.

**One deliberate exception to "no subagents by default":** Task 20 spawns `impeccable-finish-reviewer` with *no inherited conversation*. That is the point — a reviewer that inherits the builder's context inherits the builder's optimism.

---

## 4. The direction, in one paragraph

The page walks a first dental appointment in order — **the street, the lounge, the talk, the room, leaving** — because what anxious patients fear is the unknown, and the fastest way to remove an unknown is to show it. Five steps, five real sections, with the step rail as genuine navigation rather than decoration. Two Berlin practices are handled by a persistent header switch that swaps photography, address, and booking destination while leaving the page's chrome identical. Cost and the statutory-insurance exclusion sit at step 05, where you settle up at the end of a visit, so the hardest fact reads as candour rather than as a barrier at the door.

The full contract is in the plan (Task 3, `DIRECTION_CONTRACT`) and must appear as an HTML comment in the built markup.

---

## 5. Decisions and why

A cold worker who doesn't know these will "improve" the design back to average. Each one was contested or considered.

### 5.1 The structure was rolled, then overridden by the user

Seven structures were derived and ordered by resonance. The assignment was rolled externally (`concept-seed`, seed `2c7cb46c`, assigned index 7 — "the materials index") specifically so the build wouldn't default to my own top-ranked idea. That direction was built, shown to the user, and **rejected on named product-clarity grounds**: organising a dental page by building materials is confusing for a person who wants an appointment. "The Visit" was chosen instead.

**Why this matters to you:** the chosen direction is not a safe default that nobody examined. It survived a rejection of the alternative. Don't second-guess it.

### 5.2 One call to action, for first visits only

An earlier requirement had a separate, visible path for returning patients. **The user revoked it:** existing patients already know to use Doctolib or telephone, and a second button competes with the only conversion that matters.

Returning patients are served by the telephone number in the header and footer. **Do not add an "existing patient" button, link, or section.** There is a test asserting its absence.

### 5.3 No location gate

The user proposed opening with a location chooser. It was built, shown, and argued against on the user's own criterion — it costs a click before any CTA exists and splits local-search authority. The user accepted the switch instead.

**Do not add a location interstitial, modal, or "choose your practice" screen.**

### 5.4 The chrome never changes between locations

Only photography, address text, and the booking destination change. Espresso grounds, brass accent, typography, layout, and section order are identical in both states.

This is the resolution to a real finding: **the entire design system was derived from the Gendarmenmarkt praxis alone.** All four photos in `assets/images/` are that location. Kurfürstendamm is a Gründerzeit Altbau — stucco, bay windows, herringbone parquet, cream and blush, a copper chandelier — and the design system describes it not at all. Framing its pale imagery inside the same dark chrome is how two genuinely different interiors stay one brand. **Do not build a second theme.**

### 5.5 Facts cannot be invented

`Pending<T>` is a discriminated union that makes TypeScript refuse to read a value that hasn't been proven known. This is deliberate friction. When a task needs a price, a Doctolib URL, or a clinician's name and it isn't there, **render `<PendingFact>` and move on.** Do not write a plausible number "as a placeholder we'll swap later" — that is exactly the failure the type exists to prevent.

The temptation is strongest for things that are *probably* true. A private practice almost certainly does prepare itemised estimates for insurers. It is still not confirmed, and it still ships marked.

### 5.6 There is no price column, and that is the answer to "don't hide cost"

The client searched and found no published prices. This is settled, not outstanding: German private dental fees are set under the **GOZ** and depend on the treatment plan, so a fixed price list would be a guess dressed as a fact.

The first design had a from-price column. Thirteen permanent `€—` placeholders would have been worse than no column — it advertises the absence without explaining it. So the column is gone and step 03 now says plainly *why* there is no price list and *what happens instead*: a written estimate before anything is agreed.

**Do not reintroduce a price column.** A test asserts its absence. If a price ever appears, someone has invented it.

### 5.7 The practice's own marketing copy is a source of facts, not of voice

Their Doctolib profile reads: *"the first address for private patients in Berlin"*, *"exclusive State of the Art equipment"*, *"first-class personal service"*, *"sophisticated dentistry for demanding private patients"*, *"Experience a new era of dentistry"*.

**None of it goes on the page.** It is precisely the superlative, status-signalling register the voice rules forbid, and "demanding private patients" reads as snobbery. Take the facts underneath — the eleven treatments, the 3D imaging and microscopes, the university-hospital training, the veneer focus — and state them in the practice's understated voice. The `voice.spec.ts` guard fails the build on several of these phrases.

One line is worth keeping as *validation* rather than as text: *"even patients with anxiety forget to be in a dental practice."* The practice names anxious patients as its own audience, which confirms the page's whole structure. It does not become a headline.

### 5.8 Treatments are practice-wide, not per-location

The two Google service lists differed only because both were truncated. The Doctolib profile carries one list for both addresses, so `TREATMENTS` is a module-level constant, not a field on `Practice`. `TreatmentSchedule` is therefore a server component and does not read the location context.

### 5.9 No testimonials

Real ratings only: 5.0 ★ / 69 reviews and 5.0 ★ / 20 reviews, attributed per location. **No quote, no patient name, no "Katharina M., patient since 2019"** — that string appears in the old reference mock and must not migrate. Two reasons: none has been supplied, and HWG §11 restricts third-party recommendations in German medical advertising.

Related: the ratings are **displayed but deliberately not emitted as `aggregateRating` structured data.** Google disallows self-serving review markup. There is a test for this.

### 5.7 The CTA hugs its label

The user caught a mockup where the primary button stretched to ~790px because it sat in a flex column with default stretch. `Button.module.css` sets `align-self: flex-start` and `width: auto` for this reason. **If a button ever fills its container's width, that is a regression, not a layout choice.**

### 5.8 The treatment list stays in step 03

Considered moving it to its own section. The user was explicit: a dental page without visible treatments reads as evasive. It stays inside "The talk," as a real `<table>`. There is no price column; below 600px the explanatory gloss column drops first.

### 5.9 All imagery is licensed stock

The practice has its own photography and **has declined to use it on regulatory grounds.** The four images in `assets/images/` are withdrawn from publication; they remain valid as derivation evidence for the palette. Twelve stock images are sourced in Task 17, every URL verified to resolve before download.

No image may depict a patient, a procedure, a before/after, or an identifiable face.

### 5.10 German is required, later

Locale routing exists from the start; only English is authored. `DEFAULT_LOCALE` in `lib/i18n.ts` is the single constant that flips to `'de'`. `GERMAN_PENDING` in `LocaleSwitch.tsx` is the single flag that turns `/de` from an inert label into a link. **Do not link `/de` to an English page wearing a German URL.**

### 5.11 Impressum and Datenschutz are deferred by agreement

The links render; the pages 404. This build is a **cold-outreach pitch artifact**, not a live site, so the statutory pages belong to the practice owner if they take the work forward. Do not build them. Do not remove the links — they belong in the design.

---

## 6. Traps — things a fresh agent will reach for and must not

| Temptation | Why it's wrong here |
|---|---|
| Icon tiles in rounded squares for services | Named anti-goal. The old reference mock does exactly this |
| A big quote-mark testimonial section | Fabricated patient voice; HWG risk |
| Blue-white clinical imagery, gloved hands, tooth diagrams | The brand is deliberately anti-clinical |
| Rewriting tokens into a Tailwind config | Tokens are the binding contract; copy them byte-for-byte |
| Adding an icon library for the one arrow glyph | Draw it inline at 1.75 stroke, round caps |
| Springy, bouncy, or overshooting motion | System mandates 140/220/400ms, no overshoot, ever |
| "Book now", "limited slots", countdowns, exclamation marks | Hardest anti-goal. A test fails the build on these |
| An emoji, anywhere, for any reason | Never |
| Filling a `Pending` value with something reasonable | See §5.5 |
| Adding a price or "from €…" column back to the treatments | See §5.6. There are no prices, deliberately |
| Reusing the practice's own marketing lines because they're already written | See §5.7. Facts yes, register no |
| Editing anything in `tokens/`, `components/`, `guidelines/`, `ui_kits/`, `assets/` | Read-only design authority |
| Making the page "warmer" by going cream-and-serif throughout | The dark espresso ground is the differentiator against every blue-and-white clinic in Berlin. Ivory is the light passage, not the page |

---

## 7. Outstanding from the client

Run `pnpm pending` inside `site/` once Task 4 exists to regenerate this. Four items remain:

- Names and credentials of clinicians other than Dr. Zaritzki
- Whether the two addresses share a team
- Exact self-payer estimate wording
- Approval or replacement of all twelve stock images

**Prices are not on this list.** The practice publishes none, by design — see §5.6.

**Confirmed and usable right now:** both addresses; the shared telephone number; Mon–Fri 08:00–20:00 at both; 5.0 ★ / 69 and 5.0 ★ / 20; both Doctolib booking URLs; the eleven practice-wide treatments; the equipment (3D X-ray, microscopes, 3D scanners); Dr. med. dent. Felix Zaritzki and the team's university-hospital training; veneers as the practice's stated focus; and that both practices treat **privately insured and self-paying patients only**.

---

## 8. Environment notes

- **Windows 11.** Both PowerShell and Git Bash are available; they take different syntax. The plan's shell blocks are POSIX — run them in Bash.
- **No git repository yet.** Task 1, Step 1 creates it. Commit after every task.
- Project root is `zaritzki_handoff/`. All application code goes in `site/`.
- `ffmpeg` is available for the image resizing in Task 17. There is no image *generation* tooling configured.
- The brainstorming visual-companion server was running at port 50571 during the design session. It idles out after four hours; nothing depends on it. The three screens it served are preserved in `docs/design/`.

---

## 9. Definition of done

Not "the tests pass." Done is:

1. All 20 tasks complete, each committed.
2. `pnpm test:unit` and `pnpm test:e2e` green on both the desktop and mobile projects.
3. The direction contract present in the built output — `grep 2c7cb46c .next/server/app` returns a match.
4. `detect.mjs` run once over the changed targets, mechanical findings fixed.
5. `impeccable-finish-reviewer` spawned fresh, its material fixes applied in one batch, and its verdict reported to the user **as written** — a table with open findings is never announced as a pass.
6. `DESIGN.md` written by `impeccable-documenter` from the built world, not by hand, not in advance.
7. The client checklist from §7 handed over, with the hosting caveat: while this is a pitch, host it somewhere that reads as a proposal rather than at an address a patient could mistake for the practice's official site. Every practice fact on the page is real; the photography and prices are not.
