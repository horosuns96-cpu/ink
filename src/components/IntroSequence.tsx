'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroSequence() {
  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = sessionStorage.getItem('ink_nebula_intro');
    if (!hasSeenIntro) {
      sessionStorage.setItem('ink_nebula_intro', 'true');
      setShowIntro(true);
      // Auto-dismiss after 2.2s total
      const t = setTimeout(() => setShowIntro(false), 2200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
          style={{ pointerEvents: 'none' }}
        >
          <motion.svg
            width="90"
            height="115"
            viewBox="0 0 100 125"
            fill="none"
            stroke="#A855F7"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              d="M50 10 C30 40 10 70 50 110 C90 70 70 40 50 10 Z"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeInOut' }}
              stroke="#06B6D4"
              d="M50 22 V88"
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
