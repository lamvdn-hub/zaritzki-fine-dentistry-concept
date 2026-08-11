'use client';

import { useEffect, useState } from 'react';
import { useLocation } from '@/lib/LocationProvider';
import { bookingHref } from '@/lib/booking';
import { Button } from '@/components/system/Button';
import styles from './StickyBookingBar.module.css';

const DISMISS_KEY = 'zaritzki.stickyDismissed';
/** The hero sets this attribute on <body> when it leaves the viewport. */
const VISIBLE_ATTR = 'data-past-hero';

type Translator = (key: string, values?: Record<string, string | number>) => string;

export function StickyBookingBar({ t }: { t: Translator }) {
  const { practice } = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === '1') setDismissed(true);
    } catch {
      // Session storage can be unavailable; the booking action remains usable.
    }
  }, []);

  useEffect(() => {
    const update = () => setVisible(document.body.getAttribute(VISIBLE_ATTR) === 'true');
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: [VISIBLE_ATTR] });

    return () => observer.disconnect();
  }, []);

  if (dismissed) return null;

  return (
    <div className={styles.bar} data-testid="sticky-bar" data-visible={String(visible)}>
      <span className={styles.summary}>{t('sticky.summary', { address: practice.street })}</span>
      <div className={styles.right}>
        <button
          type="button"
          className={styles.dismiss}
          onClick={() => {
            setDismissed(true);
            try {
              window.sessionStorage.setItem(DISMISS_KEY, '1');
            } catch {
              // Immediate dismissal does not depend on storage availability.
            }
          }}
        >
          {t('sticky.dismiss')}
        </button>
        <Button href={bookingHref(practice)} size="sm">
          {t('nav.bookFirst')}
        </Button>
      </div>
    </div>
  );
}
