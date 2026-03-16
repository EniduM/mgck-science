import type { Metadata } from 'next';
import { buildMetadata } from '@/src/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Term Test Papers | Mahamaya Girls\' College Senior Science Society',
  description:
    "Access past term test papers by year, subject, and medium from the Mahamaya Girls' College Senior Science Society.",
  path: '/papers',
});

export default function PapersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
