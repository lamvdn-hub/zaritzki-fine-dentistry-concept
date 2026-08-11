import enMessages from '@/messages/en.json';
import deMessages from '@/messages/de.json';

export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

/** Flip to 'de' when German copy lands. This is the only place the default lives. */
export const DEFAULT_LOCALE: Locale = 'en';

export type Messages = Record<string, unknown>;

const BUNDLES: Record<Locale, Messages> = {
  en: enMessages as Messages,
  de: deMessages as Messages,
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export async function getMessages(locale: Locale): Promise<Messages> {
  return BUNDLES[locale];
}

function lookup(messages: Messages, key: string): string | undefined {
  const found = key.split('.').reduce<unknown>(
    (node, part) =>
      node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
    messages,
  );
  return typeof found === 'string' ? found : undefined;
}

/**
 * Returns a lookup function for dotted keys, falling back to the default
 * locale and finally to the key itself. Values may contain {placeholders},
 * substituted from the optional second argument.
 */
export function translator(messages: Messages) {
  return (key: string, values?: Record<string, string | number>): string => {
    const raw = lookup(messages, key) ?? lookup(BUNDLES[DEFAULT_LOCALE], key) ?? key;
    if (!values) return raw;
    return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in values ? String(values[name]) : match,
    );
  };
}
