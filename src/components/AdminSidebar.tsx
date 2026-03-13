'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Zap,
  Trophy,
  FileText,
  History,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';

const navItems = [
  { label: 'Dashboard',        href: '/admin',                icon: LayoutDashboard },
  { label: 'Committee',        href: '/admin/committee',      icon: Users           },
  { label: 'Events',           href: '/admin/events',         icon: Zap             },
  { label: 'Achievements',     href: '/admin/achievements',   icon: Trophy          },
  { label: 'Papers',           href: '/admin/papers',         icon: FileText        },
  { label: 'Past Leadership',  href: '/admin/past-leadership',icon: History         },
];

const isActiveHref = (pathname: string, href: string) => {
  if (href === '/admin') return pathname === '/admin' || pathname === '/admin/dashboard';
  return pathname.startsWith(href);
};

interface SidebarContentProps {
  pathname: string;
  onClose?: () => void;
  onLogout: () => void;
  userEmail?: string | null;
}

const SidebarContent = ({ pathname, onClose, onLogout, userEmail }: SidebarContentProps) => (
  <div className="flex flex-col h-full" style={{ background: '#050d1f' }}>

    {/* ── Logo / Branding ── */}
    <div
      className="px-5 pt-6 pb-5 flex items-center gap-3"
      style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}
    >
      <div className="relative w-9 h-9 shrink-0">
        <Image src="/Logos/2.png" alt="MGCK" fill className="object-contain" />
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <span
          className="text-[16px] font-extrabold tracking-tight"
          style={{ background: 'linear-gradient(135deg,#fff 40%,#d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Science Society
        </span>
        <span className="text-[10px] text-white/35 uppercase tracking-[0.18em] font-medium">
          Mahamaya Girls&apos; College
        </span>
      </div>
    </div>

    {/* ── Navigation ── */}
    <div className="flex-1 overflow-y-auto py-6 px-3 space-y-0.5">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const active = isActiveHref(pathname, item.href);
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
          >
            <Link href={item.href} onClick={onClose}>
              <div
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
                  transition-all duration-150 select-none
                  ${active ? '' : 'hover:bg-white/5'}
                `}
                style={active ? { background: 'rgba(212,175,55,0.1)' } : {}}
              >
                {active && (
                  <span
                    className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                    style={{ background: 'linear-gradient(180deg,#d4af37,#b8942a)' }}
                  />
                )}
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-colors duration-150 ${active ? 'bg-amber-500/15' : 'bg-white/4'}`}>
                  <Icon size={16} className={active ? 'text-amber-400' : 'text-white/40'} />
                </div>
                <span className={`text-[14px] font-medium tracking-wide ${active ? 'text-white' : 'text-white/50'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>

    {/* ── Bottom: user email + sign out ── */}
    <div
      className="px-3 pb-5 pt-4"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {userEmail && (
        <p className="text-[11px] text-white/25 px-1 mb-3 truncate">{userEmail}</p>
      )}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-[13px] font-medium"
      >
        <LogOut size={15} />
        Sign Out
      </button>
    </div>
  </div>
);

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* ── Mobile toggle button ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 md:hidden p-3 rounded-full border"
        style={{ background: '#050d1f', borderColor: 'rgba(212,175,55,0.4)' }}
        aria-label="Toggle menu"
      >
        {isOpen
          ? <X size={20} className="text-amber-400" />
          : <Menu size={20} className="text-amber-400" />
        }
      </motion.button>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed left-0 top-0 h-full w-60 z-50 md:hidden"
          >
            <SidebarContent
              pathname={pathname}
              onClose={() => setIsOpen(false)}
              onLogout={handleLogout}
              userEmail={user?.email}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:block w-56 shrink-0 h-screen sticky top-0">
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
          userEmail={user?.email}
        />
      </aside>
    </>
  );
};

export default AdminSidebar;
