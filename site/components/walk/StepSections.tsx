'use client';

import { TreatmentSchedule } from '@/components/content/TreatmentSchedule';
import { PendingFact } from '@/components/dev/PendingFact';
import { useLocation } from '@/lib/LocationProvider';
import { OPEN_FACTS } from '@/lib/openFacts';
import { StepSection } from './StepSection';

type Translator = (key: string, values?: Record<string, string | number>) => string;

export function LoungeSection({ t }: { t: Translator }) {
  const { practice } = useLocation();

  return (
    <StepSection
      anchor="step-lounge"
      eyebrow={t('lounge.eyebrow')}
      headline={t('lounge.headline')}
      body={t('lounge.body')}
      note={t('lounge.hours')}
      image={practice.images.lounge}
      imageSide="left"
      tone="dark"
    />
  );
}

export function TalkSection({ t }: { t: Translator }) {
  const { practice } = useLocation();

  return (
    <StepSection
      anchor="step-talk"
      eyebrow={t('talk.eyebrow')}
      headline={t('talk.headline')}
      body={t('talk.body')}
      image={practice.images.consultation}
      imageSide="right"
      tone="light"
    >
      <TreatmentSchedule t={t} />
    </StepSection>
  );
}

export function RoomSection({ t }: { t: Translator }) {
  const { practice } = useLocation();

  return (
    <StepSection
      anchor="step-room"
      eyebrow={t('room.eyebrow')}
      headline={t('room.headline')}
      body={t('room.body')}
      note={
        <>
          {t('room.clinician')}
          {OPEN_FACTS.clinicians.known ? null : (
            <>
              {' '}
              <PendingFact note={OPEN_FACTS.clinicians.note} />
            </>
          )}
        </>
      }
      image={practice.images.treatmentRoom}
      imageSide="left"
      tone="dark"
    />
  );
}
