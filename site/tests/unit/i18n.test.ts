import { describe, it, expect } from 'vitest';
import { isLocale, getMessages, translator, LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';

describe('i18n', () => {
  it('recognises supported locales and rejects others', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('de')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(LOCALES).toEqual(['en', 'de']);
  });

  it('defaults to English while German copy is outstanding', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('resolves a dotted key from the English messages', async () => {
    const t = translator(await getMessages('en'));
    expect(t('hero.headline')).toBe('A calmer kind of dental visit');
  });

  it('falls back to the default locale when a key is missing', async () => {
    const t = translator(await getMessages('de'));
    expect(t('hero.headline')).toBe('A calmer kind of dental visit');
  });

  it('returns the key itself when nothing resolves, rather than throwing', async () => {
    const t = translator(await getMessages('en'));
    expect(t('nothing.here.at.all')).toBe('nothing.here.at.all');
  });
});
