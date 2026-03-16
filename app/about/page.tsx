import type { Metadata } from 'next';
import Navbar from '@/src/components/Navbar';
import FloatingParticles from '@/src/components/FloatingParticles';
import { buildMetadata } from '@/src/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About Us | Mahamaya Girls\' College Senior Science Society',
  description:
    "Learn about the mission and educational purpose of the Mahamaya Girls' College Senior Science Society.",
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <FloatingParticles />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="rounded-2xl bg-white/5 border border-amber-500/20 p-8">
          <h1 className="text-4xl font-bold text-white mb-4">About the Society</h1>
          <p className="text-gray-300 leading-relaxed">
            The Senior Science Society of Mahamaya Girls&apos; College is dedicated to developing scientific curiosity,
            collaboration, and academic excellence. The society organizes educational events, science projects,
            competitions, and learning resources to support students in their scientific journey.
          </p>
        </section>
      </main>
    </>
  );
}
