# Zaritzki Fine Dentistry — Landing Page Design Spec

**Date:** 2026-08-10
**Status:** Awaiting user review
**Surface:** Public marketing landing page
**Visitor mode:** Persuade
**Product truth:** [`PRODUCT.md`](../../../PRODUCT.md)
**Visual authority:** [`DESIGN_SYSTEM_REFERENCE.md`](../../../DESIGN_SYSTEM_REFERENCE.md) and `tokens/*.css` — binding, unchanged by this work

---

## 1. Job and audience

A single landing page for Zaritzki Fine Dentistry, a private dental practice running two Berlin locations. It converts a first-time visitor into a booked first consultation.

**Who arrives:**

- **Anxious patients** who have delayed care. Scanning for evidence that this visit will not feel like the ones they remember. Primary audience; the page's structure is built for them.
- **International / English-speaking residents.** Need to know they can be treated in English and how payment works.
- **Private-pay patients** researching a considered treatment — implants, Invisalign, veneers.

Typically on a phone, mid-comparison across several practices.

**Returning patients** get no call to action. Confirmed by the user: they already use Doctolib or telephone directly, and a second button competes with the only conversion that matters. They are served by a persistently visible telephone number in the header and footer. Nothing else.

## 2. Outcome and proof

**Primary action:** book a first consultation, deep-linked to the Doctolib page for the currently selected practice.
**Success:** a booking. Every design decision is measured against whether it moves a first-time visitor toward that.

**Proof the page carries, all real:**

- 5.0 ★ from 69 reviews (Jägerstraße) and 5.0 ★ from 20 reviews (Kurfürstendamm), attributed per location.
- 08:00–20:00 Monday to Friday. Unusual for the category and directly answers "can I get an appointment that fits my job."
- Two named addresses with real transport context.
- Treatments as listed on the practice's own Google profiles.

**Proof the page does not carry:** no invented testimonial, no fabricated patient voice, no stat-slop. Beyond the honesty problem, HWG §11 makes third-party recommendations in German medical advertising legally risky. If the user later supplies real, cleared review text, it can be added — it is not designed in.

## 3. Selected direction — "The Visit"

**Thesis:** the page walks a first appointment in order — the street, the lounge, the conversation, the room, leaving — because what anxious patients fear is the unknown, and the fastest way to remove an unknown is to show it. It refuses the category arrangement of hero → trust bar → service icon-tiles → why-us → testimonial → CTA, which is exactly what the design system's own reference `HomeScreen` does.

**How it was chosen.** Seven materially different structures were derived and ordered by resonance, and the assignment was rolled externally rather than taken from that ranking (`concept-seed`, seed key `2c7cb46c`, surface scope, Persuade mode, assigned index 7 — "the materials index"). Six catalog challengers were dealt and weighed on audience identification and product clarity; five fused badly (paper-fold and automata worlds cannot coexist with the committed palette; the mecha command-center is manufactured urgency, the page's hardest anti-goal; Ray Gun deconstruction fails product clarity for a clinic; HyperCard's one-bit world cannot hold the palette). The split-flap concourse board was the one real contender and lost on audience identification — a departure board is the sound of hurry, and this practice sells its opposite. Its surviving idea, showing genuine availability rather than claiming it, is retained as a future enhancement.

The assigned direction was built and shown, and **the user rejected it on named product-clarity grounds**: organising a dental page by building materials is confusing for someone who wants an appointment, and the page must be organised around driving the call to action. A user decision beats the roll. "The Visit" was selected from the comparison and confirmed visually.

**Five steps, each a real section:**

| | Step | What it carries |
|---|---|---|
| 01 | The street | Hero. Arrival, the threshold, the qualifying facts, the primary CTA. |
| 02 | The lounge | Unhurried scheduling; 08:00–20:00; waiting without dread. |
| 03 | The talk | The consultation-first promise, and the full treatment schedule. |
| 04 | The room | The surgery, technique, equipment, clinicians. |
| 05 | Leaving | Cost and insurance, stated plainly. |

**Why cost sits at 05:** narratively you settle up at the end of a visit, and placing it there lets the page state the hard fact — *we cannot treat statutory patients* — in the position where it reads as candour rather than as a barrier at the door. The private-practice framing immediately above turns the restriction into the explanation for the long appointments and the rooms.

