import type { Metadata } from 'next';
import { buildMetadata } from '@/src/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Projects and Activities | Mahamaya Girls\' College Senior Science Society',
  description:
    "Explore science projects, initiatives, events, and student achievements by the Mahamaya Girls' College Senior Science Society.",
  path: '/projects',
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
