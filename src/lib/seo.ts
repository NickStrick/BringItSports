// src/lib/seo.ts
// Single source of truth for business identity + search metadata
// (layout metadata, robots, sitemap, Person JSON-LD, per-page titles).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.strickersan.com').replace(/\/$/, '');

export const BUSINESS = {
  name: 'Stricker-san',
  founder: 'Mark Stricker',
  jobTitle: 'Emerging Tech Educator & Solutions Engineer',
  email: 'markanthonystricker@gmail.com',
  location: { addressLocality: 'Chicago', addressRegion: 'IL', addressCountry: 'US' },
  knowsAbout: ['Agentic AI', 'Cybersecurity', 'Observability', 'Emerging technologies', 'Enterprise solutions'],
  sameAs: [
    'https://stricker.substack.com/',
    'https://www.linkedin.com/in/markanthonystricker/',
    'https://www.youtube.com/@MarkStricker1',
    'https://www.strickerdigital.com/',
  ],
  // Bump ?v= when the share image changes so social apps drop their cached preview.
  ogImage: '/mark/backdrop.jpg?v=1',
} as const;

export const DEFAULT_TITLE = 'Mark Stricker | Emerging Tech Educator & Solutions Engineer';
export const DEFAULT_DESCRIPTION =
  'Mark Stricker (Stricker-san) is a solutions engineer with 10+ years scoping, selling, demonstrating, and implementing enterprise solutions. Writing and teaching on Agentic AI, Cybersecurity, Observability, and emerging technologies.';

export const KEYWORDS = [
  'Mark Stricker',
  'Stricker-san',
  'strickersan',
  'Mark Anthony Stricker',
  'solutions engineer',
  'emerging tech educator',
  'Agentic AI',
  'AI agents',
  'cybersecurity',
  'observability',
  'enterprise solutions',
  'emerging technologies',
  'tech blog',
  'Substack newsletter',
  'Stricker Digital',
  'Chicago solutions engineer',
];

/** Per-route search titles/descriptions. Keys are page slugs ('' = home). */
// The site is currently a single page (Blog, Teachings, About, Testimonials are anchors);
// add entries here when separate routes are created.
export const PAGE_SEO: Record<string, { title: string; description: string }> = {};

/** Routes to list in sitemap.xml. */
export const SITEMAP_ROUTES = ['', ...Object.keys(PAGE_SEO)];
