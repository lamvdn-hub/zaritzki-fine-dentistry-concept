import { notFound } from 'next/navigation';
import { PageShell } from '@/components/PageShell';
import { SiteFooter } from '@/components/chrome/SiteFooter';
import { getMessages, isLocale, translator } from '@/lib/i18n';
import { PRACTICES, type LocationId } from '@/lib/locations';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ praxis?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { praxis } = await searchParams;
  const initialLocation =
    typeof praxis === 'string' && Object.prototype.hasOwnProperty.call(PRACTICES, praxis)
      ? (praxis as LocationId)
      : undefined;
  const messages = await getMessages(locale);
  const t = translator(messages);

  return (
    <>
      <PageShell messages={messages} locale={locale} initialLocation={initialLocation} />
      <SiteFooter t={t} />
    </>
  );
}
