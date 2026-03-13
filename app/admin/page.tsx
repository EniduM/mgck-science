'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Trophy, Users, Eye, History } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import {
  getCommitteeData,
  getEvents,
  getAchievements,
  getPapers,
  getProjectEvents,
  getProjectAchievements,
} from '@/src/lib/database';

const CARD_BG = { background: 'rgba(255,255,255,0.04)' };

// Each section gets its own accent colour: icon bg, icon colour, hover border, hover shadow
const navItems = [
  {
    label: 'Committee Members', key: 'committees', icon: <Users size={20} />, href: '/admin/committee',
    color: '#6366f1', // indigo
    iconBg: 'rgba(99,102,241,0.18)',
    hoverBorder: 'rgba(99,102,241,0.55)',
    hoverShadow: 'rgba(99,102,241,0.20)',
  },
  {
    label: 'Events', key: 'events', icon: <Zap size={20} />, href: '/admin/events',
    color: '#f97316', // orange
    iconBg: 'rgba(249,115,22,0.18)',
    hoverBorder: 'rgba(249,115,22,0.55)',
    hoverShadow: 'rgba(249,115,22,0.20)',
  },
  {
    label: 'Achievements', key: 'achievements', icon: <Trophy size={20} />, href: '/admin/achievements',
    color: '#eab308', // yellow-gold
    iconBg: 'rgba(234,179,8,0.18)',
    hoverBorder: 'rgba(234,179,8,0.55)',
    hoverShadow: 'rgba(234,179,8,0.20)',
  },
  {
    label: 'Papers', key: 'papers', icon: <FileText size={20} />, href: '/admin/papers',
    color: '#10b981', // emerald
    iconBg: 'rgba(16,185,129,0.18)',
    hoverBorder: 'rgba(16,185,129,0.55)',
    hoverShadow: 'rgba(16,185,129,0.20)',
  },
  {
    label: 'Past Leadership', key: null, icon: <History size={20} />, href: '/admin/past-leadership',
    color: '#a855f7', // purple
    iconBg: 'rgba(168,85,247,0.18)',
    hoverBorder: 'rgba(168,85,247,0.55)',
    hoverShadow: 'rgba(168,85,247,0.20)',
  },
  {
    label: 'Public Website', key: null, icon: <Eye size={20} />, href: '/',
    color: '#0ea5e9', // sky blue
    iconBg: 'rgba(14,165,233,0.18)',
    hoverBorder: 'rgba(14,165,233,0.55)',
    hoverShadow: 'rgba(14,165,233,0.20)',
    external: true,
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    committees: 0,
    events: 0,
    achievements: 0,
    papers: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading((prev) => prev || stats.events === 0);
        const [committeeData, events, achievements, papers, projectEvents, projectAchievements] =
          await Promise.all([
            getCommitteeData(),
            getEvents(),
            getAchievements(),
            getPapers(),
            getProjectEvents(),
            getProjectAchievements(),
          ]);
        const cd = committeeData;
        const committeeCount = cd
          ? (cd.teachersInCharge?.length || 0) +
            (cd.executiveCommittee?.length || 0) +
            (cd.organizers?.length || 0) +
            (cd.editors?.length || 0) +
            (cd.coordinators?.length || 0) +
            (cd.committeeMembers?.length || 0) +
            (cd.classCoordinators?.length || 0) +
            (cd.quizTeams?.reduce((s, t) => s + (t.members?.length || 0), 0) || 0)
          : 0;
        setStats({
          committees: committeeCount,
          events: events.length + (projectEvents?.length || 0),
          achievements: achievements.length + (projectAchievements?.length || 0),
          papers: papers.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { label: 'Committee Members', key: 'committees' as const, icon: <Users size={22} />, color: '#6366f1', iconBg: 'rgba(99,102,241,0.20)' },
    { label: 'Events',            key: 'events'      as const, icon: <Zap size={22} />,   color: '#f97316', iconBg: 'rgba(249,115,22,0.20)' },
    { label: 'Achievements',      key: 'achievements' as const, icon: <Trophy size={22} />, color: '#eab308', iconBg: 'rgba(234,179,8,0.20)' },
    { label: 'Papers',            key: 'papers'      as const, icon: <FileText size={22} />, color: '#10b981', iconBg: 'rgba(16,185,129,0.20)' },
  ];

  return (
    <AdminLayout title="Dashboard" description="Science Society Admin Panel">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-amber-500/25 p-5 mb-8 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(10,31,68,0.6) 100%)' }}
      >
        <div
          className="w-1 self-stretch rounded-full shrink-0"
          style={{ background: 'linear-gradient(180deg,#d4af37,#a07c10)' }}
        />
        <div>
          <p className="text-white font-semibold text-base">Welcome back</p>
          <p className="text-white/55 text-sm mt-0.5">
            Manage your Science Society content from the sections below.
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statItems.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border p-5 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderColor: `${s.color}33`,
              boxShadow: `inset 0 0 0 0 ${s.color}`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/50 text-sm font-medium uppercase tracking-wider">
                {s.label}
              </span>
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: s.iconBg, color: s.color }}
              >
                {s.icon}
              </span>
            </div>
            <p className="text-4xl font-bold" style={{ color: s.color }}>
              {loading ? <span className="animate-pulse">—</span> : stats[s.key]}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Section heading */}
      <p
        className="text-lg font-semibold uppercase tracking-widest mb-4"
        style={{ background: 'linear-gradient(135deg,#ffffff,#d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        Manage Content
      </p>

      {/* Nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.map((item, i) => (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.07 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group cursor-pointer flex items-center gap-4 rounded-2xl border p-5 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderColor: 'rgba(255,255,255,0.10)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = item.hoverBorder;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${item.hoverShadow}`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.10)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
              style={{ background: item.iconBg, color: item.color }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-base truncate">{item.label}</p>
              <p className="text-sm mt-0.5" style={{ color: item.color + 'bb' }}>
                {item.external ? 'View site →' : 'Open →'}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </AdminLayout>
  );
}