**Signature interaction:** the step rail beneath the hero is the page's navigation, not decoration. It sticks, tracks scroll position, and is keyboard-operable.

**Focal moment:** the first viewport is the threshold — the entrance photographed at dusk — with the walk's rail already visible beneath it. The visitor is standing outside the door before they have scrolled once.

## 4. The two locations

Location is **page-level state, not a gate**. A persistent segmented switch in the header selects Jägerstraße (default) or Kurfürstendamm. Confirmed against the alternatives:

- A selection gate was rejected: it spends the first viewport on an administrative question, adds a click before any CTA exists, and splits local-search authority across two half-pages.
- A practice-level page with location asked only at booking was rejected because the walk can only show one interior, so whichever is photographed becomes the implied look of both.

**What the switch changes:** photography, the eyebrow and address text, and the booking destination — the CTA label becomes `Book at Jägerstraße` / `Book at Kurfürstendamm`.

**What the switch never changes:** the page's chrome. Espresso grounds, brass accent, type, layout, and section order are identical in both states. Kurfürstendamm's pale Gründerzeit register appears *inside* the imagery, framed by the same dark system — which is how two genuinely different interiors stay one brand. This is the resolution to the finding that the entire design system was derived from Jägerstraße alone and describes Kurfürstendamm not at all.

**Default:** Jägerstraße, on 69 reviews against 20.

Dedicated `/mitte` and `/kurfuerstendamm` pages, each with its own address markup and photography, are the correct pattern for local search and are **explicitly out of scope for this build.**

## 5. Scope and boundaries

**In scope:** one landing page, English only, desktop and mobile, production-quality Next.js implementation with the design system ported as real tokens.

**Out of scope:** the German page, per-location pages, the booking flow itself (Doctolib owns it), team/services/contact sub-pages, a CMS.

**Untouched:** every file in `tokens/`, `components/`, `guidelines/`, and `ui_kits/`. The design system is read as authority and ported, never edited. `assets/images/` stays where it is as derivation evidence and is not published.

**Anti-goals, confirmed by the user:**

1. Anything reading as sales pressure — urgency, scarcity, countdowns, discounts, exclamation marks.
2. Anything hiding price or insurance.
3. Anything so cold or austere it reads as intimidating rather than calming.
4. Stock-dental visuals and generic icon tiles. No gloved close-ups, no blue-white clinical rooms, no tooth diagrams, no rounded-square icon grids.
5. No emoji, anywhere, ever.

## 6. Content and states

### Imagery

Every image is **licensed placeholder stock**, sourced from free-license providers (Unsplash / Pexels), each URL verified to resolve, downloaded into `public/images/`, and listed in a swap manifest. The user has excluded the practice's own photography on regulatory grounds.

Two tonal sets are needed:

- **Jägerstraße set** — warm, low-lit, dark wood, lamplight, deep shadow, enveloping.
- **Kurfürstendamm set** — Gründerzeit stucco, tall windows, herringbone parquet, pale plaster, cream and blush, daylight.

Six slots per location: entrance, lounge, consulting room, treatment room, a detail, and the closing band. No image may depict a patient, a procedure, or a before/after.

### Facts supplied 2026-08-11

The client provided the practice's Doctolib profile, which resolves most of what was outstanding:

- **Both booking URLs.** One Doctolib profile; Gendarmenmarkt is selected by `?pid=practice-540639`, the bare URL resolves to Kurfürstendamm.
- **The full treatment list, and it is practice-wide** — eleven entries. The differing Google lists were partial, not a real difference between addresses. `TREATMENTS` therefore moves out of `Practice` and becomes a module constant.
- **Equipment:** 3D X-ray machines, microscopes, 3D scanners. Real content for `04 The room`, which previously had only a placeholder.
- **Principal:** Dr. med. dent. Felix Zaritzki, with the team's experience from years in university hospitals.
- **Stated focus:** aesthetic-functional smile transformations with veneers, marked on that one row.

