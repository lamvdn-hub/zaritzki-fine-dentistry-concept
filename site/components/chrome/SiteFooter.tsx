import { PendingFact } from '@/components/dev/PendingFact';
import { PRACTICE_ORDER, getPractice } from '@/lib/locations';
import { OPEN_FACTS } from '@/lib/openFacts';
import styles from './SiteFooter.module.css';

export function SiteFooter({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <div className={styles.mark}>{t('footer.rights')}</div>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
          {OPEN_FACTS.photography.known ? null : (
            <p className={styles.credit}>
              <PendingFact note={OPEN_FACTS.photography.note} />
            </p>
          )}
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
      {/* The Impressum and Datenschutz links that used to sit here both 404'd.
          A demo of someone else's medical practice cannot be given a real
          Impressum without inventing legal text on their behalf, so the row
          now carries the disclaimer that actually applies to this page. */}
      <div className={styles.legal}>
        <p className={styles.disclaimer}>
          {t('footer.disclaimer', { builder: t('footer.builder') })}
        </p>
      </div>
    </footer>
  );
}
