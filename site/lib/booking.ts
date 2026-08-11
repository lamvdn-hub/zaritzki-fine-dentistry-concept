import { isKnown } from '@/lib/pending';
import type { Practice } from '@/lib/locations';

/**
 * A dead button is worse than a telephone call. Until the practice supplies
 * its Doctolib URLs, the primary action dials the practice instead.
 */
export function bookingHref(practice: Practice): string {
  return isKnown(practice.bookingUrl) ? practice.bookingUrl.value : `tel:${practice.phone}`;
}

export function bookingIsFallback(practice: Practice): boolean {
  return !isKnown(practice.bookingUrl);
}
