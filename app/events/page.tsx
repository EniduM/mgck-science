import type { Metadata } from 'next';
import Navbar from '@/src/components/Navbar';
import FloatingParticles from '@/src/components/FloatingParticles';
import { buildMetadata } from '@/src/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Events | Mahamaya Girls\' College Senior Science Society',
  description:
    "Browse science events, workshops, and initiatives organized by the Mahamaya Girls' College Senior Science Society.",
  path: '/events',
});

export default function EventsPage() {
  return (
    <>
      <FloatingParticles />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="rounded-2xl bg-white/5 border border-amber-500/20 p-8">
          <h1 className="text-4xl font-bold text-white mb-4">Events</h1>
          <p className="text-gray-300 leading-relaxed">
            Discover the latest science events, projects, and activities by visiting the Projects and Activities section.
          </p>
          <a href="/projects" className="inline-block mt-6 px-5 py-2.5 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition-colors">
            View Projects and Activities
          </a>
        </section>
      </main>
    </>
  );
}
