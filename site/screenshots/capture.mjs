import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'http://127.0.0.1:3000';

const SHOTS = [
  {
    file: 'hero-first-viewport.png',
    url: '/en',
    width: 390,
    height: 664,
    fullPage: false,
    scrollFirst: false,
  },
  {
    file: 'hero-first-viewport-charlottenburg.png',
    url: '/en?praxis=charlottenburg',
    width: 390,
    height: 664,
    fullPage: false,
    scrollFirst: false,
  },
  {
    file: 'desktop.png',
    url: '/en',
    width: 1440,
    height: 900,
    fullPage: true,
    scrollFirst: true,
  },
  {
    file: 'desktop-charlottenburg.png',
    url: '/en?praxis=charlottenburg',
    width: 1440,
    height: 900,
    fullPage: true,
    scrollFirst: true,
  },
  {
    file: 'mobile.png',
    url: '/en',
    width: 390,
    height: 844,
    fullPage: true,
    scrollFirst: true,
  },
];

async function settle(page) {
  await page.waitForFunction(() => {
    const bar = document.querySelector('[data-testid="sticky-bar"]');
    const past = document.body.getAttribute('data-past-hero');
    return past !== null && bar !== null && bar.getAttribute('data-visible') === past;
  }, null, { timeout: 15000 });
}

async function waitForAssets(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const hero = document.querySelector('[data-testid="hero-image"]');
    if (!(hero instanceof HTMLImageElement) || !hero.complete || hero.naturalWidth === 0) {
      return false;
    }
    const visible = [...document.images].filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
    });
    return visible.every((img) => img.complete && img.naturalWidth > 0);
  }, null, { timeout: 20000 });
}

async function realScrollBy(page, pixels) {
  await page.evaluate(async (distance) => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
    const target = window.scrollY + distance;
    while (window.scrollY < target - 1) {
      const before = window.scrollY;
      window.scrollBy(0, 80);
      await frame();
      if (window.scrollY === before) break;
    }
  }, pixels);
}

async function realScrollThrough(page) {
  await page.evaluate(async () => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    while (window.scrollY < max - 1) {
      const before = window.scrollY;
      window.scrollBy(0, 80);
      await frame();
      if (window.scrollY === before) break;
    }
  });
  await page.waitForTimeout(700);
}

async function realScrollToTop(page) {
  await page.evaluate(async () => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
    while (window.scrollY > 0) {
      const before = window.scrollY;
      window.scrollBy(0, -80);
      await frame();
      if (window.scrollY === before) break;
    }
  });
  await page.waitForTimeout(400);
}

async function railState(page) {
  return page.evaluate(() => {
    const rail = document.querySelector('#step-street nav');
    if (!rail) return null;
    const style = getComputedStyle(rail);
    return {
      dataPosition: rail.getAttribute('data-position'),
      position: style.position,
      top: style.top,
    };
  });
}

function clip(box, vw, vh) {
  if (!box) return null;
  const x = Math.max(0, box.x);
  const y = Math.max(0, box.y);
  return {
    x,
    y,
    w: Math.max(0, Math.min(vw, box.x + box.w) - x),
    h: Math.max(0, Math.min(vh, box.y + box.h) - y),
  };
}

