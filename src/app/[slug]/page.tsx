// Server Component by default — no 'use client'
import { Suspense } from 'react';
import ClientSlugPage from './ClientSlugPage';

// Custom pages from `config.pages` — each renders at /[slug]
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<main className="bg-app w-[100vw]"><div className="section w-[100vw]"><span className='loading-span w-[100vw]'>Loading…</span></div></main>}>
      <ClientSlugPage slug={slug} />
    </Suspense>
  );
}
