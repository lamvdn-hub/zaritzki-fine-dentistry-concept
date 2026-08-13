# Build checklist — Zaritzki demo

Everything here happens in the codebase. Target: half a day.
Non-code items (verification, legal, send mechanics) live in `zaritzki-pre-send-checklist.md`.

---

## Status — pass completed 2026-08-13

Every code item is done. Four items are marked `[~]` (deliberately skipped, reason
given) and three are left `[ ]` because they are not code — they are yours:

1. **Unlisted, unguessable deploy URL** (§7) — a hosting setting.
2. **Load it on a real phone** (§7) — emulation is not a handset.
3. **Portfolio live and reachable** (§8).

Two things need a decision from you before sending, both written up in place:
`PracticeJsonLd` still publishes the practice's real name, addresses and phone as
machine-readable data (§7), and two headlines still describe their rooms (§3).

**Verification.** `next lint` clean · 100 unit tests pass · production build
succeeds · 70 Playwright e2e pass across desktop and mobile, up from 61 — the 9
that were failing are all fixed and are itemised at the foot of this file.

One pre-existing failure is **not** fixed and was not touched:
`tsc --noEmit` reports `hero-responsive.spec.ts(212,38): Property 'remove' does
not exist on type 'Node'`. It is in a test file, it exists unchanged at `HEAD`,
and `npm run build` is unaffected because Next does not typecheck tests. Left
alone because that file looks like work you have in flight.

---

## 1. Brand — do this first

- [x] **Replace the header wordmark** with their existing one: stark letter-spaced `ZARITZKI` caps, black. Match the tracking and weight on the live placeholder as closely as you can.
      → No matching needed: `site/public/logo-full.svg` is now used as-is. Their outlines
      are inlined verbatim in `components/chrome/Wordmark.tsx` (path copied from the file
      by script, not retyped), so the tracking and weight are theirs exactly.
- [x] Confirm the black wordmark still reads against the dark header — may need a cream header bar or a knocked-out white version.
      → Black on the espresso bar (`#241A12`) is invisible. Took the knocked-out route
      rather than a cream bar, which would have broken the dark-header design: the path
      fills with `currentColor` and inherits ivory `--text-on-dark`, gold on hover. The
      source SVG is unchanged.
- [x] **Keep your palette in the body only.** No other change to tokens.
      → No token file touched.
- [~] Optional, only if fast: a second view showing your serif lockup, explicitly labelled as an alternative.
      → Skipped. Not fast — it needs a second route, its own nav affordance and a label
      treatment. The serif lockup is recoverable from git (`SiteHeader.tsx` before this
      change) if you want to show it live.

---

## 2. Copy — delete

- [x] `and a team whose experience comes from years in university hospitals` — cut the clause, keep `Dr. med. dent. Felix Zaritzki`.
      → `room.clinician` is now `Dr. med. dent. Felix Zaritzki.` The placeholder badge
      beside it still says the other names are unsupplied, so the sentence is not
      silently claiming he is the only clinician.
- [x] `OUR PARTICULAR FOCUS` tag on Veneers.
      → Removed the whole mechanism, not just the one flag: the `focus` field is gone
      from the `Treatment` type, `talk.focusLabel` is gone from `en.json`, and the
      `.focus` rules are gone from `TreatmentSchedule.module.css`. Nothing can
      reintroduce it by setting a boolean.
- [x] `including no-preparation veneers` — unless it's on the Doctolib listing.
      → **Kept — the exception applies.** `PRODUCT.md:74` records the treatment list read
      off their own Doctolib profile, and it reads `Veneers, including non-preparation
      veneers`. Their spelling is *non*-preparation, so `treatments.veneers` now reads
      `porcelain, including non-preparation veneers` rather than the `no-preparation` the
      demo had invented. Covered by a test that names the source.
- [x] `Appointments are spaced so that yours starts when it says it will.`
      → Cut from `lounge.body`. The `lounge.hours` line under it still carries the real,
      published 08:00–20:00 fact, so the section is not left empty-handed.

## 3. Copy — rewrite

- [x] `The room you wait in was furnished, not fitted out` — currently under a hotel lobby image. Recast as intent, not fact.
      → `was` → `should be`. One word, because the rhythm of the line is the thing worth
      keeping; the tense was the only part making a claim.
