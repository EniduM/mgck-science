'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Image, X, AlertCircle, Edit2, Save, Loader2 } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import {
  getProjectEvents,
  addProjectEvent,
  updateProjectEvent,
  deleteProjectEvent,
} from '@/src/lib/database';
import { cloudinaryFolders } from '@/src/lib/storage';
import { GlassCard } from '@/src/components/ThemeComponents';
import ConfirmDialog from '@/src/components/ConfirmDialog';

interface ProjectEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  category?: string;
  images: string[];
}

export default function EventsManagement() {
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    category: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading((prev) => prev || events.length === 0);
      const data = await getProjectEvents();
      setEvents((data || []) as ProjectEvent[]);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      category: '',
    });
    setSelectedImages([]);
    setExistingImages([]);
    setError('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (ev: ProjectEvent) => {
    setFormData({
      title: ev.title,
      description: ev.description || '',
      date: ev.date ? ev.date.split('T')[0] : new Date().toISOString().split('T')[0],
      location: ev.location || '',
      category: ev.category || '',
    });
    setExistingImages(ev.images || []);
    setSelectedImages([]);
    setError('');
    setEditingId(ev.id);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
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

      if (existingImages.length + validFiles.length + selectedImages.length > 10) {
        setError('Maximum 10 images allowed');
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
      setError('Please enter event title');
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
        body.append('folder', cloudinaryFolders.events);
        body.append('resource_type', 'image');
        const res = await fetch('/api/upload', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Upload failed');
        newImageUrls.push(data.url);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        category: formData.category,
        images: [...existingImages, ...newImageUrls],
      };

      const isEdit = !!editingId;
      const currentId = editingId;

      // Close form and stop spinner immediately — don't wait for Firestore
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0], location: '', category: '' });
      setSelectedImages([]);
      setExistingImages([]);
      setError('');
      setUploading(false);
      setSuccess(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
      setTimeout(() => setSuccess(''), 4000);

      // Fire Firestore in background
      const savePromise = isEdit
        ? updateProjectEvent(currentId!, payload)
        : addProjectEvent(payload);
      savePromise.then(() => fetchEvents()).catch((e) => console.error('Firestore save error:', e));

    } catch (error) {
      console.error('Error saving event:', error);
      setError('Error saving event. Please try again.');
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deleteProjectEvent(id);
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event');
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  return (
    <AdminLayout
      title="Activities & Initiatives"
      description="Create and manage activity events with image galleries"
    >
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Event"
        message="This event and all its images will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete Event"
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />

      {/* Add Event Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { handleResetForm(); setShowForm(true); }}
        className="mb-8 flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-300 font-semibold hover:bg-amber-500/20 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
      >
        <Plus size={20} />
        Create New Event
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

      {/* Create Event Form */}
      {showForm && (
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 glass-card p-6 border ${editingId ? 'border-amber-500/40' : 'border-white/10'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">{editingId ? 'Edit Event' : 'Create New Event'}</h3>
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
                <label className="block text-white/80 text-sm font-medium mb-2">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Science Fair 2026"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Event Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., School Premises"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Workshop, Competition"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event details and description..."
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
                {editingId ? 'Add More Images (optional, max 10 total, 5 MB each)' : 'Images * (max 10, 5 MB each)'}
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
                  : <><Save size={16} /> {editingId ? 'Save Changes' : 'Create Event'}</>}
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

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60 text-base">No events created yet.</p>
            <p className="text-white/40 text-base mt-2">Click create to add an event.</p>
          </div>
        ) : (
          events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white leading-snug">{event.title}</h3>
                  {event.category && (
                    <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">{event.category}</span>
                  )}
                </div>
                {event.date && <p className="text-white/50 text-xs mb-1">📅 {new Date(event.date).toLocaleDateString()}</p>}
                {event.location && <p className="text-white/50 text-xs mb-3">📍 {event.location}</p>}
                <p className="text-white/70 text-sm mb-4 line-clamp-3 flex-1">
                  {event.description || 'No description provided'}
                </p>

                {event.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {event.images.slice(0, 3).map((img, idx) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={idx} src={img} alt="" className="w-full h-16 object-cover rounded" />
                    ))}
                    {event.images.length > 3 && (
                      <div className="w-full h-16 rounded bg-white/10 flex items-center justify-center">
                        <span className="text-white/60 text-xs font-medium">+{event.images.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-white/10 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-blue-500/30 hover:bg-blue-500/40 text-blue-300 text-sm font-medium transition-colors"
                  >
                    <Edit2 size={15} /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmId(event.id)}
                    disabled={deleting === event.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-red-500/30 hover:bg-red-500/40 text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    {deleting === event.id ? '...' : 'Delete'}
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
