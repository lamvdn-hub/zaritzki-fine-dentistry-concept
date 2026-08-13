'use client';

import { bookingHref } from '@/lib/booking';
import { useLocation } from '@/lib/LocationProvider';
import type { Locale } from '@/lib/i18n';
import { Button } from '@/components/system/Button';
import { LocaleSwitch } from './LocaleSwitch';
import { LocationSwitch } from './LocationSwitch';
import { Wordmark } from './Wordmark';
import styles from './SiteHeader.module.css';

export function SiteHeader({
  t,
  locale,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
  locale: Locale;
}) {
  const { practice } = useLocation();
  const phoneHref = `tel:${practice.phone}`;

  return (
    <header className={styles.header}>
      <a className={styles.skip} href="#content">
        {t('nav.skipToContent')}
      </a>
      <div className={styles.inner}>
        <a className={styles.mark} href={`/${locale}`}>
          <Wordmark className={styles.wordmark} />
        </a>
        <div className={styles.actions}>
          <LocationSwitch t={t} />
          <a className={styles.desktopPhone} href={phoneHref}>
            {practice.phoneDisplay}
          </a>
          <a className={styles.compactPhone} href={phoneHref}>
            {t('nav.call')}
          </a>
          <LocaleSwitch locale={locale} label={t('nav.language')} />
          <Button className={styles.book} href={bookingHref(practice)} size="sm">
            {t('nav.book')}
          </Button>
        </div>
      </div>
    </header>
  );
}
