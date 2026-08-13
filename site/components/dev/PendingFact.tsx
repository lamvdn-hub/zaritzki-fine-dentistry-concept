import styles from './PendingFact.module.css';

/**
 * Renders an unverified fact visibly so it cannot be mistaken for a real value.
 *
 * The label is addressed to the practice, not to a patient: it says what the
 * slot is and who has to fill it.
 *
 * `role="status"` does not take its name from its contents, so the label has to
 * be repeated in `aria-label` — kept identical to the visible text so a screen
 * reader and a sighted reader are told the same thing. The `title` adds which
 * particular fact is missing.
 */
const LABEL = 'Placeholder — needs your content';

export function PendingFact({ note, dash }: { note: string; dash?: string }) {
  return (
    <>
      {dash ? <span className={styles.dash}>{dash}</span> : null}
      <span className={styles.pending} role="status" aria-label={LABEL} title={note}>
        {LABEL}
      </span>
    </>
  );
}
