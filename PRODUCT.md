# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js + TypeScript (App Router). Chosen by the user over Vite and Astro because the surface is a public marketing page for a local practice: server-rendered metadata and per-locale URLs matter for local search, and the composition leans on large photographic assets that need the framework's image pipeline. Animation is an explicit near-term requirement, so a static HTML deliverable was ruled out by the user.

Locale routing is part of the architecture from the start (`/en`, `/de`). **Only English content is authored in this phase.** A German page is required later and all copy must be externalized so it can be added without touching layout. German is the intended production default; English is the development default for now.

## Users

**First-time visitors** — people in Berlin choosing a dental practice, typically on a phone, often mid-comparison across several clinics. Three overlapping situations matter:

- **Anxious patients** who have delayed care, sometimes for years. They are scanning for evidence that this visit will not feel like the ones they remember. The environment is the argument, not a claim about it.
- **International / English-speaking residents** in a large expat city, needing to know they can be treated in English and how their insurance works here.
- **Private-pay patients** researching a considered, higher-value treatment (implants, veneers, Invisalign, whitening).

Their job: decide whether this practice is worth trusting, and book a first consultation.

**Returning patients** — existing patients who need to rebook or reach the practice. **Revised by the user, superseding the earlier "visibly separated paths" requirement:** they do not get their own call to action. Existing patients already know to go to Doctolib or to telephone directly, and a second button competes with the only conversion that matters. The page serves them by keeping the telephone number persistently visible in the header and footer — nothing more.

**The primary call to action is for first visits, exclusively.**

## Product Purpose

The public landing page for Zaritzki Fine Dentistry, a private dental practice operating **two locations in Berlin**. Its job is to convert a first-time visitor into a booked consultation, and to give an existing patient an immediate, unambiguous route back to the practice. Success is a booking, measured against the page's two separated paths.

## Positioning

Most dental practices market on clinical capability and present themselves in cool blue-and-white. Zaritzki's difference is **the experience of the appointment itself**: unhurried scheduling, 08:00–20:00 weekday hours, and consulting rooms built as designed interiors rather than fitted out from a dental catalogue. "A calmer kind of dental visit." The environment is not decoration; it is the product differentiator, and it is the one thing a competitor cannot copy from a webpage.

Being a private and self-pay practice is the mechanism underneath all of it, and should be presented as such rather than hidden: fewer patients, longer appointments, better rooms. That framing is honest, it qualifies the audience early, and it converts the page's biggest disqualifier into its clearest explanation.

## Operating Context

### The two locations (confirmed, from Google Business Profiles supplied by the user)

Both share one telephone number and identical opening hours.

| | **Gendarmenmarkt** | **Kurfürstendamm** |
|---|---|---|
| GBP name | Zaritzki Fine Dentistry · Private Zahnarztpraxis (Berlin Gendarmenmarkt) | Privatpraxis Zaritzki Fine Dentistry · Private Zahnarztpraxis (Berlin Kurfürstendamm) |
| Address | Jägerstraße 41, 10117 Berlin (Mitte) | Kurfürstendamm 52, 10707 Berlin (Charlottenburg) |
| Phone | +49 30 85403000 | +49 30 85403000 |
| Hours | Mon–Fri 08:00–20:00; Sat & Sun closed | Mon–Fri 08:00–20:00; Sat & Sun closed |
| Rating | 5.0 ★ from 69 reviews | 5.0 ★ from 20 reviews |
| Listed services | Diagnostik und Planung, Invisalign, Veneers, Implantate, Whitening, Endodontologie, Parodontologie … | Teeth whitening, Implantologie, Invisalign, Veneers, Parodontologie, Restaurationen … |
| Insurance | **Nur privat Versicherte oder Selbstzahlende** | **Nur privat Versicherte oder Selbstzahlende** |

**Both locations treat privately insured and self-paying patients only. No GKV/statutory patients.** Confirmed by the user. This is a hard qualifying fact, not a detail: a statutory patient who books and is turned away is a failure of the page. It must be stated plainly and early, in the first viewport's own terms, and not deferred to a footnote or an insurance section further down.

It is also **positioning, not just a constraint**. Private-only is *why* the appointments can be unhurried, why 08:00–20:00 is possible, and why the rooms look the way they do. Stated honestly, the disqualifier explains the entire proposition rather than apologising for it.

The Google service lists were truncated in the source screenshots. **They are superseded by the practice's own Doctolib description (below), which is practice-wide and authoritative.**

### Booking — confirmed

Doctolib, one profile with a per-practice parameter:

