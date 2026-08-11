import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationProvider, useLocation } from '@/lib/LocationProvider';

function Probe() {
  const { practice, setLocation } = useLocation();
  return (
    <div>
      <span data-testid="street">{practice.street}</span>
      <button onClick={() => setLocation('charlottenburg')}>switch</button>
    </div>
  );
}

describe('LocationProvider', () => {
  it('defaults to Mitte', () => {
    render(<LocationProvider><Probe /></LocationProvider>);
    expect(screen.getByTestId('street')).toHaveTextContent('Jägerstraße 41');
  });

  it('switches practice and persists the choice', async () => {
    const user = userEvent.setup();
    render(<LocationProvider><Probe /></LocationProvider>);
    await user.click(screen.getByRole('button', { name: 'switch' }));
    expect(screen.getByTestId('street')).toHaveTextContent('Kurfürstendamm 52');
    expect(window.localStorage.getItem('zaritzki.practice')).toBe('charlottenburg');
  });

  it('restores a persisted choice on mount', () => {
    window.localStorage.setItem('zaritzki.practice', 'charlottenburg');
    render(<LocationProvider><Probe /></LocationProvider>);
    expect(screen.getByTestId('street')).toHaveTextContent('Kurfürstendamm 52');
  });

  it('ignores a corrupt persisted value rather than crashing', () => {
    window.localStorage.setItem('zaritzki.practice', 'atlantis');
    render(<LocationProvider><Probe /></LocationProvider>);
    expect(screen.getByTestId('street')).toHaveTextContent('Jägerstraße 41');
  });

  it('accepts a server-provided initial location from the query parameter', () => {
    render(<LocationProvider initialLocation="charlottenburg"><Probe /></LocationProvider>);
    expect(screen.getByTestId('street')).toHaveTextContent('Kurfürstendamm 52');
  });

  it('prefers a server-provided initial location over persisted storage', () => {
    window.localStorage.setItem('zaritzki.practice', 'charlottenburg');
    render(<LocationProvider initialLocation="mitte"><Probe /></LocationProvider>);
    expect(screen.getByTestId('street')).toHaveTextContent('Jägerstraße 41');
  });

  it('switches practice when localStorage refuses writes', async () => {
    const user = userEvent.setup();
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    try {
      render(<LocationProvider><Probe /></LocationProvider>);
      await user.click(screen.getByRole('button', { name: 'switch' }));
      expect(screen.getByTestId('street')).toHaveTextContent('Kurfürstendamm 52');
    } finally {
      setItem.mockRestore();
    }
  });
});