**Prices are confirmed unpublished, which changes the design.** German private dental fees are set under the GOZ and depend on the treatment plan, so no fixed list exists to publish. The from-price column is removed: thirteen permanent `€—` placeholders would advertise the absence without explaining it. Step 03 now states plainly why there is no price list and what happens instead — a written estimate before anything is agreed. That serves the cost-transparency requirement better than an empty column did.

**Their marketing copy is a source of facts, not of voice.** The profile's register — "the first address for private patients in Berlin", "exclusive", "first-class", "demanding private patients" — is exactly what the voice rules forbid, and none of it may be reproduced. One line is useful as validation rather than text: *"even patients with anxiety forget to be in a dental practice"*, which is the practice naming this page's primary audience itself.

### Facts still required

| Fact | Used at |
|---|---|
| Clinicians beyond Dr. Zaritzki, with credentials | 04 The room |
| Whether both addresses share a team | 04 The room |
| Self-payer estimate wording | 05 Leaving |
| Approval or replacement of all twelve stock images | Every image slot |

These render as visibly marked placeholders and are enumerated by `pnpm pending`. **None may be invented.**

### Ranges

- Treatments: 7 known, design must hold 6–16 without breaking.
- Steps: fixed at 5. The rail's layout assumes this.
- Locations: 2. The switch is a two-state control, not a generic list.
- Copy expands roughly 25–35% under German translation; every fixed-width element must tolerate it.

### Material states

- **No JavaScript:** the page renders complete and readable at the default location. Both addresses are always present in the "Two practices" section regardless of switch state, so nothing is unreachable.
- **Missing Doctolib URL:** the CTA falls back to `tel:+493085403000` rather than rendering a dead button.
- **Image load failure:** `next/image` renders over a token-coloured ground so the layout never collapses.
- **`prefers-reduced-motion`:** all scroll reveals resolve instantly, no transforms, no parallax. Non-negotiable — anxious users are a named audience.
- **Placeholder facts:** marked in the UI and enumerable from the CLI.

## 7. Interaction and layout

**Hierarchy.** One primary action, brass, repeated at three points: hero, sticky bar, close. Nothing else on the page uses the brass fill. The telephone number is the only competing affordance and is deliberately quiet.

**Sticky booking bar.** Appears once the hero leaves the viewport; carries the current address, the hours, the insurance qualifier, and the button. Dismissible on mobile, and **dismissal persists for the rest of the browsing session** (`sessionStorage`, not `localStorage` — a returning visitor on another day should see it again). It never animates in with a bounce and carries no urgency language.

**Step rail.** The rail is authored once, as the bottom band of the hero. On desktop it **detaches and sticks beneath the header** as the hero scrolls past, and releases again when the page reaches the "Two practices" section — the walk is over by then. On mobile it does not stick; it stays in the hero and is horizontally scrollable, because a persistent second bar plus the booking bar would eat too much of a phone viewport. Semantic `<nav>` with in-page anchors, `aria-current` on the active step, IntersectionObserver scroll-spy, full keyboard operation.

**Section rhythm.** Alternating dark and light grounds: hero dark → lounge dark → talk ivory → room dark → leaving parchment → proof espresso → practices ivory → close dark → footer cocoa. Alternating image sides on the split sections. One spacing rhythm throughout, more space above a heading than below it.

**Responsive.** Splits stack at 760px with the image first. The header collapses to wordmark, location switch, and a compact Book button; the telephone number moves into the mobile menu. The treatment schedule drops its "typical" column below 600px, never the price.

**Motion.** Calm, per the design system: 140/220/400ms, `--ease-standard` and `--ease-out`, nothing overshoots or bounces. Section entrances fade and rise 12px. Photographs settle from 1.04 to 1.0 over 400ms on first entry only. Brass hairlines draw left to right. The location switch cross-fades imagery at 220ms rather than sliding. Motion is authored once, orchestrated, not scattered across hover effects.

**Feedback.** Focus rings from `--focus-ring` on every interactive element. Buttons press down 1px, never scale down. Light surfaces darken toward parchment on hover; the brass primary lightens to `--gold-light` and gains `--shadow-gold`.

## 8. Technical architecture

**Stack:** Next.js (App Router) + TypeScript, chosen by the user.

