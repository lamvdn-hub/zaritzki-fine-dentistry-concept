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

  it('disclaims affiliation instead of linking to legal pages that do not exist', () => {
    render(<SiteFooter t={t} />);

    const disclaimer = screen.getByText(/unofficial design concept/i);
    expect(disclaimer).toHaveTextContent(/not affiliated with or endorsed by/i);
    expect(disclaimer).toHaveTextContent(/taken down on request/i);

    // Both of these used to be links, and both used to 404.
    expect(screen.queryByRole('link', { name: 'Impressum' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Datenschutz' })).not.toBeInTheDocument();
  });

  it('offers the telephone number as the returning-patient path', () => {
    render(<SiteFooter t={t} />);

    expect(screen.getAllByRole('link', { name: /030 854 030 00/ })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: /030 854 030 00/ })[0]).toHaveAttribute(
      'href',
      'tel:+493085403000',
    );
  });

  it('marks the photography as licensed stock still awaiting approval', () => {
    render(<SiteFooter t={t} />);

    expect(screen.getByRole('status', { name: 'Placeholder — needs your content' })).toHaveAttribute(
      'title',
      'All 10 images are placeholders — 5 generated, 5 licensed stock — awaiting approval or replacement',
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
