---
name: Zaritzki Fine Dentistry
description: Espresso-and-brass system for a calmer private dental visit.
colors:
  espresso: "#241A12"
  cocoa: "#3A2A1D"
  ivory: "#F5F0E6"
  parchment: "#EFE7D6"
  stone: "#E0D5C0"
  gold: "#B58A3E"
  gold-light: "#CDA75E"
  gold-deep: "#8F6C2C"
  cognac: "#A45A2A"
  cognac-deep: "#7E4320"
  umber: "#7A5638"
  clay: "#9A8663"
  text-body: "#33261A"
  text-on-dark-muted: "#C2B49A"
  brand-contrast: "#2A1E10"
  border-strong: "#C3B291"
  hairline-gold: "rgba(181,138,62,0.38)"
  focus-ring: "rgba(181,138,62,0.55)"
  scrim: "rgba(20,12,7,0.9)"
typography:
  display:
    fontFamily: "Cormorant Garamond, Hoefler Text, Georgia, serif"
    fontSize: "clamp(2.75rem, 5.4vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Cormorant Garamond, Hoefler Text, Georgia, serif"
    fontSize: "clamp(1.9rem, 3.4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Cormorant Garamond, Hoefler Text, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 300
    lineHeight: 1.7
    letterSpacing: "normal"
  body:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.22em"
rounded:
  sm: "4px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "48px"
  8: "64px"
  9: "96px"
  gutter: "32px"
  section-y: "96px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.brand-contrast}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.gold-light}"
    textColor: "{colors.brand-contrast}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "44px"
  button-primary-active:
    backgroundColor: "{colors.gold-deep}"
    textColor: "{colors.brand-contrast}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "44px"
  button-primary-lg:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.brand-contrast}"
    rounded: "{rounded.sm}"
    padding: "0 30px"
    height: "54px"
  button-secondary:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-body}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "44px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.gold-deep}"
    padding: "0"
  location-selected:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.brand-contrast}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "40px"
    typography: "{typography.label}"
---

# Design System: Zaritzki Fine Dentistry

## Overview

**Creative North Star: "The Visit"**

This is a boutique-hotel register, not a clinic. Espresso wood and ivory plaster are the grounds; brass is the single accent fill; Cormorant Garamond speaks over Mulish. The atmosphere is unhurried and tactile — restrained warmth, never sales volume and never cool clinical chrome. Confidence shows up as space, sentence case, and materials that already exist in the rooms.

Density is generous. Sections breathe on a 96px vertical measure; copy sits in short serif headlines and light-leaded sans paragraphs. Photography is full-bleed and real-interior; type lives inside a warm espresso scrim, not on a white slab. Chrome stays espresso and brass even when the two Berlin interiors change. Motion settles in 140 / 220 / 400ms and never overshoots. Anxious patients are a named audience: reduced-motion is a first-class path, not an afterthought.

Confirmed rejections: cool blue-and-white dental visuals, gloved close-ups, bright clinical rooms, grey drop shadows, pill-round marketing chrome, stretched full-width CTAs, emoji, and shouting case.

**Key Characteristics:**
- Espresso and ivory grounds; brass as the only accent fill
- Cormorant Garamond display over Mulish body, with tracked uppercase eyebrows
- Architectural 4px controls; warm brown-tinted shadows
- Calm motion at 140 / 220 / 400ms, no bounce
- Location swaps photography and facts; the chrome language does not change

## Colors

A warm boutique-hotel palette drawn from wood, plaster, and brass hardware. One signature fill; everything else is ground, type, or hairline.

### Primary
- **Brass** (`gold`): The only accent fill. Primary actions, the selected location chip, and the footer's top rule. Rarity is the point.
- **Brass Light** (`gold-light`): Hover on brass fills, and type that must read as gold on espresso (eyebrows, wordmark italic, step current-state, phone hover).
- **Brass Deep** (`gold-deep`): Pressed brass fills, and default link color before the cognac hover.

### Neutral
- **Espresso** (`espresso`): Primary dark ground — header, inverse sections, secondary buttons, sticky booking bar.
- **Cocoa** (`cocoa`): Secondary inverse ground (footer) and secondary-button hover.
- **Ivory** (`ivory`): Primary light page ground and type on dark.
- **Parchment** (`parchment`): Sunken light band (cost panel) and ghost-button hover fill.
- **Stone** (`stone`): Soft borders on light, ghost-button press fill.
- **Ink** (`text-body`): Body copy on light. Headings on light use espresso.
- **Umber** (`umber`): Muted body on light (`text-muted`).
- **Clay** (`clay`): Captions and table meta (`text-subtle`).
- **On-dark muted** (`text-on-dark-muted`): Secondary type on espresso.
- **Brand contrast** (`brand-contrast`): Ink on a brass fill.
- **Gold hairline** (`hairline-gold`): Premium 1px dividers on dark chrome and light practice cards.
- **Focus ring** (`focus-ring`): 2px brass outline, 2px offset.

