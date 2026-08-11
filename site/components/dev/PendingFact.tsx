import styles from './PendingFact.module.css';

/** Renders an unverified fact visibly so it cannot be mistaken for a real value. */
export function PendingFact({ note, dash }: { note: string; dash?: string }) {
  return (
    <>
      {dash ? <span className={styles.dash}>{dash}</span> : null}
      <span className={styles.pending} role="status" aria-label="Awaiting practice" title={note}>
        Awaiting practice
      </span>
    </>
  );
}
