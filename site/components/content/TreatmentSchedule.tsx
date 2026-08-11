import { TREATMENTS } from '@/lib/locations';
import styles from './TreatmentSchedule.module.css';

/**
 * Treatments are practice-wide, so this is a server component â€” it does not
 * read the location context. There is no price column: the practice publishes
 * no price list, because German private dental fees are set under the GOZ and
 * depend on the treatment plan. Saying that plainly answers the cost question
 * better than a column of empty placeholders would.
 */
export function TreatmentSchedule({
  t,
}: {
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  return (
    <>
      <table className={styles.table}>
        <thead className={styles.head}>
          <tr>
            <th scope="col">{t('talk.columnTreatment')}</th>
            <th scope="col" className={styles.gloss}>{t('talk.columnTypical')}</th>
          </tr>
        </thead>
        <tbody>
          {TREATMENTS.map((treatment) => (
            <tr key={treatment.name} className={styles.row}>
              <td className={styles.name}>
                {treatment.name}
                {treatment.focus ? (
                  <span className={styles.focus}>{t('talk.focusLabel')}</span>
                ) : null}
              </td>
              <td className={styles.gloss}>{t(treatment.glossKey)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.noPrices}>{t('talk.noPrices')}</p>
    </>
  );
}