- **Kurfürstendamm:** `https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki`
- **Gendarmenmarkt:** `https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki?pid=practice-540639`

The bare URL resolves to Kurfürstendamm; Gendarmenmarkt is selected by `pid=practice-540639`.

### Treatments — confirmed, practice-wide

From the practice's own Doctolib profile. **One list covers both addresses** — the differing Google lists were partial, not a real difference between locations. The profile introduces the list with "including", so it is representative rather than exhaustive.

Implantology · Orthodontics with Invisalign · Veneers, including non-preparation veneers · Aesthetic prosthetics (crowns, inlays) · Functional therapy (CMD) · Microscopic endodontology (root canal treatment) · Filling therapy (cariology) · Periodontology · Prevention and diagnostics · Dental hygiene and supportive periodontal therapy

Whitening appears on both Google profiles though not in the Doctolib list; it is included on that basis.

**Their stated particular focus:** aesthetic-functional full smile transformations with veneers.

### Equipment — confirmed

3D X-ray machines, microscopes, and 3D scanners. Real, specific, and usable as content for the treatment-room section.

### Clinician — partly confirmed

**Dr. med. dent. Felix Zaritzki**, the practice's principal. The profile describes "a team of specialist dentists" with experience "at renowned university hospitals" — **no other names or individual credentials have been supplied and none may be invented.**

### Pricing — confirmed unavailable

The user searched and found no published prices. This is not an unanswered question; the practice does not publish them. Private dental fees in Germany are set under the GOZ and depend on the treatment plan, so a fixed price list would be misleading. **Design consequence: the page must explain why there are no fixed prices and promise a written estimate, rather than displaying a column of empty price placeholders.**

**08:00–20:00 Monday to Friday is a genuinely strong, real fact** — it directly answers the "can I get an appointment that fits my job" question and is unusual for the category. It is earned page material.

### Unresolved location questions

- Whether both locations share clinicians, or each has its own team.
- Whether the practice supports patients seeking *Erstattung* (reimbursement) from private insurers with itemised estimates — a common and reassuring detail in this segment, but unconfirmed and not to be asserted.

### The photography conflict (material finding)

The four photographs in `assets/images/` are all of the **Gendarmenmarkt** praxis — `interior-lounge.webp` is the same image as that location's Google Business Profile photo. The entire design system was derived from this one location: dark wood floors, taupe walls, chenille and velvet, a midnight-blue and cognac library, and a gold-mosaic powder room.

**The Kurfürstendamm praxis looks nothing like this.** Gründerzeit stucco and mouldings, tall bay windows, herringbone parquet, cream boucle curved seating, blush pink, a marble fireplace, a copper cluster chandelier, pale pastel artwork. Light and airy where Gendarmenmarkt is low-lit and enveloping.

Consequence: the bundled espresso/brass design language is **truthful for one location and misleading for the other**. Any page covering both must resolve this deliberately. Resolution is an open decision, recorded below.

### Regulatory and commercial context

- **German medical advertising law (HWG)** constrains this category. Before/after imagery and patient depictions are restricted, and third-party recommendations/testimonials in medical advertising fall under HWG §11 restrictions. The user has explicitly declined to use the practice's own photography on regulatory grounds. **Consequence: no section may depend on patient imagery, and no testimonial ships without the user confirming it is real and legally cleared.** Legal review of patient-voice content is the user's, not this project's.
- **Insurance** — the practice is private and self-pay only (above). Confirmed anti-goal: vagueness about cost reads as evasive. Here that anti-goal has teeth, because being unclear wastes a statutory patient's time.
- **Bilingual city** — German is the practice's native register; a substantial patient population operates in English.
- Patients arrive from local search and maps. Phone is a real, expected contact channel alongside online booking.

## Capabilities and Constraints

- DE/EN language switch, visible and persistent. German is the eventual production default; **English-only content this phase, German page deferred and required.**
- No patient photography, no before/after imagery, no staff photographs.
- **All imagery is licensed placeholder stock**, sourced real and verified, tonally matched to the brand world. The four photos in `assets/images/` are **withdrawn from use** — the user has excluded the practice's own material on regulatory grounds, and their licensing is unclear regardless. They remain valid as *derivation evidence* for the design system. A swap list of every image slot ships with the build.
- No logo exists. The name is set in Cormorant Garamond as the wordmark. Unchanged.
- The bundle's icon set (`ui_kits/website/Icons.jsx`) is an acknowledged substitution. Generic icon-tile treatments are an explicit anti-goal for this surface.
- **Location is a page-level state, not a gate.** A persistent switch in the header selects Jägerstraße (default, 69 reviews) or Kurfürstendamm. It swaps the photography, the address, and the booking destination. The page's own chrome — espresso grounds, brass accent, type — stays constant in both states; only the interiors change, which is how Kurfürstendamm's pale Altbau register appears without fracturing the brand. Dedicated `/mitte` and `/kurfuerstendamm` pages are a later build for local search, not the front door.
- **Still outstanding and not to be invented:** prices (confirmed unpublished — see above), the names and credentials of clinicians other than Dr. Zaritzki, and whether the two locations share a team.

