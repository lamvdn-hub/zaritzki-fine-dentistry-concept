import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The sticky booking bar is three asynchronous hops away from the truth it
 * displays: the hero's IntersectionObserver writes `body[data-past-hero]`,
 * a MutationObserver in the bar notices, and React re-renders `data-visible`.
 * None of that has happened in the server-rendered markup, where
 * `data-past-hero` is absent and `data-visible` is the literal string
 * "false".
 *
 * Asserting on `data-visible` without waiting therefore reads the pre-hydration
 * SSR state and passes regardless of what the client eventually decides. This
 * helper waits for the whole chain to converge — the attribute must exist (the
 * observer has run) and the bar must already mirror it (React has committed) —
 * so every assertion after it describes the settled client state.
 */
export async function settleStickyBar(page: Page): Promise<void> {
  await expect(page.locator('body')).toHaveAttribute('data-past-hero', /^(true|false)$/);
  await page.waitForFunction(() => {
    const bar = document.querySelector('[data-testid="sticky-bar"]');
    return (
      bar !== null && bar.getAttribute('data-visible') === document.body.getAttribute('data-past-hero')
    );
  });
}

/**
 * Scrolls the way a finger or a wheel does — a little per frame — rather than
 * teleporting. An IntersectionObserver only reports threshold crossings, so a
 * single `scrollTo` past a 1px sentinel can move it from below the viewport to
 * above it between two frames and never register. That limitation is inherent
 * to the sentinel and predates this fix (an instant scroll misses it on desktop
 * today too); real scrolling always crosses it.
 */
export async function scrollPastHero(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const hero = document.querySelector('#step-street') as HTMLElement;
    const target = hero.getBoundingClientRect().height + 200;
    const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    while (window.scrollY < target) {
      const before = window.scrollY;
      window.scrollBy(0, 60);
      await frame();
      if (window.scrollY === before) break; // hit the bottom of the document
    }
  });
}

/** The same, in reverse: back to the top a frame at a time. */
export async function scrollBackToTop(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    while (window.scrollY > 0) {
      const before = window.scrollY;
      window.scrollBy(0, -60);
      await frame();
      if (window.scrollY === before) break;
    }
  });
}

export type HitTest = {
  /** True when the element itself (or one of its descendants) is painted on top at its own centre. */
  isTopmost: boolean;
  /** What actually sits there, for the failure message. */
  topmost: string;
  /** True when the element that sits there belongs to the sticky booking bar. */
  occludedByStickyBar: boolean;
};

/**
 * `toBeInViewport()` only proves geometric intersection with the viewport; an
 * element fully painted over by fixed chrome still satisfies it. This asks the
 * browser what is actually on top at the element's centre point.
 */
export function hitTestCentre(locator: Locator): Promise<HitTest> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const describe = (node: Element | null) =>
      node === null
        ? 'nothing'
        : `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${
            typeof node.className === 'string' && node.className ? `.${node.className.trim().split(/\s+/).join('.')}` : ''
          }`;

    return {
      isTopmost: hit !== null && (hit === element || element.contains(hit)),
      topmost: describe(hit),
      occludedByStickyBar: hit !== null && hit.closest('[data-testid="sticky-bar"]') !== null,
    };
  });
}

export type Box = { x: number; y: number; width: number; height: number };

export function rectsOverlap(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
  );
}

/**
 * The sticky bar slides in and out over 220ms, so a rect read the instant
 * `data-visible` changes describes the start of the transition, not the
 * resting position. This waits for two consecutive frames to agree.
 */
export function stableViewportBox(locator: Locator): Promise<Box> {
  return locator.evaluate(async (element) => {
    const read = () => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    let previous = read();
    let stableFrames = 0;
    for (let attempt = 0; attempt < 240; attempt += 1) {
      await frame();
      const current = read();
      const same =
        current.x === previous.x &&
        current.y === previous.y &&
        current.width === previous.width &&
        current.height === previous.height;
      // A transition that has not started yet also looks still for one frame,
      // so require several in a row before believing the element has settled.
      stableFrames = same ? stableFrames + 1 : 0;
      if (stableFrames >= 5) return current;
      previous = current;
    }
    return previous;
  });
}

/**
 * The part of a rect the reader can actually see. An element parked outside the
 * viewport clips to zero area, which is the honest way to compare "what is
 * painted over the hero" against "what is merely in the document below it".
 */
export function clipToViewport(box: Box, viewport: { width: number; height: number }): Box {
  const x = Math.max(0, box.x);
  const y = Math.max(0, box.y);
  return {
    x,
    y,
    width: Math.max(0, Math.min(viewport.width, box.x + box.width) - x),
    height: Math.max(0, Math.min(viewport.height, box.y + box.height) - y),
  };
}
