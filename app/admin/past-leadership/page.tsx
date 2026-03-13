'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, X, Users } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import {
  getPastLeadership,
  addPastLeadership,
  updatePastLeadership,
  deletePastLeadership,
  PastLeadership,
  PastLeadershipMember,
} from '@/src/lib/database';
import { GlassCard } from '@/src/components/ThemeComponents';
import ConfirmDialog from '@/src/components/ConfirmDialog';

const emptyMember = (): PastLeadershipMember => ({
  name: '',
  position: '',
  category: 'student',
});

export default function PastLeadershipManagement() {
  const [entries, setEntries] = useState<PastLeadership[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // --- Year form ---
  const [showYearForm, setShowYearForm] = useState(false);
  const [newYear, setNewYear] = useState('');
  const [addingYear, setAddingYear] = useState(false);

  // --- Member form per entry ---
  const [memberForms, setMemberForms] = useState<Record<string, PastLeadershipMember>>({});
  const [savingMember, setSavingMember] = useState<string | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ fn: () => void; title: string; message: string } | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading((prev) => prev || entries.length === 0);
      const data = await getPastLeadership();
      const sorted = [...data].sort((a, b) => b.year.localeCompare(a.year));
      setEntries(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---- Add a new year ----
  const handleAddYear = async () => {
    const year = newYear.trim();
    if (!year) return;
    if (entries.some((e) => e.year === year)) {
      alert('An entry for this year already exists.');
      return;
    }
    try {
      setAddingYear(true);
      await addPastLeadership({ year, members: [] });
      setNewYear('');
      setShowYearForm(false);
      await fetchEntries();
    } catch (err) {
      console.error(err);
      alert('Failed to add year.');
    } finally {
      setAddingYear(false);
    }
  };

  // ---- Delete a year entry ----
  const handleDeleteEntry = async (id: string) => {
    try {
      setDeletingEntry(id);
      await deletePastLeadership(id);
      await fetchEntries();
    } catch (err) {
      console.error(err);
      alert('Failed to delete entry.');
    } finally {
      setDeletingEntry(null);
    }
  };

  // ---- Add a member to an entry ----
  const getMemberForm = (id: string) =>
    memberForms[id] ?? emptyMember();

  const setMemberForm = (id: string, form: PastLeadershipMember) =>
    setMemberForms((prev) => ({ ...prev, [id]: form }));

  const handleAddMember = async (entry: PastLeadership) => {
    const id = entry.id!;
    const form = getMemberForm(id);
    if (!form.name.trim() || !form.position.trim()) {
      alert('Please fill in the name and position.');
      return;
    }
    try {
      setSavingMember(id);
      const updatedMembers = [...(entry.members ?? []), { ...form, name: form.name.trim(), position: form.position.trim() }];
      await updatePastLeadership(id, { members: updatedMembers });
      setMemberForm(id, emptyMember());
      await fetchEntries();
    } catch (err) {
      console.error(err);
      alert('Failed to add member.');
    } finally {
      setSavingMember(null);
    }
  };

  // ---- Remove a member from an entry ----
  const handleRemoveMember = async (entry: PastLeadership, memberIndex: number) => {
    const id = entry.id!
    try {
      const updatedMembers = (entry.members ?? []).filter((_, i) => i !== memberIndex);
      await updatePastLeadership(id, { members: updatedMembers });
      await fetchEntries();
    } catch (err) {
      console.error(err);
      alert('Failed to remove member.');
    }
  };

  return (
    <AdminLayout
      title="Past Leadership"
      description="Manage past committee records by year"
    >
      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction?.title ?? ''}
        message={confirmAction?.message ?? ''}
        confirmLabel="Delete"
        onConfirm={() => { confirmAction?.fn(); setConfirmAction(null); }}
        onCancel={() => setConfirmAction(null)}
      />
      {/* Add Year Button */}
      <div className="mb-8 flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowYearForm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-amber-500 to-yellow-500 text-black font-semibold hover:shadow-lg hover:shadow-amber-500/40 transition-all duration-300"
        >
          <Plus size={20} />
          Add Year
        </motion.button>
      </div>

      {/* Year Form */}
      <AnimatePresence>
        {showYearForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mb-8 glass-card p-6 border border-white/10 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-xl">New Year / Term</h3>
              <button onClick={() => { setShowYearForm(false); setNewYear(''); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={18} className="text-white/60" />
              </button>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="e.g. 2024–2025"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleAddYear()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddYear}
                disabled={addingYear}
                className="px-5 py-2 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-300 font-medium transition-colors disabled:opacity-50"
              >
                {addingYear ? 'Adding…' : 'Add'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      {loading ? (
        <div className="text-center py-16 text-white/50">Loading…</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-white/50">
          No past leadership entries yet. Click <span className="text-amber-400">Add Year</span> to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const id = entry.id!;
            const isExpanded = expandedId === id;
            const memberForm = getMemberForm(id);

            return (
              <GlassCard key={id} className="overflow-hidden">
                {/* Year Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <ChevronDown
                      size={18}
                      className={`text-amber-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                    <span className="text-white font-bold text-xl">{entry.year}</span>
                    <span className="text-sm text-white/40 ml-2">
                      {(entry.members ?? []).length} member{(entry.members ?? []).length !== 1 ? 's' : ''}
                    </span>
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmAction({ title: 'Delete Year Entry', message: `Delete the ${entry.year} entry and all its members? This cannot be undone.`, fn: () => handleDeleteEntry(id) })}
                    disabled={deletingEntry === id}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors disabled:opacity-50"
                    title="Delete year"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-6">
                        {/* Member List */}
                        {(entry.members ?? []).length === 0 ? (
                          <p className="text-white/40 text-base">No members yet. Add some below.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {(entry.members ?? []).map((m, i) => (
                              <div key={i} className="flex items-start justify-between gap-2 rounded-xl px-4 py-3 bg-white/5 border border-white/10">
                                <div>
                                  <p className="text-sm text-amber-400 font-semibold uppercase tracking-widest mb-0.5">{m.position}</p>
                                  <p className="text-white text-base font-medium">{m.name}</p>
                                  {m.category && <p className="text-white/40 text-sm capitalize mt-0.5">{m.category}</p>}
                                </div>
                                <button
                                onClick={() => setConfirmAction({ title: 'Remove Member', message: `Remove ${m.name} from the ${entry.year} committee? This cannot be undone.`, fn: () => handleRemoveMember(entry, i) })}
                                  className="p-1 hover:bg-red-500/20 rounded text-red-400/60 hover:text-red-400 transition-colors shrink-0"
                                  title="Remove member"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Member Form */}
                        <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                          <p className="text-white/60 text-sm uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
                            <Users size={14} /> Add Member
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <input
                              type="text"
                              placeholder="Name"
                              value={memberForm.name}
                              onChange={(e) => setMemberForm(id, { ...memberForm, name: e.target.value })}
                              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 text-base transition-colors"
                            />
                            <input
                              type="text"
                              placeholder="Position (e.g. President)"
                              value={memberForm.position}
                              onChange={(e) => setMemberForm(id, { ...memberForm, position: e.target.value })}
                              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 text-base transition-colors"
                            />
                            <select
                              value={memberForm.category ?? 'student'}
                              onChange={(e) => setMemberForm(id, { ...memberForm, category: e.target.value as 'teacher' | 'student' })}
                              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 text-base transition-colors"
                            >
                              <option value="student" className="bg-[#0a1128]">Student</option>
                              <option value="teacher" className="bg-[#0a1128]">Teacher</option>
                            </select>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAddMember(entry)}
                            disabled={savingMember === id}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-500/30 hover:bg-green-500/40 text-green-300 text-base font-medium transition-colors disabled:opacity-50"
                          >
                            <Plus size={16} />
                            {savingMember === id ? 'Saving…' : 'Add Member'}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
