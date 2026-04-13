'use client';

import { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

const TRAIL_LENGTH = 22;

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Only on non-touch, non-reduced-motion
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const draw = () => {
      const mouse = mouseRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouse) {
        // Push new point
        trailRef.current.push({ x: mouse.x, y: mouse.y, alpha: 1 });
        if (trailRef.current.length > TRAIL_LENGTH) {
          trailRef.current.shift();
        }
      }

      // Decay alpha
      for (let i = 0; i < trailRef.current.length; i++) {
        trailRef.current[i].alpha *= 0.88;
      }

      // Draw
      for (let i = 0; i < trailRef.current.length; i++) {
        const p = trailRef.current[i];
        const norm = i / TRAIL_LENGTH;
        // Interpolate purple(168,85,247) → cyan(6,182,212)
        const r = Math.round(168 + (6 - 168) * norm);
        const g = Math.round(85 + (182 - 85) * norm);
        const b = Math.round(247 + (212 - 247) * norm);
        const radius = 3 + norm * 5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * 0.6})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * 0.08})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 9998 }}
      aria-hidden="true"
    />
  );
}
