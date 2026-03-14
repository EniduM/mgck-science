/**
 * Term Test Papers Archive Page
 * Senior Science Society of Mahamaya Girls' College
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/src/components/Navbar';
import FloatingParticles from '@/src/components/FloatingParticles';
import { getPapers, getUniquePaperValues, Paper } from '@/src/lib/database';
import { Search, Download, Filter, Loader2, BookOpen, FileText, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterState {
  subject: string;
  year: string;
  medium: string;
  searchQuery: string;
}

// Animation variants (kept for future use)

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    subject: '',
    year: '',
    medium: '',
    searchQuery: '',
  });

  const [subjects, setSubjects] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const mediums = ['Sinhala', 'English'];

  const getPaperDownloadUrl = (url: unknown) => {
    if (typeof url !== 'string' || !url.trim()) return '';

    if (url.includes('res.cloudinary.com') && url.includes('/upload/fl_attachment/')) {
      return url;
    }
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    if (url.includes('firebasestorage.googleapis.com') && !url.includes('alt=media')) {
      return url.includes('?') ? `${url}&alt=media` : `${url}?alt=media`;
    }
    return url;
  };

  // Load papers and filter options
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [firebasePapers, uniqueSubjects, uniqueYears] = await Promise.all([
          getPapers(),
          getUniquePaperValues('subject'),
          getUniquePaperValues('year'),
        ]);
        setPapers(firebasePapers.slice(0, 150));
        setSubjects(uniqueSubjects);
        setYears(uniqueYears.sort((a: number, b: number) => b - a));
      } catch (err) {
        console.error('Failed to load papers:', err);
        setPapers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter papers based on search and filters
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const matchesSubject = !filters.subject || paper.subject === filters.subject;
      const matchesYear = !filters.year || paper.year.toString() === filters.year;
      const matchesMedium = !filters.medium || paper.medium === filters.medium;
      const matchesSearch =
        !filters.searchQuery ||
        paper.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchesSubject && matchesYear && matchesMedium && matchesSearch;
    });
  }, [papers, filters]);

  const handleFilterChange = (
    key: keyof FilterState,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      year: '',
      medium: '',
      searchQuery: '',
    });
  };

  const handleDownload = (paper: Paper) => {
    window.open(getPaperDownloadUrl(paper.downloadUrl), '_blank', 'noopener,noreferrer');
  };

  // Group filtered papers: year (desc) → subject → papers
  const groupedByYear = useMemo(() => {
    const map = new Map<number, Map<string, Paper[]>>();
    filteredPapers.forEach((paper) => {
      if (!map.has(paper.year)) map.set(paper.year, new Map());
      const bySubject = map.get(paper.year)!;
      if (!bySubject.has(paper.subject)) bySubject.set(paper.subject, []);
      bySubject.get(paper.subject)!.push(paper);
    });
    // Sort years descending
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filteredPapers]);

  // Keep track of which year sections are open (default: all open)
  const [openYears, setOpenYears] = useState<Set<number>>(new Set());

  // When grouped data changes, open all years by default
  useMemo(() => {
    setOpenYears(new Set(groupedByYear.map(([year]) => year)));
  }, [groupedByYear.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleYear = (year: number) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year); else next.add(year);
      return next;
    });
  };

  if (isLoading) {
    return (
      <>
        <FloatingParticles />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
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
                Term Test Papers
              </motion.h1>
              <motion.p
                className="text-xl text-yellow-200 font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Study Materials &amp; Resources
              </motion.p>
              <motion.p
                className="text-base sm:text-lg text-white/80 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Access a comprehensive collection of past term test papers to enhance your preparation and practice.
              </motion.p>
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================================
          STATS SECTION
          ==================================================================== */}
      <section className="relative py-16 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { icon: <FileText className="w-6 h-6 text-white" />, value: `${papers.length}+`, label: 'Papers Available' },
              { icon: <BookOpen className="w-6 h-6 text-white" />, value: String(subjects.length), label: 'Subjects Covered' },
              { icon: <Clock className="w-6 h-6 text-white" />, value: String(years.length), label: 'Years Available' },
            ].map(({ icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-6 bg-white/5 border border-amber-500/20 flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0a1f44, #1a3a8f)' }}>
                  {icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400">{value}</p>
                  <p className="text-gray-400 text-sm font-medium">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          FILTERS SECTION
          ==================================================================== */}
      <section className="relative py-8 overflow-hidden px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-amber-400" size={18} />
                <input
                  type="text"
                  placeholder="Search papers by title or subject..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 focus:outline-none focus:border-amber-500/50 transition-all"
                >
                  <option value="" className="bg-gray-900">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year} className="bg-gray-900">{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">Subject</label>
                <select
                  value={filters.subject}
                  onChange={(e) => handleFilterChange('subject', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 focus:outline-none focus:border-amber-500/50 transition-all"
                >
                  <option value="" className="bg-gray-900">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject} className="bg-gray-900">{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">Medium</label>
                <select
                  value={filters.medium}
                  onChange={(e) => handleFilterChange('medium', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 focus:outline-none focus:border-amber-500/50 transition-all"
                >
                  <option value="" className="bg-gray-900">All Mediums</option>
                  {mediums.map((medium) => (
                    <option key={medium} value={medium} className="bg-gray-900">{medium}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-medium transition-all text-sm"
                >
                  Clear Filters
                </motion.button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Filter size={14} />
              <span>Showing <span className="font-semibold text-amber-400">{filteredPapers.length}</span> papers</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ====================================================================
          PAPERS — GROUPED BY YEAR
          ==================================================================== */}
      <section className="relative py-12 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          {groupedByYear.length > 0 ? groupedByYear.map(([year, subjectMap]) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {/* Year header — click to toggle */}
              <button
                onClick={() => toggleYear(year)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xl font-black tracking-tight"
                    style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {year}
                  </span>
                  <span className="text-xs font-semibold text-amber-400/60 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
                    {Array.from(subjectMap.values()).reduce((s, arr) => s + arr.length, 0)} paper{Array.from(subjectMap.values()).reduce((s, arr) => s + arr.length, 0) !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Array.from(subjectMap.keys()).join(' · ')}
                  </span>
                </div>
                {openYears.has(year)
                  ? <ChevronUp size={18} className="text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                  : <ChevronDown size={18} className="text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                }
              </button>

              <AnimatePresence initial={false}>
                {openYears.has(year) && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-6 pb-6 space-y-6 border-t border-white/8 pt-5">
                      {Array.from(subjectMap.entries()).map(([subject, subjectPapers]) => (
                        <div key={subject}>
                          {/* Subject sub-header */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-3.5 w-0.5 rounded-full bg-amber-400" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">{subject}</span>
                            <div className="flex-1 h-px bg-white/8" />
                          </div>

                          {/* Paper rows */}
                          <div className="space-y-2">
                            {subjectPapers.map((paper) => (
                              <motion.div
                                key={paper.id}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/4 hover:bg-white/8 border border-white/8 hover:border-amber-500/25 transition-all group/row"
                              >
                                {/* Title & meta */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-white truncate group-hover/row:text-amber-100 transition-colors">
                                    {paper.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">{paper.medium}</span>
                                    {paper.fileSize && (
                                      <span className="text-xs text-gray-500">{paper.fileSize}</span>
                                    )}
                                  </div>
                                </div>

                                {/* Download */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDownload(paper)}
                                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white text-xs font-semibold shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                  style={{ background: 'linear-gradient(to right, #0a1f44, #1a3a8f)' }}
                                >
                                  <Download size={13} />
                                  Download
                                </motion.button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )) : (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-4 flex justify-center">
                <Filter className="text-amber-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {papers.length === 0 ? 'No Papers Available Yet' : 'No Papers Found'}
              </h3>
              <p className="text-gray-400 mb-6">
                {papers.length === 0
                  ? 'Papers will appear here once they are uploaded through the admin panel.'
                  : 'Try adjusting your filters or search query to find papers.'}
              </p>
              {papers.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-3 text-white font-semibold rounded-xl border-2 border-amber-500 bg-white/10 hover:bg-amber-600/30 transition-all"
                >
                  Clear All Filters
                </motion.button>
              )}
            </motion.div>
          )}
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
                      <defs><radialGradient id="ig-fp" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="10%" stopColor="#fdf497"/><stop offset="50%" stopColor="#fd5949"/><stop offset="68%" stopColor="#d6249f"/><stop offset="100%" stopColor="#285AEB"/></radialGradient></defs>
                      <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#ig-fp)"/>
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
            <p className="text-gray-500 text-sm">&copy; 2026 Senior Science Society, Mahamaya Girls&apos; College. All rights reserved.</p>
            <p className="text-gray-600 text-xs">Designed &amp; Developed by Nathumini Jayathilake &amp; Enidu Maluddeniya</p>
          </div>
        </div>
      </footer>
    </>
  );
}
