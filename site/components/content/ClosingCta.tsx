'use client';

import { Button } from '@/components/system/Button';
import { bookingHref } from '@/lib/booking';
import { useLocation } from '@/lib/LocationProvider';
import styles from './ClosingCta.module.css';

/**
 * Closes on a plain espresso ground rather than a photograph.
 *
 * The slot used to carry a full-bleed interior under a 0.78 espresso scrim —
 * which meant the picture was almost invisible anyway, while still being a
 * stock building presented as theirs. Since nearly nothing of it survived the
 * scrim, dropping the image loses no design and removes the claim.
 */
export function ClosingCta({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const { practice } = useLocation();

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.headline}>{t('closing.headline')}</h2>
        <p className={styles.body}>{t('closing.body')}</p>
        <div className={styles.cta}>
          <Button href={bookingHref(practice)} size="lg">
            {t('nav.bookAt', { practice: practice.shortName })}
          </Button>
        </div>
      </div>
    </section>
  );
}