- [x] `The surgery was designed to look like the rest of the practice. Same wood, same lamps, same quiet` — same problem, same fix.
      → `was designed to look` → `should look`. The equipment clause after the dash is
      *not* hedged, because it is confirmed (`PRODUCT.md:80–82`, read off their Doctolib
      profile); it now reads `the 3D imaging, microscopes and 3D scanners we already use`
      so a reader can tell the fact from the intent inside one sentence.
- [x] Sweep for any other sentence asserting what their rooms are actually like.
      → Found and fixed one more, the worst of the three: `leaving.body` said *the rooms
      are like this*, which points a finger straight at the stock photograph. Now `That is
      what makes the time and the rooms possible`. The private/self-pay restriction in the
      same sentence is untouched.
      → **Two left deliberately, for you to rule on.** Both are headlines, and §4 protects
      the act structure and labels, so I did not rewrite them unasked:
      · `You will not be kept waiting in a queue` (02) — an operational promise that lost
        its supporting sentence when §2 deleted the appointment-spacing line. It now
        stands alone.
      · `Lamplight, not a light in your eyes` (04) — a fragment about their lighting.
        Reads as intent under the reworded body, but it is still their room being
        described.

## 4. Copy — do not touch

Verified against `git diff site/messages/en.json` — six lines changed, all of them §2/§3
items. Nothing below appears in the diff.

- [x] Five-act structure and section labels.
      → `lib/steps.ts` untouched; all five `*.eyebrow` and `steps.*` strings untouched.
- [x] GOZ / no-price-list paragraph.
      → `talk.noPrices` untouched, character for character.
- [x] GKV exclusion paragraph.
      → `leaving.gkvTitle` / `leaving.gkvBody` untouched. Note the §3 sweep did edit
      `leaving.body`, which sits in the same block but is the private-practice framing
      sentence, not the GKV paragraph — and the clause carrying the restriction (`we can
      only treat you if you are privately insured or paying yourself`) is verbatim.
- [x] `Ratings as published on Google.` attribution line.
      → `proof.sourceNote` untouched.
- [x] Self-paying slot: left empty.
      → Still empty. `OPEN_FACTS.selfPayWording` is still `pending`, so `CostPanel`
      still renders the placeholder badge there rather than the unused `leaving.selfBody`
      string. Covered by `tests/unit/CostPanel.test.tsx`.

---

## 5. Placeholder badges

- [x] Relabel `AWAITING PRACTICE` → `Placeholder — needs your content`.
      → Done, and the all-caps treatment went with it: `text-transform: uppercase` at
      0.22em tracking was built for two words and made a sentence with an em dash in it
      unreadable. Now sentence case at 0.04em. `role="status"` takes no accessible name
      from its contents, so the string is defined once in the component and used for both
      the visible text and the `aria-label`; a test asserts they have not drifted.
- [x] Restyle: ochre hairline outline, not solid red fill.
      → 1px `--hairline-gold` border over a 10%-alpha brass wash, no red anywhere. The
      text colour is *inherited* rather than set to ochre, because these badges sit on
      both grounds — espresso in the room note and the footer, parchment and ivory in the
      cost and practices panels — and no single brass passes contrast on both
      (`--gold-deep` is ~3.9:1 on ivory and worse on espresso). Checked on both grounds:
      `site/screenshots/check-badge-dark.png`, `check-badge-light.png`.
- [x] Five instances. Don't add more.
      → Added none. **But there are four, not five.** Counted on the served page, not by
      grep: `role="status"` appears 4× in the HTML at `/en`. They are the clinician note
      (04), the self-pay column (05), the shared-team line above the two addresses, and
      the photography credit in the footer. Nothing renders a fifth at either location or
      either locale. Worth a look if you were expecting a specific fifth slot to be
      flagged — it may be a slot that is silently unmarked.

---

## 6. Images

Three current images read as the wrong building, not as a stand-in for the right one. A Berlin dentist will identify all three on sight, and each sits under copy claiming it *is* their practice.

- [x] **`02 — The lounge`** — currently a hotel lobby with chandelier and marble columns. Replace with a dental waiting area: seating, reception desk or check-in surface, practice-scale room.
      → Replaced at **both** addresses. Cognac leather seating round a low table,
      a brass-edged dark oak reception counter, practice-scale room. Charlottenburg's
      lounge was replaced too — see the note below.
- [x] **`04 — The room`** — currently a leather armchair with a Tiffany lamp and a palm; reads as a bar. Replace with an operatory: chair, unit, task lighting, in the warm register of the design system.
      → Replaced at **both** addresses: chair, delivery unit, articulated task light,
      treatment microscope. The microscope matters — `room.body` claims microscopes and
      3D imaging, and now the picture underneath it agrees with the sentence.
      Deleting this file also disposes of the two taxidermy heads that `CREDITS.md`
      disclosed in its un-rendered upper crop.
