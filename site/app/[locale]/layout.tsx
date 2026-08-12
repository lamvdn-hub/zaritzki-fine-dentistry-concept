import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cormorant, mulish } from '@/lib/fonts';
import { LOCALES, isLocale, getMessages, translator } from '@/lib/i18n';
import { PracticeJsonLd } from '@/components/seo/PracticeJsonLd';
import '@/app/globals.css';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translator(await getMessages(locale));
  return { title: t('meta.title'), description: t('meta.description') };
}

const DIRECTION_CONTRACT = `
  IMPECCABLE DIRECTION CONTRACT — surface seed 2c7cb46c
  THESIS: The page walks a first appointment in order — street, lounge, talk, room, leaving —
    because what anxious patients fear is the unknown. It refuses the category arrangement of
    hero, trust bar, service icon-tiles, why-us, testimonial, CTA.
  OWN-WORLD: The Zaritzki design system, unchanged. Espresso #241A12 and ivory #F5F0E6 grounds,
    brass #B58A3E as the only accent fill, Cormorant Garamond over Mulish, warm brown shadows,
    4px controls and 10px cards, motion at 140/220/400ms with no overshoot.
  STORY: A private-pay patient in Berlin sees the whole visit before committing to it, learns
    the practice cannot treat statutory patients before booking rather than after, and books.
  FIRST VIEWPORT: The entrance at dusk, full bleed, espresso gradient weighted left. Eyebrow,
    serif headline, lede, the private/self-pay and 08:00-20:00 qualifier, then the brass primary
    action hugging its label. The five-step rail sits along the bottom as real navigation.
  FORM: "The Visit" — candidate 1 of the grounded list. The roll assigned candidate 7
    ("the materials index"); it was built, shown, and rejected by the user on product-clarity
    grounds. A user decision beats the roll.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${cormorant.variable} ${mulish.variable}`}>
      <body>
        <div dangerouslySetInnerHTML={{ __html: `<!--${DIRECTION_CONTRACT}-->` }} />
        <PracticeJsonLd />
        {children}
      </body>
    </html>
  );
}
