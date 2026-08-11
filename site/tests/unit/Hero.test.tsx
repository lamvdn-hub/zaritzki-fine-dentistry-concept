import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hero } from '@/components/walk/Hero';
import { LocationProvider } from '@/lib/LocationProvider';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';

const t = translator(en as Record<string, unknown>);

class ControlledIntersectionObserver implements IntersectionObserver {
  static instances: ControlledIntersectionObserver[] = [];

  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  readonly targets = new Set<Element>();
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.rootMargin = options?.rootMargin ?? '0px';
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold ?? 0];
    ControlledIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.targets.add(target);
  }

  unobserve(target: Element) {
    this.targets.delete(target);
  }

  disconnect() {
    this.targets.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(target: Element, isIntersecting: boolean) {
    const rect = target.getBoundingClientRect();
    const entry = {
      boundingClientRect: rect,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: isIntersecting ? rect : new DOMRectReadOnly(),
      isIntersecting,
      rootBounds: null,
      target,
      time: 0,
    } satisfies IntersectionObserverEntry;

    this.callback([entry], this);
  }
}

function renderHero() {
  return render(
    <LocationProvider>
      <Hero t={t} />
    </LocationProvider>,
  );
}

afterEach(() => {
  document.body.removeAttribute('data-past-hero');
  ControlledIntersectionObserver.instances = [];
  vi.unstubAllGlobals();
});

describe('Hero', () => {
  it('states what this is and where, in the eyebrow', () => {
    renderHero();

    expect(screen.getByText('Private Zahnarztpraxis · Berlin Mitte')).toBeInTheDocument();
  });

  it('carries the headline as the page h1', () => {
    renderHero();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'A calmer kind of dental visit',
    );
  });

  it('qualifies the audience before anyone books', () => {
    renderHero();

    expect(
      screen.getByText(
        /Privately insured and self-paying patients · Monday to Friday, 08:00–20:00/,
      ),
    ).toBeInTheDocument();
  });

  it('exposes a primary booking action in the first viewport', () => {
    renderHero();

    expect(screen.getByRole('link', { name: /Book a first consultation/ })).toBeInTheDocument();
  });

  it('gives the hero image an empty alt because it is atmosphere, not information', () => {
    renderHero();

    expect(screen.getByTestId('hero-image')).toHaveAttribute('alt', '');
  });

  it('publishes the sentinel lifecycle for past-hero consumers and clears it on cleanup', () => {
    vi.stubGlobal('IntersectionObserver', ControlledIntersectionObserver);
    const { container, unmount } = renderHero();
    const sentinel = container.querySelector('#step-street > div[aria-hidden="true"]');

    expect(sentinel).not.toBeNull();
    const observer = ControlledIntersectionObserver.instances.find((instance) =>
      instance.targets.has(sentinel!),
    );
    expect(observer).toBeDefined();

    act(() => observer!.trigger(sentinel!, false));
    expect(document.body).toHaveAttribute('data-past-hero', 'true');

    act(() => observer!.trigger(sentinel!, true));
    expect(document.body).toHaveAttribute('data-past-hero', 'false');

    unmount();
    expect(document.body).not.toHaveAttribute('data-past-hero');
  });
});