function overlap(a, b) {
  if (!a || !b) return false;
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

async function inspect(page, vw, vh) {
  return page.evaluate(({ vw, vh }) => {
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    };
    const clipBox = (b) => {
      if (!b) return null;
      const x = Math.max(0, b.x);
      const y = Math.max(0, b.y);
      return {
        x,
        y,
        w: Math.max(0, Math.min(vw, b.x + b.w) - x),
        h: Math.max(0, Math.min(vh, b.y + b.h) - y),
      };
    };
    const hero = document.querySelector('#step-street');
    const headline = document.querySelector('#hero-headline');
    const lede = document.querySelector('#step-street p:nth-of-type(2)');
    const qualifier = document.querySelector('#step-street p:nth-of-type(3)');
    const heroCta = [...document.querySelectorAll('#step-street a')].find((a) =>
      /Book a first consultation/.test(a.textContent || ''),
    );
    const bar = document.querySelector('[data-testid="sticky-bar"]');
    const rail = document.querySelector('#step-street nav, #step-street [class*="rail"], [data-testid="step-rail"]')
      || document.querySelector('#step-street ol, #step-street ul');
    const ctaStyle = heroCta ? getComputedStyle(heroCta) : null;
    const railStyle = rail ? getComputedStyle(rail) : null;
    const barStyle = bar ? getComputedStyle(bar) : null;
    const ctaBox = box(heroCta);
    let ctaHit = null;
    if (heroCta && ctaBox) {
      const cx = ctaBox.x + ctaBox.w / 2;
      const cy = ctaBox.y + ctaBox.h / 2;
      if (cy >= 0 && cy <= vh && cx >= 0 && cx <= vw) {
        const hit = document.elementFromPoint(cx, cy);
        ctaHit = {
          topmost: hit !== null && (hit === heroCta || heroCta.contains(hit)),
          inBar: hit !== null && hit.closest('[data-testid="sticky-bar"]') !== null,
          tag: hit ? hit.tagName.toLowerCase() : null,
        };
      }
    }
    const overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return {
      past: document.body.getAttribute('data-past-hero'),
      vis: bar ? bar.getAttribute('data-visible') : null,
      scrollY: Math.round(window.scrollY),
      overflowX,
      hero: clipBox(box(hero)),
      headline: clipBox(box(headline)),
      lede: clipBox(box(lede)),
      qualifier: clipBox(box(qualifier)),
      cta: clipBox(ctaBox),
      ctaAlignSelf: ctaStyle ? ctaStyle.alignSelf : null,
      ctaWidth: ctaStyle ? ctaStyle.width : null,
      ctaDisplay: ctaStyle ? ctaStyle.display : null,
      ctaNaturalW: ctaBox ? Math.round(ctaBox.w) : null,
      railPosition: railStyle ? railStyle.position : null,
      railTop: railStyle ? railStyle.top : null,
      rail: box(rail),
      barVisibility: barStyle ? barStyle.visibility : null,
      barOpacity: barStyle ? barStyle.opacity : null,
      bar: clipBox(box(bar)),
      ctaHit,
    };
  }, { vw, vh });
}

const browser = await chromium.launch();
const notes = [];

for (const shot of SHOTS) {
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(BASE + shot.url, { waitUntil: 'load' });
  await settle(page);
  await waitForAssets(page);

  const rest = await inspect(page, shot.width, shot.height);
  let midRail = null;

  if (shot.scrollFirst) {
    await realScrollBy(page, Math.round(shot.height * 1.2));
    await page.waitForTimeout(300);
    midRail = await railState(page);
    await realScrollThrough(page);
    await waitForAssets(page);
    await realScrollToTop(page);
    await waitForAssets(page);
  }

  const dest = path.join(__dirname, shot.file);
  await page.screenshot({
    path: dest,
    fullPage: shot.fullPage,
    animations: 'disabled',
  });

  const after = shot.scrollFirst ? { midRail, restAfterReturn: await inspect(page, shot.width, shot.height) } : rest;
  const barOverCta = overlap(rest.bar, rest.cta);
  const barPainted =
    rest.barVisibility === 'visible' && Number(rest.barOpacity) > 0.01 && rest.bar && rest.bar.h > 0;

  notes.push({
    file: shot.file,
    url: shot.url,
    viewport: `${shot.width}x${shot.height}`,
    fullPage: shot.fullPage,
    scrolled: shot.scrollFirst,
    rest: {
      past: rest.past,
      vis: rest.vis,
      overflowX: rest.overflowX,
      ctaAlignSelf: rest.ctaAlignSelf,
      ctaWidth: rest.ctaWidth,
      ctaNaturalW: rest.ctaNaturalW,
      railPosition: rest.railPosition,
      rail: rest.rail,
      barPainted,
      barOverCta,
      ctaHit: rest.ctaHit,
      headline: rest.headline,
      lede: rest.lede,
      qualifier: rest.qualifier,
      cta: rest.cta,
      bar: rest.bar,
    },
    afterScroll: shot.scrollFirst
      ? {
          midRail,
          overflowX: after.restAfterReturn.overflowX,
          pastAtTop: after.restAfterReturn.past,
          cta: after.restAfterReturn.cta,
        }
      : null,
  });

  console.log(
    [
      shot.file.padEnd(42),
      `${shot.width}x${shot.height}`.padEnd(10),
      `past=${rest.past}`,
      `vis=${rest.vis}`,
      `painted=${barPainted}`,
      `overCta=${barOverCta}`,
      `ctaW=${rest.ctaNaturalW}`,
      `align=${rest.ctaAlignSelf}`,
      `rail=${rest.railPosition}`,
      `railIn=${rest.rail && rest.rail.y >= 0 && rest.rail.y + rest.rail.h <= shot.height}`,
      `ctaBottom=${rest.cta ? Math.round(rest.cta.y + rest.cta.h) : '-'}`,
      `ox=${rest.overflowX}`,
    ].join(' '),
  );

  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(__dirname, 'inspect.json'), JSON.stringify(notes, null, 2));
console.log(`wrote ${notes.length} screenshots`);
