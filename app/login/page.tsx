/**
 * Admin Login Page
 * Firebase Authentication with Email & Password
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/src/context/AuthContext';
import FloatingParticles from '@/src/components/FloatingParticles';
import { Mail, Lock, AlertCircle, Loader2, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Forgot-password state ──────────────────────────────────────────────────
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSending, setResetSending] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      router.push('/admin');
    } catch {
      setLocalError(error || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    if (!resetEmail) {
      setResetError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setResetError('Please enter a valid email address.');
      return;
    }
    try {
      setResetSending(true);
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/user-not-found') {
        setResetError('No account found with that email address.');
      } else if (code === 'auth/invalid-email') {
        setResetError('Invalid email address.');
      } else if (code === 'auth/too-many-requests') {
        setResetError('Too many requests. Please try again later.');
      } else {
        setResetError('Failed to send reset email. Please try again.');
      }
    } finally {
      setResetSending(false);
    }
  };

  const handleBackToLogin = () => {
    setShowReset(false);
    setResetEmail('');
    setResetError(null);
    setResetSuccess(false);
  };

  return (
    <>
      <FloatingParticles />

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Logo + Title */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-5">
              <Image
                src="/Logos/1.png"
                alt="Mahamaya Girls' College"
                width={80}
                height={80}
                className="rounded-xl object-contain drop-shadow-lg"
              />
              <Image
                src="/Logos/2.png"
                alt="Senior Science Society"
                width={80}
                height={80}
                className="rounded-xl object-contain drop-shadow-lg"
              />
            </div>

            <h1
              className="text-4xl font-bold mb-2"
              style={{ background: 'linear-gradient(135deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Admin Portal
            </h1>
            <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mt-1">
              Senior Science Society · Mahamaya Girls&apos; College
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            className="rounded-2xl p-8 space-y-6 border border-white/10"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Top accent line */}
            <div
              className="h-px w-full rounded-full"
              style={{ background: 'linear-gradient(to right, transparent, #d4af37, transparent)' }}
            />

            <AnimatePresence mode="wait">
            {/* ── FORGOT PASSWORD PANEL ─────────────────────────────── */}
            {showReset ? (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Reset Password</h2>
                  <p className="text-white/40 text-xs">Enter your admin email and we&apos;ll send a password reset link.</p>
                </div>

                {/* Reset success */}
                {resetSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-500/15 border border-green-500/30"
                  >
                    <CheckCircle2 className="text-green-400 shrink-0" size={18} />
                    <p className="text-green-300 text-sm">Password reset email sent. Please check your inbox.</p>
                  </motion.div>
                )}

                {/* Reset error */}
                {resetError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-500/15 border border-red-500/30"
                  >
                    <AlertCircle className="text-red-400 shrink-0" size={18} />
                    <p className="text-red-300 text-sm">{resetError}</p>
                  </motion.div>
                )}

                {!resetSuccess && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label htmlFor="reset-email" className="block text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-amber-400/70" size={18} />
                        <input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="admin@mgck.lk"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                          disabled={resetSending}
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(212,175,55,0.25)' }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={resetSending}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #0a1f44, #1a3a8f 50%, #b8922a)' }}
                    >
                      {resetSending ? (
                        <><Loader2 className="w-5 h-5 animate-spin" />Sending...</>
                      ) : (
                        'Send Reset Link'
                      )}
                    </motion.button>
                  </form>
                )}

                <button
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-sm font-medium transition-all"
                >
                  <ArrowLeft size={15} />
                  Back to Login
                </button>
              </motion.div>
            ) : (
            /* ── LOGIN PANEL ─────────────────────────────────────────── */
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Login error */}
              {(localError || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-500/15 border border-red-500/30"
                >
                  <AlertCircle className="text-red-400 shrink-0" size={18} />
                  <p className="text-red-300 text-sm">{localError || error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-amber-400/70" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mgck.lk"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-amber-400/70" size={18} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </motion.div>

              {/* Remember Me */}
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 accent-amber-400 cursor-pointer"
                  disabled={isSubmitting || isLoading}
                />
                <label htmlFor="remember" className="text-sm text-white/40 cursor-pointer select-none">
                  Keep me signed in
                </label>
              </motion.div>

              {/* Submit */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(212,175,55,0.25)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #0a1f44, #1a3a8f 50%, #b8922a)' }}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                onClick={() => { setShowReset(true); setLocalError(null); }}
                className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors underline underline-offset-2"
              >
                Forgot Password?
              </button>
            </div>

            </motion.div>
            )}
            </AnimatePresence>

            {/* Bottom accent line */}
            <div
              className="h-px w-full rounded-full"
              style={{ background: 'linear-gradient(to right, transparent, #d4af37, transparent)' }}
            />
          </motion.div>

          {/* Security Badge */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
              <ShieldCheck size={14} className="text-amber-500/70" />
              <span className="text-xs text-gray-500 font-medium tracking-wide">Restricted Access · Authorised Personnel Only</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
