import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/system/Button';

describe('Button', () => {
  it('renders an anchor when given an href', () => {
    render(<Button href="tel:+493085403000">Call</Button>);

    expect(screen.getByRole('link', { name: 'Call' })).toHaveAttribute(
      'href',
      'tel:+493085403000',
    );
  });

  it('renders a button element when given an onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Book</Button>);

    await user.click(screen.getByRole('button', { name: 'Book' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('hugs its label with loaded inline-flex CSS rather than stretching', () => {
    render(<Button onClick={() => {}}>Book a first consultation</Button>);
    const button = screen.getByRole('button');
    const computed = window.getComputedStyle(button);

    expect(button.tagName).toBe('BUTTON');
    expect(computed.display).toBe('inline-flex');
    expect(computed.width).toBe('auto');
  });

  it('marks a decorative trailing icon as hidden from assistive technology', () => {
    render(<Button href="/x" iconRight={<svg data-testid="arrow" />}>Go</Button>);

    expect(screen.getByTestId('arrow').parentElement).toHaveAttribute('aria-hidden', 'true');
  });
});
