import { BUSINESS, DEFAULT_DESCRIPTION, SITE_URL } from "@/lib/seo";

export default function SeoLocalBusinessSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    "name": BUSINESS.founder,
    "alternateName": BUSINESS.name,
    "jobTitle": BUSINESS.jobTitle,
    "description": DEFAULT_DESCRIPTION,
    "url": SITE_URL,
    "email": BUSINESS.email,
    "image": `${SITE_URL}${BUSINESS.ogImage}`,
    "address": { "@type": "PostalAddress", ...BUSINESS.location },
    "knowsAbout": BUSINESS.knowsAbout,
    "sameAs": BUSINESS.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
