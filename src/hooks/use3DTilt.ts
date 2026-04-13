'use client';

import { useRef, useCallback, CSSProperties } from 'react';

interface TiltOptions {
  max?: number;    // max degrees of rotation (default 12)
  scale?: number;  // scale on hover (default 1.03)
  speed?: number;  // transition speed ms (default 400)
  glare?: boolean; // enable glare highlight (default true)
}

interface TiltResult {
  ref: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

// Detect touch device — skip tilt on mobile
const isTouch =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

export function use3DTilt(options: TiltOptions = {}): TiltResult {
  const { max = 12, scale = 1.03, speed = 400 } = options;
  const ref = useRef<HTMLDivElement>(null);

  const boundsRef = useRef<DOMRect | null>(null);

  const onMouseEnter = useCallback(() => {
    if (isTouch || !ref.current) return;
    boundsRef.current = ref.current.getBoundingClientRect();
    ref.current.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
  }, [speed]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouch || !ref.current || !boundsRef.current) return;
      const el = ref.current;
      const rect = boundsRef.current;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      // normalise -1..1
      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;
      const rotateX = -ny * max;
      const rotateY = nx * max;

      el.style.transition = 'transform 50ms linear';
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`;
      el.style.willChange = 'transform';
    },
    [max, scale]
  );

  const onMouseLeave = useCallback(() => {
    if (isTouch || !ref.current) return;
    boundsRef.current = null;
    ref.current.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    ref.current.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    ref.current.style.willChange = 'auto';
  }, [speed]);

  return { ref, onMouseMove, onMouseEnter, onMouseLeave };
}
