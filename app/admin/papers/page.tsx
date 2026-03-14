'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, Upload, X, AlertCircle, Pencil } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import { getPapers, addPaper, deletePaper, updatePaper } from '@/src/lib/database';

import { GlassCard } from '@/src/components/ThemeComponents';
import ConfirmDialog from '@/src/components/ConfirmDialog';

interface Paper {
  id: string;
  title: string;
  subject: string;
  year: number;
  medium: 'Sinhala' | 'English';
  downloadUrl: string;
  fileSize: string;
}

export default function PapersManagement() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Agriculture',
    year: new Date().getFullYear(),
    medium: 'English' as 'Sinhala' | 'English',
  });
  const [customSubject, setCustomSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterMedium, setFilterMedium] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading((prev) => prev || papers.length === 0);
      const data = await getPapers();
      setPapers(data as Paper[]);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setError('Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      title: '',
      subject: 'Agriculture',
      year: new Date().getFullYear(),
      medium: 'English',
    });
    setCustomSubject('');
    setFile(null);
    setError('');
    setEditingPaper(null);
    setShowForm(false);
  };

  const handleEdit = (paper: Paper) => {
    setEditingPaper(paper);
    const isOther = !['Agriculture', 'Biology', 'BST', 'Chemistry', 'Maths', 'Physics'].includes(paper.subject);
    setFormData({
      title: paper.title,
      subject: isOther ? 'Other' : paper.subject,
      year: paper.year,
      medium: paper.medium,
    });
    setCustomSubject(isOther ? paper.subject : '');
    setFile(null);
    setError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setError('Please enter a paper title');
      return;
    }
    // For new papers a file is required; for edits it's optional
    if (!editingPaper && !file) {
      setError('Please select a PDF file');
      return;
    }

    try {
      setUploading(true);
      setError('');

      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured');
      }
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not configured');
      }

      let downloadUrl = editingPaper?.downloadUrl ?? '';
      let fileSize = editingPaper?.fileSize ?? '';
      const selectedSubject =
        formData.subject === 'Other' ? customSubject.trim() || 'Other' : formData.subject;

      // Upload new file if provided
      if (file) {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        data.append('folder', `mgck-science/papers/${formData.year}/${selectedSubject}`);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
          {
            method: 'POST',
            body: data,
          }
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error?.message ?? uploadData.error ?? 'Upload failed');
        downloadUrl = uploadData.secure_url;
        fileSize = (file.size / 1024).toFixed(2) + ' KB';
      }

      const paperData = {
        title: formData.title,
        subject: selectedSubject,
        year: formData.year,
        medium: formData.medium,
        downloadUrl,
        fileSize,
      };

      // Close form immediately
      const isEdit = !!editingPaper;
      const editId = editingPaper?.id;
      setShowForm(false);
      setFormData({ title: '', subject: 'Agriculture', year: new Date().getFullYear(), medium: 'English' });
      setCustomSubject('');
      setFile(null);
      setError('');
      setEditingPaper(null);
      setUploading(false);
      setSuccess(isEdit ? 'Paper updated successfully!' : 'Paper uploaded successfully!');
      setTimeout(() => setSuccess(''), 4000);

      // Fire Firestore in background
      if (isEdit && editId) {
        updatePaper(editId, paperData).then(() => fetchPapers()).catch((e) => console.error('Firestore update error:', e));
      } else {
        addPaper(paperData).then(() => fetchPapers()).catch((e) => console.error('Firestore save error:', e));
      }

    } catch (error) {
      console.error('Error saving paper:', error);
      setError('Error saving paper. Please try again.');
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deletePaper(id);
      await fetchPapers();
    } catch (error) {
      console.error('Error deleting paper:', error);
      setError('Failed to delete paper');
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  const subjects = ['Agriculture', 'Biology', 'BST', 'Chemistry', 'Maths', 'Physics', 'Other'];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 16 }, (_, index) => currentYear + 5 - index);
  const availableSubjects = useMemo(
    () => Array.from(new Set(papers.map((paper) => paper.subject))).sort((a, b) => a.localeCompare(b)),
    [papers]
  );
  const availableYears = useMemo(
    () => Array.from(new Set(papers.map((paper) => paper.year))).sort((a, b) => b - a),
    [papers]
  );

  const filteredPapers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = papers.filter((paper) => {
      const matchesSearch =
        query.length === 0 ||
        paper.title.toLowerCase().includes(query) ||
        paper.subject.toLowerCase().includes(query) ||
        paper.medium.toLowerCase().includes(query);
      const matchesSubject = filterSubject === 'all' || paper.subject === filterSubject;
      const matchesYear = filterYear === 'all' || paper.year === Number.parseInt(filterYear, 10);
      const matchesMedium = filterMedium === 'all' || paper.medium === filterMedium;

      return matchesSearch && matchesSubject && matchesYear && matchesMedium;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'oldest') return a.year - b.year;
      return b.year - a.year;
    });

    return filtered;
  }, [papers, searchQuery, filterSubject, filterYear, filterMedium, sortBy]);

  return (
    <AdminLayout
      title="Papers Management"
      description="Upload and manage term test papers"
    >
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Paper"
        message="This will permanently delete the paper and its file. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
      {/* Add Paper Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowForm(true)}
        className="mb-8 flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-300 font-semibold hover:bg-amber-500/20 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
      >
        <Plus size={20} />
        Upload New Paper
      </motion.button>

      {/* Success Banner */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3"
        >
          <Upload className="text-green-400 shrink-0" size={20} />
          <p className="text-green-300 font-medium">{success}</p>
        </motion.div>
      )}

      {/* Upload / Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-card p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">{editingPaper ? 'Edit Paper' : 'Upload New Paper'}</h3>
            <button
              onClick={handleResetForm}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-white/60" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-gap-3">
              <AlertCircle className="text-red-400 shrink-0" size={20} />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-base font-medium mb-2">
                  Paper Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Biology Final Exam 2024"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/80 text-base font-medium mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (e.target.value !== 'Other') setCustomSubject('');
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition-colors"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject} className="bg-navy">
                      {subject}
                    </option>
                  ))}
                </select>
                {formData.subject === 'Other' && (
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter subject name"
                    className="mt-2 w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                  />
                )}
              </div>

              <div>
                <label className="block text-white/80 text-base font-medium mb-2">
                  Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition-colors"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year} className="bg-navy">
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-base font-medium mb-2">
                  Medium
                </label>
                <select
                  value={formData.medium}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medium: e.target.value as 'Sinhala' | 'English',
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="English" className="bg-navy">
                    English
                  </option>
                  <option value="Sinhala" className="bg-navy">
                    Sinhala
                  </option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-white/80 text-base font-medium mb-2">
                {editingPaper ? 'Replace PDF (optional — leave blank to keep existing)' : 'PDF File (Max 10MB)'}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center w-full px-4 py-6 rounded-lg border-2 border-dashed border-white/20 hover:border-gold transition-colors cursor-pointer bg-white/5 hover:bg-white/10"
                >
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-gold" size={24} />
                    <p className="text-white/80 text-sm">
                      {file ? file.name : editingPaper ? 'Click to replace PDF (optional)' : 'Click to select PDF or drag and drop'}
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      PDF files up to 10MB
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={uploading}
                className="px-6 py-2 rounded-lg bg-green-500/30 hover:bg-green-500/40 text-green-300 font-medium transition-all duration-300 disabled:opacity-50"
              >
                {uploading ? (editingPaper ? 'Saving...' : 'Uploading...') : (editingPaper ? 'Save Changes' : 'Upload Paper')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleResetForm}
                className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, subject, medium"
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors lg:col-span-2"
          />
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition-colors"
          >
            <option value="all" className="bg-navy">All Subjects</option>
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject} className="bg-navy">{subject}</option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition-colors"
          >
            <option value="all" className="bg-navy">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year} className="bg-navy">{year}</option>
            ))}
          </select>
          <select
            value={filterMedium}
            onChange={(e) => setFilterMedium(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition-colors"
          >
            <option value="all" className="bg-navy">All Mediums</option>
            <option value="English" className="bg-navy">English</option>
            <option value="Sinhala" className="bg-navy">Sinhala</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-white/60">
            Showing <span className="text-white font-semibold">{filteredPapers.length}</span> of {papers.length} papers
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition-colors"
            >
              <option value="newest" className="bg-navy">Newest Year</option>
              <option value="oldest" className="bg-navy">Oldest Year</option>
              <option value="title" className="bg-navy">Title A-Z</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterSubject('all');
                setFilterYear('all');
                setFilterMedium('all');
                setSortBy('newest');
              }}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Papers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60">Loading papers...</p>
          </div>
        ) : papers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60 text-base">No papers uploaded yet.</p>
            <p className="text-white/40 text-base mt-2">Click upload to add papers.</p>
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60 text-base">No papers match your search or filters.</p>
            <p className="text-white/40 text-base mt-2">Try different filter values or clear filters.</p>
          </div>
        ) : (
          filteredPapers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white truncate">
                    {paper.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 rounded text-sm font-medium bg-blue-500/30 text-blue-300">
                      {paper.subject}
                    </span>
                    <span className="px-2 py-1 rounded text-sm font-medium bg-purple-500/30 text-purple-300">
                      {paper.year}
                    </span>
                    <span className="px-2 py-1 rounded text-sm font-medium bg-green-500/30 text-green-300">
                      {paper.medium}
                    </span>
                  </div>
                </div>

                <p className="text-white/60 text-sm mb-4">
                  Size: {paper.fileSize}
                </p>

                <div className="flex gap-2 pt-4 border-t border-white/10 mt-auto">
                  <motion.a
                    href={paper.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-blue-500/30 hover:bg-blue-500/40 text-blue-300 text-sm font-medium transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(paper)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-medium transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmId(paper.id)}
                    disabled={deleting === paper.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-red-500/30 hover:bg-red-500/40 text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {deleting === paper.id ? '...' : 'Delete'}
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
