import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteFooter } from '@/components/chrome/SiteFooter';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('SiteFooter', () => {
  it('lists both practices regardless of which is selected', () => {
    render(<SiteFooter t={t} />);

    expect(screen.getByText('Jägerstraße 41')).toBeInTheDocument();
    expect(screen.getByText('Kurfürstendamm 52')).toBeInTheDocument();
  });

  it('keeps the German legal links in German', () => {
    render(<SiteFooter t={t} />);

    expect(screen.getByRole('link', { name: 'Impressum' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Datenschutz' })).toBeInTheDocument();
  });

  it('offers the telephone number as the returning-patient path', () => {
    render(<SiteFooter t={t} />);

    expect(screen.getAllByRole('link', { name: /030 854 030 00/ })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: /030 854 030 00/ })[0]).toHaveAttribute(
      'href',
      'tel:+493085403000',
    );
  });

  it('renders the footer tagline and hours from the translation bundle', () => {
    const messages = {
      ...en,
      practices: { ...en.practices, hours: 'Controlled translated hours' },
      footer: { ...en.footer, tagline: 'Controlled translated footer tagline' },
    };

    render(<SiteFooter t={translator(messages as Record<string, unknown>)} />);

    expect(screen.getByText('Controlled translated footer tagline')).toBeInTheDocument();
    expect(screen.getAllByText('Controlled translated hours')).toHaveLength(2);
  });
});
