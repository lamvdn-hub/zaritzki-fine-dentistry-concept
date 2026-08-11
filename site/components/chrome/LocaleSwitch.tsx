import Link from 'next/link';
import { LOCALES, type Locale } from '@/lib/i18n';
import styles from './LocaleSwitch.module.css';

/** Remove this guard when the German message bundle has approved copy. */
const GERMAN_PENDING = true;

export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  return (
    <div className={styles.switch} role="group" aria-label={label}>
      {LOCALES.map((code) => {
        if (code === locale) {
          return (
            <span key={code} className={styles.current} aria-current="true">
              {code.toUpperCase()}
            </span>
          );
        }

        if (code === 'de' && GERMAN_PENDING) {
          return (
            <span key={code} className={styles.pending} title="Deutsche Fassung folgt">
              {code.toUpperCase()}
            </span>
          );
        }

        return (
          <Link key={code} className={styles.other} href={`/${code}`}>
            {code.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
