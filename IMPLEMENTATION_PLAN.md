# Zaritzki Fine Dentistry Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task (chosen by the user). Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **READ [`HANDOFF.md`](HANDOFF.md) BEFORE THIS FILE.** It carries the reasoning behind these decisions — which alternatives were built and rejected, and which "improvements" would silently undo the design. This plan tells you what to do; the handoff tells you why, and its §5 and §6 must travel in every task packet.
>
> **The approved composition is [`docs/design/approved-comp-page-flow.html`](docs/design/approved-comp-page-flow.html).** Open it in a browser before building any UI. The comp is the target.

**Goal:** Build the public landing page for Zaritzki Fine Dentistry — a private two-location Berlin dental practice — as a production-quality Next.js application that walks a visitor through a first appointment and converts them to a Doctolib booking.

**Architecture:** Next.js App Router with a `[locale]` segment (English authored, German scaffolded). The existing design system's CSS custom properties are ported verbatim and consumed through CSS Modules — never rewritten into another styling vocabulary. The two practices are page-level React state driven by a header switch that swaps photography, address, and booking destination while leaving the page's chrome identical. Facts the client has not yet supplied are represented by a typed `Pending<T>` wrapper so they cannot be silently invented, render as visible placeholders, and are enumerable from the CLI.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), CSS Modules + CSS custom properties, `next/font/google`, Vitest + React Testing Library, Playwright + `@axe-core/playwright`.

**Spec:** [`docs/superpowers/specs/2026-08-10-zaritzki-landing-page-design.md`](docs/superpowers/specs/2026-08-10-zaritzki-landing-page-design.md)
**Product truth:** [`PRODUCT.md`](PRODUCT.md)
**Visual authority:** [`DESIGN_SYSTEM_REFERENCE.md`](DESIGN_SYSTEM_REFERENCE.md) and `tokens/*.css`

---

## Global Constraints

Every task's requirements implicitly include this section.

**Package manager.** The commands below are written with `pnpm`, but **npm is fine and requires no extra install** — it ships with Node. Pick one and stay consistent so only one lockfile exists. If using npm, substitute throughout:

| Plan says | npm equivalent |
|---|---|
| `--use-pnpm` | `--use-npm` |
| `pnpm add -D x` | `npm install -D x` |
| `pnpm exec x` | `npx x` |
| `pnpm dev` / `build` / `start` / `lint` | same, with `npm run` (`npm run dev`) |
| `pnpm test:unit` / `test:e2e` / `pending` | `npm run test:unit`, etc. |

The one trap: `npm start` and `npm test` work bare, but every other script needs `npm run`.

**Where the app lives.** All new code goes in `site/` at the repository root. **Nothing in `tokens/`, `components/`, `guidelines/`, `ui_kits/`, or `assets/` is ever edited.** Those are read-only design authority. Paths in this plan are relative to `site/` unless they begin with `../`.

**Design tokens are copied verbatim.** `tokens/*.css` are copied byte-for-byte into `site/styles/tokens/`. Values are never retyped, rounded, renamed, or translated into a Tailwind config. If a value looks wrong, it is still correct.

**Exact token values that appear in acceptance criteria:**
- Ivory `#F5F0E6`, cream `#FBF8F1`, parchment `#EFE7D6`, stone `#E0D5C0`, clay `#9A8663`
- Espresso `#241A12`, cocoa `#3A2A1D`, walnut `#5C4128`, umber `#7A5638`
- Gold `#B58A3E`, gold-light `#CDA75E`, gold-deep `#8F6C2C`, gold-wash `#EDE3CC`
- Focus ring `rgba(181,138,62,0.55)`; gold hairline `rgba(181,138,62,0.38)`
- Radii: controls and inputs `4px` (`--radius-sm`), cards `10px` (`--radius-lg`). Only Tag chips and toggle tracks are fully round.
- Shadows are warm brown-tinted, never neutral grey.
- Motion: `140ms` / `220ms` / `400ms`, `--ease-standard` `cubic-bezier(0.4,0,0.2,1)`, `--ease-out` `cubic-bezier(0.16,1,0.3,1)`. **Nothing bounces, springs, or overshoots.**
- Layout: `--container-max` `1200px`, `--gutter` `2rem`, `--section-y` `6rem`, 8px spacing base.

**Typography.** Display is Cormorant Garamond, body and UI is Mulish. Serif for feeling, sans for function, never the reverse. Eyebrows are Mulish `11px` / `600` / uppercase / `.22em` tracking in gold.

**Copy rules.** Sentence case except tracked uppercase eyebrows. Address the patient as *you*, the practice as *we*. **No emoji, ever.** No superlatives, no urgency, no scarcity, no exclamation marks. Numbers stay understated and factual.

**Anti-goals — a change that introduces any of these is wrong even if it passes tests:**
1. Anything reading as sales pressure (urgency, countdowns, scarcity, discounts).
2. Anything hiding price or insurance.
3. Anything so cold or austere it reads as intimidating rather than calming.
4. Stock-dental visuals or generic icon tiles — no gloved close-ups, no blue-white clinical rooms, no tooth diagrams, no rounded-square icon grids.

**Facts that may never be invented.** Prices, the names and credentials of any clinician other than Dr. Zaritzki, the exact self-payer estimate wording, and whether the two practices share clinicians. These are `Pending` values. Writing a plausible-looking value in their place is a defect.

**The practice's own marketing copy is a source of facts, not of voice.** Their Doctolib profile says "the first address for private patients in Berlin", "exclusive State of the Art equipment", "first-class personal service", "sophisticated dentistry for demanding private patients", "Experience a new era of dentistry". **Not one of those phrases goes on the page.** They are superlatives and status-signalling, which the voice rules above forbid outright. Use the facts underneath — treatments, equipment, training, the veneer focus — in the practice's understated register. The `voice.spec.ts` guard in Task 19 will fail the build on several of them.

**Real, confirmed facts — use these exactly:**

| | Mitte | Charlottenburg |
|---|---|---|
| Address | Jägerstraße 41, 10117 Berlin | Kurfürstendamm 52, 10707 Berlin |
| Phone | +49 30 85403000 | +49 30 85403000 |
| Hours | Mon–Fri 08:00–20:00, Sat & Sun closed | Mon–Fri 08:00–20:00, Sat & Sun closed |
| Rating | 5.0 from 69 reviews | 5.0 from 20 reviews |
| Booking | `https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki?pid=practice-540639` | `https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki` |

**Principal:** Dr. med. dent. Felix Zaritzki. **Equipment:** 3D X-ray machines, microscopes, 3D scanners. **Stated focus:** aesthetic-functional full smile transformations with veneers. **Training:** the team's experience comes from years at university hospitals.

**Treatments are practice-wide, not per-location.** The differing Google service lists were partial, not a real difference between addresses; the practice's Doctolib profile carries one list for both.

**There are no published prices, and this is settled, not outstanding.** German private dental fees are set under the GOZ and depend on the treatment plan, so a fixed price list would be misleading. The page explains that and promises a written estimate. **Do not build a price column.**

**Accessibility floor.** `prefers-reduced-motion` removes all transforms and reveals. Focus rings use `--focus-ring` and are never removed. Text over photographic grounds holds WCAG AA. Correct `lang` per locale.

**Commit after every task.** Conventional commit messages.

---

## File Structure

| Path | Responsibility |
|---|---|
| `site/app/layout.tsx` | Pass-through root layout (Next requires one; locale layout owns `<html>`) |
| `site/app/page.tsx` | Redirects `/` to the default locale |
| `site/app/[locale]/layout.tsx` | `<html lang>`, fonts, token imports, direction contract, JSON-LD |
| `site/app/[locale]/page.tsx` | Composes the page's sections in order |
| `site/app/globals.css` | Imports the ported token files |
| `site/styles/tokens/*.css` | Verbatim copies of the design system tokens |
| `site/lib/locations.ts` | The two practices as typed data — single source of truth |
| `site/lib/pending.ts` | `Pending<T>` type and constructors |
| `site/lib/booking.ts` | Resolves a practice to a booking href, with `tel:` fallback |
| `site/lib/i18n.ts` | Locale list, message loading, `t()` |
| `site/lib/LocationProvider.tsx` | Location context, persistence, query seeding |
| `site/components/system/Button.tsx` | The design system's Button, ported |
| `site/components/dev/Pending.tsx` | Renders an unverified fact as a visible placeholder |
| `site/components/chrome/SiteHeader.tsx` | Wordmark, location switch, phone, locale switch, Book |
| `site/components/chrome/LocationSwitch.tsx` | Two-state segmented control |
| `site/components/chrome/LocaleSwitch.tsx` | EN/DE links |
| `site/components/chrome/StickyBookingBar.tsx` | Post-hero booking bar with session dismissal |
| `site/components/chrome/SiteFooter.tsx` | Espresso footer |
| `site/components/walk/Hero.tsx` | Step 01 — the threshold |
| `site/components/walk/StepRail.tsx` | The walk's navigation and scroll-spy |
| `site/components/walk/StepSection.tsx` | Reusable split section for steps 02 and 04 |
| `site/components/content/TreatmentSchedule.tsx` | Step 03's treatment table |
| `site/components/content/CostPanel.tsx` | Step 05 — cost and insurance |
| `site/components/content/ProofBand.tsx` | The two real ratings |
| `site/components/content/PracticesSection.tsx` | Both addresses and maps |
| `site/components/content/ClosingCta.tsx` | Final booking band |
| `site/components/motion/Reveal.tsx` | Single orchestrated entrance primitive |
| `site/messages/en.json`, `de.json` | All copy |
| `site/scripts/list-pending.ts` | Enumerates every unverified fact |
| `site/public/images/` | Verified licensed stock, per location |

---

# Phase 1 — Foundation

## Task 1: Repository, scaffold, and test harness

**Files:**
- Create: `.gitignore`, `site/package.json`, `site/tsconfig.json`, `site/next.config.ts`, `site/vitest.config.ts`, `site/vitest.setup.ts`, `site/playwright.config.ts`
- Test: `site/tests/unit/harness.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `pnpm test:unit`, `pnpm test:e2e`, `pnpm dev`, `pnpm build` available to every later task.

- [x] **Step 1: Create `.gitignore` at the repository root before the first commit**

```gitignore
node_modules/
.next/
out/
dist/
coverage/
playwright-report/
test-results/
.superpowers/
.DS_Store
*.log
.env*.local
```

- [x] **Step 2: Initialise git at the repository root**

```bash
cd "Zaritzki Fine Dentistry Design System/zaritzki_handoff"
git init
git add -A
git commit -m "chore: import Zaritzki design system handoff, product truth, and spec"
```

`.superpowers/` is ignored because it is scratch. The three design screens worth keeping were already copied out to `docs/design/` — do not ignore that directory.

- [x] **Step 3: Scaffold the Next.js app**

```bash
npx create-next-app@15 site --typescript --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm
cd site
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright
npx playwright install chromium webkit
```

- [x] **Step 4: Replace `site/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    css: true,
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./', import.meta.url)) },
  },
});
```

- [x] **Step 5: Create `site/vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

// jsdom does not implement these; several components depend on them.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
}

if (!window.IntersectionObserver) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  }
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
```

- [x] **Step 6: Create `site/playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

- [x] **Step 7: Add scripts to `site/package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "playwright test",
    "pending": "tsx scripts/list-pending.ts"
  }
}
```

Also `npm install -D tsx`.

- [x] **Step 8: Write the harness test**

Create `site/tests/unit/harness.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('test harness', () => {
  it('runs TypeScript in a jsdom environment', () => {
    const el = document.createElement('div');
    el.textContent = 'ok';
    expect(el).toHaveTextContent('ok');
  });
});
```

- [x] **Step 9: Run the unit suite**

Run: `pnpm test:unit`
Expected: PASS, 1 test.

- [x] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Vitest and Playwright harness"
```

---

## Task 2: Port the design tokens and load the fonts

> **Approved TDD correction (2026-08-11):** write `tokens.spec.ts` first against the scaffolded `/` route and confirm it fails because the brand tokens/fonts are absent. Only then copy tokens and add the font/global-style implementation. The completed test must pass before commit. Task 3 changes its target to `/en`, confirms a routing RED, and then implements locale routing. The obsolete pass-through root-layout step below is not used.

**Files:**
- Create: `site/styles/tokens/colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`
- Create: `site/app/globals.css`, `site/lib/fonts.ts`
- Modify: `site/app/layout.tsx`
- Test: `site/tests/e2e/tokens.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: every CSS custom property from the design system, resolvable on `:root`. `fonts.ts` exports `cormorant` and `mulish` (`NextFont` objects exposing `.variable`), binding `--font-display` and `--font-sans`.

- [x] **Step 1: Copy the token files verbatim**

```bash
cd site
mkdir -p styles/tokens
cp ../tokens/colors.css ../tokens/typography.css ../tokens/spacing.css ../tokens/effects.css ../tokens/base.css styles/tokens/
```

**Do not copy `../tokens/fonts.css`** — it `@import`s from the Google Fonts CDN, which `next/font` replaces. This resolves the design system's own stated caveat about CDN loading.

- [x] **Step 2: Verify the copies are byte-identical**

```bash
for f in colors typography spacing effects base; do
  diff "../tokens/$f.css" "styles/tokens/$f.css" && echo "$f OK"
done
```

Expected: five `OK` lines, no diff output.

- [x] **Step 3: Create `site/lib/fonts.ts`**

```ts
import { Cormorant_Garamond, Mulish } from 'next/font/google';

export const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display-loaded',
});

export const mulish = Mulish({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-sans-loaded',
});
```

`latin-ext` is required — `Jägerstraße` and `Kurfürstendamm` need it.

- [x] **Step 4: Create `site/app/globals.css`**

