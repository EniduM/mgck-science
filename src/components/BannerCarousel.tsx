'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: number;
  src: string;
  alt: string;
}

const BannerCarousel: React.FC = () => {
  const banners: Banner[] = [
    {
      id: 2,
      src: '/banners/banner2.jpg',
      alt: "Mahamaya Girls' College Senior Science Society activity showcase",
    },
    {
      id: 3,
      src: '/banners/banner3.jpeg',
      alt: 'Students participating in Senior Science Society event',
    },
    {
      id: 4,
      src: '/banners/banner4.jpeg',
      alt: 'Science learning and collaboration at Mahamaya Girls College',
    },
    {
      id: 5,
      src: '/banners/banner5.jpeg',
      alt: 'Senior Science Society project and innovation presentation',
    },
    {
      id: 6,
      src: '/banners/banner6.jpeg',
      alt: 'School science activity highlights and student achievements',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [dragStart, setDragStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay, banners.length]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 6000);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 6000);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 6000);
  };

  const handleMouseEnter = () => {
    setAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setAutoPlay(true);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setDragStart(e.clientX);
  };

  const handleDragEnd = (e: React.MouseEvent) => {
    const dragEnd = e.clientX;
    const diff = dragStart - dragEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      className="relative w-full h-full overflow-hidden shadow-2xl group cursor-grab active:cursor-grabbing"
    >
      {/* Carousel Container */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
          }}
          className="absolute inset-0 origin-center"
        >
          <Image
            src={banners[currentIndex].src}
            alt={banners[currentIndex].alt}
            fill
            className="object-cover"
            priority
            draggable={false}
          />

          {/* Gradient Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
          />
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <motion.button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/30"
        whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Previous banner"
      >
        <ChevronLeft size={28} className="text-white drop-shadow-md" />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/30"
        whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Next banner"
      >
        <ChevronRight size={28} className="text-white drop-shadow-md" />
      </motion.button>

      {/* Dots Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3"
      >
        {banners.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white shadow-lg'
                : 'bg-white/40 hover:bg-white/70 backdrop-blur-sm'
            }`}
            style={{
              width: index === currentIndex ? 32 : 12,
              height: 12,
            }}
            layoutId={index === currentIndex ? 'active-dot' : undefined}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </motion.div>



      {/* Auto-play Indicator */}
      {autoPlay && (
        <motion.div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
          layoutId="progress-bar"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
          style={{ maxWidth: 'calc(100% - 2rem)' }}
        />
      )}
    </div>
  );
};

export default BannerCarousel;
