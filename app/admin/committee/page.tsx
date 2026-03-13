'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, Save, ChevronDown, ChevronUp, Users, Award, BookOpen, Loader2 } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import { getCommitteeData, setCommitteeData, CommitteeData, ExecutiveMember, QuizTeamEntry } from '@/src/lib/database';
import { GlassCard } from '@/src/components/ThemeComponents';

// ─── helpers ───────────────────────────────────────────────────────────────

const EMPTY_COMMITTEE: CommitteeData = {
  year: '',
  teachersInCharge: [],
  executiveCommittee: [],
  organizers: [],
  editors: [],
  coordinators: [],
  quizTeams: [],
  committeeMembers: [],
  classCoordinators: [],
};

// ─── StringListEditor ──────────────────────────────────────────────────────

function StringListEditor({
  title,
  icon,
  items,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [newName, setNewName] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState('');
  const [open, setOpen] = useState(true);

  const add = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setNewName('');
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const startEdit = (i: number) => {
    setEditIdx(i);
    setEditVal(items[i]);
  };

  const saveEdit = () => {
    if (editIdx === null) return;
    const updated = [...items];
    updated[editIdx] = editVal.trim();
    onChange(updated);
    setEditIdx(null);
    setEditVal('');
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 text-amber-400 font-bold uppercase tracking-widest text-sm">
          {icon}
          {title}
          <span className="text-white/40 font-normal normal-case tracking-normal text-xs ml-1">
            ({items.length})
          </span>
        </div>
        {open ? <ChevronUp size={16} className="text-amber-400" /> : <ChevronDown size={16} className="text-amber-400" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/10">
              {/* Add row */}
              <div className="flex gap-2 mt-4 mb-4">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && add()}
                  placeholder="Add name…"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  onClick={add}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              {/* List */}
              <div className="space-y-2">
                {items.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {editIdx === i ? (
                      <>
                        <input
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          autoFocus
                          className="flex-1 px-3 py-1.5 rounded bg-white/10 border border-amber-500/60 text-white text-sm focus:outline-none"
                        />
                        <button onClick={saveEdit} className="p-1.5 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"><Check size={14} /></button>
                        <button onClick={() => setEditIdx(null)} className="p-1.5 rounded bg-white/10 text-white/60 hover:bg-white/20 transition-colors"><X size={14} /></button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-gray-300 text-sm px-3 py-1.5 rounded bg-white/5 border border-white/10">{name}</span>
                        <button onClick={() => startEdit(i)} className="p-1.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => remove(i)} className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-white/30 text-xs italic text-center py-2">No entries yet. Add one above.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ExecutiveEditor ───────────────────────────────────────────────────────

function ExecutiveEditor({
  items,
  onChange,
}: {
  items: ExecutiveMember[];
  onChange: (items: ExecutiveMember[]) => void;
}) {
  const [newName, setNewName] = useState('');
  const [newPos, setNewPos] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPos, setEditPos] = useState('');
  const [open, setOpen] = useState(true);

  const add = () => {
    if (!newName.trim() || !newPos.trim()) return;
    onChange([...items, { name: newName.trim(), position: newPos.trim() }]);
    setNewName('');
    setNewPos('');
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const startEdit = (i: number) => {
    setEditIdx(i);
    setEditName(items[i].name);
    setEditPos(items[i].position);
  };

  const saveEdit = () => {
    if (editIdx === null) return;
    const updated = [...items];
    updated[editIdx] = { name: editName.trim(), position: editPos.trim() };
    onChange(updated);
    setEditIdx(null);
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 text-amber-400 font-bold uppercase tracking-widest text-sm">
          <Award size={16} /> Executive Committee
          <span className="text-white/40 font-normal normal-case tracking-normal text-xs ml-1">({items.length})</span>
        </div>
        {open ? <ChevronUp size={16} className="text-amber-400" /> : <ChevronDown size={16} className="text-amber-400" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/10">
              <div className="flex gap-2 mt-4 mb-4 flex-wrap">
                <input
                  value={newPos}
                  onChange={(e) => setNewPos(e.target.value)}
                  placeholder="Position (e.g. President)"
                  className="flex-1 min-w-[160px] px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && add()}
                  placeholder="Name"
                  className="flex-1 min-w-[160px] px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  onClick={add}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="space-y-2">
                {items.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {editIdx === i ? (
                      <>
                        <input value={editPos} onChange={(e) => setEditPos(e.target.value)} autoFocus className="w-40 px-3 py-1.5 rounded bg-white/10 border border-amber-500/60 text-white text-sm focus:outline-none" placeholder="Position" />
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} className="flex-1 px-3 py-1.5 rounded bg-white/10 border border-amber-500/60 text-white text-sm focus:outline-none" placeholder="Name" />
                        <button onClick={saveEdit} className="p-1.5 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"><Check size={14} /></button>
                        <button onClick={() => setEditIdx(null)} className="p-1.5 rounded bg-white/10 text-white/60 hover:bg-white/20 transition-colors"><X size={14} /></button>
                      </>
                    ) : (
                      <>
                        <span className="w-40 shrink-0 text-amber-400 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded bg-white/5 border border-amber-500/20">{m.position}</span>
                        <span className="flex-1 text-white text-sm px-3 py-1.5 rounded bg-white/5 border border-white/10">{m.name}</span>
                        <button onClick={() => startEdit(i)} className="p-1.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => remove(i)} className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-white/30 text-xs italic text-center py-2">No entries yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── QuizTeamBlock ─────────────────────────────────────────────────────────

function QuizTeamBlock({
  team,
  onNameChange,
  onMembersChange,
  onRemove,
}: {
  team: QuizTeamEntry;
  onNameChange: (n: string) => void;
  onMembersChange: (m: string[]) => void;
  onRemove: () => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(team.name);
  const [newMember, setNewMember] = useState('');
  const [editMemberIdx, setEditMemberIdx] = useState<number | null>(null);
  const [editMemberVal, setEditMemberVal] = useState('');

  const saveName = () => {
    onNameChange(nameVal.trim() || team.name);
    setEditingName(false);
  };

  const addMember = () => {
    if (!newMember.trim()) return;
    onMembersChange([...team.members, newMember.trim()]);
    setNewMember('');
  };

  const removeMember = (i: number) => onMembersChange(team.members.filter((_, idx) => idx !== i));

  const saveMember = () => {
    if (editMemberIdx === null) return;
    const updated = [...team.members];
    updated[editMemberIdx] = editMemberVal.trim();
    onMembersChange(updated);
    setEditMemberIdx(null);
  };

  return (
    <div className="rounded-xl border border-yellow-500/20 bg-white/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        {editingName ? (
          <>
            <input value={nameVal} onChange={(e) => setNameVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveName()} autoFocus className="flex-1 px-3 py-1.5 rounded bg-white/10 border border-amber-500/60 text-white font-bold text-sm focus:outline-none" />
            <button onClick={saveName} className="p-1.5 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"><Check size={14} /></button>
            <button onClick={() => setEditingName(false)} className="p-1.5 rounded bg-white/10 text-white/60 hover:bg-white/20 transition-colors"><X size={14} /></button>
          </>
        ) : (
          <>
            <span className="flex-1 text-white font-bold">{team.name}</span>
            <button onClick={() => { setNameVal(team.name); setEditingName(true); }} className="p-1.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"><Edit2 size={14} /></button>
            <button onClick={onRemove} className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"><Trash2 size={14} /></button>
          </>
        )}
      </div>

      <div className="flex gap-2 mb-2">
        <input
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addMember()}
          placeholder="Add member name…"
          className="flex-1 px-3 py-1.5 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-amber-500 transition-colors"
        />
        <button onClick={addMember} className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-medium transition-colors flex items-center gap-1"><Plus size={12} /></button>
      </div>

      <div className="space-y-1.5 ml-2">
        {team.members.map((m, i) => (
          <div key={i} className="flex items-center gap-2">
            {editMemberIdx === i ? (
              <>
                <input value={editMemberVal} onChange={(e) => setEditMemberVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveMember()} autoFocus className="flex-1 px-2 py-1 rounded bg-white/10 border border-amber-500/60 text-white text-xs focus:outline-none" />
                <button onClick={saveMember} className="p-1 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"><Check size={12} /></button>
                <button onClick={() => setEditMemberIdx(null)} className="p-1 rounded bg-white/10 text-white/60 hover:bg-white/20 transition-colors"><X size={12} /></button>
              </>
            ) : (
              <>
                <span className="flex-1 text-gray-300 text-xs px-2 py-1 rounded bg-white/5 border border-white/10">{m}</span>
                <button onClick={() => { setEditMemberIdx(i); setEditMemberVal(m); }} className="p-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"><Edit2 size={12} /></button>
                <button onClick={() => removeMember(i)} className="p-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"><Trash2 size={12} /></button>
              </>
            )}
          </div>
        ))}
        {team.members.length === 0 && <p className="text-white/30 text-xs italic">No members yet.</p>}
      </div>
    </div>
  );
}

// ─── QuizTeamsEditor ───────────────────────────────────────────────────────

function QuizTeamsEditor({
  teams,
  onChange,
}: {
  teams: QuizTeamEntry[];
  onChange: (teams: QuizTeamEntry[]) => void;
}) {
  const [open, setOpen] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');

  const addTeam = () => {
    if (!newTeamName.trim()) return;
    onChange([...teams, { name: newTeamName.trim(), members: [] }]);
    setNewTeamName('');
  };

  const removeTeam = (i: number) => onChange(teams.filter((_, idx) => idx !== i));

  const updateTeamName = (i: number, name: string) => {
    const updated = [...teams];
    updated[i] = { ...updated[i], name };
    onChange(updated);
  };

  const updateMembers = (i: number, members: string[]) => {
    const updated = [...teams];
    updated[i] = { ...updated[i], members };
    onChange(updated);
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 text-amber-400 font-bold uppercase tracking-widest text-sm">
          <BookOpen size={16} /> Quiz Teams
          <span className="text-white/40 font-normal normal-case tracking-normal text-xs ml-1">({teams.length} teams)</span>
        </div>
        {open ? <ChevronUp size={16} className="text-amber-400" /> : <ChevronDown size={16} className="text-amber-400" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/10">
              <div className="flex gap-2 mt-4 mb-4">
                <input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTeam()}
                  placeholder="Team name (e.g. Team A)"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  onClick={addTeam}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add Team
                </button>
              </div>

              <div className="space-y-4">
                {teams.map((team, i) => (
                  <QuizTeamBlock
                    key={i}
                    team={team}
                    onNameChange={(n) => updateTeamName(i, n)}
                    onMembersChange={(m) => updateMembers(i, m)}
                    onRemove={() => removeTeam(i)}
                  />
                ))}
                {teams.length === 0 && (
                  <p className="text-white/30 text-xs italic text-center py-2">No teams yet. Add one above.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function CommitteeManagement() {
  const [data, setData] = useState<CommitteeData>(EMPTY_COMMITTEE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const existing = await getCommitteeData();
        if (existing) setData(existing);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = data as CommitteeData & { id?: string };
      await setCommitteeData(rest);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const update = useCallback(<K extends keyof CommitteeData>(key: K, value: CommitteeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Committee Management" description="Loading…">
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Committee Management"
      description="Manage the current year's committee members across all sections"
    >
      {/* Save button – sticky top */}
      <div className="sticky top-4 z-20 flex justify-end mb-8">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 ${
            saved
              ? 'bg-green-500/30 border border-green-400/50 text-green-300'
              : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300'
          } disabled:opacity-60`}
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin" /> Saving…</>
          ) : saved ? (
            <><Check size={16} /> Saved!</>
          ) : (
            <><Save size={16} /> Save All Changes</>
          )}
        </motion.button>
      </div>

      {/* Committee Year */}
      <GlassCard className="p-6 mb-6">
        <label className="block text-amber-400 uppercase tracking-widest text-sm font-bold mb-3">
          Committee Year
        </label>
        <input
          value={data.year}
          onChange={(e) => update('year', e.target.value)}
          placeholder="e.g. 2025–2026"
          className="w-full max-w-xs px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors text-sm"
        />
        <p className="text-white/40 text-xs mt-2">
          Displayed as the section heading on the home page (e.g. &ldquo;Committee 2025–2026&rdquo;).
        </p>
      </GlassCard>

      {/* Sections */}
      <div className="space-y-4">
        <StringListEditor
          title="Teachers-in-Charge"
          icon={<Users size={16} />}
          items={data.teachersInCharge}
          onChange={(v) => update('teachersInCharge', v)}
        />

        <ExecutiveEditor
          items={data.executiveCommittee}
          onChange={(v) => update('executiveCommittee', v)}
        />

        <StringListEditor
          title="Organizers"
          icon={<Users size={16} />}
          items={data.organizers}
          onChange={(v) => update('organizers', v)}
        />

        <StringListEditor
          title="Editors"
          icon={<BookOpen size={16} />}
          items={data.editors}
          onChange={(v) => update('editors', v)}
        />

        <StringListEditor
          title="Coordinators"
          icon={<Users size={16} />}
          items={data.coordinators}
          onChange={(v) => update('coordinators', v)}
        />

        <QuizTeamsEditor
          teams={data.quizTeams}
          onChange={(v) => update('quizTeams', v)}
        />

        <StringListEditor
          title="Committee Members"
          icon={<Users size={16} />}
          items={data.committeeMembers}
          onChange={(v) => update('committeeMembers', v)}
        />

        <StringListEditor
          title="Class Coordinators"
          icon={<Users size={16} />}
          items={data.classCoordinators}
          onChange={(v) => update('classCoordinators', v)}
        />
      </div>

      {/* Bottom save */}
      <div className="mt-10 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 shadow-lg disabled:opacity-60 transition-all duration-300"
        >
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save All Changes</>}
        </motion.button>
      </div>
    </AdminLayout>
  );
}
