import Image from 'next/image';
import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import styles from './StepSection.module.css';

export function StepSection({
  anchor,
  eyebrow,
  headline,
  body,
  note,
  image,
  imageSide,
  tone,
  children,
}: {
  anchor: string;
  eyebrow: string;
  headline: string;
  body: string;
  note?: ReactNode;
  image: string;
  imageSide: 'left' | 'right';
  tone: 'dark' | 'light';
  children?: ReactNode;
}) {
  return (
    <section className={styles.section} id={anchor} data-tone={tone} data-image={imageSide}>
      <div className={styles.media}>
        <Image
          className={styles.image}
          src={image}
          alt=""
          data-testid="step-image"
          fill
          sizes="(max-width: 860px) 100vw, 50vw"
        />
      </div>
      <div className={styles.copy}>
        <Reveal>
          <p className="eyebrow" style={{ color: tone === 'dark' ? 'var(--gold-light)' : undefined }}>
            {eyebrow}
          </p>
          <h2 className={styles.headline}>{headline}</h2>
          <p className={styles.body}>{body}</p>
          {note ? <p className={styles.note}>{note}</p> : null}
          {children ? <div className={styles.children}>{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