```css
@import url('../styles/tokens/colors.css');
@import url('../styles/tokens/typography.css');
@import url('../styles/tokens/spacing.css');
@import url('../styles/tokens/effects.css');
@import url('../styles/tokens/base.css');

/* next/font supplies hashed family names; bind them to the system's token names
   so every component keeps using --font-display / --font-sans unchanged. */
:root {
  --font-display: var(--font-display-loaded), 'Hoefler Text', Georgia, serif;
  --font-sans: var(--font-sans-loaded), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--surface-page);
  color: var(--text-body);
  font-family: var(--font-sans);
  font-size: var(--text-md);
  line-height: var(--lh-normal);
  -webkit-font-smoothing: antialiased;
}

:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--text-gold);
}

.container {
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [x] **Step 5: Keep the scaffolded root layout valid while Task 2 is tested**

```tsx
import { cormorant, mulish } from '@/lib/fonts';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${mulish.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [x] **Step 6: Write the failing token test**

Create `site/tests/e2e/tokens.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('design tokens resolve on the document root', async ({ page }) => {
  await page.goto('/');
  const tokens = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      ivory: s.getPropertyValue('--ivory').trim(),
      espresso: s.getPropertyValue('--espresso').trim(),
      gold: s.getPropertyValue('--gold').trim(),
      radiusSm: s.getPropertyValue('--radius-sm').trim(),
      containerMax: s.getPropertyValue('--container-max').trim(),
      durationBase: s.getPropertyValue('--duration-base').trim(),
    };
  });
  expect(tokens.ivory).toBe('#F5F0E6');
  expect(tokens.espresso).toBe('#241A12');
  expect(tokens.gold).toBe('#B58A3E');
  expect(tokens.radiusSm).toBe('4px');
  expect(tokens.containerMax).toBe('1200px');
  expect(tokens.durationBase).toBe('220ms');
});

test('both brand faces are loaded and self-hosted', async ({ page }) => {
  await page.goto('/');
  const families = await page.evaluate(() =>
    Array.from(document.fonts).map((f) => f.family)
  );
  expect(families.join(' ')).toContain('Cormorant');
  expect(families.join(' ')).toContain('Mulish');

  const external = await page.evaluate(() =>
    Array.from(document.querySelectorAll('link[href]'))
      .map((l) => (l as HTMLLinkElement).href)
      .filter((h) => h.includes('fonts.googleapis.com') || h.includes('fonts.gstatic.com'))
  );
  expect(external).toEqual([]);
});
```

- [x] **Step 7: Run it and confirm it fails**

Run: `pnpm test:e2e tokens`
Expected: FAIL before implementation because the scaffold does not expose the Zaritzki tokens or brand fonts. After Steps 1–5, rerun it and require PASS on both projects before committing.

- [x] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: port design tokens verbatim and self-host brand fonts"
```

---

## Task 3: Locale routing and the message layer

> **Approved routing/TDD correction (2026-08-11):** after the i18n unit test passes, change both token-test navigations from `/` to `/en` and confirm RED because locale routing is absent. Then delete the scaffolded `app/layout.tsx` and `app/page.tsx`; `app/[locale]/layout.tsx` is the root layout and owns `<html lang>`/`<body>`. Add `middleware.ts` to redirect `/` to `DEFAULT_LOCALE`. This follows the official Next.js 15 internationalization/root-layout pattern; do not create the invalid pass-through root layout or the `app/page.tsx` shown below.

**Files:**
- Create: `site/lib/i18n.ts`, `site/messages/en.json`, `site/messages/de.json`
- Create: `site/app/[locale]/layout.tsx`, `site/app/[locale]/page.tsx`, `site/app/page.tsx`
- Test: `site/tests/unit/i18n.test.ts`

**Interfaces:**
- Consumes: `cormorant`, `mulish` from `@/lib/fonts`.
- Produces:
  - `type Locale = 'en' | 'de'`
  - `LOCALES: readonly Locale[]`
  - `DEFAULT_LOCALE: Locale` — currently `'en'`; **this single constant flips to `'de'` when German copy lands**
  - `isLocale(value: string): value is Locale`
  - `getMessages(locale: Locale): Promise<Messages>`
  - `translator(messages: Messages): (key: string) => string`

- [x] **Step 1: Write the failing test**

Create `site/tests/unit/i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { isLocale, getMessages, translator, LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';

describe('i18n', () => {
  it('recognises supported locales and rejects others', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('de')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(LOCALES).toEqual(['en', 'de']);
  });

  it('defaults to English while German copy is outstanding', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('resolves a dotted key from the English messages', async () => {
    const t = translator(await getMessages('en'));
    expect(t('hero.headline')).toBe('A calmer kind of dental visit');
  });

  it('falls back to the default locale when a key is missing', async () => {
    const t = translator(await getMessages('de'));
    expect(t('hero.headline')).toBe('A calmer kind of dental visit');
  });

  it('returns the key itself when nothing resolves, rather than throwing', async () => {
    const t = translator(await getMessages('en'));
    expect(t('nothing.here.at.all')).toBe('nothing.here.at.all');
  });
});
```

- [x] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit i18n`
Expected: FAIL — `Cannot find module '@/lib/i18n'`.

- [x] **Step 3: Create `site/messages/en.json`**

```json
{
  "meta": {
    "title": "Zaritzki Fine Dentistry — private dental practice in Berlin",
    "description": "A private dental practice in Berlin Mitte and Charlottenburg. Unhurried appointments, Monday to Friday 08:00–20:00, for privately insured and self-paying patients."
  },
  "nav": {
    "book": "Book",
    "bookFirst": "Book a first consultation",
    "bookAt": "Book at {practice}",
    "call": "Call the practice",
    "language": "Language",
    "practice": "Practice",
    "skipToContent": "Skip to content"
  },
  "hero": {
    "eyebrow": "Private Zahnarztpraxis · {district}",
    "headline": "A calmer kind of dental visit",
    "lede": "Walk the whole appointment before you book it — the door, the lounge, the conversation, the room, and what it costs when you leave.",
    "qualifier": "Privately insured and self-paying patients · Monday to Friday, 08:00–20:00"
  },
  "steps": {
    "street": "The street",
    "lounge": "The lounge",
    "talk": "The talk",
    "room": "The room",
    "leaving": "Leaving",
    "railLabel": "The visit, step by step"
  },
  "lounge": {
    "eyebrow": "02 — The lounge",
    "headline": "You will not be kept waiting in a queue",
    "body": "Appointments are spaced so that yours starts when it says it will. The room you wait in was furnished, not fitted out.",
    "hours": "08:00–20:00, Monday to Friday — appointments before work and after it."
  },
  "talk": {
    "eyebrow": "03 — The talk",
    "headline": "Nothing happens until we've talked",
    "body": "Your first appointment is a conversation and an examination. You leave knowing what you need, what it will cost, and what happens if you do nothing.",
    "columnTreatment": "Treatment",
    "columnTypical": "What it is",
    "focusLabel": "Our particular focus",
    "noPrices": "We do not publish a price list. Private dental fees in Germany are set under the GOZ and depend on the treatment plan, so a fixed figure would be a guess. You get a written estimate before anything is agreed."
  },
  "treatments": {
    "implantologie": "replacing a tooth at the root",
    "invisalign": "clear aligners, adults and teenagers",
    "veneers": "porcelain, including no-preparation veneers",
    "prothetik": "crowns and inlays",
    "funktionstherapie": "jaw joint and bite (CMD)",
    "endodontologie": "root canals, under the microscope",
    "fuellungstherapie": "fillings",
    "parodontologie": "gum treatment",
    "prophylaxe": "examination and prevention",
    "dentalhygiene": "hygiene and periodontal aftercare",
    "whitening": "supervised, in the practice"
  },
  "room": {
    "eyebrow": "04 — The room",
    "headline": "Lamplight, not a light in your eyes",
    "body": "The surgery was designed to look like the rest of the practice. Same wood, same lamps, same quiet — with 3D imaging, microscopes and 3D scanners where the work actually needs them.",
    "clinician": "Dr. med. dent. Felix Zaritzki, and a team whose experience comes from years in university hospitals."
  },
  "leaving": {
    "eyebrow": "05 — Leaving",
    "headline": "What it costs, said plainly",
    "body": "We are a private practice. That is the reason the appointments are long and the rooms are like this — and it means we can only treat you if you are privately insured or paying yourself.",
    "privateTitle": "Privately insured",
    "privateBody": "Billed per GOZ. You receive a written estimate before treatment begins.",
    "selfTitle": "Self-paying",
    "selfBody": "A written estimate before anything is agreed.",
    "gkvTitle": "Statutory (GKV)",
    "gkvBody": "We cannot treat statutory patients. Said here rather than after you have booked."
  },
  "proof": {
    "label": "{count} reviews · {address}",
    "sourceNote": "Ratings as published on Google."
  },
  "practices": {
    "eyebrow": "Two practices",
    "headline": "Mitte and Charlottenburg",
    "directions": "Directions",
    "hours": "Monday to Friday, 08:00–20:00"
  },
  "closing": {
    "headline": "Ready when you are",
    "body": "New patients are welcome at both practices."
  },
  "sticky": {
    "summary": "{address} · Mon–Fri 08:00–20:00 · privately insured & self-paying",
    "dismiss": "Hide this bar"
  },
  "footer": {
    "imprint": "Impressum",
    "privacy": "Datenschutz",
    "rights": "Zaritzki Fine Dentistry"
  },
  "pending": {
    "label": "Awaiting practice confirmation"
  }
}
```

- [x] **Step 4: Create `site/messages/de.json`**

```json
{
  "__note": "German copy is required and not yet written. Every key in en.json must appear here before DEFAULT_LOCALE in lib/i18n.ts is flipped to 'de' and the /de route is linked from the locale switch. Until then this file is intentionally empty and the translator falls back to English."
}
```

- [x] **Step 5: Create `site/lib/i18n.ts`**

```ts
import enMessages from '@/messages/en.json';
import deMessages from '@/messages/de.json';

export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

/** Flip to 'de' when German copy lands. This is the only place the default lives. */
export const DEFAULT_LOCALE: Locale = 'en';

export type Messages = Record<string, unknown>;

const BUNDLES: Record<Locale, Messages> = {
  en: enMessages as Messages,
  de: deMessages as Messages,
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export async function getMessages(locale: Locale): Promise<Messages> {
  return BUNDLES[locale];
}

function lookup(messages: Messages, key: string): string | undefined {
  const found = key.split('.').reduce<unknown>(
    (node, part) =>
      node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
    messages,
  );
  return typeof found === 'string' ? found : undefined;
}

/**
 * Returns a lookup function for dotted keys, falling back to the default
 * locale and finally to the key itself. Values may contain {placeholders},
 * substituted from the optional second argument.
 */
export function translator(messages: Messages) {
  return (key: string, values?: Record<string, string | number>): string => {
    const raw = lookup(messages, key) ?? lookup(BUNDLES[DEFAULT_LOCALE], key) ?? key;
    if (!values) return raw;
    return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in values ? String(values[name]) : match,
    );
  };
}
```

- [x] **Step 6: Run the test and confirm it passes**

Run: `pnpm test:unit i18n`
Expected: PASS, 5 tests.

- [x] **Step 7: Create `site/app/[locale]/layout.tsx`**

The direction contract must be the **first child of `<body>`** and must survive the production build.

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cormorant, mulish } from '@/lib/fonts';
import { LOCALES, isLocale, getMessages, translator, type Locale } from '@/lib/i18n';
import '@/app/globals.css';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(await getMessages(locale));
  return { title: t('meta.title'), description: t('meta.description') };
}

const DIRECTION_CONTRACT = `
  IMPECCABLE DIRECTION CONTRACT — surface seed 2c7cb46c
  THESIS: The page walks a first appointment in order — street, lounge, talk, room, leaving —
    because what anxious patients fear is the unknown. It refuses the category arrangement of
    hero, trust bar, service icon-tiles, why-us, testimonial, CTA.
  OWN-WORLD: The Zaritzki design system, unchanged. Espresso #241A12 and ivory #F5F0E6 grounds,
    brass #B58A3E as the only accent fill, Cormorant Garamond over Mulish, warm brown shadows,
    4px controls and 10px cards, motion at 140/220/400ms with no overshoot.
  STORY: A private-pay patient in Berlin sees the whole visit before committing to it, learns
    the practice cannot treat statutory patients before booking rather than after, and books.
  FIRST VIEWPORT: The entrance at dusk, full bleed, espresso gradient weighted left. Eyebrow,
    serif headline, lede, the private/self-pay and 08:00-20:00 qualifier, then the brass primary
    action hugging its label. The five-step rail sits along the bottom as real navigation.
  FORM: "The Visit" — candidate 1 of the grounded list. The roll assigned candidate 7
    ("the materials index"); it was built, shown, and rejected by the user on product-clarity
    grounds. A user decision beats the roll.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${cormorant.variable} ${mulish.variable}`}>
      <body>
        <div dangerouslySetInnerHTML={{ __html: `<!--${DIRECTION_CONTRACT}-->` }} />
        {children}
      </body>
    </html>
  );
}
```

- [x] **Step 8: Create `site/app/[locale]/page.tsx` as a temporary shell**

```tsx
export default function Page() {
  return <main id="content" />;
}
```

- [x] **Step 9: Add `site/middleware.ts` and remove the scaffold root files**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE } from '@/lib/i18n';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/') return NextResponse.next();
  return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
}

export const config = { matcher: ['/'] };
```

Delete `site/app/layout.tsx` and `site/app/page.tsx` so the locale layout is the root layout. Before implementing this step, change both navigations in `tokens.spec.ts` from `/` to `/en` and confirm the test fails because `/en` is not yet routed.

- [x] **Step 10: Run the token e2e test, which should now pass**

Run: `pnpm test:e2e tokens`
Expected: PASS, both tests, on both projects.

- [x] **Step 11: Verify the direction contract survives the production build**

```bash
pnpm build
grep -r "2c7cb46c" .next/server/app | head -3
```

Expected: at least one match. A contract the build erased is a contract nobody can audit.

- [x] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add locale routing, message layer, and direction contract"
```

---

# Phase 2 — Data and state

## Task 4: Pending facts and the practice data

**Files:**
- Create: `site/lib/pending.ts`, `site/lib/locations.ts`, `site/scripts/list-pending.ts`
- Test: `site/tests/unit/locations.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Pending<T> = { known: false; note: string } | { known: true; value: T }`
  - `pending(note: string): Pending<never>`, `known<T>(value: T): Pending<T>`
  - `isKnown<T>(p: Pending<T>): p is { known: true; value: T }`
  - `type LocationId = 'mitte' | 'charlottenburg'`
  - `type ImageSlot = 'entrance' | 'lounge' | 'consultation' | 'treatmentRoom' | 'detail' | 'closing'`
  - `type Treatment = { name: string; glossKey: string; focus?: boolean }`
  - `TREATMENTS: Treatment[]` — practice-wide, eleven entries, not a field on `Practice`
  - `type Practice` (fields below)
  - `PRACTICES: Record<LocationId, Practice>`, `PRACTICE_ORDER: LocationId[]`, `DEFAULT_LOCATION: LocationId`
  - `getPractice(id: LocationId): Practice`

- [x] **Step 1: Write the failing test**

Create `site/tests/unit/locations.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { PRACTICES, PRACTICE_ORDER, DEFAULT_LOCATION, getPractice, TREATMENTS } from '@/lib/locations';
import { isKnown } from '@/lib/pending';

describe('practice data', () => {
  it('carries both confirmed addresses exactly', () => {
    expect(PRACTICES.mitte.street).toBe('Jägerstraße 41');
    expect(PRACTICES.mitte.postalCode).toBe('10117');
    expect(PRACTICES.charlottenburg.street).toBe('Kurfürstendamm 52');
    expect(PRACTICES.charlottenburg.postalCode).toBe('10707');
  });

  it('shares one telephone number across both practices', () => {
    expect(PRACTICES.mitte.phone).toBe('+493085403000');
    expect(PRACTICES.charlottenburg.phone).toBe(PRACTICES.mitte.phone);
  });

  it('carries the real ratings and no others', () => {
    expect(PRACTICES.mitte.rating).toEqual({ value: 5.0, count: 69 });
    expect(PRACTICES.charlottenburg.rating).toEqual({ value: 5.0, count: 20 });
  });

  it('opens 08:00 to 20:00 Monday to Friday at both practices', () => {
    for (const id of PRACTICE_ORDER) {
      const p = getPractice(id);
      expect(p.hours.opens).toBe('08:00');
      expect(p.hours.closes).toBe('20:00');
      expect(p.hours.days).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr']);
    }
  });

  it('defaults to Mitte, which has the larger review count', () => {
    expect(DEFAULT_LOCATION).toBe('mitte');
    expect(PRACTICES.mitte.rating.count).toBeGreaterThan(PRACTICES.charlottenburg.rating.count);
  });

  it('carries one practice-wide treatment list, not a list per address', () => {
    expect(TREATMENTS).toHaveLength(11);
    expect(TREATMENTS.map((t) => t.name)).toContain('Implantologie');
    expect(TREATMENTS.map((t) => t.name)).toContain('Funktionstherapie');
    // Treatments are not a property of a location.
    expect('treatments' in PRACTICES.mitte).toBe(false);
  });

  it('marks veneers as the practice\'s one stated focus', () => {
    const focused = TREATMENTS.filter((t) => t.focus);
    expect(focused).toHaveLength(1);
    expect(focused[0].name).toBe('Veneers');
  });

  it('sends each practice to its own Doctolib destination', () => {
    const mitte = PRACTICES.mitte.bookingUrl;
    const kudamm = PRACTICES.charlottenburg.bookingUrl;
    expect(isKnown(mitte) && mitte.value).toContain('pid=practice-540639');
    expect(isKnown(kudamm) && kudamm.value).not.toContain('pid=');
  });
});
```

- [x] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit locations`
Expected: FAIL — `Cannot find module '@/lib/pending'`.

