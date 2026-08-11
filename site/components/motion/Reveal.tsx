'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Reveal.module.css';

type RevealState = 'visible' | 'hidden' | 'revealed';

/**
 * The page's only entrance animation: a single 400ms fade and 12px rise on
 * --ease-out. Static and unsupported clients keep the server-visible state.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>('visible');

  useEffect(() => {
    const node = ref.current;
    const supportsMotion =
      typeof window.matchMedia === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!node || !supportsMotion || typeof window.IntersectionObserver !== 'function') return;

    setState('hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState('revealed');
        observer.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        styles.reveal,
        state === 'hidden' ? styles.hidden : '',
        state === 'revealed' ? styles.revealed : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
