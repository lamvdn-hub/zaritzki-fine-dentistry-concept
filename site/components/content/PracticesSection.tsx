import { Reveal } from '@/components/motion/Reveal';
import { PRACTICE_ORDER, getPractice } from '@/lib/locations';
import styles from './PracticesSection.module.css';

export function PracticesSection({ t }: { t: (key: string) => string }) {
  return (
    <section className={styles.section} id="practices">
      <div className={styles.inner}>
        <Reveal>
          <p className="eyebrow">{t('practices.eyebrow')}</p>
          <h2 className={styles.headline}>{t('practices.headline')}</h2>
        </Reveal>
        <div className={styles.grid}>
          {PRACTICE_ORDER.map((id, index) => {
            const practice = getPractice(id);

            return (
              <Reveal key={id} delay={index * 80}>
                <article className={styles.practice}>
                  <h3 className={styles.name}>{practice.shortName}</h3>
                  <p className={styles.line}>{practice.street}</p>
                  <p className={styles.line}>
                    {practice.postalCode} {practice.city}
                  </p>
                  <p className={styles.line}>{t('practices.hours')}</p>
                  <div className={styles.actions}>
                    <a className={styles.link} href={`tel:${practice.phone}`}>
                      {practice.phoneDisplay}
                    </a>
                    <a
                      className={styles.link}
                      href={practice.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('practices.directions')}
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
