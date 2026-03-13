'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Image, X, AlertCircle, Edit2, Save, Loader2 } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import {
  getProjectAchievements,
  addProjectAchievement,
  updateProjectAchievement,
  deleteProjectAchievement,
} from '@/src/lib/database';
import { cloudinaryFolders } from '@/src/lib/storage';
import { GlassCard } from '@/src/components/ThemeComponents';
import ConfirmDialog from '@/src/components/ConfirmDialog';

interface ProjectAchievement {
  id: string;
  title: string;
  description: string;
  category: string;
  date?: string;
  achievedBy?: string[];
  images: string[];
}

export default function AchievementsManagement() {
  const [achievements, setAchievements] = useState<ProjectAchievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Award',
    date: new Date().toISOString().split('T')[0],
    achievedBy: '',
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading((prev) => prev || achievements.length === 0);
      const data = await getProjectAchievements();
      setAchievements((data || []) as ProjectAchievement[]);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Award',
      date: new Date().toISOString().split('T')[0],
      achievedBy: '',
    });
    setSelectedImages([]);
    setExistingImages([]);
    setError('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (ach: ProjectAchievement) => {
    setFormData({
      title: ach.title,
      description: ach.description || '',
      category: ach.category || 'Award',
      date: ach.date ? ach.date.split('T')[0] : new Date().toISOString().split('T')[0],
      achievedBy: ach.achievedBy ? ach.achievedBy.join(', ') : '',
    });
    setExistingImages(ach.images || []);
    setSelectedImages([]);
    setError('');
    setEditingId(ach.id);
    setShowForm(true);
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((file) => {
        if (!file.type.startsWith('image/')) {
          setError('Please select only image files');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError('Each image must be less than 5MB');
          return false;
        }
        return true;
      });

      if (existingImages.length + validFiles.length + selectedImages.length > 8) {
        setError('Maximum 8 images allowed');
        return;
      }

      setSelectedImages([...selectedImages, ...validFiles]);
      setError('');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setError('Please enter achievement title');
      return;
    }
    if (!editingId && selectedImages.length === 0) {
      setError('Please select at least one image');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const newImageUrls: string[] = [];
      for (const image of selectedImages) {
        const body = new FormData();
        body.append('file', image);
        body.append('folder', cloudinaryFolders.achievements);
        body.append('resource_type', 'image');
        const res = await fetch('/api/upload', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Upload failed');
        newImageUrls.push(data.url);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        achievedBy: formData.achievedBy
          ? formData.achievedBy.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        images: [...existingImages, ...newImageUrls],
      };

      const isEdit = !!editingId;
      const currentId = editingId;

      // Close form and stop spinner immediately — don't wait for Firestore
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', category: 'Award', date: new Date().toISOString().split('T')[0], achievedBy: '' });
      setSelectedImages([]);
      setExistingImages([]);
      setError('');
      setUploading(false);
      setSuccess(isEdit ? 'Achievement updated successfully!' : 'Achievement created successfully!');
      setTimeout(() => setSuccess(''), 4000);

      // Fire Firestore in background
      const savePromise = isEdit
        ? updateProjectAchievement(currentId!, payload)
        : addProjectAchievement(payload);
      savePromise.then(() => fetchAchievements()).catch((e) => console.error('Firestore save error:', e));

    } catch (error) {
      console.error('Error saving achievement:', error);
      setError('Error saving achievement. Please try again.');
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deleteProjectAchievement(id);
      await fetchAchievements();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      setError('Failed to delete achievement');
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  const categories = [
    'Award',
    'Competition',
    'Recognition',
    'Project',
    'Research',
    'Other',
  ];

  return (
    <AdminLayout
      title="Achievements & Recognition"
      description="Showcase student achievements and awards"
    >
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Achievement"
        message="This will permanently delete the achievement and its image. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
      {/* Add Achievement Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { handleResetForm(); setShowForm(true); }}
        className="mb-8 flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-300 font-semibold hover:bg-amber-500/20 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
      >
        <Plus size={20} />
        Add Achievement
      </motion.button>

      {/* Success Banner */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3"
        >
          <Save className="text-green-400 shrink-0" size={20} />
          <p className="text-green-300 font-medium">{success}</p>
        </motion.div>
      )}

      {/* Add Achievement Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-card p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">{editingId ? 'Edit Achievement' : 'Add New Achievement'}</h3>
            <button
              onClick={handleResetForm}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-white/60" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-3">
              <AlertCircle className="text-red-400 shrink-0" size={20} />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Achievement Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Science Olympiad Gold Medal"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-navy">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Achieved By (comma-separated)</label>
                <input
                  type="text"
                  value={formData.achievedBy}
                  onChange={(e) => setFormData({ ...formData, achievedBy: e.target.value })}
                  placeholder="e.g., Alice, Bob, Carol"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details about the achievement..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {editingId && existingImages.length > 0 && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Current Images — click &times; to remove</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {existingImages.map((url, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-white/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`img-${idx}`} className="w-full h-20 object-cover" />
                      <button type="button" onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded bg-red-500/80 hover:bg-red-500 transition-colors">
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                {editingId ? 'Add More Images (optional, max 8 total, 5 MB each)' : 'Images * (max 8, 5 MB each)'}
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelection}
                  className="hidden"
                  id="images-input"
                />
                <label
                  htmlFor="images-input"
                  className="flex items-center justify-center w-full px-4 py-6 rounded-lg border-2 border-dashed border-white/20 hover:border-amber-500 transition-colors cursor-pointer bg-white/5 hover:bg-white/10"
                >
                  <div className="text-center">
                    {/* Image is from lucide-react, not HTML img element */}
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="mx-auto mb-2 text-amber-400" size={24} />
                    <p className="text-white/80 text-sm">
                      Click to select images or drag and drop
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      {selectedImages.length} image(s) selected
                    </p>
                  </div>
                </label>
              </div>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedImages.map((file, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden bg-white/10 border border-white/20"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded bg-red-500/80 hover:bg-red-500 transition-colors"
                      >
                        <X size={16} className="text-white" />
                      </button>
                      <p className="absolute bottom-1 left-1 right-1 text-xs text-white/70 truncate bg-black/40 px-1 py-0.5 rounded">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-500/30 hover:bg-green-500/40 text-green-300 font-medium transition-all duration-300 disabled:opacity-50"
              >
                {uploading
                  ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  : <><Save size={16} /> {editingId ? 'Save Changes' : 'Add Achievement'}</> }
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

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60">Loading achievements...</p>
          </div>
        ) : achievements.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60 text-base">No achievements added yet.</p>
            <p className="text-white/40 text-base mt-2">Click add to create one.</p>
          </div>
        ) : (
          achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white leading-snug">{achievement.title}</h3>
                  <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">{achievement.category}</span>
                </div>
                {achievement.date && (
                  <p className="text-white/50 text-xs mb-1">📅 {new Date(achievement.date).toLocaleDateString()}</p>
                )}
                {achievement.achievedBy && achievement.achievedBy.length > 0 && (
                  <p className="text-white/50 text-xs mb-3">🏆 {achievement.achievedBy.join(', ')}</p>
                )}
                <p className="text-white/70 text-sm mb-4 line-clamp-2 flex-1">
                  {achievement.description || 'No description provided'}
                </p>

                {achievement.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {achievement.images.slice(0, 3).map((img, idx) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={idx} src={img} alt="" className="w-full h-16 object-cover rounded" />
                    ))}
                    {achievement.images.length > 3 && (
                      <div className="w-full h-16 rounded bg-white/10 flex items-center justify-center">
                        <span className="text-white/60 text-xs font-medium">+{achievement.images.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-white/10 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(achievement)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-blue-500/30 hover:bg-blue-500/40 text-blue-300 text-sm font-medium transition-colors"
                  >
                    <Edit2 size={15} /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmId(achievement.id)}
                    disabled={deleting === achievement.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-red-500/30 hover:bg-red-500/40 text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    {deleting === achievement.id ? '...' : 'Delete'}
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