- [x] **Step 3: Create `site/lib/pending.ts`**

```ts
/**
 * A fact the practice has not yet supplied.
 *
 * The point of this type is that TypeScript will not let a consumer read
 * `.value` without first proving the fact is known — so a plausible-looking
 * placeholder cannot be typed in by accident. Every Pending value renders
 * through <PendingFact> and is listed by `pnpm pending`.
 */
export type Pending<T> = { known: false; note: string } | { known: true; value: T };

export function pending(note: string): Pending<never> {
  return { known: false, note };
}

export function known<T>(value: T): Pending<T> {
  return { known: true, value };
}

export function isKnown<T>(p: Pending<T>): p is { known: true; value: T } {
  return p.known;
}
```

- [x] **Step 4: Create `site/lib/locations.ts`**

```ts
import { known, type Pending } from '@/lib/pending';

export type LocationId = 'mitte' | 'charlottenburg';

export type ImageSlot =
  | 'entrance'
  | 'lounge'
  | 'consultation'
  | 'treatmentRoom'
  | 'detail'
  | 'closing';

export type Treatment = {
  /** Proper noun, as the practice publishes it. Never translated. */
  name: string;
  /** Key into messages.treatments — the plain-language gloss, which is translated. */
  glossKey: string;
  /** The practice names veneers as its particular focus. Exactly one is true. */
  focus?: boolean;
};

export type Practice = {
  id: LocationId;
  /** Short label for the switch: "Mitte" / "Charlottenburg". */
  shortName: string;
  /** For the hero eyebrow: "Berlin Mitte". */
  district: string;
  legalName: string;
  street: string;
  postalCode: string;
  city: string;
  /** E.164, for tel: hrefs. */
  phone: string;
  phoneDisplay: string;
  hours: { opens: string; closes: string; days: string[] };
  rating: { value: number; count: number };
  mapsUrl: string;
  bookingUrl: Pending<string>;
  images: Record<ImageSlot, string>;
};

const PHONE = '+493085403000';
const PHONE_DISPLAY = '030 854 030 00';
const HOURS = { opens: '08:00', closes: '20:00', days: ['Mo', 'Tu', 'We', 'Th', 'Fr'] };

/**
 * Practice-wide, from the practice's own Doctolib profile. The two Google
 * service lists differed only because both were truncated — the treatments do
 * not vary by address, so this list is not a per-practice field.
 *
 * The Doctolib profile introduces the list with "including", so it is
 * representative rather than exhaustive. Whitening is carried from both Google
 * profiles. Do not extend this list by inference.
 */
export const TREATMENTS: Treatment[] = [
  { name: 'Implantologie', glossKey: 'treatments.implantologie' },
  { name: 'Invisalign', glossKey: 'treatments.invisalign' },
  { name: 'Veneers', glossKey: 'treatments.veneers', focus: true },
  { name: 'Ästhetische Prothetik', glossKey: 'treatments.prothetik' },
  { name: 'Funktionstherapie', glossKey: 'treatments.funktionstherapie' },
  { name: 'Endodontologie', glossKey: 'treatments.endodontologie' },
  { name: 'Füllungstherapie', glossKey: 'treatments.fuellungstherapie' },
  { name: 'Parodontologie', glossKey: 'treatments.parodontologie' },
  { name: 'Prophylaxe und Diagnostik', glossKey: 'treatments.prophylaxe' },
  { name: 'Dentalhygiene', glossKey: 'treatments.dentalhygiene' },
  { name: 'Whitening', glossKey: 'treatments.whitening' },
];

export const PRACTICES: Record<LocationId, Practice> = {
  mitte: {
    id: 'mitte',
    shortName: 'Mitte',
    district: 'Berlin Mitte',
    legalName: 'Zaritzki Fine Dentistry',
    street: 'Jägerstraße 41',
    postalCode: '10117',
    city: 'Berlin',
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY,
    hours: HOURS,
    rating: { value: 5.0, count: 69 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=J%C3%A4gerstra%C3%9Fe+41+10117+Berlin',
    // The bare Doctolib profile resolves to Kurfürstendamm; this pid selects Gendarmenmarkt.
    bookingUrl: known(
      'https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki?pid=practice-540639',
    ),
    images: {
      entrance: '/images/mitte/entrance.jpg',
      lounge: '/images/mitte/lounge.jpg',
      consultation: '/images/mitte/consultation.jpg',
      treatmentRoom: '/images/mitte/treatment-room.jpg',
      detail: '/images/mitte/detail.jpg',
      closing: '/images/mitte/closing.jpg',
    },
  },
  charlottenburg: {
    id: 'charlottenburg',
    shortName: 'Charlottenburg',
    district: 'Berlin Charlottenburg',
    legalName: 'Privatpraxis Zaritzki Fine Dentistry',
    street: 'Kurfürstendamm 52',
    postalCode: '10707',
    city: 'Berlin',
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY,
    hours: HOURS,
    rating: { value: 5.0, count: 20 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kurf%C3%BCrstendamm+52+10707+Berlin',
    bookingUrl: known('https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki'),
    images: {
      entrance: '/images/charlottenburg/entrance.jpg',
      lounge: '/images/charlottenburg/lounge.jpg',
      consultation: '/images/charlottenburg/consultation.jpg',
      treatmentRoom: '/images/charlottenburg/treatment-room.jpg',
      detail: '/images/charlottenburg/detail.jpg',
      closing: '/images/charlottenburg/closing.jpg',
    },
  },
};

/** Mitte first: 69 reviews to Charlottenburg's 20. */
export const PRACTICE_ORDER: LocationId[] = ['mitte', 'charlottenburg'];
export const DEFAULT_LOCATION: LocationId = 'mitte';

export function getPractice(id: LocationId): Practice {
  return PRACTICES[id];
}

/**
 * The practice publishes no price list, and this is settled rather than
 * outstanding: German private dental fees are set under the GOZ and depend on
 * the treatment plan. The page explains that instead of showing empty prices.
 */
export const PRICES_ARE_NOT_PUBLISHED = true;
```

- [x] **Step 5: Run the test and confirm it passes**

Run: `pnpm test:unit locations`
Expected: PASS, 7 tests.

- [x] **Step 6: Create `site/scripts/list-pending.ts`**

```ts
import { PRACTICES, PRACTICE_ORDER } from '../lib/locations';
import { isKnown } from '../lib/pending';

const rows: string[] = [];

for (const id of PRACTICE_ORDER) {
  const p = PRACTICES[id];
  if (!isKnown(p.bookingUrl)) {
    rows.push(`${p.shortName.padEnd(16)} bookingUrl        ${p.bookingUrl.note}`);
  }
}

// Facts held outside the practice data, tracked here so one command lists everything.
rows.push('both             clinicians         Names and credentials beyond Dr. Zaritzki not supplied');
rows.push('both             sharedTeam         Whether both addresses share clinicians is unknown');
rows.push('both             selfPayWording     Estimate wording awaiting practice confirmation');
rows.push('both             photography        All 12 images are licensed stock awaiting approval or replacement');

console.log(`\n${rows.length} facts awaiting the practice:\n`);
for (const r of rows) console.log(`  ${r}`);
console.log('\nNone of these may be filled in with a plausible guess.');
console.log('Prices are NOT on this list: the practice publishes none, by design (GOZ).\n');
process.exit(0);
```

- [x] **Step 7: Run it**

Run: `pnpm pending`
Expected: 4 rows. Both booking URLs are now known, so neither appears; prices are deliberately absent from the list. If a treatment price shows up here, someone has reintroduced a field that was removed on purpose.

- [x] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add typed practice data with unforgeable pending facts"
```

---

## Task 5: Location context and booking resolution

**Files:**
- Create: `site/lib/booking.ts`, `site/lib/LocationProvider.tsx`
- Test: `site/tests/unit/booking.test.ts`, `site/tests/unit/LocationProvider.test.tsx`

**Interfaces:**
- Consumes: `Practice`, `LocationId`, `PRACTICES`, `DEFAULT_LOCATION` from `@/lib/locations`; `isKnown` from `@/lib/pending`.
- Produces:
  - `bookingHref(practice: Practice): string`
  - `bookingIsFallback(practice: Practice): boolean`
  - `<LocationProvider initialLocation?: LocationId>` — client component
  - `useLocation(): { practice: Practice; locationId: LocationId; setLocation: (id: LocationId) => void }`

- [x] **Step 1: Write the failing booking test**

Create `site/tests/unit/booking.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { bookingHref, bookingIsFallback } from '@/lib/booking';
import { PRACTICES } from '@/lib/locations';
import { pending } from '@/lib/pending';

describe('booking href', () => {
  it('sends each practice to its own Doctolib destination', () => {
    expect(bookingHref(PRACTICES.mitte)).toBe(
      'https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki?pid=practice-540639',
    );
    expect(bookingHref(PRACTICES.charlottenburg)).toBe(
      'https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki',
    );
    expect(bookingIsFallback(PRACTICES.mitte)).toBe(false);
  });

  it('falls back to the telephone number if a URL is ever missing', () => {
    const p = { ...PRACTICES.mitte, bookingUrl: pending('withdrawn') };
    expect(bookingHref(p)).toBe('tel:+493085403000');
    expect(bookingIsFallback(p)).toBe(true);
  });

  it('never returns an empty or hash href', () => {
    for (const p of Object.values(PRACTICES)) {
      expect(bookingHref(p)).not.toBe('');
      expect(bookingHref(p)).not.toBe('#');
    }
  });
});
```

- [x] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit booking`
Expected: FAIL — `Cannot find module '@/lib/booking'`.

- [x] **Step 3: Create `site/lib/booking.ts`**

```ts
import { isKnown } from '@/lib/pending';
import type { Practice } from '@/lib/locations';

/**
 * A dead button is worse than a telephone call. Until the practice supplies
 * its Doctolib URLs, the primary action dials the practice instead.
 */
export function bookingHref(practice: Practice): string {
  return isKnown(practice.bookingUrl) ? practice.bookingUrl.value : `tel:${practice.phone}`;
}

export function bookingIsFallback(practice: Practice): boolean {
  return !isKnown(practice.bookingUrl);
}
```

- [x] **Step 4: Run the booking test and confirm it passes**

Run: `pnpm test:unit booking`
Expected: PASS, 3 tests.

- [x] **Step 5: Write the failing provider test**

Create `site/tests/unit/LocationProvider.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationProvider, useLocation } from '@/lib/LocationProvider';

function Probe() {
  const { practice, setLocation } = useLocation();
  return (
    <div>
      <span data-testid="street">{practice.street}</span>
      <button onClick={() => setLocation('charlottenburg')}>switch</button>
    </div>
  );
}

describe('LocationProvider', () => {
  it('defaults to Mitte', () => {
    render(<LocationProvider><Probe /></LocationProvider>);
    expect(screen.getByTestId('street')).toHaveTextContent('Jägerstraße 41');
  });

  it('switches practice and persists the choice', async () => {
    const user = userEvent.setup();
    render(<LocationProvider><Probe /></LocationProvider>);
    await user.click(screen.getByRole('button', { name: 'switch' }));
    expect(screen.getByTestId('street')).toHaveTextContent('Kurfürstendamm 52');
    expect(window.localStorage.getItem('zaritzki.practice')).toBe('charlottenburg');
  });

  it('restores a persisted choice on mount', () => {
    window.localStorage.setItem('zaritzki.practice', 'charlottenburg');
    render(<LocationProvider><Probe /></LocationProvider>);
    expect(screen.getByTestId('street')).toHaveTextContent('Kurfürstendamm 52');
  });

  it('ignores a corrupt persisted value rather than crashing', () => {
    window.localStorage.setItem('zaritzki.practice', 'atlantis');
    render(<LocationProvider><Probe /></LocationProvider>);
    expect(screen.getByTestId('street')).toHaveTextContent('Jägerstraße 41');
  });

  it('accepts a server-provided initial location from the query parameter', () => {
    render(<LocationProvider initialLocation="charlottenburg"><Probe /></LocationProvider>);
    expect(screen.getByTestId('street')).toHaveTextContent('Kurfürstendamm 52');
  });
});
```

- [x] **Step 6: Run it and confirm it fails**

Run: `pnpm test:unit LocationProvider`
Expected: FAIL — `Cannot find module '@/lib/LocationProvider'`.

- [x] **Step 7: Create `site/lib/LocationProvider.tsx`**

```tsx
'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_LOCATION,
  PRACTICES,
  getPractice,
  type LocationId,
  type Practice,
} from '@/lib/locations';

const STORAGE_KEY = 'zaritzki.practice';

type LocationContextValue = {
  locationId: LocationId;
  practice: Practice;
  setLocation: (id: LocationId) => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

function isLocationId(value: unknown): value is LocationId {
  return typeof value === 'string' && value in PRACTICES;
}

export function LocationProvider({
  children,
  initialLocation,
}: {
  children: React.ReactNode;
  initialLocation?: LocationId;
}) {
  const [locationId, setLocationId] = useState<LocationId>(initialLocation ?? DEFAULT_LOCATION);

  // Restore only when the server did not already choose via ?praxis=,
  // and only after hydration so server and client markup match.
  useEffect(() => {
    if (initialLocation) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocationId(stored)) setLocationId(stored);
  }, [initialLocation]);

  const setLocation = useCallback((id: LocationId) => {
    setLocationId(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Private browsing can refuse storage. The switch must still work.
    }
  }, []);

  return (
    <LocationContext.Provider value={{ locationId, practice: getPractice(locationId), setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside <LocationProvider>');
  return ctx;
}
```

- [x] **Step 8: Run the provider test and confirm it passes**

Run: `pnpm test:unit LocationProvider`
Expected: PASS, 5 tests.

- [x] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add location context, persistence, and booking href resolution"
```

---

# Phase 3 — Chrome

## Task 6: Button and the pending-fact marker

> **Approved Phase 3 TDD/copy correction (2026-08-11):** the “never stretches” test must assert the loaded CSS behavior (`display: inline-flex` and `width: auto`) rather than merely checking that a generated class name contains `button`. After Button reaches GREEN, add a separate failing `PendingFact` behavior test before creating that component; no production component bypasses RED. The pending marker must not mention or imply a from-price column; the binding no-price decision remains in force.

**Files:**
- Create: `site/components/system/Button.tsx`, `Button.module.css`
- Create: `site/components/dev/PendingFact.tsx`, `PendingFact.module.css`
- Test: `site/tests/unit/Button.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `<Button variant="primary" | "secondary" | "ghost" | "link" size="sm" | "md" | "lg" href? onClick? iconRight?>`
  - `<PendingFact note="…" />` — renders the placeholder marker

- [x] **Step 1: Read the design system's Button contract before writing anything**

Read `../components/forms/Button.jsx.txt` and `../components/forms/Button.prompt.md`. The port must preserve variants, sizes, hover and press behaviour exactly. **Primary lightens to `--gold-light` on hover and gains `--shadow-gold`; press nudges `translateY(1px)`; nothing scales down.**

- [x] **Step 2: Write the failing test**

Create `site/tests/unit/Button.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/system/Button';

describe('Button', () => {
  it('renders an anchor when given an href', () => {
    render(<Button href="tel:+493085403000">Call</Button>);
    const link = screen.getByRole('link', { name: 'Call' });
    expect(link).toHaveAttribute('href', 'tel:+493085403000');
  });

  it('renders a button element when given an onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Book</Button>);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('never stretches — it is inline-flex, not block', () => {
    render(<Button onClick={() => {}}>Book a first consultation</Button>);
    const el = screen.getByRole('button');
    expect(el.className).toContain('button');
    expect(el.tagName).toBe('BUTTON');
  });

  it('marks a decorative trailing icon as hidden from assistive technology', () => {
    render(<Button href="/x" iconRight={<svg data-testid="arrow" />}>Go</Button>);
    expect(screen.getByTestId('arrow').parentElement).toHaveAttribute('aria-hidden', 'true');
  });
});
```

