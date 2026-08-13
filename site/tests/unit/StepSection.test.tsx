import { act, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Reveal } from '@/components/motion/Reveal';
import { LocationProvider } from '@/lib/LocationProvider';
import { translator } from '@/lib/i18n';
import en from '@/messages/en.json';
import { StepSection } from '@/components/walk/StepSection';
import { RoomSection } from '@/components/walk/StepSections';

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

function stubMotionPreference(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduced,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) satisfies MediaQueryList);
}

afterEach(() => {
  ControlledIntersectionObserver.instances = [];
  vi.unstubAllGlobals();
});

describe('Reveal', () => {
  it('server-renders visible without a transform when JavaScript does not mount', () => {
    const host = document.createElement('div');
    host.innerHTML = renderToString(
      <Reveal>
        <span>Already readable</span>
      </Reveal>,
    );
    document.body.append(host);
    const reveal = host.firstElementChild as HTMLElement;

    expect(window.getComputedStyle(reveal).opacity).toBe('1');
    expect(window.getComputedStyle(reveal).transform).toBe('none');

    host.remove();
  });

  it('stays visible without a transform when reduced motion is requested', async () => {
    stubMotionPreference(true);
    vi.stubGlobal('IntersectionObserver', ControlledIntersectionObserver);
    render(
      <Reveal>
        <span>Calm content</span>
      </Reveal>,
    );
    const reveal = screen.getByText('Calm content').parentElement as HTMLElement;

    await waitFor(() => expect(window.getComputedStyle(reveal).opacity).toBe('1'));
    expect(window.getComputedStyle(reveal).transform).toBe('none');
  });

  it('stays visible when IntersectionObserver is unavailable', async () => {
    stubMotionPreference(false);
    vi.stubGlobal('IntersectionObserver', undefined);
    render(
      <Reveal>
        <span>Unsupported-client content</span>
      </Reveal>,
    );
    const reveal = screen.getByText('Unsupported-client content').parentElement as HTMLElement;

    await waitFor(() => expect(window.getComputedStyle(reveal).opacity).toBe('1'));
    expect(window.getComputedStyle(reveal).transform).toBe('none');
  });

  it('opts into the 12px pre-reveal state, then reveals once in view', async () => {
    stubMotionPreference(false);
    vi.stubGlobal('IntersectionObserver', ControlledIntersectionObserver);
    render(
      <Reveal delay={80}>
        <span>Motion-enabled content</span>
      </Reveal>,
    );
    const reveal = screen.getByText('Motion-enabled content').parentElement as HTMLElement;

    await waitFor(() => expect(window.getComputedStyle(reveal).opacity).toBe('0'));
    expect(window.getComputedStyle(reveal).transform).toBe('translateY(12px)');
    expect(reveal.style.transitionDelay).toBe('80ms');

    const observer = ControlledIntersectionObserver.instances.find((instance) =>
      instance.targets.has(reveal),
    );
    expect(observer).toBeDefined();

    act(() => observer!.trigger(reveal, true));
    expect(window.getComputedStyle(reveal).opacity).toBe('1');
    expect(window.getComputedStyle(reveal).transform).toBe('none');
    expect(observer!.targets.size).toBe(0);

    act(() => observer!.trigger(reveal, false));
    expect(window.getComputedStyle(reveal).opacity).toBe('1');
  });
});

describe('StepSection', () => {
  it('anchors itself so the step rail can navigate to it', () => {
    const { container } = render(
      <StepSection
        anchor="step-lounge"
        eyebrow="02 — The lounge"
        headline="You will not be kept waiting in a queue"
        body="Appointments are spaced."
        image="/images/mitte/lounge-generated.jpg"
        imageSide="left"
        tone="dark"
      />,
    );

    expect(container.querySelector('#step-lounge')).toBeInTheDocument();
  });

  it('renders the headline as an h2 because h1 belongs to the hero', () => {
    render(
      <StepSection
        anchor="step-lounge"
        eyebrow="02 — The lounge"
        headline="You will not be kept waiting in a queue"
        body="Appointments are spaced."
        image="/images/mitte/lounge-generated.jpg"
        imageSide="left"
        tone="dark"
      />,
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'You will not be kept waiting in a queue',
    );
  });

  it('leaves atmospheric imagery out of the accessibility tree', () => {
    render(
      <StepSection
        anchor="step-room"
        eyebrow="04 — The room"
        headline="Lamplight, not a light in your eyes"
        body="Designed to look like the rest."
        image="/images/mitte/treatment-room-generated.jpg"
        imageSide="right"
        tone="dark"
      />,
    );

    expect(screen.getByTestId('step-image')).toHaveAttribute('alt', '');
  });

  it('exposes tone and image-side layout states on the split section', () => {
    const { container } = render(
      <StepSection
        anchor="step-talk"
        eyebrow="03 — The talk"
        headline="Nothing happens until we have talked"
        body="Your first appointment is a conversation."
        note="A written estimate follows."
        image="/images/mitte/consultation.jpg"
        imageSide="right"
        tone="light"
      >
        <div>Treatment schedule</div>
      </StepSection>,
    );
    const section = container.querySelector('#step-talk');

    expect(section).toHaveAttribute('data-tone', 'light');
    expect(section).toHaveAttribute('data-image', 'right');
    expect(screen.getByText('A written estimate follows.')).toBeInTheDocument();
    expect(screen.getByText('Treatment schedule')).toBeInTheDocument();
  });
});

describe('RoomSection', () => {
  const t = translator(en as Record<string, unknown>);

  it('names only the clinician the practice publishes, and marks the rest as pending', () => {
    render(
      <LocationProvider>
        <RoomSection t={t} />
      </LocationProvider>,
    );

    expect(screen.getByText(/Dr\. med\. dent\. Felix Zaritzki\./)).toBeInTheDocument();
    // The team's university-hospital background was never confirmed by the practice.
    expect(screen.queryByText(/university hospital/i)).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Placeholder — needs your content' })).toHaveAttribute(
      'title',
      'Names and credentials beyond Dr. Zaritzki not supplied',
    );
  });
});