### Named Rules
**The Brass Fill Rule.** Brass is the only accent fill. It paints the primary action, the selected location, and small moments of shine — never a large flat ground.

**The Light-Gold Text Rule.** Gold type on ivory or parchment is remapped to cognac-deep. Gold-deep fails AA at eyebrow size; gold-light is reserved for espresso grounds.

## Typography

**Display Font:** Cormorant Garamond (with Hoefler Text, Georgia)
**Body Font:** Mulish (with ui-sans-serif, system-ui)
**Label/Mono Font:** Mulish (same as body; no mono face)

**Character:** High-contrast old-style serif carries the "Fine" in the name; quiet humanist sans does the work. Serif for feeling, sans for function.

### Hierarchy
- **Display** (400, `clamp(2.75rem, 5.4vw, 5.5rem)`, 1.05 / −0.01em): Hero headline only. Caps at 14ch. Below 640px the clamp floor drops to 2.25rem / 8vw / 4rem.
- **Headline** (400, `clamp(1.9rem, 3.4vw, 3rem)`, 1.2 / −0.01em): Section titles on the walk, cost, practices, and closing CTA. Caps at 18ch.
- **Title** (400, 1.75rem, ~1.1): Wordmark, step-rail labels, practice names, treatment names. Header wordmark uses weight 500; "Fine Dentistry" is italic 300 in brass light.
- **Lede** (300, 1.375rem, 1.7): Opening paragraphs. Hero lede caps at 44ch; cost lede at 62ch. Section bodies often sit one step down at 1.125rem / 300 / 1.7, 48ch.
- **Body** (400, 1rem, 1.5): Default document type. Supporting lines frequently drop to 300.
- **Label** (600, 0.6875rem, 0.22em, uppercase): Eyebrows, table heads, locale switch, location switch, dismiss. Sentence case everywhere else.

### Named Rules
**The Eyebrow Rule.** Every major section opens with a Mulish eyebrow: 11px, semibold, uppercase, 0.22em tracking. On espresso, brass light; on ivory, cognac-deep. Eyebrows are native to this world.

**The Serif Feeling Rule.** Cormorant carries headlines, the wordmark, step labels, and practice names. Mulish carries body, UI, and eyebrows. Never the reverse.

## Layout

A single 1200px measure (`--container-max`) with a 32px gutter that tightens to 16px below 640px. Vertical rhythm is an 8px scale; full sections use 96px block padding (`--section-y`).

The walk sections are a two-column 1fr/1fr split, minimum 34rem tall, image and copy exchanging sides. Below 860px they stack, image first, copy padded at 48px / 24px. Light and inverse grounds alternate. The first viewport is full-bleed photography at ~88svh (or `100svh − 145px` under the wrapped mobile header), copy left-aligned in the dark third, five-step rail along the bottom.

Breakpoints that the chrome actually answers: 860px (rail, header wrap, section stack) and 640px (header grid, hero scrim, booking bar stack). Scroll padding is 145px on small screens and 137px from 861px up, matching the measured sticky chrome.

## Elevation & Depth

Depth is a hybrid of tonal grounds and warm, lamp-like shadows. Inverse espresso blocks and parchment bands do most of the layering. Shadows are espresso-tinted (`rgba(36,26,18,…)`) and used sparingly — rest state is nearly flat.

Photography sits behind a left-weighted espresso scrim (`rgba(20,12,7)` at 0.9 → 0.66 → 0.2). Below 640px the last two stops rise (0.84 / 0.72) so full-width copy still meets AA. Sticky chrome is espresso at 86–94% with a 12px backdrop blur.

### Shadow Vocabulary
- **Rest lift** (`box-shadow: 0 1px 2px rgba(36,26,18,0.06)`): Default primary button.
- **Brass glow** (`box-shadow: 0 6px 24px rgba(181,138,62,0.28)`): Primary button hover only.
- **Sticky glass** (`background: rgba(36,26,18,0.86)` + `backdrop-filter: blur(12px)`): Header. Booking bar uses 0.94 / 12px. Step rail uses `rgba(20,12,7,0.62)` + 8px blur.

