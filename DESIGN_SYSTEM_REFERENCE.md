# Zaritzki Fine Dentistry — Design System

A warm, boutique-hotel design language for **Zaritzki Fine Dentistry**, a private dental practice in Berlin. The system deliberately breaks from the cool, clinical blue-and-white of most dental branding: it is built on espresso wood, warm ivory plaster, brass mosaic, cognac leather, and midnight-velvet — the palette of the practice's own interiors. The feeling to reproduce is *a calmer kind of dental visit*: unhurried, precise, and quietly luxurious.

Consumers link **one file — `styles.css`** — for the full token + font closure.

---

## Sources given

- **4 interior photographs** from the practice's Google Business Profile (copied into `assets/images/`):
  - `treatment-room.webp` — the surgery: white dental chair in a warm, low-lit room with wood floor, framed art, and an orange lamp. The wall screen reads *"Dr. Felix F. Zaritzki · Zahnarzt & Prophylaxe"* in a serif face.
  - `interior-lounge.webp` — waiting lounge: chenille sofa, framed prints, brass side table, dark flowers.
  - `library-lounge.webp` — a club-like library with wingback leather chairs, midnight-blue velvet armchairs, fireplace, and book walls.
  - `powder-room.webp` — espresso powder room with a full-height **gold glass mosaic** feature and brass sconces.
- **Brief:** improve on the practice's coherent warm palette and make it distinctive versus other Berlin dental clinics; **no logo yet** — set the name where a mark would go; typography should embody *"Fine Dentistry"*; explore other design aspects freely.
- **No codebase, Figma, or existing component library** was supplied — the component inventory below is a from-scratch standard set sized to a clinic's website needs.

---

## Content fundamentals

**Voice:** warm, precise, understated. We speak like an attentive maître d', not a salesperson. Confidence is shown through restraint, never volume.

- **Person:** address the patient as **you**; refer to the practice as **we / our**. ("*We set aside generous time for every appointment.*")
- **Casing:** sentence case for everything except tracked uppercase eyebrows/labels. Never ALL-CAPS headlines, never Title Case Marketing Phrases.
- **Tone examples we'd use:** "A calmer kind of dental visit." · "Care that's considered, never rushed." · "We'd rather know one patient well than a thousand in passing."
- **Tone we avoid:** hype, superlatives, urgency, and exclamation marks — "BEST dentist!!!", "Book NOW — limited slots", "painless, affordable, world-class".
- **Emoji:** none. Ever. They break the register.
- **Numbers:** understated and factual (ratings, years, prices "from €90") — never inflated stat-slop.
- **German context:** Berlin practice. German terms appear naturally where authentic (*Zahnarzt, Prophylaxe, Impressum, Datenschutz, GKV/statutory*). Body copy is otherwise English in this system; keep it bilingual-friendly.
- **Length:** headlines are short and evocative (serif); supporting copy is one calm sentence or two, generously leaded. Whitespace is part of the message.

---

## Visual foundations

**Overall vibe.** Boutique hotel / private members' club, not a clinic. Warm, low-lit, architectural, tactile. Every surface should feel considered.

