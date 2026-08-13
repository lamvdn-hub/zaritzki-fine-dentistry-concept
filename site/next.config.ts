import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL('./', import.meta.url)),

  /**
   * Sent on every response, including the images and any other static asset —
   * which is what makes this different from the robots meta tag, since that
   * only exists inside an HTML document. `noimageindex` matters here: the
   * interiors are stock, and an indexed image of a hotel lobby attributed to a
   * named dental practice is exactly the failure mode to avoid.
   *
   * See `app/robots.ts` for why this demo is kept out of search entirely.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
