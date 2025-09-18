import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    scale: number;
    velocity: { x: number; y: number };
  }>>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const colors = ['#F5A623', '#FFC857', '#FF5E5B', '#FFFFFF', '#FFD700'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 3 + 2
      }
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
            scale: particle.scale,
            opacity: 1
          }}
          animate={{
            x: particle.x + particle.velocity.x * 100,
            y: window.innerHeight + 100,
            rotate: particle.rotation + 720,
            scale: particle.scale * 0.5,
            opacity: 0
          }}
          transition={{
            duration: 3,
            ease: "easeOut"
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
}