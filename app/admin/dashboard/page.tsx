/**
 * Admin Dashboard
 * Protected admin panel for managing the society
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/src/context/AuthContext';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import AdminLayout from '@/src/components/AdminLayout';
import {
  FileText,
  Calendar,
  Award,
  Users,
  History,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

interface MenuCard {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
}

const DashboardContent = () => {
  const router = useRouter();
  const { user } = useAuth();

  const menuCards: MenuCard[] = [
    {
      icon: FileText,
      label: 'Papers',
      description: 'Upload and organise term test papers',
      href: '/admin/papers',
    },
    {
      icon: Calendar,
      label: 'Events',
      description: 'Create and manage events with galleries',
      href: '/admin/events',
    },
    {
      icon: Award,
      label: 'Achievements',
      description: 'Add and showcase student achievements',
      href: '/admin/achievements',
    },
    {
      icon: Users,
      label: 'Committee',
      description: 'Manage committee members and positions',
      href: '/admin/committee',
    },
    {
      icon: History,
      label: 'Past Leadership',
      description: 'Manage past committee records by year',
      href: '/admin/past-leadership',
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      description={`Welcome back, ${user?.email?.split('@')[0] ?? 'Admin'}`}
    >
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 rounded-2xl px-8 py-6 border border-amber-500/20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(10,31,68,0.4) 100%)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 rounded-full bg-linear-to-b from-amber-400 to-yellow-600 shrink-0" />
          <div>
            <h2
              className="text-3xl font-bold"
              style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Senior Science Society — Admin Panel
            </h2>
            <p className="text-gray-400 text-base mt-1">
              Manage all aspects of the society from this portal.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Management Tools heading */}
      <motion.div className="mb-6" {...fadeInUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-5 w-0.5 rounded-full bg-linear-to-b from-amber-400 to-yellow-600" />
          <h2
            className="text-base font-bold uppercase tracking-widest"
            style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Management Tools
          </h2>
        </div>
      </motion.div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {menuCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(card.href)}
              className="group text-left rounded-2xl p-6 border border-white/10 hover:border-amber-500/35 transition-all duration-300 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(212,175,55,0.07), transparent 70%)' }}
              />
              <div className="relative">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl border border-amber-500/30 bg-amber-500/10 group-hover:border-amber-400/50 group-hover:bg-amber-500/15 transition-all duration-300">
                  <Icon size={22} className="text-amber-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{card.label}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{card.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-amber-400 text-sm font-semibold uppercase tracking-widest group-hover:gap-3 transition-all duration-200">
                  <span>Open</span>
                  <span>→</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