- **Colour.** Warm **ivory** (`--ivory #F5F0E6`) is the primary light ground; **cream** (`--cream`) for raised surfaces. **Espresso** (`--espresso #241A12`) is the primary dark ground. **Brass/gold** (`--gold #B58A3E`) is the *signature* accent — used for the primary action, hairlines, eyebrows, and small moments of shine, never as large flat fills. Secondary accents: **cognac** (leather), **midnight** (velvet navy) as a cool counterweight, and **amber** (lamp glow) used sparingly. Max one or two grounds per view. Semantic colours are pulled toward the warm palette (olive success, amber warning, brick danger, midnight info). See the **Colors** cards.
- **Type.** Display voice is **Cormorant Garamond** — a high-contrast old-style serif that carries the "Fine" in Fine Dentistry; used at generous sizes with a slight negative tracking (`--tracking-display`), often in *italic* for softer moments. Body/UI voice is **Mulish**, a quiet humanist sans, frequently at light (300) weight for lead paragraphs. Eyebrows are Mulish, 11px, `600`, uppercase, `.22em` tracking, in gold. Serif for feeling, sans for function — never the reverse.
- **Backgrounds.** Full-bleed photography of the real interiors, darkened with a warm espresso overlay (`rgba(20,12,7,.66–.86)`), often as a left-weighted gradient so text sits in the shadow. No synthetic gradients, no patterns, no textures beyond the photography itself. Sections alternate between ivory and the faintly darker `--surface-sunken` (parchment) to create rhythm.
- **Imagery.** Warm, low-lit, shallow, intimate. Espresso wood, brass, lamplight, deep shadow. **Never** cool blue-white "dental stock" imagery, gloved close-ups, or bright clinical rooms. Portrait photography (team) should match: warm, soft, editorial. (None supplied — placeholders are used, see Caveats.)
- **Corner radii.** Restrained and architectural. Cards `--radius-lg` (10px), controls `--radius-sm` (4px), inputs 4px. The only fully-round element is the **Tag** chip and toggle tracks — everything else stays low. No bubbly cards.
- **Cards.** Cream surface, 1px `--border-soft` hairline, soft warm shadow (`--shadow-sm`). Interactive cards lift 3px and gain a brass hairline on hover. An **inverse** card variant sits on espresso for contrast moments.
- **Shadows.** Warm-tinted (brown `rgba(36,26,18,…)`, never neutral grey), soft and diffuse — modelled on the clinic's low lamplight. A dedicated **gold glow** (`--shadow-gold`) is reserved for the primary button's hover and rare highlight moments.
- **Borders / hairlines.** 1px is the default. Gold hairlines (`--hairline-gold`, ~38% brass) mark premium dividers — e.g. between the espresso footer and body, or under a dark hero.
- **Transparency & blur.** Used for the sticky header only: translucent ivory or espresso at ~72–82% with a 12px backdrop-blur, so content passes softly beneath. Modal scrims are warm (`rgba(26,15,8,.55)`) with a light 3px blur.
- **Motion.** Calm, no bounce. `--ease-standard` for most, `--ease-out` for entrances. Durations 140/220/400ms. Tabs slide a brass underline in; accordion "+" rotates 45° to "×"; dialogs fade + rise 12px; cards lift on hover. Nothing springs or overshoots.
- **Hover states.** Light surfaces darken toward parchment/stone; the brass primary *lightens* to `--gold-light` and gains the gold glow; text links shift gold→cognac. **Press states** nudge down 1px (`translateY(1px)`) and deepen colour — no scale-down.
- **Layout.** `--container-max` 1200px, `--gutter` 2rem, `--section-y` 6rem. Generous vertical rhythm on an 8px base. Sticky header is the only fixed element.

---

## Iconography

