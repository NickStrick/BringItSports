// src/lib/seo.ts
// Single source of truth for business identity + search metadata
// (layout metadata, robots, sitemap, LocalBusiness JSON-LD, per-page titles).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bringitsports.com').replace(/\/$/, '');

export const BUSINESS = {
  name: 'Bring It Sports Academy',
  shortName: 'Bring It Sports',
  // TODO: fill in before launch — blank fields are left out of the JSON-LD.
  email: '',
  phone: '',
  location: {
    streetAddress: '',
    addressLocality: '',
    addressRegion: '',
    postalCode: '',
    addressCountry: 'US',
  },
  services: ['Batting cages', 'Pickleball', 'Facility space rental', 'The Market'],
  sameAs: [
    'https://www.facebook.com/Bringitsports/',
  ],
  // Bump ?v= when the share image changes so social apps drop their cached preview.
  ogImage: '/bringItSports/bring-it-large.jpg?v=1',
} as const;

export const DEFAULT_TITLE = 'Bring It Sports Academy | Batting Cages, Pickleball & Space Rental';
export const DEFAULT_DESCRIPTION =
  'Bring It Sports Academy offers indoor batting cages, pickleball, and facility space rental for teams, clinics, camps, and events — plus The Market for drinks, snacks, and gear. Opening December 1st.';

export const KEYWORDS = [
  'Bring It Sports Academy',
  'Bring It Sports',
  'bringitsports',
  'bringitsportsacademy',
  'batting cages',
  'indoor batting cages',
  'baseball batting cages',
  'softball batting cages',
  'hitting lessons',
  'pickleball',
  'indoor pickleball',
  'pickleball court rental',
  'sports facility rental',
  'team practice space',
  'sports academy',
];

/** Per-route search titles/descriptions. Keys are page slugs ('' = home). */
// Keep in sync with `pages` in src/mocks/bringitConfig.ts.
export const PAGE_SEO: Record<string, { title: string; description: string }> = {
  'space-rental': {
    title: 'Space Rental',
    description: 'Rent the Bring It Sports Academy facility for team practices, clinics, camps, tryouts, birthday parties, and private events.',
  },
  'batting-cages': {
    title: 'Batting Cages',
    description: 'Indoor batting cages on turf for baseball and softball — individual cage time, team rentals, and private hitting and pitching lessons.',
  },
  pickleball: {
    title: 'Pickleball',
    description: 'Indoor pickleball at Bring It Sports Academy — open play, leagues, and private court reservations for every skill level.',
  },
  market: {
    title: 'The Market',
    description: 'Drinks, snacks, gear, and Bring It merch on site at Bring It Sports Academy.',
  },
  contact: {
    title: 'Contact',
    description: 'Contact Bring It Sports Academy to book batting cages, reserve a pickleball court, or rent the facility.',
  },
};

/** Routes to list in sitemap.xml. */
export const SITEMAP_ROUTES = ['', ...Object.keys(PAGE_SEO)];
