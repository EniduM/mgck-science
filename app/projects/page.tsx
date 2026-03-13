/**
 * Projects & Activities Page
 * Senior Science Society of Mahamaya Girls' College
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/src/components/Navbar';
import FloatingParticles from '@/src/components/FloatingParticles';
import { ResponsiveGallery } from '@/src/components/ResponsiveGallery';
import { getProjectEvents, getProjectAchievements, ProjectEvent, ProjectAchievement } from '@/src/lib/database';
import { Calendar, MapPin, Loader2, Award, Users, FlaskConical, Trophy } from 'lucide-react';

export default function ProjectsPage() {
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [achievements, setAchievements] = useState<ProjectAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [firebaseEvents, firebaseAchievements] = await Promise.all([
          getProjectEvents(),
          getProjectAchievements(),
        ]);
        // Sort by date descending (newest first)
        const sortedEvents = [...firebaseEvents].sort((a, b) => {
          const da = a.date ? new Date(a.date as string).getTime() : 0;
          const db_ = b.date ? new Date(b.date as string).getTime() : 0;
          return db_ - da;
        });
        const sortedAchievements = [...firebaseAchievements].sort((a, b) => {
          const da = a.date ? new Date(a.date as string).getTime() : 0;
          const db_ = b.date ? new Date(b.date as string).getTime() : 0;
          return db_ - da;
        });
        setEvents(sortedEvents);
        setAchievements(sortedAchievements);
      } catch (err) {
        console.error('Failed to load projects data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <>
        <FloatingParticles />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-12 h-12 text-amber-400" />
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <FloatingParticles />
      <Navbar />

      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <div className="relative h-[50vh] min-h-90">
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(0,4,52,0.88), rgba(0,4,52,0.65), rgba(0,4,52,0.88))' }} />
        <section className="relative z-10 w-full h-full flex items-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col items-center text-center gap-4">
              <motion.h1
                className="text-5xl sm:text-6xl font-bold"
                style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Projects &amp; Activities
              </motion.h1>
              <motion.p
                className="text-xl text-yellow-200 font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Exploring Science Through Experience
              </motion.p>
              <motion.p
                className="text-base sm:text-lg text-white/80 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Discover our activities, educational initiatives, and achievements that define the Senior Science Society.
              </motion.p>
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================================
          INTRODUCTION SECTION
          ==================================================================== */}
      <section className="relative py-20 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col gap-10"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-1.5 rounded-full bg-linear-to-b from-yellow-600 to-amber-500" />
              <h2 className="text-4xl font-bold" style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Our Journey
              </h2>
            </div>
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
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">What We Do</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-base">
                  The Senior Science Society is committed to making science education engaging, accessible, and practical for all students. Through our diverse projects and activities, we create platforms for scientific exploration, innovation, and community engagement.
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
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-linear-to-br from-yellow-600 to-amber-500">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">Our Impact</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-base">
                  From organizing inter-school competitions to conducting environmental research and outreach programs, every activity is designed to inspire curiosity, foster critical thinking, and build a community of science enthusiasts.
                </p>
              </motion.div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          ACTIVITIES & INITIATIVES SECTION
          ==================================================================== */}
      <section className="relative py-20 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2
              className="text-4xl font-bold text-center mb-4"
              style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Activities &amp; Initiatives
            </h2>
            <div className="flex justify-center mb-16">
              <div className="h-1 w-16 rounded-full bg-linear-to-r from-yellow-500 to-amber-400" />
            </div>
          </motion.div>

          <div className="space-y-20">
            {events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4 py-20 rounded-2xl bg-white/5 border border-white/10"
              >
                <FlaskConical size={44} className="text-amber-400/50" />
                <p className="text-gray-400 text-lg font-medium">No activities yet</p>
                <p className="text-gray-500 text-sm">Activities will appear here once added by an admin.</p>
              </motion.div>
            ) : (
              events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-start`}
              >
                {/* Info card */}
                <div className="w-full lg:w-1/2 rounded-2xl p-8 bg-white/5 backdrop-blur-md border border-amber-500/20 shadow-lg shadow-black/30">
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 mb-4">
                    {event.category || 'Event'}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-4">{event.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{event.description}</p>
                  <div className="space-y-3 text-sm">
                    {event.date && (
                      <div className="flex items-center gap-3 text-gray-400">
                        <Calendar className="text-amber-400 shrink-0" size={16} />
                        <span>{event.date instanceof Date ? event.date.toLocaleDateString() : new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-3 text-gray-400">
                        <MapPin className="text-amber-400 shrink-0" size={16} />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery */}
                <motion.div
                  className="w-full lg:w-1/2"
                  initial={{ opacity: 0, x: index % 2 === 1 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <ResponsiveGallery
                    images={event.images}
                    columns={event.images.length > 3 ? 3 : 2}
                  />
                </motion.div>
              </motion.div>
            ))
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          ACHIEVEMENTS SECTION
          ==================================================================== */}
      <section className="relative py-20 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2
              className="text-4xl font-bold text-center mb-4"
              style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Achievements &amp; Recognition
            </h2>
            <div className="flex justify-center mb-16">
              <div className="h-1 w-16 rounded-full bg-linear-to-r from-yellow-500 to-amber-400" />
            </div>
          </motion.div>

          <div className="space-y-16">
            {achievements.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4 py-20 rounded-2xl bg-white/5 border border-white/10"
              >
                <Trophy size={44} className="text-amber-400/50" />
                <p className="text-gray-400 text-lg font-medium">No achievements yet</p>
                <p className="text-gray-500 text-sm">Achievements will appear here once added by an admin.</p>
              </motion.div>
            ) : (
              achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-start`}
              >
                {/* Gallery */}
                <motion.div
                  className="w-full lg:w-1/2"
                  initial={{ opacity: 0, x: index % 2 === 1 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <ResponsiveGallery images={achievement.images} columns={2} />
                </motion.div>

                {/* Content */}
                <div className="w-full lg:w-1/2 rounded-2xl p-8 bg-white/5 backdrop-blur-md border border-yellow-500/20 shadow-lg shadow-black/30 flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 mb-4">
                      {achievement.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-4">{achievement.title}</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">{achievement.description}</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    {achievement.date && (
                      <div className="flex items-center gap-3 text-gray-400">
                        <Calendar className="text-amber-400 shrink-0" size={16} />
                        <span>{achievement.date instanceof Date ? achievement.date.toLocaleDateString() : new Date(achievement.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {achievement.achievedBy && achievement.achievedBy.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="font-semibold text-amber-400 uppercase tracking-widest text-xs mb-3">Achieved By</p>
                        <ul className="space-y-2">
                          {achievement.achievedBy.map((person, idx) => (
                            <li key={idx} className="text-gray-300 flex items-center gap-2 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />{person}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CTA SECTION
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
            <div className="flex justify-center mb-6">
              <div className="h-1 w-16 rounded-full bg-linear-to-r from-yellow-500 to-amber-400" />
            </div>
            <h2
              className="text-4xl font-bold mb-6"
              style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Interested in Joining?
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              If you&apos;re passionate about science and want to be part of our exciting initiatives, we&apos;d love to have you! Join us in exploring, learning, and making a difference.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://whatsapp.com/channel/0029VabCzo4AYlUR3GRv5b05"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-lg shadow-blue-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 inline-block"
                style={{ background: 'linear-gradient(to right, #0a1f44, #0f2d6b, #1a3a8f)' }}
              >
                Join Now
              </a>
              <a
                href="/"
                className="px-8 py-4 text-lg font-semibold text-white rounded-xl border-2 border-amber-500 bg-white/10 backdrop-blur-sm hover:bg-amber-600/30 hover:border-amber-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 inline-block"
              >
                Back to Home
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          FOOTER
          ==================================================================== */}
      <footer className="relative mt-8 overflow-hidden border-t border-white/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-500/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-linear-to-b from-yellow-500 to-amber-400" />
                <span className="text-white font-bold text-lg">Senior Science Society</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mahamaya Girls&apos; College, Kandy<br />
                Promoting scientific curiosity,<br />academic excellence &amp; collaborative learning.
              </p>
              <div className="flex gap-3 mt-2">
                {[
                  { href: 'https://www.instagram.com/mayanz_science', label: 'Instagram', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs><radialGradient id="ig-fpr" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="10%" stopColor="#fdf497"/><stop offset="50%" stopColor="#fd5949"/><stop offset="68%" stopColor="#d6249f"/><stop offset="100%" stopColor="#285AEB"/></radialGradient></defs>
                      <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#ig-fpr)"/>
                      <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.8"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="white"/>
                    </svg>
                  ) },
                  { href: 'https://web.facebook.com/MahamayaScience', label: 'Facebook', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="6" fill="#1877F2"/>
                      <path d="M15.12 13H13v7h-3v-7H8.5v-3H10v-1.75C10 6.12 11.19 5 13.25 5c.95 0 1.75.07 1.75.07v2h-1c-.97 0-1 .46-1 1.14V10h2.12L15.12 13z" fill="white"/>
                    </svg>
                  ) },
                  { href: 'https://youtube.com/@sssofmahamayagirlscollegekandy', label: 'YouTube', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="6" fill="#FF0000"/>
                      <path d="M19.6 8.2a2 2 0 00-1.4-1.4C16.8 6.5 12 6.5 12 6.5s-4.8 0-6.2.3a2 2 0 00-1.4 1.4C4.1 9.6 4.1 12 4.1 12s0 2.4.3 3.8a2 2 0 001.4 1.4c1.4.3 6.2.3 6.2.3s4.8 0 6.2-.3a2 2 0 001.4-1.4c.3-1.4.3-3.8.3-3.8s0-2.4-.3-3.8zm-9.1 5.3V10.5l4.1 1.5-4.1 1.5z" fill="white"/>
                    </svg>
                  ) },
                  { href: 'https://whatsapp.com/channel/0029VabCzo4AYlUR3GRv5b05', label: 'WhatsApp', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="6" fill="#25D366"/>
                      <path d="M12 4.5A7.5 7.5 0 004.5 12c0 1.32.35 2.56.96 3.63L4.5 19.5l3.97-.94A7.5 7.5 0 1012 4.5zm4.38 10.53c-.18.5-1.06.96-1.46 1.02-.38.05-.86.07-1.38-.09-.32-.1-.73-.24-1.25-.47-2.2-.95-3.64-3.17-3.75-3.32-.1-.14-.84-1.12-.84-2.14 0-1.01.53-1.51.72-1.72.18-.2.4-.25.53-.25h.38c.12 0 .28-.05.44.33.17.4.57 1.38.62 1.48.05.1.08.22.02.35-.07.13-.1.21-.2.32-.1.1-.21.23-.3.31-.1.09-.2.18-.09.36.12.18.52.77 1.12 1.25.77.63 1.41.83 1.62.92.2.1.32.08.44-.04.12-.13.5-.58.63-.78.13-.2.26-.17.44-.1.18.07 1.15.54 1.35.64.2.1.33.15.38.23.05.1.05.55-.13 1.05z" fill="white"/>
                    </svg>
                  ) },
                  { href: 'mailto:sssmgck@gmail.com', label: 'Email', icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="6" fill="#EA4335"/>
                      <path d="M5 8l7 5 7-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      <rect x="4" y="7" width="16" height="11" rx="1" fill="none" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  ) },
                ].map(({ href, label, icon }) => (
                  <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-200 shadow-sm">
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
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 Senior Science Society, Mahamaya Girls&apos; College. All rights reserved.</p>
            <p className="text-gray-600 text-xs">Designed &amp; Developed by Nathumini Jayathilake &amp; Enidu Maluddeniya</p>
          </div>
        </div>
      </footer>
    </>
  );
}
