/**
 * Responsive Image Gallery Component
 * Used for displaying project events and achievements with multiple images
 */

'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryProps {
  images: string[];
  title?: string;
  columns?: 2 | 3 | 4;
}

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Lightbox Component - Full screen image viewer
 */
const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl"
        >
          {/* Main Image */}
          <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
            <Image
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-gold transition-colors"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </motion.button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white hover:text-gold transition-colors p-2"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white hover:text-gold transition-colors p-2"
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </motion.button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Responsive Gallery Component
 */
export const ResponsiveGallery: React.FC<GalleryProps> = ({
  images,
  title,
  columns = 3,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const handlePrev = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
      );
    }
  }, [selectedImageIndex, images.length]);

  const handleNext = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  }, [selectedImageIndex, images.length]);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedImageIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, handlePrev, handleNext]);

  const gridColClass = {
    2: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-navy mb-6">{title}</h2>}

      <div className={`grid ${gridColClass[columns]} gap-4`}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer group relative"
            onClick={() => setSelectedImageIndex(index)}
          >
            <div className="relative aspect-square w-full bg-linear-to-br from-navy/10 to-gold/10 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gold/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-6 h-6 text-navy"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4a8 8 0 110 16 8 8 0 010-16zm3.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default ResponsiveGallery;
