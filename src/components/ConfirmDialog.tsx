'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = 'Confirm Delete',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f1729] shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30">
                    <AlertTriangle size={20} className="text-red-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">{title}</h3>
                </div>
                <button
                  onClick={onCancel}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <p className="text-white/60 text-sm leading-relaxed">{message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 text-red-300 hover:text-red-200 text-sm font-medium transition-all duration-200"
                >
                  <Trash2 size={15} />
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
