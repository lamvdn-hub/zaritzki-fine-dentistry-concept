'use client';

import { useEffect, useState } from 'react';
import { STEPS } from '@/lib/steps';
import styles from './StepRail.module.css';

const DESKTOP_MIN_WIDTH = 861;
const HEADER_HEIGHT = 62;
const PAST_HERO_ATTR = 'data-past-hero';

type RailPosition = 'docked' | 'fixed' | 'released';

export function StepRail({ t }: { t: (key: string) => string }) {
  const [current, setCurrent] = useState<string>(STEPS[0].id);
  const [position, setPosition] = useState<RailPosition>('docked');

  useEffect(() => {
    const updatePosition = () => {
      const isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
      const isPastHero = document.body.getAttribute(PAST_HERO_ATTR) === 'true';

      if (!isDesktop || !isPastHero) {
        setPosition('docked');
        return;
      }

      const practices = document.getElementById('practices');
      setPosition(
        practices && practices.getBoundingClientRect().top <= HEADER_HEIGHT
          ? 'released'
          : 'fixed',
      );
    };

    updatePosition();

    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [PAST_HERO_ATTR],
      childList: true,
      subtree: true,
    });
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  useEffect(() => {
    const sections = STEPS.flatMap((step) => {
      const el = document.getElementById(step.anchor);
      return el ? [{ id: step.id, el }] : [];
    });
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const match = sections.find((step) => step.el === visible.target);
        if (match) setCurrent(match.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    for (const section of sections) observer.observe(section.el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={styles.rail}
      aria-label={t('steps.railLabel')}
      data-position={position}
    >
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
