import type { Metadata } from 'next';
import AdminRouteLayout from '@/src/components/AdminRouteLayout';
import { buildMetadata } from '@/src/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: "Admin | Mahamaya Girls' College Senior Science Society",
  description: 'Admin section for managing society website content.',
  path: '/admin',
  index: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRouteLayout>{children}</AdminRouteLayout>
  );
}
