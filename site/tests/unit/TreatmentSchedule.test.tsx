import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { LocationProvider } from '@/lib/LocationProvider';
import { TreatmentSchedule } from '@/components/content/TreatmentSchedule';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

const setup = () =>
  render(
    <LocationProvider>
      <TreatmentSchedule t={t} />
    </LocationProvider>,
  );

describe('TreatmentSchedule', () => {
  it('is a table, because it is tabular data', () => {
    setup();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('lists all eleven practice-wide treatments', () => {
    setup();
    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(rows).toHaveLength(12); // 1 header + 11 treatments
    expect(screen.getByText('Implantologie')).toBeInTheDocument();
    expect(screen.getByText('Funktionstherapie')).toBeInTheDocument();
    expect(screen.getByText('Ästhetische Prothetik')).toBeInTheDocument();
  });

  it('keeps German treatment names untranslated and glosses them in English', () => {
    setup();
    const row = screen.getByText('Endodontologie').closest('tr');
    expect(row).not.toBeNull();
    expect(within(row as HTMLElement).getByText('root canals, under the microscope')).toBeInTheDocument();
  });

  it('singles out no treatment, and does not claim veneers as a focus', () => {
    setup();
    const row = screen.getByText('Veneers').closest('tr');
    expect(within(row as HTMLElement).queryByText(/particular focus/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/particular focus/i)).not.toBeInTheDocument();
  });

  it('keeps the non-preparation veneers gloss, which their Doctolib profile publishes', () => {
    setup();
    const row = screen.getByText('Veneers').closest('tr');
    expect(
      within(row as HTMLElement).getByText('porcelain, including non-preparation veneers'),
    ).toBeInTheDocument();
  });

  it('has no price column, and shows no price anywhere', () => {
    setup();
    expect(screen.queryByText('From')).not.toBeInTheDocument();
    expect(screen.queryByText(/€/)).not.toBeInTheDocument();
  });

  it('explains why there is no price list instead of leaving it unsaid', () => {
    setup();
    expect(screen.getByText(/We do not publish a price list/)).toBeInTheDocument();
    expect(screen.getByText(/written estimate before anything is agreed/)).toBeInTheDocument();
  });
});
