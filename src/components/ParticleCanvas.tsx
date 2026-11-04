/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

export interface ParticleTrigger {
  x: number;
  y: number;
  color: string;
  count?: number;
  type?: 'burst' | 'ring' | 'gem';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  shape: 'square' | 'sparkle' | 'ring';
}

interface ParticleCanvasProps {
  triggers: ParticleTrigger[];
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ triggers }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const rafRef = useRef<number | null>(null);

  // Resize canvas to match screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Spawn new particles whenever new triggers come in
  useEffect(() => {
    if (!triggers || triggers.length === 0) return;

    const newParticles: Particle[] = [];

    triggers.forEach((trig) => {
      const count = trig.count || 24;
      const isRing = trig.type === 'ring';
      const isGem = trig.type === 'gem';

      if (isRing) {
        newParticles.push({
          x: trig.x,
          y: trig.y,
          vx: 0,
          vy: 0,
          size: 10,
          color: trig.color,
          alpha: 0.9,
          life: 0,
          maxLife: 28,
          rotation: 0,
          vRot: 0,
          shape: 'ring',
        });
      }

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = isGem ? 4 + Math.random() * 8 : 2 + Math.random() * 7;
        const size = isGem ? 6 + Math.random() * 6 : 4 + Math.random() * 8;

        newParticles.push({
          x: trig.x + (Math.random() - 0.5) * 15,
          y: trig.y + (Math.random() - 0.5) * 15,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isGem ? 2 : 1),
          size,
          color: trig.color,
          alpha: 1,
          life: 0,
          maxLife: 30 + Math.random() * 25,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.25,
          shape: isGem ? 'sparkle' : Math.random() > 0.4 ? 'square' : 'sparkle',
        });
      }
    });

    particlesRef.current.push(...newParticles);
  }, [triggers]);

  // 60fps Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (now: number) => {
      const rawDt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const dt = Math.min(rawDt, 0.05);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt * 60;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        p.alpha = 1 - Math.pow(progress, 1.4);

        if (p.shape === 'ring') {
          p.size += dt * 260;
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.7;
          ctx.lineWidth = Math.max(1, 4 * (1 - progress));
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.stroke();
          ctx.restore();
          continue;
        }

        // Apply friction and subtle gravity
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vy += 4.5 * dt; // gravity

        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        if (p.shape === 'sparkle') {
          // Draw diamond 4-point sparkle star
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        } else {
          // Draw square block shard with bevel outline
          const half = p.size / 2;
          ctx.fillRect(-half, -half, p.size, p.size);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-half, -half, p.size, p.size);
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
