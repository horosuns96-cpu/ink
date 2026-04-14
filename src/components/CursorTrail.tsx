'use client';

import { useEffect, useRef } from 'react';
import { subscribeRaf } from '@/lib/rafScheduler';

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

const TRAIL_LENGTH = 14;

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    let w = window.innerWidth;
    let h = window.innerHeight;
    let needsClear = false;

    const origResize = resize;
    window.removeEventListener('resize', resize);
    const resizeWithCache = () => {
      origResize();
      w = canvas.width;
      h = canvas.height;
    };
    window.addEventListener('resize', resizeWithCache, { passive: true });

    const draw = (_timestamp: number) => {
      const mouse = mouseRef.current;
      const trail = trailRef.current;

      // Only push if mouse actually moved
      if (mouse) {
        const last = trail[trail.length - 1];
        if (!last || last.x !== mouse.x || last.y !== mouse.y) {
          trail.push({ x: mouse.x, y: mouse.y, alpha: 1 });
          if (trail.length > TRAIL_LENGTH) trail.shift();
        }
      }

      // Decay and prune fully faded points
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].alpha *= 0.88;
        if (trail[i].alpha < 0.01) trail.splice(i, 1);
      }

      // Nothing active — clear once then skip
      if (trail.length === 0) {
        if (needsClear) {
          ctx.clearRect(0, 0, w, h);
          needsClear = false;
        }
        return;
      }

      needsClear = true;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
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
    };

    const unsubscribe = subscribeRaf(draw);

    return () => {
      window.removeEventListener('resize', resizeWithCache);
      window.removeEventListener('mousemove', onMove);
      unsubscribe();
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
