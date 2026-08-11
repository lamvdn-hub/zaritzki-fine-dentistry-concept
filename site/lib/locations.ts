import { known, type Pending } from '@/lib/pending';

export type LocationId = 'mitte' | 'charlottenburg';

export type ImageSlot =
  | 'entrance'
  | 'lounge'
  | 'consultation'
  | 'treatmentRoom'
  | 'detail'
  | 'closing';

export type Treatment = {
  /** Proper noun, as the practice publishes it. Never translated. */
  name: string;
  /** Key into messages.treatments — the plain-language gloss, which is translated. */
  glossKey: string;
  /** The practice names veneers as its particular focus. Exactly one is true. */
  focus?: boolean;
};

export type Practice = {
  id: LocationId;
  /** Short label for the switch: "Mitte" / "Charlottenburg". */
  shortName: string;
  /** For the hero eyebrow: "Berlin Mitte". */
  district: string;
  legalName: string;
  street: string;
  postalCode: string;
  city: string;
  /** E.164, for tel: hrefs. */
  phone: string;
  phoneDisplay: string;
  hours: { opens: string; closes: string; days: string[] };
  rating: { value: number; count: number };
  mapsUrl: string;
  bookingUrl: Pending<string>;
  images: Record<ImageSlot, string>;
};

const PHONE = '+493085403000';
const PHONE_DISPLAY = '030 854 030 00';
const HOURS = { opens: '08:00', closes: '20:00', days: ['Mo', 'Tu', 'We', 'Th', 'Fr'] };

/**
 * Practice-wide, from the practice's own Doctolib profile. The two Google
 * service lists differed only because both were truncated — the treatments do
 * not vary by address, so this list is not a per-practice field.
 *
 * The Doctolib profile introduces the list with "including", so it is
 * representative rather than exhaustive. Whitening is carried from both Google
 * profiles. Do not extend this list by inference.
 */
export const TREATMENTS: Treatment[] = [
  { name: 'Implantologie', glossKey: 'treatments.implantologie' },
  { name: 'Invisalign', glossKey: 'treatments.invisalign' },
  { name: 'Veneers', glossKey: 'treatments.veneers', focus: true },
  { name: 'Ästhetische Prothetik', glossKey: 'treatments.prothetik' },
  { name: 'Funktionstherapie', glossKey: 'treatments.funktionstherapie' },
  { name: 'Endodontologie', glossKey: 'treatments.endodontologie' },
  { name: 'Füllungstherapie', glossKey: 'treatments.fuellungstherapie' },
  { name: 'Parodontologie', glossKey: 'treatments.parodontologie' },
  { name: 'Prophylaxe und Diagnostik', glossKey: 'treatments.prophylaxe' },
  { name: 'Dentalhygiene', glossKey: 'treatments.dentalhygiene' },
  { name: 'Whitening', glossKey: 'treatments.whitening' },
];

export const PRACTICES: Record<LocationId, Practice> = {
  mitte: {
    id: 'mitte',
    shortName: 'Mitte',
    district: 'Berlin Mitte',
    legalName: 'Zaritzki Fine Dentistry',
    street: 'Jägerstraße 41',
    postalCode: '10117',
    city: 'Berlin',
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY,
    hours: HOURS,
    rating: { value: 5.0, count: 69 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=J%C3%A4gerstra%C3%9Fe+41+10117+Berlin',
    // The bare Doctolib profile resolves to Kurfürstendamm; this pid selects Gendarmenmarkt.
    bookingUrl: known(
      'https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki?pid=practice-540639',
    ),
    images: {
      entrance: '/images/mitte/entrance.jpg',
      lounge: '/images/mitte/lounge.jpg',
      consultation: '/images/mitte/consultation.jpg',
      treatmentRoom: '/images/mitte/treatment-room.jpg',
      detail: '/images/mitte/detail.jpg',
      closing: '/images/mitte/closing.jpg',
    },
  },
  charlottenburg: {
    id: 'charlottenburg',
    shortName: 'Charlottenburg',
    district: 'Berlin Charlottenburg',
    legalName: 'Privatpraxis Zaritzki Fine Dentistry',
    street: 'Kurfürstendamm 52',
    postalCode: '10707',
    city: 'Berlin',
    phone: PHONE,
    phoneDisplay: PHONE_DISPLAY,
    hours: HOURS,
    rating: { value: 5.0, count: 20 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kurf%C3%BCrstendamm+52+10707+Berlin',
    bookingUrl: known('https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki'),
    images: {
      entrance: '/images/charlottenburg/entrance.jpg',
      lounge: '/images/charlottenburg/lounge.jpg',
      consultation: '/images/charlottenburg/consultation.jpg',
      treatmentRoom: '/images/charlottenburg/treatment-room.jpg',
      detail: '/images/charlottenburg/detail.jpg',
      closing: '/images/charlottenburg/closing.jpg',
    },
  },
};

/** Mitte first: 69 reviews to Charlottenburg's 20. */
export const PRACTICE_ORDER: LocationId[] = ['mitte', 'charlottenburg'];
export const DEFAULT_LOCATION: LocationId = 'mitte';

export function getPractice(id: LocationId): Practice {
  return PRACTICES[id];
}

/**
 * The practice publishes no price list, and this is settled rather than
 * outstanding: German private dental fees are set under the GOZ and depend on
 * the treatment plan. The page explains that instead of showing empty prices.
 */
export const PRICES_ARE_NOT_PUBLISHED = true;
