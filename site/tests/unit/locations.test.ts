import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCATION,
  getPractice,
  PRACTICES,
  PRACTICE_ORDER,
  TREATMENTS,
} from '@/lib/locations';
import { isKnown } from '@/lib/pending';

describe('practice data', () => {
  it('carries both confirmed addresses exactly', () => {
    expect(PRACTICES.mitte.street).toBe('Jägerstraße 41');
    expect(PRACTICES.mitte.postalCode).toBe('10117');
    expect(PRACTICES.charlottenburg.street).toBe('Kurfürstendamm 52');
    expect(PRACTICES.charlottenburg.postalCode).toBe('10707');
  });

  it('shares one telephone number across both practices', () => {
    expect(PRACTICES.mitte.phone).toBe('+493085403000');
    expect(PRACTICES.charlottenburg.phone).toBe(PRACTICES.mitte.phone);
  });

  it('carries the real ratings and no others', () => {
    expect(PRACTICES.mitte.rating).toEqual({ value: 5.0, count: 69 });
    expect(PRACTICES.charlottenburg.rating).toEqual({ value: 5.0, count: 20 });
  });

  it('opens 08:00 to 20:00 Monday to Friday at both practices', () => {
    for (const id of PRACTICE_ORDER) {
      const p = getPractice(id);
      expect(p.hours.opens).toBe('08:00');
      expect(p.hours.closes).toBe('20:00');
      expect(p.hours.days).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr']);
    }
  });

  it('defaults to Mitte, which has the larger review count', () => {
    expect(DEFAULT_LOCATION).toBe('mitte');
    expect(PRACTICES.mitte.rating.count).toBeGreaterThan(PRACTICES.charlottenburg.rating.count);
  });

  it('carries one practice-wide treatment list, not a list per address', () => {
    expect(TREATMENTS).toHaveLength(11);
    expect(TREATMENTS.map((t) => t.name)).toContain('Implantologie');
    expect(TREATMENTS.map((t) => t.name)).toContain('Funktionstherapie');
    // Treatments are not a property of a location.
    expect('treatments' in PRACTICES.mitte).toBe(false);
  });

  it("marks veneers as the practice's one stated focus", () => {
    const focused = TREATMENTS.filter((t) => t.focus);
    expect(focused).toHaveLength(1);
    expect(focused[0].name).toBe('Veneers');
  });

  it('sends each practice to its own Doctolib destination', () => {
    const mitte = PRACTICES.mitte.bookingUrl;
    const kudamm = PRACTICES.charlottenburg.bookingUrl;
    expect(isKnown(mitte) && mitte.value).toContain('pid=practice-540639');
    expect(isKnown(kudamm) && kudamm.value).not.toContain('pid=');
  });
});
