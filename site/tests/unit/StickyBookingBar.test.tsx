import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationProvider, useLocation } from '@/lib/LocationProvider';
import { StickyBookingBar } from '@/components/chrome/StickyBookingBar';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);
const DISMISS_KEY = 'zaritzki.stickyDismissed';

function setup() {
  return render(
    <LocationProvider>
      <StickyBookingBar t={t} />
    </LocationProvider>,
  );
}

function LocationControl() {
  const { setLocation } = useLocation();
  return <button type="button" onClick={() => setLocation('charlottenburg')}>Switch practice</button>;
}

afterEach(() => {
  document.body.removeAttribute('data-past-hero');
});

describe('StickyBookingBar', () => {
  it('starts hidden so it does not cover the hero', () => {
    setup();

    expect(screen.getByTestId('sticky-bar')).toHaveAttribute('data-visible', 'false');
  });

  it('carries the current practice address and insurance qualifier', () => {
    setup();

    expect(screen.getByTestId('sticky-bar')).toHaveTextContent('Jägerstraße 41');
    expect(screen.getByTestId('sticky-bar')).toHaveTextContent('privately insured & self-paying');
  });

  it('follows the hero sentinel while mounted', async () => {
    setup();
    const bar = screen.getByTestId('sticky-bar');

    document.body.setAttribute('data-past-hero', 'true');
    await waitFor(() => expect(bar).toHaveAttribute('data-visible', 'true'));

    document.body.setAttribute('data-past-hero', 'false');
    await waitFor(() => expect(bar).toHaveAttribute('data-visible', 'false'));
  });

  it('updates the summary and booking destination for the selected practice', async () => {
    const user = userEvent.setup();
    render(
      <LocationProvider>
        <LocationControl />
        <StickyBookingBar t={t} />
      </LocationProvider>,
    );
    document.body.setAttribute('data-past-hero', 'true');
    await waitFor(() => expect(screen.getByTestId('sticky-bar')).toHaveAttribute('data-visible', 'true'));

    await user.click(screen.getByRole('button', { name: 'Switch practice' }));

    expect(screen.getByTestId('sticky-bar')).toHaveTextContent('Kurfürstendamm 52');
    expect(screen.getByRole('link', { name: 'Book a first consultation' })).toHaveAttribute(
      'href',
      'https://www.doctolib.de/zahnarztpraxis/berlin/fine-dentistry-dr-felix-zaritzki',
    );
  });

  it('stays dismissed for the session but not beyond it', async () => {
    const user = userEvent.setup();
    setup();
    document.body.setAttribute('data-past-hero', 'true');
    await waitFor(() => expect(screen.getByTestId('sticky-bar')).toHaveAttribute('data-visible', 'true'));

    await user.click(screen.getByRole('button', { name: 'Hide this bar' }));

    expect(screen.queryByTestId('sticky-bar')).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(DISMISS_KEY)).toBe('1');
    expect(window.localStorage.getItem(DISMISS_KEY)).toBeNull();
  });

  it('restores a session dismissal that existed before mount', () => {
    window.sessionStorage.setItem(DISMISS_KEY, '1');

    setup();

    expect(screen.queryByTestId('sticky-bar')).not.toBeInTheDocument();
  });

  it('continues rendering when session storage refuses the restore read', () => {
    const getItem = vi.spyOn(window.sessionStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable', 'SecurityError');
    });

    setup();

    expect(screen.getByTestId('sticky-bar')).toBeInTheDocument();
    getItem.mockRestore();
  });

  it('dismisses immediately when session storage refuses the write', async () => {
    const user = userEvent.setup();
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable', 'SecurityError');
    });
    setup();
    document.body.setAttribute('data-past-hero', 'true');
    await waitFor(() => expect(screen.getByTestId('sticky-bar')).toHaveAttribute('data-visible', 'true'));

    await user.click(screen.getByRole('button', { name: 'Hide this bar' }));

    expect(screen.queryByTestId('sticky-bar')).not.toBeInTheDocument();
    setItem.mockRestore();
  });

  it('carries no urgency or scarcity language', () => {
    setup();
    const text = screen.getByTestId('sticky-bar').textContent ?? '';

    for (const banned of ['now', 'limited', 'hurry', 'today only', '!']) {
      expect(text.toLowerCase()).not.toContain(banned.toLowerCase());
    }
  });

  it('allows its booking controls to wrap on narrow screens', () => {
    setup();
    const actions = screen.getByText('Hide this bar').parentElement;

    expect(actions).not.toBeNull();
    expect(window.getComputedStyle(actions!).flexWrap).toBe('wrap');
  });
});