### Named Rules
**The Warm Lamp Rule.** Shadows are espresso-tinted and diffuse. Neutral grey shadows are out.

## Shapes

Architectural, not bubbly. Controls — buttons, location switch, skip link — are 4px (`--radius-sm`). The location switch is a 4px capsule with a 1px gold hairline and a flush brass selected cell. Images and split sections are square-clipped; no rounded photography. Hairlines are 1px. Focus is a 2px brass ring, 2px offset (inset on the location switch so it stays inside the capsule).

### Named Rules
**The Hug Rule.** Primary actions hug their label (`width: auto`, `align-self: flex-start`). They never stretch to fill a container.

## Components

### Buttons
Hugs the label. 4px corners, Mulish semibold, 0.01em tracking, 140ms standard ease. Press nudges `translateY(1px)`. Disabled sits at 45% opacity and loses the press.

- **Shape:** Architectural 4px radius. Default 44×22px padding; small 36×16px; large 54×30px (hero CTA).
- **Primary:** Brass fill, brand-contrast type, rest lift. Hover lightens to brass light and takes the brass glow. Press deepens to brass deep.
- **Secondary:** Espresso fill, ivory type. Hover cocoa. Press `#160f0a`.
- **Ghost:** Transparent, strong stone border, body ink. Hover parchment fill and umber border. Press stone fill.
- **Link:** No box, no radius, brass-deep type. Hover cognac. No press translation.

### Cards / Containers
No card primitive ships on the page. Recurring containers are full-bleed sections, not lifted tiles: ivory or espresso grounds, or a parchment band with stone block borders. Practice and cost columns are hairline-topped stacks (gold or gold-hairline), not boxed cards.

### Inputs / Fields
No text-field primitive ships on this surface. Booking leaves the page.

### Navigation
- **Header:** Sticky espresso glass, gold hairline under. Wordmark is Cormorant: "Zaritzki" regular, *"Fine Dentistry"* italic brass light. Phone is persistent sans at 14px / 0.04em. Header book control is the small primary.
- **Location switch:** 4px hairline capsule. Unselected is tracked uppercase muted type; selected is brass fill, brand-contrast, weight 700. Inset brass focus ring.
- **Locale switch:** Tracked uppercase. Current locale is brass light semibold; the pending locale is muted and not-allowed, without opacity (opacity failed AA).
- **Step rail:** Five equal columns on a dark glass bar. Number is brass 11px / 0.22em; label is Cormorant 1.75rem. Current step washes brass at 14% and lights the label. From 861px the rail pins under the 62px header while the walk is active; below 860px it scrolls horizontally and stays on the hero.
- **Sticky booking bar:** Fixed espresso glass after the hero, 220ms ease-out slide. One primary action plus a tracked dismiss.

### Eyebrow
Native kicker. Global `.eyebrow` helper: Mulish, 11px, 600, uppercase, 0.22em, cognac-deep. Dark sections override to brass light.

### Named Rules
**The Chrome Stays Rule.** Location state swaps photography, address, and booking destination. Espresso grounds, brass accent, and type stay constant.

**The No Overshoot Rule.** Motion is 140 / 220 / 400ms with standard (`cubic-bezier(0.4, 0, 0.2, 1)`) or ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`). Nothing bounces. `prefers-reduced-motion` cancels duration.

## Do's and Don'ts

### Do:
- **Do** open major sections with a tracked uppercase Mulish eyebrow (11px / 0.22em).
- **Do** keep brass fills rare: the primary action, the selected location, small shine.
- **Do** set gold type on light grounds to cognac-deep; use brass light only on espresso.
- **Do** let buttons hug their label at 4px radius, 140ms, with a 1px press.
- **Do** use espresso-tinted shadows and left-weighted `rgba(20,12,7)` scrims over photography.
- **Do** honor `prefers-reduced-motion` by dropping animation and transition duration.

### Don't:
- **Don't** use cool blue-white dental palettes, gloved close-ups, or bright clinical rooms.
- **Don't** use neutral grey shadows or pill-round marketing chrome.
- **Don't** stretch a primary button to full width.
- **Don't** set brass-deep type on ivory at eyebrow size.
- **Don't** reverse the pairing: no sans headlines, no serif UI.
- **Don't** use emoji, ALL-CAPS headlines, or motion with bounce or overshoot.