- [x] **Step 3: Run it and confirm it fails**

Run: `pnpm test:unit Button`
Expected: FAIL — module not found.

- [x] **Step 4: Create `site/components/system/Button.module.css`**

```css
.button {
  /* Hugs its label. Never stretches, whatever container it lands in. */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: auto;
  align-self: flex-start;
  white-space: nowrap;

  font-family: var(--font-sans);
  font-weight: var(--fw-bold);
  letter-spacing: 0.03em;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.button:active { transform: translateY(1px); }

.sm { font-size: var(--text-xs); padding: var(--space-2) var(--space-3); }
.md { font-size: var(--text-sm); padding: var(--space-3) var(--space-5); }
.lg { font-size: var(--text-md); padding: var(--space-4) var(--space-6); }

.primary { background: var(--brand); color: var(--brand-contrast); }
.primary:hover { background: var(--brand-hover); box-shadow: var(--shadow-gold); }
.primary:active { background: var(--brand-active); }

.secondary { background: var(--surface-inverse); color: var(--text-on-dark); }
.secondary:hover { background: var(--surface-inverse-2); }

.ghost { background: transparent; border-color: var(--hairline-gold); color: currentColor; }
.ghost:hover { background: rgba(181, 138, 62, 0.1); }

.link {
  background: none; padding: 0; color: var(--text-gold);
  border-bottom: 1px solid var(--hairline-gold); border-radius: 0;
}
.link:hover { color: var(--cognac); }

.icon { display: inline-flex; line-height: 0; opacity: 0.8; }
```

- [x] **Step 5: Create `site/components/system/Button.tsx`**

```tsx
import Link from 'next/link';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  iconRight?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  iconRight,
  className,
  ...rest
}: Props) {
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');
  const inner = (
    <>
      {children}
      {iconRight ? <span className={styles.icon} aria-hidden="true">{iconRight}</span> : null}
    </>
  );

  if (href) {
    // External and tel: hrefs must not go through the client router.
    const isExternal = /^(https?:|tel:|mailto:)/.test(href);
    if (isExternal) {
      return <a className={cls} href={href} {...rest}>{inner}</a>;
    }
    return <Link className={cls} href={href} {...rest}>{inner}</Link>;
  }

  return <button type="button" className={cls} onClick={onClick} {...rest}>{inner}</button>;
}
```

- [x] **Step 6: Run the test and confirm it passes**

Run: `pnpm test:unit Button`
Expected: PASS, 4 tests.

- [x] **Step 7: Create `site/components/dev/PendingFact.module.css`**

```css
.pending {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--danger-fg);
  background: var(--danger);
  padding: 2px var(--space-2);
  border-radius: var(--radius-xs);
}

.dash {
  font-family: var(--font-sans);
  color: var(--text-subtle);
}
```

- [x] **Step 8: Create `site/components/dev/PendingFact.tsx`**

```tsx
import styles from './PendingFact.module.css';

/**
 * Renders an unverified fact visibly, so it can never ship unnoticed as if it
 * were real. `dash` shows the em-dash placeholder that stands where a value
 * would sit (for example the from-price column); `label` is the marker itself.
 */
export function PendingFact({ note, dash }: { note: string; dash?: string }) {
  return (
    <>
      {dash ? <span className={styles.dash}>{dash}</span> : null}
      <span className={styles.pending} title={note}>Awaiting practice</span>
    </>
  );
}
```

- [x] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: port Button and add the pending-fact marker"
```

---

## Task 7: Site header with location and locale switches

> **Approved mobile correction (2026-08-11):** returning patients must retain an immediate, visible, dialable phone path on mobile. The desktop number may become a compact translated “Call the practice” link at the narrow breakpoint, but it may not disappear from the header on the promise that a later, initially hidden and dismissible bar will carry it.

**Files:**
- Create: `site/components/chrome/LocationSwitch.tsx` + `.module.css`
- Create: `site/components/chrome/LocaleSwitch.tsx` + `.module.css`
- Create: `site/components/chrome/SiteHeader.tsx` + `.module.css`
- Test: `site/tests/unit/SiteHeader.test.tsx`

**Interfaces:**
- Consumes: `useLocation`, `Button`, `bookingHref`, `translator`.
- Produces: `<SiteHeader t={t} locale={locale} />`, `<LocationSwitch t={t} />`, `<LocaleSwitch locale={locale} />`.

- [x] **Step 1: Write the failing test**

Create `site/tests/unit/SiteHeader.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationProvider } from '@/lib/LocationProvider';
import { SiteHeader } from '@/components/chrome/SiteHeader';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

function setup() {
  return render(
    <LocationProvider>
      <SiteHeader t={t} locale="en" />
    </LocationProvider>,
  );
}

describe('SiteHeader', () => {
  it('presents the two practices as a radio group with Mitte selected', () => {
    setup();
    const group = screen.getByRole('radiogroup', { name: /practice/i });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Mitte' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Charlottenburg' })).not.toBeChecked();
  });

  it('switches the selected practice on click', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('radio', { name: 'Charlottenburg' }));
    expect(screen.getByRole('radio', { name: 'Charlottenburg' })).toBeChecked();
  });

  it('shows the telephone number as a dialable link — the returning-patient path', () => {
    setup();
    expect(screen.getByRole('link', { name: /030 854 030 00/ })).toHaveAttribute(
      'href',
      'tel:+493085403000',
    );
  });

  it('offers exactly one booking action and no competing patient CTA', () => {
    setup();
    expect(screen.getAllByRole('link', { name: /^Book$/ })).toHaveLength(1);
    expect(screen.queryByText(/existing patient/i)).not.toBeInTheDocument();
  });

  it('does not link the German route while its copy is unwritten', () => {
    setup();
    expect(screen.queryByRole('link', { name: 'DE' })).not.toBeInTheDocument();
  });
});
```

- [x] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit SiteHeader`
Expected: FAIL — module not found.

- [x] **Step 3: Create `site/components/chrome/LocationSwitch.module.css`**

```css
.group {
  display: inline-flex;
  border: 1px solid var(--hairline-gold);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.option {
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: var(--space-2) var(--space-3);
  background: transparent;
  color: var(--text-on-dark-muted);
  border: 0;
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.option + .option { border-left: 1px solid var(--hairline-gold); }
.option:hover { color: var(--text-on-dark); }

.selected {
  background: var(--brand);
  color: var(--brand-contrast);
  font-weight: var(--fw-bold);
}
```

- [x] **Step 4: Create `site/components/chrome/LocationSwitch.tsx`**

Native radio semantics via `role="radio"` on buttons, with roving arrow-key focus — a segmented control is a radio group, not a set of independent buttons.

```tsx
'use client';

import { useRef } from 'react';
import { useLocation } from '@/lib/LocationProvider';
import { PRACTICE_ORDER, getPractice, type LocationId } from '@/lib/locations';
import styles from './LocationSwitch.module.css';

export function LocationSwitch({ t }: { t: (key: string) => string }) {
  const { locationId, setLocation } = useLocation();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const index = PRACTICE_ORDER.indexOf(locationId);
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = PRACTICE_ORDER[(index + delta + PRACTICE_ORDER.length) % PRACTICE_ORDER.length];
    setLocation(next);
    refs.current[next]?.focus();
  }

  return (
    <div className={styles.group} role="radiogroup" aria-label={t('nav.practice')} onKeyDown={onKeyDown}>
      {PRACTICE_ORDER.map((id: LocationId) => {
        const selected = id === locationId;
        return (
          <button
            key={id}
            ref={(el) => { refs.current[id] = el; }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className={`${styles.option} ${selected ? styles.selected : ''}`}
            onClick={() => setLocation(id)}
          >
            {getPractice(id).shortName}
          </button>
        );
      })}
    </div>
  );
}
```

- [x] **Step 5: Create `site/components/chrome/LocaleSwitch.module.css`**

```css
.switch { display: inline-flex; align-items: center; gap: var(--space-2); }

.current,
.other {
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
}

.current { color: var(--gold-light); font-weight: var(--fw-semibold); }
.other { color: var(--text-on-dark-muted); text-decoration: none; }
.other:hover { color: var(--gold-light); }
.pending { color: var(--text-on-dark-muted); opacity: 0.4; cursor: not-allowed; }
```

- [x] **Step 6: Create `site/components/chrome/LocaleSwitch.tsx`**

```tsx
import Link from 'next/link';
import { LOCALES, type Locale } from '@/lib/i18n';
import styles from './LocaleSwitch.module.css';

/**
 * German copy is not written yet, so /de is rendered as an inert label rather
 * than a link to an English page wearing a German URL. Delete GERMAN_PENDING
 * when messages/de.json is filled in.
 */
const GERMAN_PENDING = true;

export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  return (
    <div className={styles.switch} aria-label={label}>
      {LOCALES.map((code) => {
        if (code === locale) {
          return <span key={code} className={styles.current} aria-current="true">{code.toUpperCase()}</span>;
        }
        if (code === 'de' && GERMAN_PENDING) {
          return (
            <span key={code} className={styles.pending} title="Deutsche Fassung folgt">
              {code.toUpperCase()}
            </span>
          );
        }
        return (
          <Link key={code} className={styles.other} href={`/${code}`}>
            {code.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
```

- [x] **Step 7: Create `site/components/chrome/SiteHeader.module.css`**

```css
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(36, 26, 18, 0.82);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--hairline-gold);
}

.inner {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: var(--space-3) var(--gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
}

.mark {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: var(--fw-display-medium);
  color: var(--text-on-dark);
  text-decoration: none;
  line-height: 1;
}

.mark em { font-style: italic; font-weight: var(--fw-display-light); color: var(--gold-light); }

.actions { display: flex; align-items: center; gap: var(--space-5); }

.phone {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--text-on-dark-muted);
  text-decoration: none;
  letter-spacing: 0.04em;
}
.phone:hover { color: var(--gold-light); }

.skip {
  position: absolute; left: var(--space-4); top: -100%;
  background: var(--brand); color: var(--brand-contrast);
  padding: var(--space-2) var(--space-4); border-radius: var(--radius-sm);
  font-size: var(--text-sm); font-weight: var(--fw-semibold); text-decoration: none;
}
.skip:focus { top: var(--space-2); }

@media (max-width: 860px) {
  .phone { display: none; } /* moves into the sticky booking bar on small screens */
  .inner { gap: var(--space-3); }
  .mark { font-size: var(--text-lg); }
}
```

- [x] **Step 8: Create `site/components/chrome/SiteHeader.tsx`**

```tsx
'use client';

import { useLocation } from '@/lib/LocationProvider';
import { bookingHref } from '@/lib/booking';
import { Button } from '@/components/system/Button';
import { LocationSwitch } from './LocationSwitch';
import { LocaleSwitch } from './LocaleSwitch';
import type { Locale } from '@/lib/i18n';
import styles from './SiteHeader.module.css';

export function SiteHeader({
  t,
  locale,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
  locale: Locale;
}) {
  const { practice } = useLocation();

  return (
    <header className={styles.header}>
      <a className={styles.skip} href="#content">{t('nav.skipToContent')}</a>
      <div className={styles.inner}>
        <a className={styles.mark} href={`/${locale}`}>
          Zaritzki <em>Fine Dentistry</em>
        </a>
        <div className={styles.actions}>
          <LocationSwitch t={t} />
          <a className={styles.phone} href={`tel:${practice.phone}`}>{practice.phoneDisplay}</a>
          <LocaleSwitch locale={locale} label={t('nav.language')} />
          <Button href={bookingHref(practice)} size="sm">{t('nav.book')}</Button>
        </div>
      </div>
    </header>
  );
}
```

- [x] **Step 9: Run the test and confirm it passes**

Run: `pnpm test:unit SiteHeader`
Expected: PASS, 5 tests.

- [x] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add site header with location and locale switches"
```

---

## Task 8: Sticky booking bar

**Files:**
- Create: `site/components/chrome/StickyBookingBar.tsx` + `.module.css`
- Test: `site/tests/unit/StickyBookingBar.test.tsx`

**Interfaces:**
- Consumes: `useLocation`, `bookingHref`, `Button`.
- Produces: `<StickyBookingBar t={t} />` — hidden until `data-visible="true"` is set by the hero sentinel.

- [x] **Step 1: Write the failing test**

Create `site/tests/unit/StickyBookingBar.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationProvider } from '@/lib/LocationProvider';
import { StickyBookingBar } from '@/components/chrome/StickyBookingBar';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('StickyBookingBar', () => {
  it('starts hidden — it must not cover the hero', () => {
    render(<LocationProvider><StickyBookingBar t={t} /></LocationProvider>);
    expect(screen.getByTestId('sticky-bar')).toHaveAttribute('data-visible', 'false');
  });

  it('carries the current practice address and the insurance qualifier', () => {
    render(<LocationProvider><StickyBookingBar t={t} /></LocationProvider>);
    expect(screen.getByTestId('sticky-bar')).toHaveTextContent('Jägerstraße 41');
    expect(screen.getByTestId('sticky-bar')).toHaveTextContent('privately insured & self-paying');
  });

  it('stays dismissed for the session but not beyond it', async () => {
    const user = userEvent.setup();
    render(<LocationProvider><StickyBookingBar t={t} /></LocationProvider>);
    await user.click(screen.getByRole('button', { name: 'Hide this bar' }));
    expect(screen.queryByTestId('sticky-bar')).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem('zaritzki.stickyDismissed')).toBe('1');
    expect(window.localStorage.getItem('zaritzki.stickyDismissed')).toBeNull();
  });

  it('carries no urgency or scarcity language', () => {
    render(<LocationProvider><StickyBookingBar t={t} /></LocationProvider>);
    const text = screen.getByTestId('sticky-bar').textContent ?? '';
    for (const banned of ['now', 'limited', 'hurry', 'today only', '!']) {
      expect(text.toLowerCase()).not.toContain(banned.toLowerCase());
    }
  });
});
```

- [x] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit StickyBookingBar`
Expected: FAIL — module not found.

- [x] **Step 3: Create `site/components/chrome/StickyBookingBar.module.css`**

```css
.bar {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 40;
  background: rgba(36, 26, 18, 0.94);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--gold);
  padding: var(--space-3) var(--gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  transform: translateY(100%);
  opacity: 0;
  visibility: hidden;
  transition:
    transform var(--duration-base) var(--ease-out),
    opacity var(--duration-base) var(--ease-out),
    visibility 0s linear var(--duration-base);
}

.bar[data-visible='true'] {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
  transition-delay: 0s;
}

.summary {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--fw-light);
  color: var(--text-on-dark-muted);
}

.right { display: flex; align-items: center; gap: var(--space-4); }

.dismiss {
  background: none; border: 0; cursor: pointer;
  font-family: var(--font-sans); font-size: var(--text-2xs);
  letter-spacing: var(--tracking-eyebrow); text-transform: uppercase;
  color: var(--text-on-dark-muted);
}
.dismiss:hover { color: var(--text-on-dark); }

@media (max-width: 860px) {
  .summary { font-size: var(--text-xs); }
  .bar { padding: var(--space-3) var(--space-4); }
}

@media (prefers-reduced-motion: reduce) {
  .bar { transition: none; }
}
```

