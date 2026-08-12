import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/en');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

/** Everything the page offers to a keyboard, in document order. */
const INTERACTIVE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The brass the system draws focus rings in: --focus-ring / --gold
 * rgba(181,138,62,·), and --gold-light #CDA75E where SiteFooter recolours the
 * ring for its cocoa ground. Matched on the channel triple rather than the whole
 * rgba() string because the mobile project's deviceScaleFactor 3 quantises the
 * 0.55 alpha to 0.533 and a 2px ring to 1.938077px.
 */
const BRASS = ['181, 138, 62', '205, 167, 94'];

/** Attribute holding an element's resting box-shadow, stamped before focusing. */
const REST_ATTR = 'data-ring-rest';

/**
 * Runs in the page. True only when the focused element paints a real focus ring:
 * a brass outline of non-zero width, or a brass box-shadow that has non-zero
 * geometry AND differs from the element's resting shadow. The last clause is
 * what stops a decorative brass shadow — --shadow-gold is
 * `0 6px 24px rgba(181,138,62,0.28)` and Button.module.css applies it on hover —
 * from being mistaken for a focus indicator.
 */
function focusedElementDrawsRing(brass: string[]): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body || el === document.documentElement) return false;

  const style = getComputedStyle(el);
  const isBrass = (value: string) => brass.some((channel) => value.includes(channel));
  /** rgba(…, 0) is fully transparent and paints nothing. */
  const isPainted = (value: string) => !/rgba\([^)]*,\s*0\s*\)/.test(value);

  const outlineDrawn =
    style.outlineStyle !== 'none' &&
    Number.parseFloat(style.outlineWidth) > 0 &&
    isBrass(style.outlineColor) &&
    isPainted(style.outlineColor);

  const shadow = style.boxShadow;
  const lengths = (shadow.replace(/rgba?\([^)]*\)/g, '').match(/-?\d*\.?\d+px/g) ?? []).map(
    Number.parseFloat,
  );
  const shadowDrawn =
    shadow !== 'none' &&
    isBrass(shadow) &&
    isPainted(shadow) &&
    lengths.some((length) => length !== 0) &&
    shadow !== el.getAttribute('data-ring-rest');

  return outlineDrawn || shadowDrawn;
}

test('every interactive element is reachable and visibly focused by keyboard', async ({ page }, testInfo) => {
  // Reduced motion floors every transition at 0.01ms (globals.css). Without it
  // the location switch's 140ms box-shadow transition can still be at its
  // transparent start value when the ring is read.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');

  // The mobile project runs WebKit — devices['iPhone 13'].defaultBrowserType is
  // 'webkit' — and Safari's default is that Tab reaches form controls only, so
  // the first tab stop differs by engine. This is a browser-engine choice in
  // playwright.config.ts, not a page defect: Chromium at the same iPhone 13
  // metrics tabs through every link. Both projects still assert that Tab reaches
  // the first focusable element and that it carries a visible focus ring.
  const firstStop =
    testInfo.project.name === 'desktop'
      ? page.getByRole('link', { name: /Skip to content/ })
      : page.getByRole('radio', { name: 'Mitte' });

  await firstStop.evaluate((el, attr) => {
    el.setAttribute(attr, getComputedStyle(el).boxShadow);
  }, REST_ATTR);

  await page.keyboard.press('Tab');
  await expect(firstStop).toBeFocused();

  // Polled on animation frames rather than read once: a settled ring resolves on
  // the first frame, a missing one fails on a bounded timeout. No sleep.
  const ringed = await page
    .waitForFunction(focusedElementDrawsRing, BRASS, { timeout: 2000 })
    .then(() => true)
    .catch(() => false);

  const focus = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const style = getComputedStyle(el);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineColor: style.outlineColor,
      boxShadow: style.boxShadow,
    };
  });

  expect(
    ringed,
    `the first tab stop draws no --focus-ring indicator: ${JSON.stringify(focus)}`,
  ).toBe(true);
});

