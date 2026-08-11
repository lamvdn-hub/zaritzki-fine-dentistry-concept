# Handoff: Zaritzki Fine Dentistry Design System

## Overview
This is the complete **Zaritzki Fine Dentistry** design system — a warm, boutique-hotel visual language (espresso wood, ivory plaster, brass, cognac, midnight velvet) for a private Berlin dental practice. It includes design tokens (CSS), a React component library, foundation specimens, and a full marketing-site UI kit recreation.

## About the Design Files
Everything in this bundle is a **design reference built in HTML/CSS/React** — prototypes and token files that define the intended look, feel, and behavior. They are **not necessarily production-ready code to import as-is**. Your task is to **recreate this design system inside the target codebase's existing environment** (React, Vue, Swift, native, etc.), following its established conventions, build tooling, and component patterns — or, if no environment exists yet, choose the most appropriate stack and implement it there.

The component `.jsx` files here use a simplified, dependency-free style (plain React, inline/CSS-variable styling, no build step) so they preview standalone. Treat them as **exact visual and behavioral specs**, not literal source to copy into a real app — port them into your framework's component conventions (props typing, styling system, accessibility primitives, etc.), preserving the tokens, structure, states, and copy exactly.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, shadows, motion timing, and copy are final design decisions, not placeholders. Recreate pixel-perfectly using the token values below. Two exceptions (see Caveats): the icon set is a substitution to be replaced with a licensed set (Lucide recommended), and there is no logo — the wordmark is set in type.

## Design Tokens
All tokens are in `tokens/*.css`, imported by `styles.css` (link this one file). Key values:

- **Color** — Ivory `#F5F0E6` (primary light ground), Espresso `#241A12` (primary dark ground), Gold/brass `#B58A3E` (signature accent — hairlines, primary actions, eyebrows), plus cognac, midnight, amber secondary accents, and warm-shifted semantic colors (olive success, amber warning, brick danger, midnight info). Full palette + semantic aliases: `tokens/colors.css`.
- **Type** — Display: **Cormorant Garamond** (serif, generous size, slight negative tracking, often italic). Body/UI: **Mulish** (humanist sans, often weight 300 for lead paragraphs). Eyebrows: Mulish 11px/600/uppercase/.22em tracking in gold. Scale, weights, line-heights, tracking: `tokens/typography.css`.
- **Spacing** — 8px base scale; `--container-max` 1200px, `--gutter` 2rem, `--section-y` 6rem. `tokens/spacing.css`.
- **Radii / shadows / motion** — Cards 10px (`--radius-lg`), controls/inputs 4px (`--radius-sm`); only Tag chips and toggle tracks are fully round. Shadows are warm brown-tinted, never neutral grey, plus a dedicated gold glow for primary-button hover. Motion: 140/220/400ms, `--ease-standard`/`--ease-out`, no bounce/overshoot. `tokens/effects.css`.
- **Fonts** — Loaded from Google Fonts CDN in `tokens/fonts.css` (Cormorant Garamond + Mulish). For production, self-host the `.woff2` files and write `@font-face` rules instead of the CDN import.

See `DESIGN_SYSTEM_REFERENCE.md` for the full narrative spec (voice/tone, visual foundations, hover/press states, iconography rules) — read it in full before implementing.

## Components
React reference implementations in `components/`, each with a `.jsx` (implementation), `.d.ts` (props contract), and `.prompt.md` (usage notes):

- **forms/** — Button (primary/secondary/ghost/link × sm/md/lg), IconButton, Input, Textarea, Select, Checkbox, Radio, Switch.
- **content/** — Card (+ CardEyebrow/CardTitle/CardBody, default/flat/raised/inverse variants), Badge, Tag.
- **feedback/** — Tabs (sliding brass underline), Accordion (serif-headed, "+"→"×" rotation), Dialog (blurred warm scrim), Tooltip.

Each directory's `.card.html` file is a live demo of that group's components — open it to see rendered states, or read the `.jsx` directly for exact markup/styling.

## Screens / Views
`ui_kits/website/` recreates the clinic's public marketing site: **Home, Services, Team, Booking**, sharing a sticky translucent header and an espresso footer. It composes the component library above — see `ui_kits/website/README.md` for per-screen layout notes. Treat these as the reference for how components compose into full pages, including responsive behavior and section rhythm (alternating ivory / parchment `--surface-sunken` backgrounds).

## Assets
- `assets/images/` — 4 source interior photographs from the practice (treatment room, lounge, library, powder room). Used as full-bleed section backgrounds with a warm espresso overlay gradient.
- No logo file — the wordmark is typeset in Cormorant Garamond (see `guidelines/brand-logotype.card.html`).
- No icon set was supplied; `ui_kits/website/Icons.jsx` (`window.ZKIcons`) is a hand-built inline-SVG substitute at Lucide-matching weight (1.75px stroke). **Replace with [Lucide](https://lucide.dev) in production.**
- Team portraits are placeholders (initials on espresso) — no headshots were supplied.

## Caveats / Open Items
- **No logo** — none supplied; the name is set in type as the mark.
- **Icons are a placeholder set** — swap for Lucide (or Feather) at the same 1.75px stroke weight.
- **Team photos are placeholders.**
- **Practice details are fictional** (address, phone, hours, review counts) — replace with real data.
- **Fonts load from Google Fonts CDN** — self-host for production/offline use.

## Files
- `DESIGN_SYSTEM_REFERENCE.md` — full design system documentation (voice, visual foundations, iconography, rationale). **Read this first.**
- `styles.css` + `tokens/*.css` — the complete token system (colors, typography, spacing, effects, fonts, base element styles).
- `components/forms/`, `components/content/`, `components/feedback/` — component reference implementations + prop contracts + usage notes.
- `guidelines/*.card.html` — foundation specimens (color palettes, type scale/pairing, spacing scale, radii/shadows, brand voice, brand imagery, logotype).
- `ui_kits/website/` — full marketing-site recreation (Home/Services/Team/Booking).
- `assets/images/` — source photography.
- `SKILL.md` — an Agent Skill wrapper describing how an AI agent should use this system when generating new designs; useful context for how the system is intended to be applied consistently.
