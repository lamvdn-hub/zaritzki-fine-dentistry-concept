import { test, expect, type Page } from '@playwright/test';
import {
  clipToViewport,
  hitTestCentre,
  rectsOverlap,
  scrollBackToTop,
  scrollPastHero,
  settleStickyBar,
  stableViewportBox,
} from './settle';

/**
 * Short viewports — the ones where `headerHeight + heroHeight > viewportHeight`,
 * which is every phone and tablet the page will actually meet. 390x664 is the
 * `mobile` project's own device (iPhone 13); 320x568 is the narrowest supported
 * size; 740x360 is a phone held sideways.
 */
const SHORT_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 390, height: 664 },
  { width: 740, height: 360 },
];

for (const viewport of SHORT_VIEWPORTS) {
  const label = `${viewport.width}x${viewport.height}`;

  test(`the sticky bar never covers the hero at ${label} and still appears after the hero`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/en');
    await settleStickyBar(page);

    const bar = page.getByTestId('sticky-bar');
    const heroCta = page
      .locator('#step-street')
      .getByRole('link', { name: /Book a first consultation/ });

    // --- at rest, scroll position 0, after hydration has settled ---
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    // Real geometry, in viewport coordinates, once the slide transition has
    // come to rest. Rects are clipped to the viewport: a bar parked below the
    // fold has nothing painted and therefore covers nothing, while the hero
    // legitimately continues past the bottom of a short screen.
    const barBox = clipToViewport(await stableViewportBox(bar), viewport);
    const ctaBox = clipToViewport(await stableViewportBox(heroCta), viewport);
    const heroBox = clipToViewport(await stableViewportBox(page.locator('#step-street')), viewport);

    expect(
      rectsOverlap(barBox, heroBox),
      `at ${label} the sticky bar ${JSON.stringify(barBox)} must not be painted over the hero ${JSON.stringify(heroBox)}`,
    ).toBe(false);
    expect(
      rectsOverlap(barBox, ctaBox),
      `at ${label} the sticky bar ${JSON.stringify(barBox)} must not be painted over the hero CTA ${JSON.stringify(ctaBox)}`,
    ).toBe(false);

    // Whatever the reader can see at the very bottom of the first screen must
    // belong to the hero, not to fixed chrome docked on top of it.
    const atBottomEdge = await page.evaluate(() => {
      const hit = document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 4);
      return {
        inHero: hit !== null && hit.closest('#step-street') !== null,
        inStickyBar: hit !== null && hit.closest('[data-testid="sticky-bar"]') !== null,
        tag: hit === null ? 'nothing' : hit.tagName.toLowerCase(),
      };
    });
    expect(
      atBottomEdge,
      `at ${label} the bottom edge of the first screen must still be the hero`,
    ).toMatchObject({ inHero: true, inStickyBar: false });

    // On viewports where the hero CTA's own centre is on screen, it must be the
    // thing a finger lands on. On the shortest viewports the hero is taller than
    // the fold and the button is genuinely below it, which is layout, not paint.
    const ctaCentreOnScreen = await heroCta.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const y = rect.top + rect.height / 2;
      return y >= 0 && y <= window.innerHeight;
    });
    if (ctaCentreOnScreen) {
      const hit = await hitTestCentre(heroCta);
      expect(
        hit,
        `at ${label} the hero CTA must be the topmost element at its own centre`,
      ).toMatchObject({ isTopmost: true, occludedByStickyBar: false });
    }

    await expect(bar).not.toBeInViewport();
    await expect(bar).toHaveAttribute('data-visible', 'false');

    // --- after the hero has genuinely left the viewport, the bar must appear ---
    await scrollPastHero(page);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(page.locator('body')).toHaveAttribute('data-past-hero', 'true');
    await expect(bar).toHaveAttribute('data-visible', 'true');
    await expect(bar).toBeInViewport();

    // --- and it must go away again on the way back up ---
    await scrollBackToTop(page);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator('body')).toHaveAttribute('data-past-hero', 'false');
    await expect(bar).toHaveAttribute('data-visible', 'false');
    await expect(bar).not.toBeInViewport();
  });
}

/* -------------------------------------------------------------------------- */
/* Hero copy contrast over the photograph                                      */
/* -------------------------------------------------------------------------- */

type ContrastStats = { min: number; p5: number; median: number; fracBelow45: number };