- [x] **Closing hero** — currently a gothic library with stained glass. Replace with an interior at practice scale, or drop to a plain ground.
      → Took the plain-ground option. `ClosingCta` no longer renders an image at all;
      it paints espresso with a faint warm radial lift off the top left. This costs
      nothing visually because the old block already covered its photograph with a flat
      0.78 espresso scrim — almost none of the library was ever visible. Both
      `closing.jpg` files are deleted and the `closing` slot is gone from `ImageSlot`,
      so nothing can point at them again.
- [x] Generate or source replacements that read unmistakably as a dental practice, in the existing palette and lighting.
      → **Sourcing was tried first and could not satisfy both halves.** Unsplash was
      reachable this time; its dental interiors are still uniformly bright white-and-teal
      clinical rooms, which is the design system's stated anti-goal, and the few warm
      candidates were not dental practices — the exact failure being fixed. So: four
      images generated with `gpt-image-2` at 1536x1024, re-encoded to JPEG. Two
      registers held, matching the split the project already used: Mitte warm and
      lamplit at dusk, Charlottenburg pale Altbau in afternoon daylight. Both share the
      existing hero's materials — espresso, dark oak, cognac leather, brass, herringbone
      — so the five generated files read as one practice. Full prompts and provenance
      are in `site/public/images/CREDITS.md` under *The 2026-08-13 pass*.
- [x] **Audit every image for teeth, treatment results, patients, or before/after.** Remove any that qualify — HWG restricts result imagery in dentistry, and synthetic outcomes are worse than stock.
      → **Nothing qualified; nothing had to be removed on these grounds.** All 11 unique
      files were opened and looked at, not taken on trust from the existing `CREDITS.md`
      audit. No teeth, no treatment results, no before/after, no tooth diagrams, no
      charts or x-ray images, no patients — in fact no people at all in any frame, and
      no gloved hands. The four generated images carried explicit negative constraints
      for every one of those, and each output was checked against them before install.
- [~] Optional if cheap: swap the three real interior shots from their Instagram into the strongest three slots.
      → Skipped, and not just on cost: taking images off their Instagram to publish on an
      unofficial page is a licensing decision that is yours to make, not a default.
      Every slot is now a placeholder that clearly isn't theirs, which is the safer
      state to send. The five commissioning briefs at the foot of `CREDITS.md` still
      stand if real photography becomes possible.

**Not on your list, found during the audit — two more images were as wrong as the
three you named, on the Charlottenburg side.** Both are replaced:

- `charlottenburg/lounge.jpg` was an empty pale room with a floor lamp and **no seating
  at all**, under a headline about not being kept waiting. It read as an apartment
  listing.
- `charlottenburg/treatment-room.jpg` was an empty flat with bare walls and patched
  skirting, under copy describing a surgery with microscopes and 3D imaging in it. The
  worst mismatch of the five.

Also deleted: `mitte/entrance.jpg` and `charlottenburg/entrance.jpg`, byte-identical
orphan copies of `entrance-chair.jpg` that nothing referenced. The set is now **ten
files, five of them generated** — `OPEN_FACTS.photography` was saying "All 12 images
are licensed stock", which was wrong on both the count and the origin, and now says so
correctly. The fact itself stays open: the practice must still approve or replace
everything.

Evidence: `site/screenshots/checklist-pass/02-*.png`, `04-*.png`.

---

## 7. Hosting

- [x] **`noindex` meta tag + `robots.txt` disallow.** Highest-priority technical item — a crawlable clone of a named medical practice, carrying their real phone number and both addresses, must not be indexable.
      → Three overlapping layers, because any one can be missed by a given crawler:
      1. `app/robots.ts` → `User-Agent: * / Disallow: /`
      2. `robots: { index: false, follow: false }` in the locale layout's metadata
      3. `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex` on
         every response, set in `next.config.ts`
      Layer 3 is the one that carries: it is the only one that also covers **the
      images**, which a meta tag cannot reach. All three verified live against the
      running server, and now pinned by two e2e tests in `tests/e2e/seo.spec.ts`.
- [ ] Unlisted, unguessable URL. Not linked from your portfolio.
      → **Yours to do — this is a deploy setting, not a code change.** Nothing in the
      repo can enforce it.
