import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { StepRail } from '@/components/walk/StepRail';
import { STEPS } from '@/lib/steps';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);
const originalInnerWidth = window.innerWidth;

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

function addPractices(top: number) {
  const practices = document.createElement('section');
  practices.id = 'practices';
  practices.getBoundingClientRect = () => ({
    top,
    right: 0,
    bottom: top + 400,
    left: 0,
    width: 1200,
    height: 400,
    x: 0,
    y: top,
    toJSON: () => ({}),
  });
  document.body.append(practices);
  return practices;
}

afterEach(() => {
  document.body.removeAttribute('data-past-hero');
  document.getElementById('practices')?.remove();
  setViewportWidth(originalInnerWidth);
});

describe('StepRail', () => {
  it('is real navigation, not decoration', () => {
    render(<StepRail t={t} />);
    expect(screen.getByRole('navigation', { name: 'The visit, step by step' })).toBeInTheDocument();
  });

  it('renders exactly the five steps, in order, as in-page anchors', () => {
    render(<StepRail t={t} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      STEPS.map((step) => `#${step.anchor}`),
    );
    expect(links.map((link) => link.textContent)).toEqual([
      '01The street', '02The lounge', '03The talk', '04The room', '05Leaving',
    ]);
  });

  it('marks the first step current on load', () => {
    render(<StepRail t={t} />);
    expect(screen.getByRole('link', { current: 'step' })).toHaveTextContent('The street');
  });

  it('fixes beneath the header after the hero on desktop, then docks on return', async () => {
    setViewportWidth(1024);
    addPractices(500);
    render(<StepRail t={t} />);
    const rail = screen.getByRole('navigation');

    expect(rail).toHaveAttribute('data-position', 'docked');

    document.body.setAttribute('data-past-hero', 'true');
    await waitFor(() => expect(rail).toHaveAttribute('data-position', 'fixed'));

    document.body.setAttribute('data-past-hero', 'false');
    await waitFor(() => expect(rail).toHaveAttribute('data-position', 'docked'));
  });

  it('releases when the practices section reaches the desktop rail position', async () => {
    setViewportWidth(1024);
    let practicesTop = 500;
    const practices = addPractices(practicesTop);
    practices.getBoundingClientRect = () => ({
      top: practicesTop,
      right: 0,
      bottom: practicesTop + 400,
      left: 0,
      width: 1200,
      height: 400,
      x: 0,
      y: practicesTop,
      toJSON: () => ({}),
    });
    render(<StepRail t={t} />);
    const rail = screen.getByRole('navigation');

    document.body.setAttribute('data-past-hero', 'true');
    await waitFor(() => expect(rail).toHaveAttribute('data-position', 'fixed'));

    practicesTop = 62;
    window.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(rail).toHaveAttribute('data-position', 'released'));
  });

  it('never fixes on mobile', async () => {
    setViewportWidth(860);
    addPractices(500);
    document.body.setAttribute('data-past-hero', 'true');
    render(<StepRail t={t} />);

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toHaveAttribute('data-position', 'docked');
    });
  });

  it('can fix before the practices section is composed', async () => {
    setViewportWidth(1024);
    document.body.setAttribute('data-past-hero', 'true');
    render(<StepRail t={t} />);

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toHaveAttribute('data-position', 'fixed');
    });
  });
});