/**
 * Measures each hero text element against the ground it is actually composited
 * over: the element's own text is hidden, the viewport is screenshotted, and
 * every pixel of the element's box is scored with the WCAG relative-luminance
 * contrast formula against that element's computed colour.
 *
 * The median is the reported figure. The box includes inter-glyph gaps, so the
 * per-pixel minimum is dominated by pixels no glyph ever covers; the median is
 * the honest summary of what the text sits on.
 */
async function measureHeroContrast(page: Page): Promise<Record<string, ContrastStats>> {
  await page.waitForFunction(() => {
    const image = document.querySelector('[data-testid="hero-image"]') as HTMLImageElement | null;
    return image !== null && image.complete && image.naturalWidth > 0;
  });

  const targets = await page.evaluate(() => {
    const headline = document.querySelector('#hero-headline') as HTMLElement;
    const inner = headline.parentElement as HTMLElement;
    const children = Array.from(inner.children) as HTMLElement[];
    const eyebrow = children.find((node) => node.classList.contains('eyebrow')) as HTMLElement;
    const paragraphs = children.filter((node) => node.tagName === 'P' && node !== eyebrow);
    const describe = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return {
        rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
        color: getComputedStyle(element).color,
      };
    };

    return {
      eyebrow: describe(eyebrow),
      headline: describe(headline),
      lede: describe(paragraphs[0]),
      qualifier: describe(paragraphs[1]),
    };
  });

  const hidden = await page.addStyleTag({
    content: '#step-street .eyebrow, #step-street h1, #step-street p { visibility: hidden !important; }',
  });
  const shot = await page.screenshot({ type: 'png', scale: 'css' });
  await page.evaluate((node) => node.remove(), hidden);

  return page.evaluate(
    async ({ base64, targets: boxes }) => {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = `data:image/png;base64,${base64}`;
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      const scale = image.width / document.documentElement.clientWidth;

      const linear = (channel: number) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
      };
      const luminance = (r: number, g: number, b: number) =>
        0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
      const ratio = (a: number, b: number) =>
        (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const parse = (value: string) => {
        const parts = value.match(/rgba?\(([^)]+)\)/)![1].split(',').map(Number);
        return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
      };

      const results: Record<string, { min: number; p5: number; median: number; fracBelow45: number }> = {};
      for (const [name, target] of Object.entries(boxes)) {
        const x0 = Math.max(0, Math.round(target.rect.left * scale));
        const y0 = Math.max(0, Math.round(target.rect.top * scale));
        const x1 = Math.min(canvas.width, Math.round(target.rect.right * scale));
        const y1 = Math.min(canvas.height, Math.round(target.rect.bottom * scale));
        const pixels = context.getImageData(x0, y0, x1 - x0, y1 - y0).data;
        const foreground = parse(target.color);

        const contrasts: number[] = [];
        for (let i = 0; i < pixels.length; i += 4) {
          const ground = luminance(pixels[i], pixels[i + 1], pixels[i + 2]);
          const text = luminance(
            foreground.r * foreground.a + pixels[i] * (1 - foreground.a),
            foreground.g * foreground.a + pixels[i + 1] * (1 - foreground.a),
            foreground.b * foreground.a + pixels[i + 2] * (1 - foreground.a),
          );
          contrasts.push(ratio(text, ground));
        }
        contrasts.sort((a, b) => a - b);
        const at = (p: number) => contrasts[Math.floor((contrasts.length - 1) * p)];
        const round = (n: number) => Math.round(n * 100) / 100;

        results[name] = {
          min: round(at(0)),
          p5: round(at(0.05)),
          median: round(at(0.5)),
          fracBelow45: round((contrasts.filter((c) => c < 4.5).length / contrasts.length) * 100),
        };
      }
      return results;
    },
    { base64: shot.toString('base64'), targets },
  );
}

/**
 * Global constraint: "Text over photographic grounds holds WCAG AA."
 * The Charlottenburg entrance photograph is bright sandstone and sky, and the
 * hero scrim runs dark-to-light left-to-right, so narrow viewports push the
 * copy into the transparent end of the gradient. Mitte's photograph is dark and
 * has never been at risk, so it is measured here as the control.
 */
for (const practice of ['charlottenburg', 'mitte'] as const) {
  test(`hero copy over the ${practice} photograph holds AA at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/en?praxis=${practice}`);
    await expect(page.getByTestId('hero-image')).toBeVisible();

    const measured = await measureHeroContrast(page);

    for (const element of ['eyebrow', 'headline', 'lede', 'qualifier'] as const) {
      expect(
        measured[element].median,
        `${practice} hero ${element} at 320px: ${JSON.stringify(measured[element])}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
}
