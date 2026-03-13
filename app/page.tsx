/**
 * Senior Science Society Homepage
 * Mahamaya Girls' College
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GlassCard,
  GradientButton,
  AnimatedSection,
  Badge,
} from '@/src/components/ThemeComponents';
import Navbar from '@/src/components/Navbar';
import FloatingParticles from '@/src/components/FloatingParticles';
import BannerCarousel from '@/src/components/BannerCarousel';
import {
  Users,
  Target,
  Zap,
  Award,
  BookOpen,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { getPastLeadership, PastLeadership, getCommitteeData, CommitteeData } from '@/src/lib/database';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// Committee data is loaded from Firebase (managed via admin panel)

export default function Home() {
  const [pastLeadership, setPastLeadership] = useState<PastLeadership[]>([]);
  const [expandedYear, setExpandedYear] = useState<string | null>(null);
  const [committeeData, setCommitteeData] = useState<CommitteeData | null>(null);
  const [committeeLoading, setCommitteeLoading] = useState(true);

  useEffect(() => {
    getPastLeadership()
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.year.localeCompare(a.year));
        setPastLeadership(sorted);
      })
      .catch(console.error);

    getCommitteeData()
      .then((data) => setCommitteeData(data))
      .catch(console.error)
      .finally(() => setCommitteeLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero section with carousel as full background */}
      <div className="relative h-[calc(100vh-96px)]">
        {/* Carousel fills the entire hero area as background */}
        <div className="absolute inset-0 z-0">
          <BannerCarousel />
        </div>

        {/* Float Particles Background */}
        <FloatingParticles />

        {/* Hero Section Content - overlaid on carousel */}
        <section className="relative z-10 w-full h-full flex items-center py-20" style={{ background: 'linear-gradient(to bottom, rgba(0,4,52,0.80), rgba(0,4,52,0.55), rgba(0,4,52,0.80))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Title */}
              <motion.h1
                className="text-5xl sm:text-6xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)' }}
              >
                Senior Science Society
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl sm:text-2xl font-medium text-yellow-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
              >
                Mahamaya Girls&apos; College
              </motion.p>

              {/* Tagline */}
              <motion.p
                className="text-base sm:text-lg text-white/90 max-w-2xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
              >
                Igniting Curiosity, Advancing Excellence, Building Tomorrow&apos;s Scientists
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex gap-4 flex-wrap justify-center mt-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Primary — navy blue gradient */}
                <a href="#about" className="px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg shadow-blue-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200" style={{ background: 'linear-gradient(to right, #0a1f44, #0f2d6b, #1a3a8f)' }}>
                  Explore Now
                </a>
                {/* Secondary — transparent with amber border, matching navbar accent */}
                <a href="https://whatsapp.com/channel/0029VabCzo4AYlUR3GRv5b05" target="_blank" rel="noopener noreferrer" className="px-8 py-4 text-lg font-semibold text-white rounded-xl border-2 border-amber-500 bg-white/10 backdrop-blur-sm hover:bg-amber-600/30 hover:border-amber-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                  Join Us
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================================
          ABOUT US SECTION
          ==================================================================== */}
      <section id="about" className="relative py-20 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col gap-10"
          >
            {/* Heading row */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-yellow-600 to-amber-500" />
              <h2 className="text-4xl font-bold" style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                About Us
              </h2>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-8 bg-white/5 backdrop-blur-md border border-amber-500/20 shadow-lg shadow-black/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1f44, #1a3a8f)' }}>
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">Who We Are</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-base">
                  The Senior Science Society of Mahamaya Girls&apos; College is an organization dedicated to promoting scientific curiosity, academic excellence, and collaborative learning among students. The society organizes educational workshops, competitions, community outreach projects, and various academic activities to inspire students to explore and develop their scientific knowledge.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="rounded-2xl p-8 bg-white/5 backdrop-blur-md border border-yellow-500/20 shadow-lg shadow-black/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-yellow-600 to-amber-500">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">This Platform</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-base">
                  This official website serves as a digital platform to showcase the society&apos;s projects, achievements, and activities while providing access to educational materials. Through this platform, we aim to document our work and create opportunities for learning, creativity, and scientific engagement.
                </p>
              </motion.div>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          CURRENT COMMITTEE SECTION
          ==================================================================== */}
      <section className="relative py-20 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          {...fadeInUp}
        >
          {committeeData?.year ? `Committee ${committeeData.year}` : 'Current Committee'}
        </motion.h2>

        {committeeLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-white/40 text-base">Loading committee data…</p>
          </div>
        ) : !committeeData ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-white/40 text-base">Committee information unavailable. Please check back later.</p>
          </div>
        ) : (
          <>
            {/* Teachers in Charge */}
            {committeeData.teachersInCharge.length > 0 && (
              <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                <h3 className="text-xl font-bold text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Users size={20} className="text-amber-400" /> Teachers-in-Charge
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {committeeData.teachersInCharge.map((name, i) => (
                    <div key={i} className="rounded-xl px-6 py-4 bg-white/5 border border-amber-500/20 text-white font-semibold text-base">{name}</div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Executive Committee */}
            {committeeData.executiveCommittee.length > 0 && (
              <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
                <h3 className="text-xl font-bold text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Award size={20} className="text-amber-400" /> Executive Committee
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {committeeData.executiveCommittee.map((m, i) => (
                    <div key={i} className="rounded-xl px-6 py-4 bg-white/5 border border-yellow-500/20">
                      <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">{m.position}</p>
                      <p className="text-white font-semibold">{m.name}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Organizers, Editors, Coordinators */}
            {(committeeData.organizers.length > 0 || committeeData.editors.length > 0 || committeeData.coordinators.length > 0) && (
              <motion.div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }}>
                {[
                  { title: 'Organizers', members: committeeData.organizers },
                  { title: 'Editors', members: committeeData.editors },
                  { title: 'Coordinators', members: committeeData.coordinators },
                ].filter(({ members }) => members.length > 0).map(({ title, members }) => (
                  <div key={title} className="rounded-2xl p-6 bg-white/5 border border-white/10">
                    <h3 className="text-lg font-bold text-amber-400 uppercase tracking-widest mb-4">{title}</h3>
                    <ul className="space-y-2">
                      {members.map((name, i) => (
                        <li key={i} className="text-gray-300 flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />{name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Quiz Teams */}
            {committeeData.quizTeams.length > 0 && (
              <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
                <h3 className="text-xl font-bold text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <BookOpen size={20} className="text-amber-400" /> Quiz Teams
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {committeeData.quizTeams.map((team, i) => (
                    <div key={i} className="rounded-2xl p-6 bg-white/5 border border-yellow-500/20">
                      <h4 className="text-white font-bold text-lg mb-4">{team.name}</h4>
                      <ul className="space-y-2">
                        {team.members.map((m, j) => (
                          <li key={j} className="text-gray-300 flex items-center gap-2 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />{m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Committee Members */}
            {committeeData.committeeMembers.length > 0 && (
              <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} viewport={{ once: true }}>
                <h3 className="text-xl font-bold text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Users size={20} className="text-amber-400" /> Committee Members
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {committeeData.committeeMembers.map((name, i) => (
                    <div key={i} className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-gray-300 text-sm text-center">{name}</div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Class Coordinators */}
            {committeeData.classCoordinators.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
                <h3 className="text-xl font-bold text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Users size={20} className="text-amber-400" /> Class Coordinators
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {committeeData.classCoordinators.map((name, i) => (
                    <div key={i} className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-gray-300 text-sm text-center">{name}</div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
        </div>
      </section>

      {/* ====================================================================
          PAST LEADERSHIP SECTION
          ==================================================================== */}
      <section className="relative py-20 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-4"
            style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            {...fadeInUp}
          >
            Past Leadership
          </motion.h2>
          <motion.p
            className="text-center text-gray-400 mb-12 text-base"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
          >
            Honouring the leaders who shaped the Senior Science Society over the years
          </motion.p>

          {pastLeadership.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            >
              <Clock size={40} className="text-amber-400/60" />
              <p className="text-gray-400 text-lg font-medium">Coming Soon</p>
              <p className="text-gray-500 text-sm">Past committee records will be added here.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {pastLeadership.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.06 }} viewport={{ once: true }}
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedYear(expandedYear === entry.id ? null : (entry.id ?? null))}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors duration-200"
                  >
                    <span className="text-white font-bold text-lg">{entry.year}</span>
                    <ChevronDown
                      size={20}
                      className={`text-amber-400 transition-transform duration-300 ${
                        expandedYear === entry.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedYear === entry.id && (
                    <div className="px-6 pb-6 border-t border-white/10">
                      {!entry.members || entry.members.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10">
                          <Clock size={28} className="text-amber-400/50" />
                          <p className="text-gray-400 text-sm">Coming Soon</p>
                        </div>
                      ) : (
                        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {entry.members.map((m, i) => (
                            <div key={i} className="rounded-xl px-5 py-4 bg-white/5 border border-amber-500/20">
                              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">{m.position}</p>
                              <p className="text-white font-semibold text-sm">{m.name}</p>
                              {m.category && (
                                <p className="text-gray-500 text-xs mt-1 capitalize">{m.category}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          CALL TO ACTION SECTION
          ==================================================================== */}
      <section className="relative py-24 overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-2xl p-12 bg-white/5 border border-amber-500/20 shadow-lg shadow-black/30"
          >
            {/* Accent bar */}
            <div className="flex justify-center mb-6">
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-400" />
            </div>

            <h2
              className="text-4xl font-bold mb-6"
              style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Ready to Join?
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              Become part of a vibrant community dedicated to science, learning, and
              innovation. Whether you&apos;re passionate about research, competitions, or
              collaborative projects, we have a place for you.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://whatsapp.com/channel/0029VabCzo4AYlUR3GRv5b05" target="_blank" rel="noopener noreferrer" className="px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg shadow-blue-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 inline-block" style={{ background: 'linear-gradient(to right, #0a1f44, #0f2d6b, #1a3a8f)' }}>
                Join Now
              </a>
              <a href="/projects" className="px-8 py-4 text-lg font-semibold text-white rounded-xl border-2 border-amber-500 bg-white/10 backdrop-blur-sm hover:bg-amber-600/30 hover:border-amber-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 inline-block">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          FOOTER
          ==================================================================== */}
      <footer className="relative mt-8 overflow-hidden border-t border-white/10">
        {/* subtle gradient top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Brand column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-yellow-500 to-amber-400" />
                <span className="text-white font-bold text-lg">Senior Science Society</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mahamaya Girls&apos; College, Kandy<br />
                Promoting scientific curiosity,<br />academic excellence &amp; collaborative learning.
              </p>
              {/* Social icons */}
              <div className="flex gap-3 mt-2">
                {[
                  { href: 'https://www.instagram.com/mayanz_science', label: 'Instagram', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs><radialGradient id="ig-f1" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="10%" stopColor="#fdf497"/><stop offset="50%" stopColor="#fd5949"/><stop offset="68%" stopColor="#d6249f"/><stop offset="100%" stopColor="#285AEB"/></radialGradient></defs>
                      <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#ig-f1)"/>
                      <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.8"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="white"/>
                    </svg>
                  )},
                  { href: 'https://web.facebook.com/MahamayaScience', label: 'Facebook', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="6" fill="#1877F2"/>
                      <path d="M15.12 13H13v7h-3v-7H8.5v-3H10v-1.75C10 6.12 11.19 5 13.25 5c.95 0 1.75.07 1.75.07v2h-1c-.97 0-1 .46-1 1.14V10h2.12L15.12 13z" fill="white"/>
                    </svg>
                  )},
                  { href: 'https://youtube.com/@sssofmahamayagirlscollegekandy', label: 'YouTube', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="6" fill="#FF0000"/>
                      <path d="M19.6 8.2a2 2 0 00-1.4-1.4C16.8 6.5 12 6.5 12 6.5s-4.8 0-6.2.3a2 2 0 00-1.4 1.4C4.1 9.6 4.1 12 4.1 12s0 2.4.3 3.8a2 2 0 001.4 1.4c1.4.3 6.2.3 6.2.3s4.8 0 6.2-.3a2 2 0 001.4-1.4c.3-1.4.3-3.8.3-3.8s0-2.4-.3-3.8zm-9.1 5.3V10.5l4.1 1.5-4.1 1.5z" fill="white"/>
                    </svg>
                  )},
                  { href: 'https://whatsapp.com/channel/0029VabCzo4AYlUR3GRv5b05', label: 'WhatsApp', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="6" fill="#25D366"/>
                      <path d="M12 4.5A7.5 7.5 0 004.5 12c0 1.32.35 2.56.96 3.63L4.5 19.5l3.97-.94A7.5 7.5 0 1012 4.5zm4.38 10.53c-.18.5-1.06.96-1.46 1.02-.38.05-.86.07-1.38-.09-.32-.1-.73-.24-1.25-.47-2.2-.95-3.64-3.17-3.75-3.32-.1-.14-.84-1.12-.84-2.14 0-1.01.53-1.51.72-1.72.18-.2.4-.25.53-.25h.38c.12 0 .28-.05.44.33.17.4.57 1.38.62 1.48.05.1.08.22.02.35-.07.13-.1.21-.2.32-.1.1-.21.23-.3.31-.1.09-.2.18-.09.36.12.18.52.77 1.12 1.25.77.63 1.41.83 1.62.92.2.1.32.08.44-.04.12-.13.5-.58.63-.78.13-.2.26-.17.44-.1.18.07 1.15.54 1.35.64.2.1.33.15.38.23.05.1.05.55-.13 1.05z" fill="white"/>
                    </svg>
                  )},
                  { href: 'mailto:sssmgck@gmail.com', label: 'Email', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="6" fill="#EA4335"/>
                      <path d="M5 8l7 5 7-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      <rect x="4" y="7" width="16" height="11" rx="1" fill="none" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  )},
                ].map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-200 shadow-sm"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Projects & Activities', href: '/projects' },
                  { label: 'Term Test Papers', href: '/papers' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 group transition-colors duration-200">
                      <span className="w-1 h-1 rounded-full bg-amber-500 group-hover:w-3 transition-all duration-200" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4">
              <h3 className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Contact</h3>
              <ul className="space-y-4">
                <li>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Email</p>
                  <a href="mailto:sssmgck@gmail.com" className="text-gray-300 hover:text-amber-400 text-sm transition-colors duration-200">sssmgck@gmail.com</a>
                </li>
                <li>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">WhatsApp Channel</p>
                  <a href="https://whatsapp.com/channel/0029VabCzo4AYlUR3GRv5b05" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-amber-400 text-sm transition-colors duration-200">Senior Science Society MGCK</a>
                </li>
                <li>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Instagram</p>
                  <a href="https://www.instagram.com/mayanz_science" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-amber-400 text-sm transition-colors duration-200">@mayanz_science</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Senior Science Society, Mahamaya Girls&apos; College. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">Designed &amp; Developed by Nathumini Jayathilake &amp; Enidu Maluddeniya</p>
          </div>
        </div>
      </footer>
    </>
  );
}
