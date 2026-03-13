/**
 * Responsive Navbar Component
 * Senior Science Society of Mahamaya Girls' College
 * Apple-inspired glassmorphism design with mobile support
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
} from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

interface SocialIcon {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Navigation links
  const navLinks: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Projects & Activities', href: '/projects' },
    { label: 'Term Test Papers', href: '/papers' },
  ];

  // Social media icons — official brand colors
  const socialIcons: SocialIcon[] = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/mayanz_science',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="10%" stopColor="#fdf497" />
              <stop offset="50%" stopColor="#fd5949" />
              <stop offset="68%" stopColor="#d6249f" />
              <stop offset="100%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#ig-grad)" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.8" />
          <circle cx="17.5" cy="6.5" r="1" fill="white" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: 'https://web.facebook.com/MahamayaScience',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5" fill="#1877F2" />
          <path d="M15.12 13H13v7h-3v-7H8.5v-3H10v-1.75C10 6.12 11.19 5 13.25 5c.95 0 1.75.07 1.75.07v2h-1c-.97 0-1 .46-1 1.14V10h2.12L15.12 13z" fill="white" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com/@sssofmahamayagirlscollegekandy',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5" fill="#FF0000" />
          <path d="M19.6 8.2a2 2 0 00-1.4-1.4C16.8 6.5 12 6.5 12 6.5s-4.8 0-6.2.3a2 2 0 00-1.4 1.4C4.1 9.6 4.1 12 4.1 12s0 2.4.3 3.8a2 2 0 001.4 1.4c1.4.3 6.2.3 6.2.3s4.8 0 6.2-.3a2 2 0 001.4-1.4c.3-1.4.3-3.8.3-3.8s0-2.4-.3-3.8zm-9.1 5.3V10.5l4.1 1.5-4.1 1.5z" fill="white" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: 'https://whatsapp.com/channel/0029VabCzo4AYlUR3GRv5b05',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5" fill="#25D366" />
          <path d="M12 4.5A7.5 7.5 0 004.5 12c0 1.32.35 2.56.96 3.63L4.5 19.5l3.97-.94A7.5 7.5 0 1012 4.5zm4.38 10.53c-.18.5-1.06.96-1.46 1.02-.38.05-.86.07-1.38-.09-.32-.1-.73-.24-1.25-.47-2.2-.95-3.64-3.17-3.75-3.32-.1-.14-.84-1.12-.84-2.14 0-1.01.53-1.51.72-1.72.18-.2.4-.25.53-.25h.38c.12 0 .28-.05.44.33.17.4.57 1.38.62 1.48.05.1.08.22.02.35-.07.13-.1.21-.2.32-.1.1-.21.23-.3.31-.1.09-.2.18-.09.36.12.18.52.77 1.12 1.25.77.63 1.41.83 1.62.92.2.1.32.08.44-.04.12-.13.5-.58.63-.78.13-.2.26-.17.44-.1.18.07 1.15.54 1.35.64.2.1.33.15.38.23.05.1.05.55-.13 1.05z" fill="white" />
        </svg>
      ),
    },
    {
      label: 'Email',
      href: 'mailto:sssmgck@gmail.com',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5" fill="#EA4335" />
          <path d="M5 8l7 5 7-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="4" y="7" width="16" height="11" rx="1" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>
      ),
    },
  ];

  // Animation variants for desktop menu
  const desktopMenuVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    initial: { opacity: 0, x: 300 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 },
  };

  // Animation variants for mobile menu items
  const menuItemVariants = {
    initial: { opacity: 0, x: 20 },
    animate: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.1 },
    }),
    exit: { opacity: 0, x: 20 },
  };

  // Animation variants for social icons
  const iconVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: index * 0.05 },
    }),
    hover: { scale: 1.2, rotate: 5 },
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Navbar Container */}
      <nav className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-amber-600 shadow-lg border-b-4 border-yellow-500/30 rounded-b-3xl">
        <div className="flex items-center justify-between h-24 px-6">
          {/* Logo / Brand with Images - Left Corner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="shrink-0 flex items-center gap-2"
          >
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              {/* Logo Images */}
              <div className="flex items-center gap-0">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/Logos/1.png"
                    alt="MGCK Logo 1"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="w-16 h-16 relative">
                  <Image
                    src="/Logos/2.png"
                    alt="MGCK Logo 2"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              {/* Text Section */}
              <div className="hidden sm:flex flex-col justify-center pl-2">
                <h1 className="text-lg font-light text-white group-hover:text-yellow-100 transition-colors">
                  Senior Science Society
                </h1>
                <p className="text-sm font-light text-white/95 group-hover:text-yellow-100 transition-colors">
                  Mahamaya Girls&apos; College ,Kandy
                </p>
              </div>
            </Link>
          </motion.div>

            {/* Desktop Navigation Links - Centered */}
            <motion.div
              className="hidden md:flex flex-1 justify-center items-center gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  variants={desktopMenuVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="relative text-white hover:text-yellow-100 font-medium text-base transition-colors group"
                  >
                    {link.label}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"
                      aria-hidden="true"
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Desktop Social Icons */}
            <motion.div
              className="hidden md:flex items-center gap-5 ml-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {socialIcons.map((social, index) => {
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="transition-all duration-200 hover:scale-110 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    custom={index}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 90 }}
                    exit={{ rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed top-24 right-0 bottom-0 w-full sm:w-80 bg-gradient-to-b from-yellow-600 to-amber-600 backdrop-blur-2xl bg-opacity-95 border-l border-yellow-500/30 shadow-lg z-30 rounded-bl-3xl"
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Mobile Navigation Links */}
            <motion.div
              className="flex flex-col gap-4 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-white font-semibold mb-2">Navigation</h2>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  custom={index}
                  variants={menuItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-white/20 hover:text-yellow-100 font-medium rounded-lg transition-all duration-300 border-l-4 border-transparent hover:border-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Social Icons */}
            <motion.div
              className="border-t border-white/30 px-6 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-white font-semibold mb-4">Follow Us</h2>
              <div className="flex gap-4 flex-wrap">
                {socialIcons.map((social, index) => {
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith('mailto') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="transition-all duration-200 hover:scale-110 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
                      custom={index}
                      variants={menuItemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Mobile CTA */}
            <motion.div
              className="border-t border-white/30 px-6 py-6 mt-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                className="w-full bg-white text-yellow-700 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Get Involved
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