- [x] **Step 4: Create `site/components/chrome/StickyBookingBar.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useLocation } from '@/lib/LocationProvider';
import { bookingHref } from '@/lib/booking';
import { Button } from '@/components/system/Button';
import styles from './StickyBookingBar.module.css';

const DISMISS_KEY = 'zaritzki.stickyDismissed';
/** The hero sets this attribute on <body> when it leaves the viewport (Task 10). */
const VISIBLE_ATTR = 'data-past-hero';

export function StickyBookingBar({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const { practice } = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(DISMISS_KEY) === '1') setDismissed(true);
  }, []);

  useEffect(() => {
    const update = () => setVisible(document.body.getAttribute(VISIBLE_ATTR) === 'true');
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: [VISIBLE_ATTR] });
    return () => observer.disconnect();
  }, []);

  if (dismissed) return null;

  return (
    <div className={styles.bar} data-testid="sticky-bar" data-visible={String(visible)}>
      <span className={styles.summary}>
        {t('sticky.summary', { address: practice.street })}
      </span>
      <div className={styles.right}>
        <button
          type="button"
          className={styles.dismiss}
          onClick={() => {
            setDismissed(true);
            try { window.sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
          }}
        >
          {t('sticky.dismiss')}
        </button>
        <Button href={bookingHref(practice)} size="sm">{t('nav.bookFirst')}</Button>
      </div>
    </div>
  );
}
```

- [x] **Step 5: Run the test and confirm it passes**

Run: `pnpm test:unit StickyBookingBar`
Expected: PASS, 4 tests.

- [x] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add sticky booking bar with session-scoped dismissal"
```

---

## Task 9: Site footer

> **Approved message-layer correction (2026-08-11):** footer prose and hours labels must resolve through `messages/en.json` via `t`; only confirmed location data such as addresses and telephone numbers comes directly from `locations.ts`. Do not hardcode new rendered English prose in the component.

**Files:**
- Create: `site/components/chrome/SiteFooter.tsx` + `.module.css`
- Test: `site/tests/unit/SiteFooter.test.tsx`

**Interfaces:**
- Consumes: `PRACTICE_ORDER`, `getPractice`, `translator`.
- Produces: `<SiteFooter t={t} />` — a server component; it lists both practices unconditionally.

- [x] **Step 1: Write the failing test**

Create `site/tests/unit/SiteFooter.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteFooter } from '@/components/chrome/SiteFooter';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('SiteFooter', () => {
  it('lists both practices regardless of which is selected', () => {
    render(<SiteFooter t={t} />);
    expect(screen.getByText('Jägerstraße 41')).toBeInTheDocument();
    expect(screen.getByText('Kurfürstendamm 52')).toBeInTheDocument();
  });

  it('keeps the German legal links in German', () => {
    render(<SiteFooter t={t} />);
    expect(screen.getByRole('link', { name: 'Impressum' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Datenschutz' })).toBeInTheDocument();
  });

  it('offers the telephone number as the returning-patient path', () => {
    render(<SiteFooter t={t} />);
    expect(screen.getAllByRole('link', { name: /030 854 030 00/ }).length).toBeGreaterThan(0);
  });
});
```

- [x] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit SiteFooter`
Expected: FAIL — module not found.

- [x] **Step 3: Create `site/components/chrome/SiteFooter.module.css`**

```css
.footer {
  background: var(--surface-inverse-2);
  border-top: 1px solid var(--gold);
  color: var(--text-on-dark-muted);
  padding-block: var(--space-8);
  /* Clears the sticky booking bar. */
  padding-bottom: calc(var(--space-8) + 64px);
}

.inner {
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: var(--space-7);
}

.mark {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: var(--fw-display-regular);
  color: var(--text-on-dark);
}

.tagline { font-size: var(--text-sm); font-weight: var(--fw-light); margin-top: var(--space-3); max-width: 34ch; }

.name { font-family: var(--font-display); font-size: var(--text-xl); color: var(--text-on-dark); }
.line { font-size: var(--text-sm); font-weight: var(--fw-light); margin-top: var(--space-2); }
.link { color: var(--text-on-dark-muted); text-decoration: none; }
.link:hover { color: var(--gold-light); }

.legal {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: var(--space-6) var(--gutter) 0;
  margin-top: var(--space-6);
  border-top: 1px solid rgba(245, 240, 230, 0.12);
  display: flex; gap: var(--space-5); flex-wrap: wrap;
  font-size: var(--text-xs);
}

@media (max-width: 860px) {
  .inner { grid-template-columns: 1fr; gap: var(--space-6); }
}
```

- [x] **Step 4: Create `site/components/chrome/SiteFooter.tsx`**

```tsx
import { PRACTICE_ORDER, getPractice } from '@/lib/locations';
import styles from './SiteFooter.module.css';

export function SiteFooter({ t }: { t: (key: string) => string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <div className={styles.mark}>Zaritzki Fine Dentistry</div>
          <p className={styles.tagline}>
            A private dental practice in Berlin. Privately insured and self-paying patients.
          </p>
        </div>
        {PRACTICE_ORDER.map((id) => {
          const p = getPractice(id);
          return (
            <div key={id}>
              <div className={styles.name}>{p.shortName}</div>
              <div className={styles.line}>{p.street}</div>
              <div className={styles.line}>{p.postalCode} {p.city}</div>
              <div className={styles.line}>Monday to Friday, 08:00–20:00</div>
              <div className={styles.line}>
                <a className={styles.link} href={`tel:${p.phone}`}>{p.phoneDisplay}</a>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.legal}>
        <a className={styles.link} href="/impressum">{t('footer.imprint')}</a>
        <a className={styles.link} href="/datenschutz">{t('footer.privacy')}</a>
      </div>
    </footer>
  );
}
```

**Note for the builder:** `/impressum` and `/datenschutz` render as links but have no pages — they 404. **This is a deliberate, user-confirmed deferral:** this build is a cold-outreach pitch artifact, not a live commercial site, so the statutory pages are the practice owner's to finalise if they take the work forward. Do not build them, and do not remove the links — they belong in the design.

The obligation is real the moment this is published as the practice's own site. It is recorded on the handoff checklist in Task 20, not here.

- [x] **Step 5: Run the test and confirm it passes**

Run: `pnpm test:unit SiteFooter`
Expected: PASS, 3 tests.

- [x] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add espresso site footer with both practices"
```

---

# Phase 4 — The walk

> **Approved Phase 4 implementation correction (2026-08-11):** execute this
> phase as Task 11, then Task 10, then Task 12 so `StepRail` exists before the
> hero consumes it. The rail remains one authored navigation at the bottom of
> the hero: it is static and readable by default, becomes fixed beneath the
> desktop header only while `body[data-past-hero='true']` and the walk is still
> active, and releases when the top of `#practices` reaches the rail position.
> It never fixes on mobile. Cover both the stuck and released states with
> behavior tests; do not duplicate the rail. Task 10 must separately prove the
> hero sentinel toggles and cleans up `data-past-hero`.
>
> `Reveal` also stays fully visible in server-rendered/no-JavaScript markup.
> Only a mounted, motion-enabled client with `IntersectionObserver` may opt it
> into the pre-reveal opacity/12px transform; reduced-motion and unsupported
> clients remain visible with no transform. Give `Reveal` its own failing
> behavior test before implementation. Its needed public API is `children`,
> optional `delay`, and optional `className`; the unused `as?` notation below
> is removed rather than implementing an unneeded polymorphic surface.

## Task 10: Hero and the past-hero sentinel

> **Binding correction:** Task 11 is already complete before this task starts.
> Add a focused RED/GREEN behavior test proving the sentinel sets
> `body[data-past-hero]` to `true` when it leaves, returns it to `false` when it
> re-enters, and removes the attribute on cleanup.

**Files:**
- Create: `site/components/walk/Hero.tsx` + `.module.css`
- Test: `site/tests/unit/Hero.test.tsx`

**Interfaces:**
- Consumes: `useLocation`, `bookingHref`, `Button`, `StepRail` (Task 11 — build Task 11 first if working out of order).
- Produces: `<Hero t={t} />`. Sets `document.body[data-past-hero]` to `"true"` once the hero's bottom sentinel leaves the viewport, which is what `StickyBookingBar` observes.

- [x] **Step 1: Write the failing test**

Create `site/tests/unit/Hero.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocationProvider } from '@/lib/LocationProvider';
import { Hero } from '@/components/walk/Hero';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('Hero', () => {
  it('states what this is and where, in the eyebrow', () => {
    render(<LocationProvider><Hero t={t} /></LocationProvider>);
    expect(screen.getByText('Private Zahnarztpraxis · Berlin Mitte')).toBeInTheDocument();
  });

  it('carries the headline as the page h1', () => {
    render(<LocationProvider><Hero t={t} /></LocationProvider>);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('A calmer kind of dental visit');
  });

  it('qualifies the audience before anyone books', () => {
    render(<LocationProvider><Hero t={t} /></LocationProvider>);
    expect(
      screen.getByText(/Privately insured and self-paying patients · Monday to Friday, 08:00–20:00/),
    ).toBeInTheDocument();
  });

  it('exposes a primary booking action in the first viewport', () => {
    render(<LocationProvider><Hero t={t} /></LocationProvider>);
    expect(screen.getByRole('link', { name: /Book a first consultation/ })).toBeInTheDocument();
  });

  it('gives the hero image an empty alt — it is atmosphere, not information', () => {
    render(<LocationProvider><Hero t={t} /></LocationProvider>);
    const img = screen.getByTestId('hero-image');
    expect(img).toHaveAttribute('alt', '');
  });
});
```

- [x] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit Hero`
Expected: FAIL — module not found.

- [x] **Step 3: Create `site/components/walk/Hero.module.css`**

```css
.hero { position: relative; min-height: 88svh; display: flex; flex-direction: column; overflow: hidden; }

.image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

.scrim {
  position: absolute; inset: 0;
  background: linear-gradient(
    90deg,
    rgba(20, 12, 7, 0.9) 0%,
    rgba(20, 12, 7, 0.66) 46%,
    rgba(20, 12, 7, 0.2) 100%
  );
}

.inner {
  position: relative; z-index: 2; flex: 1;
  display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
  max-width: var(--container-max);
  width: 100%;
  margin-inline: auto;
  padding: var(--space-8) var(--gutter);
}

.headline {
  font-family: var(--font-display);
  font-weight: var(--fw-display-regular);
  font-size: clamp(2.75rem, 5.4vw, var(--text-display-2xl));
  line-height: var(--lh-tight);
  letter-spacing: var(--tracking-display);
  color: var(--text-on-dark);
  margin: var(--space-4) 0 0;
  max-width: 14ch;
}

.lede {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-relaxed);
  color: rgba(245, 240, 230, 0.78);
  max-width: 44ch;
  margin: var(--space-5) 0 0;
}

.qualifier {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: rgba(245, 240, 230, 0.6);
  margin: var(--space-4) 0 0;
  padding-top: var(--space-4);
  border-top: 1px solid var(--hairline-gold);
  max-width: 46ch;
}

.cta { margin-top: var(--space-6); }

.sentinel { position: absolute; bottom: 0; height: 1px; width: 100%; }

@media (max-width: 860px) {
  .hero { min-height: 92svh; }
  .lede { font-size: var(--text-lg); }
}
```

- [x] **Step 4: Create `site/components/walk/Hero.tsx`**

```tsx
'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useLocation } from '@/lib/LocationProvider';
import { bookingHref } from '@/lib/booking';
import { Button } from '@/components/system/Button';
import { StepRail } from './StepRail';
import styles from './Hero.module.css';

export function Hero({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const { practice } = useLocation();
  const sentinel = useRef<HTMLDivElement>(null);

  // Tell the sticky bar when the hero has left. Attribute rather than context
  // so the bar can live outside this subtree without prop drilling.
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.setAttribute('data-past-hero', String(!entry.isIntersecting));
      },
      { rootMargin: '0px' },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.body.removeAttribute('data-past-hero');
    };
  }, []);

  return (
    <section className={styles.hero} id="step-street" aria-labelledby="hero-headline">
      <Image
        className={styles.image}
        src={practice.images.entrance}
        alt=""
        data-testid="hero-image"
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.scrim} />
      <div className={styles.inner}>
        <p className="eyebrow" style={{ color: 'var(--gold-light)' }}>
          {t('hero.eyebrow', { district: practice.district })}
        </p>
        <h1 id="hero-headline" className={styles.headline}>{t('hero.headline')}</h1>
        <p className={styles.lede}>{t('hero.lede')}</p>
        <p className={styles.qualifier}>{t('hero.qualifier')}</p>
        <div className={styles.cta}>
          <Button href={bookingHref(practice)} size="lg" iconRight={<Arrow />}>
            {t('nav.bookFirst')}
          </Button>
        </div>
      </div>
      <StepRail t={t} />
      <div ref={sentinel} className={styles.sentinel} aria-hidden="true" />
    </section>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
```

The arrow is drawn inline at the design system's specified 1.75 stroke with round caps. **Do not add an icon library for one glyph.**

- [x] **Step 5: Run the test and confirm it passes**

Run: `pnpm test:unit Hero`
Expected: PASS, 5 tests. (Requires Task 11's `StepRail` to exist — build it first if this fails on import.)

- [x] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add hero with past-hero sentinel"
```

---

## Task 11: Step rail navigation

> **Binding correction:** this is the first task executed in Phase 4. The
> single nav is static by default. On desktop only, it becomes fixed beneath
> the 62px header while `body[data-past-hero='true']`; it returns to its docked
> state when scrolling back into the hero and enters a released state when the
> top of `#practices` reaches the rail position. Add behavior tests for the
> fixed and released transitions. On mobile it never fixes.

**Files:**
- Create: `site/components/walk/StepRail.tsx` + `.module.css`, `site/lib/steps.ts`
- Test: `site/tests/unit/StepRail.test.tsx`

**Interfaces:**
- Consumes: `translator`.
- Produces:
  - `STEPS: readonly { id: string; anchor: string; labelKey: string; number: string }[]` from `@/lib/steps`
  - `<StepRail t={t} />`

- [x] **Step 1: Write the failing test**

Create `site/tests/unit/StepRail.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepRail } from '@/components/walk/StepRail';
import { STEPS } from '@/lib/steps';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('StepRail', () => {
  it('is real navigation, not decoration', () => {
    render(<StepRail t={t} />);
    expect(screen.getByRole('navigation', { name: 'The visit, step by step' })).toBeInTheDocument();
  });

  it('renders exactly the five steps, in order, as in-page anchors', () => {
    render(<StepRail t={t} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
    expect(links.map((l) => l.getAttribute('href'))).toEqual(
      STEPS.map((s) => `#${s.anchor}`),
    );
    expect(links.map((l) => l.textContent)).toEqual([
      '01The street', '02The lounge', '03The talk', '04The room', '05Leaving',
    ]);
  });

  it('marks the first step current on load', () => {
    render(<StepRail t={t} />);
    expect(screen.getByRole('link', { current: 'step' })).toHaveTextContent('The street');
  });
});
```

- [x] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit StepRail`
Expected: FAIL — module not found.

- [x] **Step 3: Create `site/lib/steps.ts`**

```ts
/**
 * The five steps of the walk. The rail's layout assumes exactly five; adding a
 * sixth is a design change, not a data change.
 */
export const STEPS = [
  { id: 'street',  anchor: 'step-street',  labelKey: 'steps.street',  number: '01' },
  { id: 'lounge',  anchor: 'step-lounge',  labelKey: 'steps.lounge',  number: '02' },
  { id: 'talk',    anchor: 'step-talk',    labelKey: 'steps.talk',    number: '03' },
  { id: 'room',    anchor: 'step-room',    labelKey: 'steps.room',    number: '04' },
  { id: 'leaving', anchor: 'step-leaving', labelKey: 'steps.leaving', number: '05' },
] as const;

export type Step = (typeof STEPS)[number];
```

- [x] **Step 4: Create `site/components/walk/StepRail.module.css`**

