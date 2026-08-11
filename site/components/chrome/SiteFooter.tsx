import Link from 'next/link';
import { PRACTICE_ORDER, getPractice } from '@/lib/locations';
import styles from './SiteFooter.module.css';

export function SiteFooter({ t }: { t: (key: string) => string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <div className={styles.mark}>{t('footer.rights')}</div>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
        </div>
        {PRACTICE_ORDER.map((id) => {
          const practice = getPractice(id);

          return (
            <address key={id} className={styles.practice}>
              <h2 className={styles.name}>{practice.shortName}</h2>
              <div className={styles.line}>{practice.street}</div>
              <div className={styles.line}>
                {practice.postalCode} {practice.city}
              </div>
              <div className={styles.line}>{t('practices.hours')}</div>
              <div className={styles.line}>
                <a className={styles.link} href={`tel:${practice.phone}`}>
                  {practice.phoneDisplay}
                </a>
              </div>
            </address>
          );
        })}
      </div>
      <div className={styles.legal}>
        <Link className={styles.link} href="/impressum">
          {t('footer.imprint')}
        </Link>
        <Link className={styles.link} href="/datenschutz">
          {t('footer.privacy')}
        </Link>
      </div>
    </footer>
  );
}
