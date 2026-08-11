/**
 * A fact the practice has not yet supplied.
 *
 * The point of this type is that TypeScript will not let a consumer read
 * `.value` without first proving the fact is known — so a plausible-looking
 * placeholder cannot be typed in by accident. Every Pending value renders
 * through <PendingFact> and is listed by `npm run pending`.
 */
export type Pending<T> = { known: false; note: string } | { known: true; value: T };

export function pending(note: string): Pending<never> {
  return { known: false, note };
}

export function known<T>(value: T): Pending<T> {
  return { known: true, value };
}

export function isKnown<T>(p: Pending<T>): p is { known: true; value: T } {
  return p.known;
}
