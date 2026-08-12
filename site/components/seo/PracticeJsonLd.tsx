import { PRACTICE_ORDER, getPractice } from '@/lib/locations';

/**
 * aggregateRating and review are deliberately omitted. Google's structured-data
 * policy disallows self-serving review markup for a business's own reviews, and
 * these ratings already live on Google. They are displayed on the page; they are
 * not claimed in markup.
 */
export function PracticeJsonLd() {
  return (
    <>
      {PRACTICE_ORDER.map((id) => {
        const p = getPractice(id);
        const record = {
          '@context': 'https://schema.org',
          '@type': 'Dentist',
          name: p.legalName,
          address: {
            '@type': 'PostalAddress',
            streetAddress: p.street,
            postalCode: p.postalCode,
            addressLocality: p.city,
            addressCountry: 'DE',
          },
          telephone: p.phone,
          areaServed: 'Berlin',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: p.hours.days.map(
                (d) =>
                  ({ Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday' })[d],
              ),
              opens: p.hours.opens,
              closes: p.hours.closes,
            },
          ],
          hasMap: p.mapsUrl,
        };
        return (
          <script
            key={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(record) }}
          />
        );
      })}
    </>
  );
}
