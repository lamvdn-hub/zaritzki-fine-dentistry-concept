import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PendingFact } from '@/components/dev/PendingFact';

describe('PendingFact', () => {
  it('shows an awaiting status with its note and an optional dash placeholder', () => {
    const note = 'Confirm this detail with the practice before publishing.';
    const { rerender } = render(<PendingFact note={note} dash="—" />);

    const marker = screen.getByRole('status', { name: 'Awaiting practice' });
    expect(marker).toBeVisible();
    expect(marker).toHaveAttribute('title', note);
    expect(screen.getByText('—')).toBeVisible();
    expect(screen.queryByText(/from[- ]price/i)).not.toBeInTheDocument();

    rerender(<PendingFact note={note} />);
    expect(screen.queryByText('—')).not.toBeInTheDocument();
  });
});
