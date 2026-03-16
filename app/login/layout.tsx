import type { Metadata } from 'next';
import { buildMetadata } from '@/src/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Admin Login | Mahamaya Girls\' College Senior Science Society',
  description: 'Secure administrator login for managing the Senior Science Society website content.',
  path: '/login',
  index: false,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
