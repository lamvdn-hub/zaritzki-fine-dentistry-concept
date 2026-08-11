import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PracticesSection } from '@/components/content/PracticesSection';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('PracticesSection', () => {
  it('keeps both practice addresses reachable regardless of the header switch', () => {
    render(<PracticesSection t={t} />);

    expect(screen.getByText('Jägerstraße 41')).toBeInTheDocument();
    expect(screen.getByText('Kurfürstendamm 52')).toBeInTheDocument();
  });

  it('links each practice to its confirmed map destination', () => {
    render(<PracticesSection t={t} />);

    const links = screen.getAllByRole('link', { name: 'Directions' });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', expect.stringContaining('google.com/maps'));
    expect(links[1]).toHaveAttribute('href', expect.stringContaining('google.com/maps'));
  });

  it('states the confirmed hours for each practice', () => {
    render(<PracticesSection t={t} />);

    expect(screen.getAllByText('Monday to Friday, 08:00–20:00')).toHaveLength(2);
  });
});
