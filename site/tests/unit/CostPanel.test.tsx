import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { CostPanel } from '@/components/content/CostPanel';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

describe('CostPanel', () => {
  it('states the statutory-insurance exclusion in plain words', () => {
    render(<CostPanel t={t} />);
    expect(screen.getByText(/We cannot treat statutory patients/)).toBeInTheDocument();
  });

  it('gives all three insurance cases equal heading hierarchy', () => {
    render(<CostPanel t={t} />);
    const headings = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(headings).toEqual(['Privately insured', 'Self-paying', 'Statutory (GKV)']);
  });

  it('explains private practice as what pays for the time, without describing their rooms', () => {
    render(<CostPanel t={t} />);
    expect(screen.getByText(/what makes the time and the rooms possible/)).toBeInTheDocument();
    // The old wording pointed at a stock photograph and called it their room.
    expect(screen.queryByText(/the rooms are like this/)).not.toBeInTheDocument();
  });

  it('withholds unconfirmed self-pay wording and shows its typed note instead', () => {
    render(<CostPanel t={t} />);
    const selfPayColumn = screen.getByRole('heading', { level: 3, name: 'Self-paying' }).parentElement;

    expect(selfPayColumn).not.toBeNull();
    expect(screen.queryByText('A written estimate before anything is agreed.')).not.toBeInTheDocument();
    expect(within(selfPayColumn as HTMLElement).getByRole('status')).toHaveAttribute(
      'title',
      'Estimate wording awaiting practice confirmation',
    );
  });

  it('renders confirmed private GOZ copy without a pending marker', () => {
    render(<CostPanel t={t} />);
    const privateColumn = screen.getByRole('heading', { level: 3, name: 'Privately insured' }).parentElement;

    expect(privateColumn).not.toBeNull();
    expect(
      within(privateColumn as HTMLElement).getByText('Billed per GOZ. You receive a written estimate before treatment begins.'),
    ).toBeInTheDocument();
    expect(within(privateColumn as HTMLElement).queryByRole('status')).not.toBeInTheDocument();
  });
});
