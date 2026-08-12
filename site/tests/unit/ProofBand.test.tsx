import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProofBand } from '@/components/content/ProofBand';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('ProofBand', () => {
  it('shows both confirmed ratings with their practice addresses', () => {
    render(<ProofBand t={t} />);

    expect(screen.getByText('69 reviews · Jägerstraße 41')).toBeInTheDocument();
    expect(screen.getByText('20 reviews · Kurfürstendamm 52')).toBeInTheDocument();
  });

  it('carries no testimonial text because none has been supplied or cleared', () => {
    const { container } = render(<ProofBand t={t} />);

    expect(container.querySelector('blockquote')).toBeNull();
  });

  it('attributes the ratings to their source', () => {
    render(<ProofBand t={t} />);

    expect(screen.getByText('Ratings as published on Google.')).toBeInTheDocument();
  });

  it('marks each rating with a decorative SVG star, not a unicode glyph', () => {
    const { container } = render(<ProofBand t={t} />);

    expect(container.textContent).not.toContain('★');
    expect(container.querySelectorAll('[aria-hidden] svg')).toHaveLength(2);
    expect(screen.getAllByText('5.0', { exact: false })).toHaveLength(2);
  });
});
