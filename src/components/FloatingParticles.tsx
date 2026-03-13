/**
 * Floating Particles Component
 * Generates science-themed floating particles for the background
 */

'use client';

import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  size: 'small' | 'medium' | 'large';
  left: number;
  delay: number;
  duration: number;
}

const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only generate particles on client to avoid hydration mismatch
    setIsClient(true);
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }));
    setParticles(generatedParticles);
  }, []);

  if (!isClient) {
    return <div className="floating-particles" />;
  }

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle particle-${particle.size}`}
          style={{
            left: `${particle.left}%`,
            bottom: '-20px',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