- **No icon font, sprite, or SVG set was supplied** with the source material (the sources were four photographs only).
- **Substitution (flagged):** the system ships a small, self-contained inline-SVG set in `ui_kits/website/Icons.jsx` (exported as `window.ZKIcons`), drawn at a **1.75px stroke, round caps/joins** to match a Lucide-weight line style. It covers what the clinic surfaces need: `Tooth, Phone, MapPin, Clock, Star, Sparkle, Shield, Leaf, Chair, ArrowRight, Menu, Check, Quote`. For production, replace with a licensed set at the same stroke weight — **[Lucide](https://lucide.dev)** (CDN or npm) is the recommended match; Feather is an acceptable alternative.
- **Style rules:** outline (not filled) icons, 1.75 stroke, sized to the text they sit beside (16–24px). Icons ride *alongside* labels, rarely alone; when alone they use the `IconButton` component with a required `label`. Icons take `currentColor` so they inherit brass/ink/ivory from context.
- **Emoji / unicode as icons:** never.

---

## Foundations (tokens)

All tokens live under `tokens/`, each `@import`ed by root `styles.css`:

- `tokens/colors.css` — base palette + semantic aliases (`--surface-*`, `--text-*`, `--border-*`, `--brand*`, `--focus-ring`).
- `tokens/typography.css` — font stacks, weights, display + body scales, line-heights, tracking.
- `tokens/spacing.css` — 8px spacing scale + layout container tokens.
- `tokens/effects.css` — radii, borders, warm shadows, motion easings/durations.
- `tokens/fonts.css` — webfont loading (see Caveats).
- `tokens/base.css` — light element defaults (headings in serif, body in Mulish, links, eyebrow helper, selection colour).

Specimen cards for all of the above live in `guidelines/` and populate the Design System tab (groups **Colors, Type, Spacing, Brand**).

---

## Components

Reusable React primitives under `components/`, exported on `window.ZaritzkiFineDentistryDesignSystem_dfee56`. Each has a `.jsx`, a `.d.ts` props contract, and a `.prompt.md` usage note; each directory has one `@dsCard` demo.

**forms/**
- **Button** — primary (brass) / secondary (espresso) / ghost (hairline) / link; sizes sm·md·lg; icon slots.
- **IconButton** — square icon-only control; ghost / outline / solid.
- **Input** & **Textarea** — labelled fields with hint, error, and icon adornments.
- **Select** — native select styled to match, with a brass caret.
- **Checkbox** — brass-filled check.
- **Radio** — brass dot, scales in.
- **Switch** — brass track toggle.

**content/**
- **Card** (+ `CardEyebrow`, `CardTitle`, `CardBody`) — default / flat / raised / inverse; optional interactive lift.
- **Badge** — uppercase status label; neutral / gold / solid / success / warning / danger / info.
- **Tag** — rounded filter/selection chip; selectable and removable.

**feedback/**
- **Tabs** — underlined tabs with a sliding brass indicator.
- **Accordion** — serif-headed disclosure list; brass "+" rotates to "×".
- **Dialog** — centred modal over a warm blurred scrim.
- **Tooltip** — espresso hover/focus bubble.

*Intentional additions:* none beyond the standard set — no source defined a different inventory. `Textarea` ships alongside `Input` in the same file as a paired field type.

---

## UI kits

- **`ui_kits/website/`** — interactive recreation of the clinic's public marketing site: Home, Services, Team, and Booking screens with a shared sticky header and espresso footer. Composes the primitives above; see its `README.md`.

---

## Root index / manifest

| Path | What |
|---|---|
| `styles.css` | Global entry — `@import` lines only. Link this. |
| `tokens/` | `colors, typography, spacing, effects, fonts, base` CSS. |
| `guidelines/` | Foundation specimen cards (Colors / Type / Spacing / Brand). |
| `components/forms/` | Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch. |
| `components/content/` | Card, Badge, Tag. |
| `components/feedback/` | Tabs, Accordion, Dialog, Tooltip. |
| `ui_kits/website/` | Clinic marketing-site recreation (4 screens). |
| `assets/images/` | The four source interior photos. |
| `thumbnail.html` | Homepage tile for the design-system picker. |
| `SKILL.md` | Agent Skill wrapper for use in Claude Code. |
| `_ds_bundle.js`, `_ds_manifest.json` | Auto-generated by the compiler — do not edit. |

---

## Caveats

- **No logo.** None was supplied and none was invented. The name is set in Cormorant Garamond as the wordmark (see `guidelines/brand-logotype.card.html`). Provide a logo to replace it.
- **Fonts load from Google Fonts CDN**, not self-hosted (`tokens/fonts.css` `@import`s Cormorant Garamond + Mulish). These are the chosen faces, not stand-ins for a proprietary font — but for offline/self-hosted production you'll want the `.woff2` binaries dropped in and `@font-face` rules written. **If you have preferred licensed display/body faces, send them and I'll swap them in.**
- **Icons are a substitution** (inline SVG in the Lucide style) — see ICONOGRAPHY.
- **Team portraits are placeholders** (initials on espresso) — no people photos were supplied. Send headshots to finish the Team screen.
- **Practice details are fictional** (address, phone, hours, review counts) — replace with the real ones.