```css
.rail {
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--hairline-gold);
  background: rgba(20, 12, 7, 0.62);
  backdrop-filter: blur(8px);
}

.list {
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  list-style: none;
  margin-block: 0;
}

.item { border-right: 1px solid rgba(245, 240, 230, 0.1); }
.item:last-child { border-right: 0; }

.link {
  display: block;
  padding: var(--space-3) var(--space-4);
  text-decoration: none;
  transition: background-color var(--duration-fast) var(--ease-standard);
}
.link:hover { background: rgba(181, 138, 62, 0.08); }

.number {
  display: block;
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  letter-spacing: var(--tracking-eyebrow);
  color: var(--gold);
}

.label {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: var(--fw-display-regular);
  color: var(--text-on-dark);
  margin-top: 2px;
  line-height: 1.1;
}

.link[aria-current='step'] { background: rgba(181, 138, 62, 0.14); }
.link[aria-current='step'] .label { color: var(--gold-light); }

/* Desktop: detaches and sticks beneath the 62px header once the hero scrolls past. */
@media (min-width: 861px) {
  .rail { position: sticky; top: 62px; }
}

/* Mobile: never sticks — the booking bar already owns the bottom edge. */
@media (max-width: 860px) {
  .list {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    padding-inline: var(--space-4);
  }
  .list::-webkit-scrollbar { display: none; }
  .item { flex: 0 0 auto; min-width: 8.5rem; }
  .label { font-size: var(--text-lg); }
}
```

- [x] **Step 5: Create `site/components/walk/StepRail.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { STEPS } from '@/lib/steps';
import styles from './StepRail.module.css';

export function StepRail({ t }: { t: (key: string) => string }) {
  const [current, setCurrent] = useState<string>(STEPS[0].id);

  useEffect(() => {
    const sections = STEPS
      .map((s) => ({ id: s.id, el: document.getElementById(s.anchor) }))
      .filter((s): s is { id: string; el: HTMLElement } => Boolean(s.el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const match = sections.find((s) => s.el === visible.target);
        if (match) setCurrent(match.id);
      },
      // Bias toward the section occupying the middle of the viewport.
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    for (const s of sections) observer.observe(s.el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={styles.rail} aria-label={t('steps.railLabel')}>
      <ol className={styles.list}>
        {STEPS.map((step) => (
          <li key={step.id} className={styles.item}>
            <a
              className={styles.link}
              href={`#${step.anchor}`}
              aria-current={current === step.id ? 'step' : undefined}
            >
              <span className={styles.number}>{step.number}</span>
              <span className={styles.label}>{t(step.labelKey)}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [x] **Step 6: Run the test and confirm it passes**

Run: `pnpm test:unit StepRail`
Expected: PASS, 3 tests.

- [x] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add step rail navigation with scroll-spy"
```

---

## Task 12: Reveal primitive and the split step section

> **Binding correction:** use separate RED/GREEN cycles for `Reveal` and
> `StepSection`. `Reveal` markup is visible by default. Only after a
> motion-enabled client mounts with `IntersectionObserver` available may it
> opt into the hidden 12px pre-reveal state; reduced-motion and unsupported
> clients stay visible without transforms. The entrance fires once. Its public
> API is `children`, optional `delay`, and optional `className`.

**Files:**
- Create: `site/components/motion/Reveal.tsx` + `.module.css`
- Create: `site/components/walk/StepSection.tsx` + `.module.css`
- Test: `site/tests/unit/StepSection.test.tsx`

**Interfaces:**
- Consumes: `Reveal`.
- Produces:
  - `<Reveal delay?={number}>` — one orchestrated entrance, used everywhere; no other component writes its own scroll animation.
  - `<StepSection id anchor eyebrow headline body note? image imageSide="left"|"right" tone="dark"|"light" />`

- [x] **Step 1: Write the failing test**

Create `site/tests/unit/StepSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepSection } from '@/components/walk/StepSection';

describe('StepSection', () => {
  it('anchors itself so the step rail can navigate to it', () => {
    const { container } = render(
      <StepSection
        anchor="step-lounge" eyebrow="02 — The lounge" headline="You will not be kept waiting in a queue"
        body="Appointments are spaced." image="/images/mitte/lounge.jpg" imageSide="left" tone="dark"
      />,
    );
    expect(container.querySelector('#step-lounge')).toBeInTheDocument();
  });

  it('renders the headline as an h2 — h1 belongs to the hero', () => {
    render(
      <StepSection
        anchor="step-lounge" eyebrow="02 — The lounge" headline="You will not be kept waiting in a queue"
        body="Appointments are spaced." image="/images/mitte/lounge.jpg" imageSide="left" tone="dark"
      />,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'You will not be kept waiting in a queue',
    );
  });

  it('leaves atmospheric imagery out of the accessibility tree', () => {
    render(
      <StepSection
        anchor="step-room" eyebrow="04 — The room" headline="Lamplight, not a light in your eyes"
        body="Designed to look like the rest." image="/images/mitte/treatment-room.jpg"
        imageSide="right" tone="dark"
      />,
    );
    expect(screen.getByTestId('step-image')).toHaveAttribute('alt', '');
  });
});
```

- [x] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit StepSection`
Expected: FAIL — module not found.

- [x] **Step 3: Create `site/components/motion/Reveal.module.css`**

```css
.reveal {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity var(--duration-slow) var(--ease-out),
    transform var(--duration-slow) var(--ease-out);
}

.revealed { opacity: 1; transform: none; }

/* Anxious patients are a named audience. This path is not optional. */
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

- [x] **Step 4: Create `site/components/motion/Reveal.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Reveal.module.css';

/**
 * The page's only entrance animation. Fade plus a 12px rise over 400ms on
 * --ease-out, once, never repeated on scroll-back. Every section uses this
 * rather than authoring its own motion — the design system asks for one
 * orchestrated movement, not scattered effects.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[styles.reveal, shown ? styles.revealed : '', className].filter(Boolean).join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

- [x] **Step 5: Create `site/components/walk/StepSection.module.css`**

```css
.section { display: grid; grid-template-columns: 1fr 1fr; min-height: 34rem; }
.section[data-tone='dark'] { background: var(--surface-inverse); color: var(--text-on-dark); }
.section[data-tone='light'] { background: var(--surface-page); color: var(--text-body); }
.section[data-image='right'] .media { order: 2; }

.media { position: relative; overflow: hidden; min-height: 22rem; }
.image { object-fit: cover; }

.copy {
  display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
  padding: var(--section-y) clamp(var(--space-6), 5vw, var(--space-9));
}

.headline {
  font-family: var(--font-display);
  font-weight: var(--fw-display-regular);
  font-size: clamp(1.9rem, 3.4vw, var(--text-display-lg));
  line-height: var(--lh-snug);
  letter-spacing: var(--tracking-display);
  margin: var(--space-4) 0 0;
  max-width: 18ch;
}
.section[data-tone='dark'] .headline { color: var(--text-on-dark); }
.section[data-tone='light'] .headline { color: var(--text-strong); }

.body {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--fw-light);
  line-height: var(--lh-relaxed);
  margin: var(--space-5) 0 0;
  max-width: 48ch;
}
.section[data-tone='dark'] .body { color: rgba(245, 240, 230, 0.76); }
.section[data-tone='light'] .body { color: var(--text-muted); }

.note {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  margin: var(--space-4) 0 0;
  color: var(--gold-light);
}
.section[data-tone='light'] .note { color: var(--text-gold); }

.children { margin-top: var(--space-5); width: 100%; }

@media (max-width: 860px) {
  .section { grid-template-columns: 1fr; }
  .section[data-image='right'] .media { order: 0; }
  .media { min-height: 16rem; }
  .copy { padding: var(--space-7) var(--space-5); }
}
```

- [x] **Step 6: Create `site/components/walk/StepSection.tsx`**

```tsx
import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';
import styles from './StepSection.module.css';

export function StepSection({
  anchor,
  eyebrow,
  headline,
  body,
  note,
  image,
  imageSide,
  tone,
  children,
}: {
  anchor: string;
  eyebrow: string;
  headline: string;
  body: string;
  note?: React.ReactNode;
  image: string;
  imageSide: 'left' | 'right';
  tone: 'dark' | 'light';
  children?: React.ReactNode;
}) {
  return (
    <section className={styles.section} id={anchor} data-tone={tone} data-image={imageSide}>
      <div className={styles.media}>
        <Image
          className={styles.image}
          src={image}
          alt=""
          data-testid="step-image"
          fill
          sizes="(max-width: 860px) 100vw, 50vw"
        />
      </div>
      <div className={styles.copy}>
        <Reveal>
          <p className="eyebrow" style={{ color: tone === 'dark' ? 'var(--gold-light)' : undefined }}>
            {eyebrow}
          </p>
          <h2 className={styles.headline}>{headline}</h2>
          <p className={styles.body}>{body}</p>
          {note ? <p className={styles.note}>{note}</p> : null}
          {children ? <div className={styles.children}>{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
```

- [x] **Step 7: Run the test and confirm it passes**

Run: `pnpm test:unit StepSection`
Expected: PASS, 3 tests.

- [x] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add reveal primitive and reusable split step section"
```

---

# Phase 5 — Content sections

## Task 13: Treatment schedule

**Files:**
- Create: `site/components/content/TreatmentSchedule.tsx` + `.module.css`
- Test: `site/tests/unit/TreatmentSchedule.test.tsx`

**Interfaces:**
- Consumes: `useLocation`, `PendingFact`, `isKnown`.
- Produces: `<TreatmentSchedule t={t} />` — a real `<table>`, because it is tabular data.

- [ ] **Step 1: Write the failing test**

Create `site/tests/unit/TreatmentSchedule.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { LocationProvider } from '@/lib/LocationProvider';
import { TreatmentSchedule } from '@/components/content/TreatmentSchedule';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

const setup = () =>
  render(<LocationProvider><TreatmentSchedule t={t} /></LocationProvider>);

describe('TreatmentSchedule', () => {
  it('is a table, because it is tabular data', () => {
    setup();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('lists all eleven practice-wide treatments', () => {
    setup();
    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(rows).toHaveLength(12); // 1 header + 11 treatments
    expect(screen.getByText('Implantologie')).toBeInTheDocument();
    expect(screen.getByText('Funktionstherapie')).toBeInTheDocument();
    expect(screen.getByText('Ästhetische Prothetik')).toBeInTheDocument();
  });

  it('keeps German treatment names untranslated and glosses them in English', () => {
    setup();
    const row = screen.getByText('Endodontologie').closest('tr');
    expect(row).not.toBeNull();
    expect(within(row as HTMLElement).getByText('root canals, under the microscope')).toBeInTheDocument();
  });

  it('marks veneers as the practice\'s stated focus', () => {
    setup();
    const row = screen.getByText('Veneers').closest('tr');
    expect(within(row as HTMLElement).getByText('Our particular focus')).toBeInTheDocument();
  });

  it('has no price column, and shows no price anywhere', () => {
    setup();
    expect(screen.queryByText('From')).not.toBeInTheDocument();
    expect(screen.queryByText(/€/)).not.toBeInTheDocument();
  });

  it('explains why there is no price list instead of leaving it unsaid', () => {
    setup();
    expect(screen.getByText(/We do not publish a price list/)).toBeInTheDocument();
    expect(screen.getByText(/written estimate before anything is agreed/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit TreatmentSchedule`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `site/components/content/TreatmentSchedule.module.css`**

```css
.table { width: 100%; border-collapse: collapse; margin-top: var(--space-5); }

.head th {
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--text-subtle);
  text-align: left;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-soft);
}
.row td { padding-block: var(--space-2); border-bottom: 1px solid var(--border-soft); vertical-align: baseline; }

.name {
  font-family: var(--font-display);
  font-size: var(--text-display-sm);
  font-weight: var(--fw-display-regular);
  color: var(--text-strong);
}

.focus {
  display: inline-block;
  margin-left: var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--text-gold);
  vertical-align: middle;
}

.gloss { font-family: var(--font-sans); font-size: var(--text-sm); color: var(--text-muted); }

.noPrices {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: var(--fw-light);
  line-height: var(--lh-relaxed);
  color: var(--text-muted);
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--hairline-gold);
  max-width: 56ch;
}

@media (max-width: 600px) {
  /* The gloss moves under the name rather than disappearing — it is the only
     thing telling an English speaker what Funktionstherapie means. */
  .table, .row, .row td { display: block; width: 100%; }
  .head { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .row td { border-bottom: 0; padding-block: 0; }
  .row { border-bottom: 1px solid var(--border-soft); padding-block: var(--space-3); }
  .name { font-size: var(--text-xl); }
  .focus { display: block; margin-left: 0; margin-top: var(--space-1); }
}
```

- [ ] **Step 4: Create `site/components/content/TreatmentSchedule.tsx`**

```tsx
import { TREATMENTS } from '@/lib/locations';
import styles from './TreatmentSchedule.module.css';

/**
 * Treatments are practice-wide, so this is a server component — it does not
 * read the location context. There is no price column: the practice publishes
 * no price list, because German private dental fees are set under the GOZ and
 * depend on the treatment plan. Saying that plainly answers the cost question
 * better than a column of empty placeholders would.
 */
