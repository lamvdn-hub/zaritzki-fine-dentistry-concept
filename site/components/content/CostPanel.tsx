import { PendingFact } from '@/components/dev/PendingFact';
import { Reveal } from '@/components/motion/Reveal';
import { OPEN_FACTS } from '@/lib/openFacts';
import styles from './CostPanel.module.css';

export function CostPanel({ t }: { t: (key: string) => string }) {
  const selfPayWording = OPEN_FACTS.selfPayWording;

  return (
    <section className={styles.section} id="step-leaving">
      <div className={styles.inner}>
        <Reveal>
          <p className="eyebrow">{t('leaving.eyebrow')}</p>
          <h2 className={styles.headline}>{t('leaving.headline')}</h2>
          <p className={styles.body}>{t('leaving.body')}</p>
          <div className={styles.columns}>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{t('leaving.privateTitle')}</h3>
              <p className={styles.columnBody}>{t('leaving.privateBody')}</p>
            </div>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{t('leaving.selfTitle')}</h3>
              <p className={styles.columnBody}>
                {selfPayWording.known ? (
                  selfPayWording.value
                ) : (
                  <PendingFact note={selfPayWording.note} />
                )}
              </p>
            </div>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>{t('leaving.gkvTitle')}</h3>
              <p className={styles.columnBody}>{t('leaving.gkvBody')}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
