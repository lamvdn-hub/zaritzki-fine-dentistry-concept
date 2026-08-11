# Website UI Kit — Zaritzki Fine Dentistry

Interactive recreation of the clinic's public marketing site. Click-through across four screens with a shared header/footer.

## Run
Open `index.html`. It loads the compiled design-system bundle (`../../_ds_bundle.js`) plus the JSX screens (Babel-transpiled in-browser).

## Screens
- **HomeScreen** — full-bleed hero over the treatment-room photo, trust strip, services preview, split "approach" section, editorial testimonial, image CTA band.
- **ServicesScreen** — dark page header, 6 service detail cards with price badges, FAQ accordion, closing CTA.
- **TeamScreen** — clinician cards (portraits are **placeholders** — no photos were supplied), quote band.
- **BookScreen** — appointment request form (left) + inverse practice-info card (right), confirmation `Dialog` on submit.

## Shared
- **SiteHeader** — sticky wordmark + nav + Book CTA. `dark` prop for the home hero.
- **SiteFooter** — espresso footer with hours / address / links.
- **Icons.jsx** — thin-stroke inline SVG set (`window.ZKIcons`), matching the DS 1.75 stroke. Substituted for a licensed icon font (none supplied) — see readme.md → ICONOGRAPHY.

## Notes
- Every primitive comes from the design system (`window.ZaritzkiFineDentistryDesignSystem_dfee56`) — Button, Input, Select, Radio, Checkbox, Textarea, Card, Badge, Accordion, Dialog. The kit does not re-implement primitives.
- Fictional practice details (address, phone, hours, reviews) stand in for real copy.
