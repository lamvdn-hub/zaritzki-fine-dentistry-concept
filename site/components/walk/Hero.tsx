'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/system/Button';
import { bookingHref } from '@/lib/booking';
import { useLocation } from '@/lib/LocationProvider';
import { StepRail } from './StepRail';
import styles from './Hero.module.css';

type Translator = (key: string, values?: Record<string, string | number>) => string;
const PAST_HERO_ATTR = 'data-past-hero';

export function Hero({ t }: { t: Translator }) {
  const { practice } = useLocation();
  const sentinel = useRef<HTMLDivElement>(null);

  // Publish the hero boundary on <body> so chrome outside this subtree can react
  // without coupling the page-level location context to scroll position.
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // The sentinel sits on the hero's bottom edge, so `!isIntersecting` is
        // true in two opposite situations: the edge has left through the top of
        // the viewport (genuinely scrolled past) and the edge is still below the
        // fold (not reached yet). On any viewport shorter than the header plus
        // the hero, the first callback arrives in the second state — so treating
        // the two alike claims "past the hero" while the reader is still at the
        // top of it. Only an edge above the root's top counts.
        const rootTop = entry.rootBounds?.top ?? 0;
        const pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom <= rootTop;
        document.body.setAttribute(PAST_HERO_ATTR, String(pastHero));
      },
      { rootMargin: '0px' },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      document.body.removeAttribute(PAST_HERO_ATTR);
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
        <h1 id="hero-headline" className={styles.headline}>
          {t('hero.headline')}
        </h1>
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
