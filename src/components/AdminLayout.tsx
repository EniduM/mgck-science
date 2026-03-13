'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

interface Particle {
  left: number;
  top: number;
  duration: number;
  key: number;
}

const generateParticles = (): Particle[] =>
  [...Array(12)].map((_, i) => ({
    key: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 12 + Math.random() * 12,
  }));

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, description }) => {
  const [particles] = useState<Particle[]>(() => generateParticles());

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050d1f 0%, #0a1f44 55%, #07162e 100%)' }}
    >
      {/* ── Floating particles ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.key}
            className="absolute w-0.5 h-0.5 rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: 'rgba(212,175,55,0.35)',
            }}
            animate={{ y: [0, -80, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Sidebar ── */}
      <AdminSidebar />

      {/* ── Right pane ── */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">

        {/* ── Top bar (thin accent only) ── */}
        <header
          className="shrink-0 border-b"
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #d4af37 0%, rgba(212,175,55,0.3) 100%)',
            borderColor: 'rgba(212,175,55,0.12)',
          }}
        />

        {/* ── Scrollable content ── */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="p-5 md:p-7"
          >
            {/* Page heading */}
            {title && (
              <div className="flex items-center gap-3 mb-7">
                <div
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ background: 'linear-gradient(180deg,#d4af37,#b8942a)' }}
                />
                <div>
                  <h1
                    className="text-2xl font-bold leading-tight"
                    style={{ background: 'linear-gradient(135deg,#ffffff,#d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {title}
                  </h1>
                  {description && (
                    <p className="text-sm text-white/40 leading-tight mt-0.5">{description}</p>
                  )}
                </div>
              </div>
            )}
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
