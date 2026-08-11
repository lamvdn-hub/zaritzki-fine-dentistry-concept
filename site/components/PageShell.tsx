'use client';

import { SiteHeader } from '@/components/chrome/SiteHeader';
import { StickyBookingBar } from '@/components/chrome/StickyBookingBar';
import { ClosingCta } from '@/components/content/ClosingCta';
import { CostPanel } from '@/components/content/CostPanel';
import { PracticesSection } from '@/components/content/PracticesSection';
import { ProofBand } from '@/components/content/ProofBand';
import { Hero } from '@/components/walk/Hero';
import { LoungeSection, RoomSection, TalkSection } from '@/components/walk/StepSections';
import { translator, type Locale, type Messages } from '@/lib/i18n';
import { LocationProvider } from '@/lib/LocationProvider';
import type { LocationId } from '@/lib/locations';

export function PageShell({
  messages,
  locale,
  initialLocation,
}: {
  messages: Messages;
  locale: Locale;
  initialLocation?: LocationId;
}) {
  const t = translator(messages);

  return (
    <LocationProvider initialLocation={initialLocation}>
      <SiteHeader t={t} locale={locale} />
      <main id="content">
        <Hero t={t} />
        <LoungeSection t={t} />
        <TalkSection t={t} />
        <RoomSection t={t} />
        <CostPanel t={t} />
        <ProofBand t={t} />
        <PracticesSection t={t} />
        <ClosingCta t={t} />
      </main>
      <StickyBookingBar t={t} />
    </LocationProvider>
  );
}