```
app/
  [locale]/
    layout.tsx          # <html lang>, fonts, tokens, JSON-LD, direction-contract comment
    page.tsx            # composes the sections
  globals.css           # imports the ported token files
styles/tokens/          # colors, typography, spacing, effects, base — ported verbatim
components/
  chrome/               SiteHeader, SiteFooter, LocationSwitch, LocaleSwitch, StickyBookingBar
  walk/                 Hero, StepRail, StepSection
  content/              TreatmentSchedule, CostPanel, ProofBand, PracticesSection, ClosingCta
  system/               Button, Badge — ported from components/, not reinvented
  dev/                  Pending (marks unverified facts)
lib/
  locations.ts          # the two practices as typed data, single source of truth
  useLocation.ts        # context + localStorage persistence
messages/
  en.json               # all copy — authored
  de.json               # scaffolded, empty, required later
public/images/          # verified stock, per location
scripts/
  list-pending.ts       # enumerates every unverified fact
```

**Design tokens.** The `tokens/*.css` files port **verbatim** as CSS custom properties, not translated into a Tailwind config. They are the binding visual contract; rewriting them into another system's vocabulary invites drift, and CSS variables cost nothing in Next.js. Components use CSS Modules referencing `var(--…)`.

**Fonts.** `next/font/google` for Cormorant Garamond and Mulish. This self-hosts and preloads them, which resolves the design system's own caveat about loading from the Google Fonts CDN.

**Internationalisation.** `/en` and `/de` routes exist from the start; only `en` is authored. `/` redirects to `/en` for now, with a single documented constant to flip to `de` when the German copy lands. `de.json` is scaffolded and empty; the `/de` route is not linked until it is filled. All copy lives in message files — no string is hard-coded in a component.

**Where treatment data lives.** Treatment names stay in `lib/locations.ts` as per-location data, not in message files: `Endodontologie` and `Invisalign` are proper nouns that do not translate, and the two practices list different sets. Only the plain-English glosses beside them ("root canal", "gum treatment") are translatable strings. Prices are data, formatted per locale.

**Location state.** React context, default `mitte`, persisted to `localStorage`, optionally seeded from a `?praxis=` query parameter so a link can be shared pre-selected. Not routing — routes are the later per-location build.

**SEO.** Per-location `Dentist` JSON-LD with name, address, telephone, opening hours, and area served. **`aggregateRating` is deliberately omitted from the structured data** — Google's policy disallows self-serving review markup for a business's own reviews, and these ratings already live on Google. The ratings are displayed visually; they are not marked up.

## 9. Verification

**Unit (Vitest + Testing Library):** location context defaults and persistence; CTA `href` resolves per location and falls back to `tel:` when a Doctolib URL is absent; every rendered string resolves from `messages/en.json`; the pending-fact marker renders for each unverified value.

**End-to-end (Playwright):** a primary CTA is present and in view in the first viewport at 390px and 1440px; the sticky bar appears after the hero and not before; the location switch changes address, imagery, and booking destination together; the step rail navigates and updates `aria-current`; the page is complete and readable with JavaScript disabled; the reduced-motion path renders without transforms.

**Accessibility:** automated `axe` pass on the rendered page; manual keyboard traversal of header, rail, and CTAs; contrast verified for text over every photographic ground at the specified overlay strengths.

**Performance:** LCP is the hero photograph — priority-loaded, AVIF/WebP, correctly sized. Lighthouse budget set before the first image lands so regressions are visible.

## 10. Deferred, in order

1. **German page.** Required, not optional. Translate `de.json`, flip the default locale, review German copy against the practice's own register.
2. **Per-location pages** at `/mitte` and `/kurfuerstendamm` with their own photography and address markup.
3. **Real photography**, if the practice's regulatory position changes — the slots are specified for it.
4. **Live availability** at the close, if Doctolib exposes it. The surviving good idea from the split-flap challenger.

## 11. Open decisions a builder must not invent

- Every fact in the table in §6. Placeholders ship marked; they are never guessed.
- Whether the two locations share clinicians.
- Whether the practice supports insurer reimbursement with itemised estimates. Plausible for this segment and therefore especially tempting to assert — do not.
- Exact German wording for the cost panel; the English is a translation source, not the legal text.

---

**Note:** this project is not a git repository, so the spec is written to disk but not committed. Initialising one before implementation is worth doing.