## Brand Commitments

Binding, supplied by the user as the design system in this repository:

- **Name:** Zaritzki Fine Dentistry. Practitioner named on the treatment-room screen: Dr. Felix F. Zaritzki, Zahnarzt & Prophylaxe.
- **Design system:** the token set and component contracts in `tokens/`, `components/`, and `DESIGN_SYSTEM_REFERENCE.md`. Espresso `#241A12` and ivory `#F5F0E6` grounds, brass `#B58A3E` as the single signature accent, cognac / midnight / amber as secondary accents. Cormorant Garamond display over Mulish body. Warm brown-tinted shadows, never neutral grey. Architectural radii (4px controls, 10px cards). Calm motion, 140/220/400ms, no bounce or overshoot.
- **Voice:** warm, precise, understated. Address the patient as *you*, the practice as *we*. Sentence case except tracked uppercase eyebrows. No emoji, ever. No superlatives, urgency, or exclamation marks. German terms appear where authentic.
- **Deliberately anti-clinical.** Cool blue-white dental visuals, gloved close-ups, and bright clinical rooms are out of bounds.

### The practice's own marketing copy is a source of facts, not of voice

Their Doctolib profile reads: *"the first address for private patients in Berlin"*, *"exclusive State of the Art equipment"*, *"first-class personal service"*, *"sophisticated dentistry for demanding private patients"*, *"Experience a new era of dentistry"*.

**None of this may be reproduced on the page.** It is exactly the superlative, status-signalling register the design system's voice rules forbid, and "demanding private patients" reads as snobbery rather than care. Take the facts underneath — the treatments, the equipment, the university-hospital training, the veneer focus — and state them plainly in the practice's understated voice.

One line from their copy is worth keeping as *validation* rather than as text: *"even patients with anxiety forget to be in a dental practice."* The practice names anxious patients as its own audience. That confirms the page's structure; it does not become a headline.

## Evidence on Hand

- The complete design system: tokens, component contracts and demos, foundation specimens, and a four-screen reference UI kit. Real, high-fidelity, and binding.
- **Real practice data** for both locations: names, addresses, phone, hours, ratings and review counts, partial service lists (table above).
- **Real ratings: 5.0 ★ / 69 reviews (Gendarmenmarkt) and 5.0 ★ / 20 reviews (Kurfürstendamm).** Citable as-is. The individual review texts have not been supplied and must not be written.
- `assets/images/` (4 photographs of Gendarmenmarkt) — present, valid as derivation evidence, **withdrawn from publication.**
- **Confirmed from the practice's own Doctolib profile:** the full treatment list, both booking URLs, the equipment (3D X-ray, microscopes, 3D scanners), the principal's name and title, the university-hospital training, and the stated veneer focus.
- **No team photographs. No verified testimonial text. No logo. No pricing.** None may be fabricated as claims.

## Product Principles

1. **The room is the argument.** Show the environment doing its work rather than asserting that care is calm. Atmosphere carries the differentiator; adjectives do not.
2. **Restraint is the register, warmth is the result.** The page must never read as sales pressure — and never as so austere it feels expensive or intimidating. Confirmed anti-goals on both sides.
3. **One call to action, for first visits.** Every design decision is measured by whether it moves a first-time visitor toward booking. Returning patients are served by a visible telephone number and their existing Doctolib habit, not by a competing button.
4. **Money and insurance are answered, not deflected.** Cost clarity is a trust signal in this market, not a concession.
5. **Nothing invented that a patient could act on.** Facts, credentials, prices, and patient voices come from the user or ship visibly marked as placeholder.
6. **Two locations, one practice, without lying about either.** Whatever visual resolution is chosen, a patient must arrive at the right address and not be surprised by the room they walk into.

## Accessibility & Inclusion

- Anxious users are a named primary audience; motion must stay calm and respect `prefers-reduced-motion`.
- Text over photographic grounds must hold contrast at the token system's overlay strengths.
- Bilingual structure with correct `lang` attributes per locale.
- Phone contact is a first-class path, not a fallback — relevant for older and less digitally confident patients.