export function TreatmentSchedule({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <>
      <table className={styles.table}>
        <thead className={styles.head}>
          <tr>
            <th scope="col">{t('talk.columnTreatment')}</th>
            <th scope="col" className={styles.gloss}>{t('talk.columnTypical')}</th>
          </tr>
        </thead>
        <tbody>
          {TREATMENTS.map((treatment) => (
            <tr key={treatment.name} className={styles.row}>
              <td className={styles.name}>
                {treatment.name}
                {treatment.focus ? (
                  <span className={styles.focus}>{t('talk.focusLabel')}</span>
                ) : null}
              </td>
              <td className={styles.gloss}>{t(treatment.glossKey)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.noPrices}>{t('talk.noPrices')}</p>
    </>
  );
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `pnpm test:unit TreatmentSchedule`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add treatment schedule with unforgeable pricing"
```

---

## Task 14: Cost and insurance panel

**Files:**
- Create: `site/components/content/CostPanel.tsx` + `.module.css`
- Test: `site/tests/unit/CostPanel.test.tsx`

**Interfaces:**
- Consumes: `translator`, `PendingFact`, `Reveal`.
- Produces: `<CostPanel t={t} />` — step 05, on the parchment ground.

- [ ] **Step 1: Write the failing test**

Create `site/tests/unit/CostPanel.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CostPanel } from '@/components/content/CostPanel';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('CostPanel', () => {
  it('states the statutory-insurance exclusion in plain words', () => {
    render(<CostPanel t={t} />);
    expect(screen.getByText(/We cannot treat statutory patients/)).toBeInTheDocument();
  });

  it('gives the exclusion equal visual weight, not a footnote', () => {
    render(<CostPanel t={t} />);
    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(headings).toEqual(['Privately insured', 'Self-paying', 'Statutory (GKV)']);
  });

  it('explains private practice as the reason for the long appointments', () => {
    render(<CostPanel t={t} />);
    expect(screen.getByText(/the appointments are long and the rooms are like this/)).toBeInTheDocument();
  });

  it('marks the wording that still needs practice confirmation', () => {
    render(<CostPanel t={t} />);
    expect(screen.getAllByTitle(/awaiting practice confirmation/i).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit CostPanel`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `site/components/content/CostPanel.module.css`**

```css
.section { background: var(--surface-sunken); border-block: 1px solid var(--border-soft); }

.inner {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: var(--section-y) var(--gutter);
}

.headline {
  font-family: var(--font-display);
  font-weight: var(--fw-display-regular);
  font-size: clamp(1.9rem, 3.4vw, var(--text-display-lg));
  line-height: var(--lh-snug);
  letter-spacing: var(--tracking-display);
  color: var(--text-strong);
  margin: var(--space-4) 0 0;
}

.body {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: var(--fw-light);
  line-height: var(--lh-relaxed);
  color: var(--text-muted);
  max-width: 62ch;
  margin: var(--space-5) 0 0;
}

.columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); margin-top: var(--space-7); }

.column { border-top: 1px solid var(--gold); padding-top: var(--space-4); }

.columnTitle {
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--text-gold);
  margin: 0;
}

.columnBody {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: var(--fw-light);
  line-height: var(--lh-relaxed);
  color: var(--text-muted);
  margin: var(--space-3) 0 0;
}

@media (max-width: 860px) { .columns { grid-template-columns: 1fr; gap: var(--space-5); } }
```

- [ ] **Step 4: Create `site/components/content/CostPanel.tsx`**

```tsx
import { Reveal } from '@/components/motion/Reveal';
import { PendingFact } from '@/components/dev/PendingFact';
import styles from './CostPanel.module.css';

export function CostPanel({ t }: { t: (key: string) => string }) {
  return (
    <section className={styles.section} id="step-leaving">
      <div className={styles.inner}>
        <Reveal>
          <p className="eyebrow">{t('leaving.eyebrow')}</p>
          <h2 className={styles.headline}>{t('leaving.headline')}</h2>
          <p className={styles.body}>{t('leaving.body')}</p>
          <div className={styles.columns}>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{t('leaving.privateTitle')}</h3>
              <p className={styles.columnBody}>
                {t('leaving.privateBody')}{' '}
                <PendingFact note="GOZ billing language awaiting practice confirmation" />
              </p>
            </div>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{t('leaving.selfTitle')}</h3>
              <p className={styles.columnBody}>
                {t('leaving.selfBody')}{' '}
                <PendingFact note="Estimate wording awaiting practice confirmation" />
              </p>
            </div>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{t('leaving.gkvTitle')}</h3>
              <p className={styles.columnBody}>{t('leaving.gkvBody')}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `pnpm test:unit CostPanel`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add cost and insurance panel stating the GKV exclusion plainly"
```

---

## Task 15: Proof band, practices section, and closing CTA

**Files:**
- Create: `site/components/content/ProofBand.tsx` + `.module.css`
- Create: `site/components/content/PracticesSection.tsx` + `.module.css`
- Create: `site/components/content/ClosingCta.tsx` + `.module.css`
- Test: `site/tests/unit/ProofBand.test.tsx`, `site/tests/unit/PracticesSection.test.tsx`

**Interfaces:**
- Consumes: `PRACTICE_ORDER`, `getPractice`, `useLocation`, `bookingHref`, `Button`, `Reveal`.
- Produces: `<ProofBand t={t} />`, `<PracticesSection t={t} />`, `<ClosingCta t={t} />`.

- [ ] **Step 1: Write the failing proof test**

Create `site/tests/unit/ProofBand.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProofBand } from '@/components/content/ProofBand';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('ProofBand', () => {
  it('shows both real ratings, attributed to their practice', () => {
    render(<ProofBand t={t} />);
    expect(screen.getByText(/69 reviews · Jägerstraße 41/)).toBeInTheDocument();
    expect(screen.getByText(/20 reviews · Kurfürstendamm 52/)).toBeInTheDocument();
  });

  it('carries no testimonial text — none has been supplied or legally cleared', () => {
    const { container } = render(<ProofBand t={t} />);
    expect(container.querySelector('blockquote')).toBeNull();
    expect(screen.queryByText(/"/)).not.toBeInTheDocument();
  });

  it('attributes the ratings to their source', () => {
    render(<ProofBand t={t} />);
    expect(screen.getByText('Ratings as published on Google.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm test:unit ProofBand`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `site/components/content/ProofBand.module.css`**

```css
.band { background: var(--surface-inverse); border-block: 1px solid var(--hairline-gold); }

.inner {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: var(--space-8) var(--gutter);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-7);
}

.rating {
  font-family: var(--font-display);
  font-weight: var(--fw-display-regular);
  font-size: var(--text-display-md);
  color: var(--gold-light);
  line-height: 1;
}

.label {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--fw-light);
  color: var(--text-on-dark-muted);
  margin-top: var(--space-3);
}

.source {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 0 var(--gutter) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--text-on-dark-muted);
  opacity: 0.7;
}

@media (max-width: 860px) { .inner { grid-template-columns: 1fr; gap: var(--space-5); } }
```

- [ ] **Step 4: Create `site/components/content/ProofBand.tsx`**

```tsx
import { PRACTICE_ORDER, getPractice } from '@/lib/locations';
import { Reveal } from '@/components/motion/Reveal';
import styles from './ProofBand.module.css';

/**
 * Real Google ratings only. No testimonial text: none has been supplied, and
 * HWG §11 restricts third-party recommendations in German medical advertising.
 * These figures are shown but deliberately NOT emitted as aggregateRating
 * structured data — see the JSON-LD task.
 */
export function ProofBand({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        {PRACTICE_ORDER.map((id, index) => {
          const p = getPractice(id);
          return (
            <Reveal key={id} delay={index * 80}>
              <p className={styles.rating}>
                {p.rating.value.toFixed(1)} <span aria-hidden="true">★</span>
              </p>
              <p className={styles.label}>
                {t('proof.label', { count: p.rating.count, address: p.street })}
              </p>
            </Reveal>
          );
        })}
      </div>
      <p className={styles.source}>{t('proof.sourceNote')}</p>
    </section>
  );
}
```

- [ ] **Step 5: Run the proof test and confirm it passes**

Run: `pnpm test:unit ProofBand`
Expected: PASS, 3 tests.

- [ ] **Step 6: Write the failing practices test**

Create `site/tests/unit/PracticesSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PracticesSection } from '@/components/content/PracticesSection';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('PracticesSection', () => {
  it('shows both addresses regardless of the header switch — nothing is unreachable', () => {
    render(<PracticesSection t={t} />);
    expect(screen.getByText('Jägerstraße 41')).toBeInTheDocument();
    expect(screen.getByText('Kurfürstendamm 52')).toBeInTheDocument();
  });

  it('links each practice to directions on a map', () => {
    render(<PracticesSection t={t} />);
    const links = screen.getAllByRole('link', { name: 'Directions' });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', expect.stringContaining('google.com/maps'));
  });

  it('states the hours for each practice', () => {
    render(<PracticesSection t={t} />);
    expect(screen.getAllByText('Monday to Friday, 08:00–20:00')).toHaveLength(2);
  });
});
```

- [ ] **Step 7: Run it and confirm it fails**

Run: `pnpm test:unit PracticesSection`
Expected: FAIL — module not found.

- [ ] **Step 8: Create `site/components/content/PracticesSection.module.css`**

```css
.section { background: var(--surface-page); }

.inner {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: var(--section-y) var(--gutter);
}

.headline {
  font-family: var(--font-display);
  font-weight: var(--fw-display-regular);
  font-size: clamp(1.9rem, 3.4vw, var(--text-display-lg));
  letter-spacing: var(--tracking-display);
  color: var(--text-strong);
  margin: var(--space-4) 0 0;
}

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-7); margin-top: var(--space-7); }

.card {
  background: var(--surface-raised);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
}

.name { font-family: var(--font-display); font-size: var(--text-display-sm); color: var(--text-strong); margin: 0; }
.line { font-family: var(--font-sans); font-size: var(--text-md); font-weight: var(--fw-light); color: var(--text-muted); margin: var(--space-2) 0 0; }
.link { color: var(--text-gold); text-decoration: none; border-bottom: 1px solid var(--hairline-gold); }
.link:hover { color: var(--cognac); }
.actions { margin-top: var(--space-5); display: flex; gap: var(--space-4); align-items: center; flex-wrap: wrap; }

@media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 9: Create `site/components/content/PracticesSection.tsx`**

```tsx
import { PRACTICE_ORDER, getPractice } from '@/lib/locations';
import { Reveal } from '@/components/motion/Reveal';
import styles from './PracticesSection.module.css';

export function PracticesSection({ t }: { t: (key: string) => string }) {
  return (
    <section className={styles.section} id="practices">
      <div className={styles.inner}>
        <Reveal>
          <p className="eyebrow">{t('practices.eyebrow')}</p>
          <h2 className={styles.headline}>{t('practices.headline')}</h2>
        </Reveal>
        <div className={styles.grid}>
          {PRACTICE_ORDER.map((id, index) => {
            const p = getPractice(id);
            return (
              <Reveal key={id} delay={index * 80}>
                <article className={styles.card}>
                  <h3 className={styles.name}>{p.shortName}</h3>
                  <p className={styles.line}>{p.street}</p>
                  <p className={styles.line}>{p.postalCode} {p.city}</p>
                  <p className={styles.line}>{t('practices.hours')}</p>
                  <div className={styles.actions}>
                    <a className={styles.link} href={`tel:${p.phone}`}>{p.phoneDisplay}</a>
                    <a className={styles.link} href={p.mapsUrl} target="_blank" rel="noreferrer">
                      {t('practices.directions')}
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 10: Run the practices test and confirm it passes**

Run: `pnpm test:unit PracticesSection`
Expected: PASS, 3 tests.

- [ ] **Step 11: Create `site/components/content/ClosingCta.module.css`**

```css
.section { position: relative; overflow: hidden; }
.image { object-fit: cover; }
.scrim { position: absolute; inset: 0; background: rgba(20, 12, 7, 0.78); }

.inner {
  position: relative; z-index: 2;
  max-width: var(--container-max);
  margin-inline: auto;
  padding: var(--space-9) var(--gutter);
  display: flex; flex-direction: column; align-items: center; text-align: center;
}

.headline {
  font-family: var(--font-display);
  font-weight: var(--fw-display-regular);
  font-size: clamp(2rem, 3.8vw, var(--text-display-lg));
  letter-spacing: var(--tracking-display);
  color: var(--text-on-dark);
  margin: 0;
}

.body {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--fw-light);
  color: rgba(245, 240, 230, 0.8);
  margin: var(--space-4) 0 var(--space-6);
  max-width: 42ch;
}
```

- [ ] **Step 12: Create `site/components/content/ClosingCta.tsx`**

```tsx
'use client';

import Image from 'next/image';
import { useLocation } from '@/lib/LocationProvider';
import { bookingHref } from '@/lib/booking';
import { Button } from '@/components/system/Button';
import styles from './ClosingCta.module.css';

export function ClosingCta({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const { practice } = useLocation();
  return (
    <section className={styles.section}>
      <Image className={styles.image} src={practice.images.closing} alt="" fill sizes="100vw" />
      <div className={styles.scrim} />
      <div className={styles.inner}>
        <h2 className={styles.headline}>{t('closing.headline')}</h2>
        <p className={styles.body}>{t('closing.body')}</p>
        <Button href={bookingHref(practice)} size="lg">
          {t('nav.bookAt', { practice: practice.shortName })}
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add proof band, practices section, and closing CTA"
```

---

## Task 16: Compose the page

**Files:**
- Modify: `site/app/[locale]/page.tsx`
- Create: `site/components/PageShell.tsx`
- Test: `site/tests/e2e/page.spec.ts`

**Interfaces:**
- Consumes: everything built so far.
- Produces: the assembled landing page at `/en`, with `?praxis=` seeding the initial practice.

- [ ] **Step 1: Create `site/components/PageShell.tsx`**

The provider, header, and sticky bar are client components; the page's content is composed inside them.

```tsx
'use client';

import { LocationProvider } from '@/lib/LocationProvider';
import { SiteHeader } from '@/components/chrome/SiteHeader';
import { StickyBookingBar } from '@/components/chrome/StickyBookingBar';
import type { LocationId } from '@/lib/locations';
import type { Locale } from '@/lib/i18n';

export function PageShell({
  children,
  t,
  locale,
  initialLocation,
}: {
  children: React.ReactNode;
  t: (key: string, values?: Record<string, string | number>) => string;
  locale: Locale;
  initialLocation?: LocationId;
}) {
  return (
    <LocationProvider initialLocation={initialLocation}>
      <SiteHeader t={t} locale={locale} />
      <main id="content">{children}</main>
      <StickyBookingBar t={t} />
    </LocationProvider>
  );
}
```

- [ ] **Step 2: Replace `site/app/[locale]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import { getMessages, isLocale, translator } from '@/lib/i18n';
import { PRACTICES, type LocationId } from '@/lib/locations';
import { PageShell } from '@/components/PageShell';
import { Hero } from '@/components/walk/Hero';
import { StepSection } from '@/components/walk/StepSection';
import { TreatmentSchedule } from '@/components/content/TreatmentSchedule';
import { CostPanel } from '@/components/content/CostPanel';
import { ProofBand } from '@/components/content/ProofBand';
import { PracticesSection } from '@/components/content/PracticesSection';
import { ClosingCta } from '@/components/content/ClosingCta';
import { SiteFooter } from '@/components/chrome/SiteFooter';
import { LoungeSection, RoomSection } from '@/components/walk/StepSections';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ praxis?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { praxis } = await searchParams;
  const initialLocation =
    praxis && praxis in PRACTICES ? (praxis as LocationId) : undefined;

  const t = translator(await getMessages(locale));

  return (
    <>
      <PageShell t={t} locale={locale} initialLocation={initialLocation}>
        <Hero t={t} />
        <LoungeSection t={t} />
        <TalkSection t={t} />
        <RoomSection t={t} />
        <CostPanel t={t} />
        <ProofBand t={t} />
        <PracticesSection t={t} />
        <ClosingCta t={t} />
      </PageShell>
      <SiteFooter t={t} />
    </>
  );
}

function TalkSection({ t }: { t: (key: string, values?: Record<string, string | number>) => string }) {
  return <TalkSectionClient t={t} />;
}

// Re-exported from StepSections so the image can follow the selected practice.
import { TalkSectionClient } from '@/components/walk/StepSections';
```

- [ ] **Step 3: Create `site/components/walk/StepSections.tsx`**

These wrap `StepSection` so each one reads the currently selected practice's imagery.

```tsx
'use client';

import { useLocation } from '@/lib/LocationProvider';
import { StepSection } from './StepSection';
import { TreatmentSchedule } from '@/components/content/TreatmentSchedule';

type T = (key: string, values?: Record<string, string | number>) => string;

export function LoungeSection({ t }: { t: T }) {
  const { practice } = useLocation();
  return (
    <StepSection
      anchor="step-lounge"
      eyebrow={t('lounge.eyebrow')}
      headline={t('lounge.headline')}
      body={t('lounge.body')}
      note={t('lounge.hours')}
      image={practice.images.lounge}
      imageSide="left"
      tone="dark"
    />
  );
}

export function TalkSectionClient({ t }: { t: T }) {
  const { practice } = useLocation();
  return (
    <StepSection
      anchor="step-talk"
      eyebrow={t('talk.eyebrow')}
      headline={t('talk.headline')}
      body={t('talk.body')}
      image={practice.images.consultation}
      imageSide="right"
      tone="light"
    >
      <TreatmentSchedule t={t} />
    </StepSection>
  );
}

export function RoomSection({ t }: { t: T }) {
  const { practice } = useLocation();
  return (
    <StepSection
      anchor="step-room"
      eyebrow={t('room.eyebrow')}
      headline={t('room.headline')}
      body={t('room.body')}
      note={t('room.clinician')}
      image={practice.images.treatmentRoom}
      imageSide="left"
      tone="dark"
    />
  );
}
```

Then simplify `page.tsx` — delete the `TalkSection` wrapper function and the trailing import, and use `<TalkSectionClient t={t} />` directly in the tree, importing it alongside `LoungeSection` and `RoomSection` at the top.

- [ ] **Step 4: Run the whole unit suite**

Run: `pnpm test:unit`
Expected: PASS, all tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: compose the landing page from the walk's sections"
```

---

# Phase 6 — Assets, search, and verification

## Task 17: Source and verify the photography

**Files:**
- Create: `site/public/images/mitte/*.jpg`, `site/public/images/charlottenburg/*.jpg`
- Create: `site/public/images/CREDITS.md`

**Interfaces:**
- Consumes: `ImageSlot` from `@/lib/locations`.
- Produces: twelve verified image files at the exact paths `locations.ts` already references.

- [ ] **Step 1: Source the Mitte set**

Six images: `entrance`, `lounge`, `consultation`, `treatment-room`, `detail`, `closing`.

Search Unsplash and Pexels for **warm, low-lit, dark-wood interiors** — boutique hotel lobbies, private members' clubs, panelled rooms, brass fittings, lamplight, deep shadow. Useful queries: `dark wood hotel lobby lamp`, `private club interior brass`, `warm interior evening lamplight`, `panelled room armchair`.

**Reject on sight:** anything blue-white or clinical, any dental equipment, any gloved hands, any person's face, any before/after.

- [ ] **Step 2: Source the Charlottenburg set**

Same six slots, opposite register: **Gründerzeit stucco, tall bay windows, herringbone parquet, pale plaster, cream and blush textiles, marble, daylight.** Queries: `stucco ceiling apartment berlin`, `herringbone parquet bay window`, `pale cream living room moulding`, `altbau interior daylight`.

- [ ] **Step 3: Verify every URL resolves before downloading**

```bash
for url in $URLS; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
  echo "$code  $url"
done
```

Expected: every line `200`. A 404 means that image does not exist — find another; never ship a broken path.

- [ ] **Step 4: Download, resize, and convert**

```bash
cd site/public/images
mkdir -p mitte charlottenburg
# per image:
curl -L "$URL" -o mitte/entrance.jpg
ffmpeg -y -i mitte/entrance.jpg -vf "scale=2400:-2" -q:v 3 mitte/entrance.jpg
```

2400px wide is enough for a full-bleed hero on a 2× display without shipping 8MB. Next.js generates the responsive AVIF/WebP variants at build time.

- [ ] **Step 5: Write `site/public/images/CREDITS.md`**

```markdown
# Image credits and swap list

**Every image here is licensed placeholder stock.** None depicts the actual
Zaritzki practices. Replace all twelve before launch, or confirm the practice
is content to publish stock interiors.

Sourced under the Unsplash / Pexels licence. No image depicts a patient, a
procedure, a before/after, or an identifiable person — required under HWG.

| Slot | File | Source URL | Photographer | Licence |
|---|---|---|---|---|
| Mitte · entrance | `mitte/entrance.jpg` | … | … | Unsplash |
| … | | | | |

## What to commission if real photography becomes possible

- **entrance** — the street door at dusk, brass numerals legible, shot from outside at eye level.
- **lounge** — the waiting room, lamplight, no people.
- **consultation** — where the conversation happens; a desk and two chairs, not a surgery.
- **treatmentRoom** — the chair, lit warmly, no instruments in focus.
- **detail** — one material close up: brass, oak, wool, or parquet.
- **closing** — a wide, quiet room, space at the top for a headline.
```

- [ ] **Step 6: Verify the build optimises them**

```bash
cd site && pnpm build && pnpm start
```

Open `/en`, and confirm in the network panel that images are served as AVIF or WebP, not the source JPEGs.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add verified placeholder photography for both practices"
```

---

## Task 18: Structured data and metadata

**Files:**
- Create: `site/components/seo/PracticeJsonLd.tsx`
- Modify: `site/app/[locale]/layout.tsx`
- Test: `site/tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `PRACTICE_ORDER`, `getPractice`.
- Produces: one `Dentist` JSON-LD block per practice.

- [ ] **Step 1: Write the failing test**

Create `site/tests/e2e/seo.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('emits one Dentist record per practice with correct address and hours', async ({ page }) => {
  await page.goto('/en');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const records = blocks.map((b) => JSON.parse(b));
  const dentists = records.filter((r) => r['@type'] === 'Dentist');

  expect(dentists).toHaveLength(2);

  const mitte = dentists.find((d) => d.address.streetAddress === 'Jägerstraße 41');
  expect(mitte).toBeDefined();
  expect(mitte.address.postalCode).toBe('10117');
  expect(mitte.telephone).toBe('+493085403000');
  expect(mitte.openingHoursSpecification[0].opens).toBe('08:00');
  expect(mitte.openingHoursSpecification[0].closes).toBe('20:00');
});

test('does not emit self-serving review markup', async ({ page }) => {
  await page.goto('/en');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  for (const block of blocks) {
    expect(block).not.toContain('aggregateRating');
    expect(block).not.toContain('"review"');
  }
});

test('sets the document language and a descriptive title', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Zaritzki Fine Dentistry/);
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm test:e2e seo`
Expected: FAIL — no JSON-LD present.

- [ ] **Step 3: Create `site/components/seo/PracticeJsonLd.tsx`**

```tsx
import { PRACTICE_ORDER, getPractice } from '@/lib/locations';

/**
 * aggregateRating and review are deliberately omitted. Google's structured-data
 * policy disallows self-serving review markup for a business's own reviews, and
 * these ratings already live on Google. They are displayed on the page; they are
 * not claimed in markup.
 */
export function PracticeJsonLd() {
  return (
    <>
      {PRACTICE_ORDER.map((id) => {
        const p = getPractice(id);
        const record = {
          '@context': 'https://schema.org',
          '@type': 'Dentist',
          name: p.legalName,
          address: {
            '@type': 'PostalAddress',
            streetAddress: p.street,
            postalCode: p.postalCode,
            addressLocality: p.city,
            addressCountry: 'DE',
          },
          telephone: p.phone,
          areaServed: 'Berlin',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: p.hours.days.map(
                (d) =>
                  ({ Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday' })[d],
              ),
              opens: p.hours.opens,
              closes: p.hours.closes,
            },
          ],
          hasMap: p.mapsUrl,
        };
        return (
          <script
            key={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(record) }}
          />
        );
      })}
    </>
  );
}
```

- [ ] **Step 4: Render it in `site/app/[locale]/layout.tsx`**

Add the import and place `<PracticeJsonLd />` immediately after the direction-contract comment inside `<body>`.

- [ ] **Step 5: Run the test and confirm it passes**

Run: `pnpm test:e2e seo`
Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add per-practice Dentist structured data without review markup"
```

---

## Task 19: End-to-end behaviour, accessibility, and the anti-goal guard

**Files:**
- Create: `site/tests/e2e/conversion.spec.ts`, `site/tests/e2e/a11y.spec.ts`, `site/tests/e2e/no-js.spec.ts`, `site/tests/e2e/voice.spec.ts`

**Interfaces:**
- Consumes: the assembled page.
- Produces: the verification gate the spec requires.

- [ ] **Step 1: Write the conversion tests**

Create `site/tests/e2e/conversion.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('a booking action is visible in the first viewport before any scrolling', async ({ page }) => {
  await page.goto('/en');
  const cta = page.getByRole('link', { name: /Book a first consultation/ }).first();
  await expect(cta).toBeInViewport();
});

test('the sticky bar stays hidden over the hero and appears after it', async ({ page }) => {
  await page.goto('/en');
  const bar = page.getByTestId('sticky-bar');
  await expect(bar).toHaveAttribute('data-visible', 'false');
  await page.getByRole('link', { name: 'The talk' }).click();
  await expect(bar).toHaveAttribute('data-visible', 'true');
});

test('switching practice changes address, imagery, and booking destination together', async ({ page }) => {
  await page.goto('/en');
  const before = await page.getByTestId('hero-image').getAttribute('src');
  await expect(page.getByText('Private Zahnarztpraxis · Berlin Mitte')).toBeVisible();

  await page.getByRole('radio', { name: 'Charlottenburg' }).click();

  await expect(page.getByText('Private Zahnarztpraxis · Berlin Charlottenburg')).toBeVisible();
  const after = await page.getByTestId('hero-image').getAttribute('src');
  expect(after).not.toBe(before);
  await expect(page.getByRole('link', { name: /Book at Charlottenburg/ })).toBeVisible();
});

test('the practice choice survives a reload', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('radio', { name: 'Charlottenburg' }).click();
  await page.reload();
  await expect(page.getByRole('radio', { name: 'Charlottenburg' })).toBeChecked();
});

test('a shared ?praxis= link opens on that practice', async ({ page }) => {
  await page.goto('/en?praxis=charlottenburg');
  await expect(page.getByText('Private Zahnarztpraxis · Berlin Charlottenburg')).toBeVisible();
});

test('the step rail navigates and tracks position', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('link', { name: 'The room' }).click();
  await expect(page.locator('#step-room')).toBeInViewport();
  await expect(page.getByRole('link', { name: 'The room' })).toHaveAttribute('aria-current', 'step');
});
```

- [ ] **Step 2: Write the accessibility test**

Create `site/tests/e2e/a11y.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/en');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('every interactive element is reachable and visibly focused by keyboard', async ({ page }) => {
  await page.goto('/en');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /Skip to content/ })).toBeFocused();

  const outline = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    return getComputedStyle(el).outlineStyle;
  });
  expect(outline).not.toBe('none');
});

test('honours prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');
  const duration = await page.evaluate(() => {
    const el = document.querySelector('[class*="reveal"]');
    return el ? getComputedStyle(el).transitionDuration : '0s';
  });
  expect(['0s', '0.01ms']).toContain(duration);
});

test('has exactly one h1', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toHaveCount(1);
});
```

- [ ] **Step 3: Write the no-JavaScript test**

Create `site/tests/e2e/no-js.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('the page is complete and both practices reachable without JavaScript', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A calmer kind of dental visit');
  await expect(page.getByText('Jägerstraße 41').first()).toBeVisible();
  await expect(page.getByText('Kurfürstendamm 52').first()).toBeVisible();
  await expect(page.getByText(/We cannot treat statutory patients/)).toBeVisible();
  await expect(page.getByRole('link', { name: /030 854 030 00/ }).first()).toBeVisible();
});
```

- [ ] **Step 4: Write the voice and anti-goal guard**

Create `site/tests/e2e/voice.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const BANNED = [
  // Urgency and scarcity
  'limited', 'hurry', 'act now', 'don\'t miss', 'only today', 'book now',
  // Superlatives
  'best dentist', 'world-class', 'world class', 'painless', 'guaranteed',
  // The practice's own Doctolib marketing register — facts from it are welcome,
  // these phrasings are not. See HANDOFF.md §5.7.
  'first address', 'first-class', 'exclusive', 'state of the art',
  'demanding patients', 'demanding private patients', 'new era', 'sophisticated dentistry',
];

test('carries no urgency, scarcity, or superlative language', async ({ page }) => {
  await page.goto('/en');
  const text = ((await page.locator('body').textContent()) ?? '').toLowerCase();
  for (const phrase of BANNED) {
    expect(text, `found banned phrase: ${phrase}`).not.toContain(phrase);
  }
});

test('contains no exclamation marks and no emoji', async ({ page }) => {
  await page.goto('/en');
  const text = (await page.locator('body').textContent()) ?? '';
  expect(text).not.toContain('!');
  expect(/\p{Extended_Pictographic}/u.test(text)).toBe(false);
});

test('states the insurance position before the visitor can book', async ({ page }) => {
  await page.goto('/en');
  await expect(
    page.getByText('Privately insured and self-paying patients · Monday to Friday, 08:00–20:00'),
  ).toBeInViewport();
});
```

- [ ] **Step 5: Run the whole end-to-end suite**

Run: `pnpm test:e2e`
Expected: PASS on both the desktop and mobile projects. Fix any failure before continuing — these are the spec's acceptance criteria, not advisory.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: add conversion, accessibility, no-JS, and voice guards"
```

---

## Task 20: Design detector, finish review, and documentation

**Files:**
- Create: `DESIGN.md` (written by the documenter, not by hand)
- Create: `site/screenshots/desktop.png`, `site/screenshots/mobile.png`

**Interfaces:**
- Consumes: the finished build.
- Produces: the run's exit condition, as the direction contract's FINISH line requires.

- [ ] **Step 1: Run the mechanical design detector once**

```bash
node "C:/Users/Lam/.claude/skills/impeccable/scripts/detect.mjs" --json \
  site/app site/components site/styles
```

Fix everything mechanical it reports. Pass anything remaining to the reviewer rather than arguing with it.

- [ ] **Step 2: Capture desktop and mobile screenshots in one batched round**

```bash
cd site && pnpm build && pnpm start &
npx playwright screenshot --viewport-size=1440,900 --full-page http://localhost:3000/en screenshots/desktop.png
npx playwright screenshot --viewport-size=390,844 --full-page http://localhost:3000/en screenshots/mobile.png
```

- [ ] **Step 3: Inspect both, fix material gaps in one batch, and recapture once**

Two rounds is the ceiling. Check specifically: the CTA hugs its label at both widths; the step rail sticks on desktop and scrolls on mobile; text over photography holds contrast; nothing overflows horizontally; the pale Charlottenburg imagery still reads inside the espresso chrome.

- [ ] **Step 4: Spawn the finish reviewer**

Spawn `impeccable-finish-reviewer` fresh, with no inherited conversation. Pass: the original request, the confirmed answers, `site/app/[locale]/page.tsx`, both screenshot paths, the direction contract from the layout, any remaining detector findings, and the craft-floor reference path. Apply its material fixes in one batch, recapture, and send back for a verdict.

- [ ] **Step 5: Spawn the documenter**

Spawn `impeccable-documenter` with the project root, the artifact path, the direction contract, `PRODUCT.md`, and the `document.md` reference path. It writes `DESIGN.md` from the built world.

**`DESIGN.md` must not be hand-written before this point.** A rulebook written ahead of the build gets defended against reality instead of describing it.

- [ ] **Step 6: Hand the user the replacement checklist**

```bash
cd site && pnpm pending
```

Report that list, plus:

- All twelve images are licensed stock and need replacing or approving.
- The German page remains required.
- **Before this goes live as the practice's own site:** `/impressum` and `/datenschutz` are statutory obligations under German law and currently 404. Deferred by agreement while this is a pitch artifact.
- **While it is a pitch artifact:** host it somewhere that reads as a proposal — a staging or agency URL — rather than at an address a patient could mistake for the practice's official site. Every practice fact on the page is real; the photography and prices are not.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs: record the built design system and finish the review cycle"
```

---

## Self-review notes

**Spec coverage.** Every section of the spec maps to a task: §3 the walk (Tasks 10–12, 16), §4 locations (Tasks 4, 5, 7), §5 scope boundaries (Global Constraints), §6 imagery and pending facts (Tasks 4, 17), §7 interaction and layout (Tasks 7–15), §8 architecture (Tasks 1–3, 18), §9 verification (Task 19), §10 deferrals (recorded in `i18n.ts` and `LocaleSwitch.tsx`), §11 open decisions (enforced by the `Pending<T>` type).

**Two gaps found and closed while reviewing:** the spec's `/impressum` and `/datenschutz` links had no owner, so Task 9 now flags them explicitly as a statutory obligation outside this build; and the sticky bar needed a signal for when the hero has left, which is why Task 10 owns the `data-past-hero` sentinel that Task 8 observes.

**Naming consistency:** `Pending<T>` uses `known` as its discriminant throughout (`pending.ts`, `locations.ts`, `booking.ts`, `list-pending.ts`, and all tests). `bookingHref` and `bookingIsFallback` keep their names across Tasks 5, 7, 8, 10, and 15. Step anchors are `step-street`, `step-lounge`, `step-talk`, `step-room`, `step-leaving` in `steps.ts`, `StepSections.tsx`, `CostPanel.tsx`, and the end-to-end tests.
