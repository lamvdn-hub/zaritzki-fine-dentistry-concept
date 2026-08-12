import { Reveal } from '@/components/motion/Reveal';
import { PRACTICE_ORDER, getPractice } from '@/lib/locations';
import styles from './ProofBand.module.css';

/**
 * Confirmed Google ratings only. No testimonial text has been supplied or
 * cleared, and the figures are deliberately excluded from aggregateRating
 * structured data elsewhere in the build.
 */
export function ProofBand({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <section className={styles.band} aria-label="Practice ratings">
      <div className={styles.inner}>
        {PRACTICE_ORDER.map((id, index) => {
          const practice = getPractice(id);

          return (
            <Reveal key={id} delay={index * 80}>
              <p className={styles.rating}>
                {practice.rating.value.toFixed(1)}{' '}
                <span aria-hidden="true">
                  <RatingStar />
                </span>
              </p>
              <p className={styles.label}>
                {t('proof.label', {
                  count: practice.rating.count,
                  address: practice.street,
                })}
              </p>
            </Reveal>
          );
        })}
      </div>
      <p className={styles.source}>{t('proof.sourceNote')}</p>
    </section>
  );
}

function RatingStar() {
  return (
    <svg
      className={styles.star}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2.5l2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17.3 6 20.6l1.3-6.6-4.9-4.6 6.7-.8L12 2.5z" />
    </svg>
  );
}