test('the whole tab order is walkable and every stop shows the focus ring', async ({ page }, testInfo) => {
  // The focus ring on the location switch is transitioned over 140ms, so a style
  // read taken immediately after Tab catches it mid-transition. Reduced motion
  // floors every transition at 0.01ms (globals.css), so each stop's ring is at
  // its final value by the time it is read. This is the page's own mechanism,
  // not a sleep.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');

  // Tag everything the page offers a keyboard so the walk can be compared to it
  // by identity rather than by selector, and stamp each resting box-shadow so a
  // decorative brass shadow cannot later be mistaken for a focus ring.
  await page.evaluate(
    ([selector, attr]) => {
      document.querySelectorAll(selector).forEach((el, index) => {
        el.setAttribute('data-kbd', String(index));
        el.setAttribute(attr, getComputedStyle(el).boxShadow);
      });
    },
    [INTERACTIVE, REST_ATTR] as const,
  );

  // Enumerated before the walk, at the top of the page. Everything here is
  // present regardless of scroll position, so the expected set cannot shift
  // underneath the walk. The sticky booking bar is deliberately excluded from
  // the *expected* set: it is visibility:hidden until the hero leaves the
  // viewport, so its two controls come and go with scroll and cannot be a
  // required stop. On desktop the walk does reach both of them once scrolling
  // reveals the bar, and their rings are then asserted like any other stop —
  // they are simply not demanded. conversion.spec.ts owns the bar's appearance
  // and its data-visible flip.
  const offered = await page.evaluate((selector) => {
    return [...document.querySelectorAll(selector)]
      .filter((el) => {
        const node = el as HTMLElement;
        if (node.tabIndex < 0 || node.hasAttribute('disabled')) return false;
        const style = getComputedStyle(node);
        if (style.visibility === 'hidden' || style.display === 'none') return false;
        return node.getClientRects().length > 0;
      })
      .map((el) => ({
        id: el.getAttribute('data-kbd') as string,
        tag: el.tagName,
        label: `${el.tagName}:${(el.textContent ?? '').trim().slice(0, 30)}`,
      }));
  }, INTERACTIVE);

  const visited: string[] = [];
  const ringless: string[] = [];

  for (let step = 0; step < 80; step += 1) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body || el === document.documentElement) return null;
      return {
        id: el.getAttribute('data-kbd'),
        label: `${el.tagName}:${(el.textContent ?? '').trim().slice(0, 30)}`,
      };
    });

    if (!stop?.id || visited.includes(stop.id)) break;
    visited.push(stop.id);

    const ringed = await page
      .waitForFunction(focusedElementDrawsRing, BRASS, { timeout: 2000 })
      .then(() => true)
      .catch(() => false);

    if (!ringed) ringless.push(stop.label);
  }

  // The mobile project runs WebKit (devices['iPhone 13'].defaultBrowserType is
  // 'webkit'), where Safari's default is that Tab reaches form controls only, so
  // there the reachable set is the form controls. Chromium at the same iPhone 13
  // metrics tabs through all of them — this is an engine choice in
  // playwright.config.ts, not a page defect. Desktop carries the full
  // requirement: every interactive element on the page, links included.
  const expected =
    testInfo.project.name === 'desktop' ? offered : offered.filter((el) => el.tag !== 'A');

  // Canary against a silently collapsing enumeration: the page currently offers
  // 20 scroll-independent interactive elements on desktop, of which 1 is a form
  // control. Losing any of them should fail here rather than pass vacuously.
  expect(expected.length).toBeGreaterThanOrEqual(testInfo.project.name === 'desktop' ? 20 : 1);
  expect(
    expected.filter((el) => !visited.includes(el.id)).map((el) => el.label),
    'these interactive elements are not reachable by Tab',
  ).toEqual([]);
  expect(ringless, 'these tab stops draw no --focus-ring indicator').toEqual([]);
});

test('honours prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');
  const duration = await page.evaluate(() => {
    const el = document.querySelector('[class*="reveal"]');
    return el ? getComputedStyle(el).transitionDuration : '0s';
  });
  // globals.css floors transitions at 0.01ms under reduced motion. Chromium
  // serialises that as "1e-05s" and WebKit as "0.00001s" — the two projects run
  // different engines. Compare the value, not its spelling.
  const ms = duration.trim().endsWith('ms')
    ? Number.parseFloat(duration)
    : Number.parseFloat(duration) * 1000;
  expect(ms).toBeLessThanOrEqual(0.01);
});

test('has exactly one h1', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toHaveCount(1);
});
