import type { Metadata } from 'next';
import Navbar from '@/src/components/Navbar';
import FloatingParticles from '@/src/components/FloatingParticles';
import { buildMetadata } from '@/src/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact | Mahamaya Girls\' College Senior Science Society',
  description:
    "Contact the Mahamaya Girls' College Senior Science Society through official email and social media channels.",
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <FloatingParticles />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="rounded-2xl bg-white/5 border border-amber-500/20 p-8 space-y-4">
          <h1 className="text-4xl font-bold text-white">Contact</h1>
          <p className="text-gray-300">Email: sssmgck@gmail.com</p>
          <p className="text-gray-300">Instagram: @mayanz_science</p>
          <p className="text-gray-300">Facebook: Mahamaya Science</p>
          <p className="text-gray-300">YouTube: Senior Science Society Channel</p>
          <p className="text-gray-300">WhatsApp Channel: Official Society Updates</p>
        </section>
      </main>
    </>
  );
}
