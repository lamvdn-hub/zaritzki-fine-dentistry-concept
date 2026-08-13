import type { MetadataRoute } from 'next';

/**
 * This is an unofficial concept for a real, named Berlin dental practice. It
 * carries their trading name, both real addresses and their real telephone
 * number, so an indexed copy of it would compete with — and could be mistaken
 * for — the practice's own site.
 *
 * Disallow everything, for every agent. This is one of three overlapping
 * defences, because any one of them can be missed by a given crawler:
 *   1. this file,
 *   2. the `noindex, nofollow` robots meta tag in the locale layout,
 *   3. the `X-Robots-Tag` response header in `next.config.ts`, which is the
 *      only one of the three that also covers the images.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  };
}
