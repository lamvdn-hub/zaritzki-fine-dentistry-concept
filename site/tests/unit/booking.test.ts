import { describe, it, expect } from 'vitest';
import { bookingHref, bookingIsFallback } from '@/lib/booking';
import { PRACTICES } from '@/lib/locations';
import { pending } from '@/lib/pending';

describe('booking href', () => {
  it('sends each practice to its own Doctolib destination', () => {
    expect(bookingHref(PRACTICES.mitte)).toBe(
      'https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki?pid=practice-540639',
    );
    expect(bookingHref(PRACTICES.charlottenburg)).toBe(
      'https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki',
    );
    expect(bookingIsFallback(PRACTICES.mitte)).toBe(false);
  });

  it('falls back to the telephone number if a URL is ever missing', () => {
    const p = { ...PRACTICES.mitte, bookingUrl: pending('withdrawn') };
    expect(bookingHref(p)).toBe('tel:+493085403000');
    expect(bookingIsFallback(p)).toBe(true);
  });

  it('never returns an empty or hash href', () => {
    for (const p of Object.values(PRACTICES)) {
      expect(bookingHref(p)).not.toBe('');
      expect(bookingHref(p)).not.toBe('#');
    }
  });
});
