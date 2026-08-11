import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ClosingCta } from '@/components/content/ClosingCta';
import { LocationProvider, useLocation } from '@/lib/LocationProvider';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

function PracticeSwitchProbe() {
  const { setLocation } = useLocation();
  return <button onClick={() => setLocation('charlottenburg')}>Choose Charlottenburg</button>;
}

function renderClosingCta() {
  return render(
    <LocationProvider>
      <PracticeSwitchProbe />
      <ClosingCta t={t} />
    </LocationProvider>,
  );
}

describe('ClosingCta', () => {
  it('updates the booking destination with the selected practice', async () => {
    const user = userEvent.setup();
    renderClosingCta();

    const bookingLink = screen.getByRole('link', { name: 'Book at Mitte' });
    expect(bookingLink).toHaveAttribute(
      'href',
      'https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki?pid=practice-540639',
    );

    await user.click(screen.getByRole('button', { name: 'Choose Charlottenburg' }));

    expect(screen.getByRole('link', { name: 'Book at Charlottenburg' })).toHaveAttribute(
      'href',
      'https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki',
    );
  });

  it('marks the atmospheric photograph as decorative', () => {
    renderClosingCta();

    expect(screen.getByTestId('closing-image')).toHaveAttribute('alt', '');
  });
});
