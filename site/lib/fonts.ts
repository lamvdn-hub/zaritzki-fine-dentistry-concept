import { Cormorant_Garamond, Mulish } from 'next/font/google';

export const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display-loaded',
});

export const mulish = Mulish({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-sans-loaded',
});
