import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PendingFact } from '@/components/dev/PendingFact';

describe('PendingFact', () => {
  it('labels itself a placeholder, carries its note, and takes an optional dash', () => {
    const note = 'Confirm this detail with the practice before publishing.';
    const { rerender } = render(<PendingFact note={note} dash="—" />);

    // role="status" takes no name from content, so the label is duplicated into
    // aria-label; this asserts the two have not drifted apart.
    const marker = screen.getByRole('status', { name: 'Placeholder — needs your content' });
    expect(marker).toBeVisible();
    expect(marker).toHaveTextContent('Placeholder — needs your content');
    expect(marker).toHaveAttribute('title', note);
    expect(screen.getByText('—')).toBeVisible();
    expect(screen.queryByText(/from[- ]price/i)).not.toBeInTheDocument();

    rerender(<PendingFact note={note} />);
    expect(screen.queryByText('—')).not.toBeInTheDocument();
  });
});