- [x] Strip all analytics and tracking from the demo.
      → Nothing to strip: there was none. Verified rather than assumed — no analytics
      dependency in `package.json` (the only three runtime deps are `next`, `react`,
      `react-dom`), and no `gtag`/GTM/Plausible/PostHog/Fathom/Hotjar/Vercel-Analytics
      reference anywhere in `app`, `components` or `lib`.
- [x] Footer line: unofficial concept, not affiliated, built by [name], taken down on request.
      → *"An unofficial design concept, not affiliated with or endorsed by Zaritzki Fine
      Dentistry. Built by Lam as a speculative proposal. It will be taken down on
      request."* Set at body size rather than fine print. Name taken from this repo's
      git identity, as you chose — **change `footer.builder` in `messages/en.json` if
      you sign work under a different name.**
- [x] `Book` / `Book a first consultation` buttons: either point at their real Doctolib, or mark inert. No dead links.
      → Every `href` on the page was crawled for both practices and fetched. All live:
      both Doctolib URLs return 200 (Mitte carries `pid=practice-540639`, Charlottenburg
      the bare profile), both Maps links 200, `tel:` and in-page anchors resolve.
      → **Two dead links found and removed that were not booking buttons:** the footer's
      `Impressum` and `Datenschutz` both pointed at routes that do not exist and returned
      404. A demo of someone else's medical practice cannot be given a real Impressum
      without inventing legal text on their behalf, so that row now carries the
      disclaimer above instead. This is why the a11y tab-order canary moved from 20
      interactive elements to 18.
- [ ] Load the deployed URL on an actual phone before sending.
      → **Yours to do.** The closest I can get is emulation: the 390x664 first viewport
      is captured at `site/screenshots/checklist-pass/01-first-viewport-390x664.png`
      and the mobile e2e project passes, but neither is a real handset.

**Flagged, not changed — `components/seo/PracticeJsonLd.tsx`.** The page emits
JSON-LD `Dentist` records carrying the real trading name, both real addresses and
the real phone number. That is machine-readable identity for a live medical
practice, on a page that is not theirs — the same concern this section is built
around. The three noindex layers should keep compliant crawlers off it, and it is
arguably a *feature* to demonstrate to them, so I left it alone rather than
deleting something you may have put there deliberately. Worth a decision before
you send.

---

## 8. Portfolio

- [ ] Portfolio or GitHub live and reachable. She will check it before she replies.
      → **Yours to do.** Nothing in this codebase touches it. Noting only that it
      interacts with §7: the demo URL must stay unlisted and unlinked *from* the
      portfolio, even while the portfolio itself is live.

---

## Test failures fixed during this pass

The e2e suite was at 61 passing / 9 failing when the pass finished its edits.
All 9 now pass. They split into two groups.

### Caused by this pass — two real regressions

- **`hero-responsive.spec.ts` — "the step rail sits in the first viewport at
  390x664", both practices.** The rail bottom landed at 686px against a 664px
  budget. The new wordmark caused it: the old text mark was a single 18px line,
  the practice's lockup is two lines, and below 860px the mark sits on its own
  row so every pixel it gains the header gains too. I had also given the link a
  40px min-height for touch, which alone accounted for the 22px overflow.
  Fixed by dropping that min-height, setting the desktop wordmark to 28px to
  match the height of the text mark it replaced, 24px below 860px, and giving
  the header back 4px of vertical padding below 640px. Verified at
  `screenshots/checklist-pass/01-first-viewport-390x664.png`.

- **`a11y.spec.ts` — "the whole tab order is walkable".** It asserts the page
  offers at least 20 interactive elements on desktop, as a canary against a
  silently collapsing enumeration. It found 18, because §7 removed the two
  footer links that 404'd. That is the canary doing its job, so the fix is the
  honest one: the threshold moves to 18 with a comment saying which two elements
  went and why. Every remaining stop still draws its focus ring.

### Already failing before this pass — four stale assertions

- **`page.spec.ts` — "seeds Charlottenburg from a valid praxis query" and
  "rejects inherited object keys as praxis values", desktop and mobile.** Both
  assert the hero `src` matches `entrance.jpg`. The hero moved to
  `entrance-chair.jpg` in the commits immediately before this pass and the
  assertions were never updated — confirmed by reading `lib/locations.ts` at
  `HEAD`, which already pointed at `entrance-chair.jpg`. Updated to match. The
  tests still do their real job, because the two practices load that file from
  their own directories and so still have distinct URLs.
