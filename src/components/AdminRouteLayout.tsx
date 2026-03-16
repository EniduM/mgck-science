'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">{children}</div>
        <footer className="w-full py-5 px-6 text-center border-t border-white/10 bg-[#0a1528]">
          <p className="text-xs text-gray-500">
            © 2026 Senior Science Society, Mahamaya Girls&apos; College. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Designed &amp; Developed by{' '}
            <span className="text-amber-600/70">Nathumini Jayathilake</span>
            {' '}&amp;{' '}
            <span className="text-amber-600/70">Enidu Maluddeniya</span>
          </p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
