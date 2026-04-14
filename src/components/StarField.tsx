'use client';

import { useEffect, useRef } from 'react';
import { subscribeRaf } from '@/lib/rafScheduler';

interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;      // drift speed
  angle: number;      // drift direction radians
  phase: number;      // flicker phase offset
  flickerSpeed: number;
}

const STAR_COUNT = 80;

function createStars(w: number, h: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.2 + 0.3,
    speed: Math.random() * 0.12 + 0.02,
    angle: Math.random() * Math.PI * 2,
    phase: Math.random() * Math.PI * 2,
    flickerSpeed: Math.random() * 0.6 + 0.2,
  }));
}

const FRAME_MS = 1000 / 30;
const BUCKETS = 6;

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let stars = createStars(w, h);
    let t = 0;
    let lastTime = 0;

    // Pre-allocated bucket arrays — reused every frame, zero GC pressure
    const buckets: Star[][] = Array.from({ length: BUCKETS }, () => []);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      stars = createStars(w, h);
    };
    window.addEventListener('resize', resize, { passive: true });

    const draw = (timestamp: number) => {
      if (timestamp - lastTime < FRAME_MS) return;
      lastTime = timestamp;

      ctx.clearRect(0, 0, w, h);
      t += 0.016;

      // Clear buckets
      for (let i = 0; i < BUCKETS; i++) buckets[i].length = 0;

      // Move stars and sort into opacity buckets
      for (const s of stars) {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        const opacity = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * s.flickerSpeed + s.phase));
        const idx = Math.min(Math.floor(opacity * BUCKETS), BUCKETS - 1);
        buckets[idx].push(s);
      }

      // Draw each bucket as a single batched path — 6 fill() calls instead of 80
      for (let i = 0; i < BUCKETS; i++) {
        const group = buckets[i];
        if (group.length === 0) continue;
        ctx.fillStyle = `rgba(255,255,255,${(i + 0.5) / BUCKETS})`;
        ctx.beginPath();
        for (const s of group) {
          ctx.moveTo(s.x + s.r, s.y);
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    const unsubscribe = subscribeRaf(draw);

    return () => {
      window.removeEventListener('resize', resize);
      unsubscribe();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
