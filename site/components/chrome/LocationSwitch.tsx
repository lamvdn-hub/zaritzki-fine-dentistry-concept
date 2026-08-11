'use client';

import { useRef } from 'react';
import { useLocation } from '@/lib/LocationProvider';
import { getPractice, PRACTICE_ORDER, type LocationId } from '@/lib/locations';
import styles from './LocationSwitch.module.css';

export function LocationSwitch({ t }: { t: (key: string) => string }) {
  const { locationId, setLocation } = useLocation();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    event.preventDefault();
    const currentIndex = PRACTICE_ORDER.indexOf(locationId);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + direction + PRACTICE_ORDER.length) % PRACTICE_ORDER.length;
    const nextLocation = PRACTICE_ORDER[nextIndex];

    setLocation(nextLocation);
    refs.current[nextLocation]?.focus();
  }

  return (
    <div
      className={styles.group}
      role="radiogroup"
      aria-label={t('nav.practice')}
      onKeyDown={onKeyDown}
    >
      {PRACTICE_ORDER.map((id: LocationId) => {
        const selected = id === locationId;

        return (
          <button
            key={id}
            ref={(element) => {
              refs.current[id] = element;
            }}
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
