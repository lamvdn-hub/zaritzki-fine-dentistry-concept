'use client';

import Image from 'next/image';
import { Button } from '@/components/system/Button';
import { bookingHref } from '@/lib/booking';
import { useLocation } from '@/lib/LocationProvider';
import styles from './ClosingCta.module.css';

export function ClosingCta({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const { practice } = useLocation();

  return (
    <section className={styles.section}>
      <Image
        className={styles.image}
        src={practice.images.closing}
        alt=""
        fill
        sizes="100vw"
        data-testid="closing-image"
      />
      <div className={styles.scrim} aria-hidden="true" />
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
