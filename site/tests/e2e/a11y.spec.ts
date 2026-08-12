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

test('every interactive element is reachable and visibly focused by keyboard', async ({ page }, testInfo) => {
  await page.goto('/en');

  // Chromium's mobile emulation removes links from sequential focus navigation
  // — Tab visits form controls only — so the first tab stop differs by platform.
  // Both projects still assert that Tab reaches the first focusable element and
  // that it carries a visible focus ring.
  const firstStop =
    testInfo.project.name === 'desktop'
      ? page.getByRole('link', { name: /Skip to content/ })
      : page.getByRole('radio', { name: 'Mitte' });

  await page.keyboard.press('Tab');
  await expect(firstStop).toBeFocused();

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

  // The system draws the ring with --focus-ring, as an outline or — where a
  // clipping parent would crop one, as on the location switch's overflow:hidden
  // group — as an inset box-shadow. Either counts; nothing counts if it is
  // drawn in some other colour.
  const hasOutline =
    focus.outlineStyle !== 'none' && Number.parseFloat(focus.outlineWidth) > 0;
  expect(
    hasOutline || focus.boxShadow !== 'none',
    `no visible focus indicator: ${JSON.stringify(focus)}`,
  ).toBe(true);
  expect(
    `${focus.outlineColor} ${focus.boxShadow}`,
    'the focus indicator must be drawn with --focus-ring',
    // The channel triple, not the whole rgba() string: the mobile project's
    // emulation quantises the 0.55 alpha to 0.533 and the 2px ring to 1.938px.
  ).toContain('181, 138, 62');
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
  // by identity rather than by selector.
  await page.evaluate((selector) => {
    document
      .querySelectorAll(selector)
      .forEach((el, index) => el.setAttribute('data-kbd', String(index)));
  }, INTERACTIVE);

  // Enumerated before the walk, at the top of the page. Everything here is
  // present regardless of scroll position, so the expected set cannot shift
  // underneath the walk. The sticky booking bar is deliberately excluded: it is
  // visibility:hidden until the hero leaves the viewport, so its two controls
  // come and go with scroll. conversion.spec.ts owns that behaviour, and the
  // walk still checks the bar's ring whenever it reaches it.
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

    // Poll on animation frames rather than reading once: a settled ring resolves
    // on the first frame, and a missing one fails on a bounded timeout.
    const ringed = await page
      .waitForFunction(
        () => {
          const el = document.activeElement as HTMLElement | null;
          if (!el) return false;
          const style = getComputedStyle(el);
          const outline =
            style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) > 0
              ? style.outlineColor
              : '';
          // --focus-ring / --gold on light and espresso grounds, --gold-light
          // where the footer recolours the ring for its cocoa ground.
          const drawn = `${outline} ${style.boxShadow}`;
          return drawn.includes('181, 138, 62') || drawn.includes('205, 167, 94');
        },
        null,
        { timeout: 2000 },
      )
      .then(() => true)
      .catch(() => false);

    if (!ringed) ringless.push(stop.label);
  }

  // Chromium's mobile emulation drops links from sequential focus navigation, so
  // there the reachable set is the form controls. Desktop carries the full
  // requirement: every interactive element on the page, links included.
  const expected =
    testInfo.project.name === 'desktop' ? offered : offered.filter((el) => el.tag !== 'A');

  // Canary: if the enumeration ever collapses, the coverage assertion below
  // would pass vacuously.
  expect(expected.length).toBeGreaterThanOrEqual(testInfo.project.name === 'desktop' ? 15 : 1);
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
  // globals.css floors transitions at 0.01ms under reduced motion, which
  // getComputedStyle serialises as "1e-05s" or "0.00001s" depending on the
  // Chromium build. Compare the value, not its spelling.
  const ms = duration.trim().endsWith('ms')
    ? Number.parseFloat(duration)
    : Number.parseFloat(duration) * 1000;
  expect(ms).toBeLessThanOrEqual(0.01);
});

test('has exactly one h1', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toHaveCount(1);
});
