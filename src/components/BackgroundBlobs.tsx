'use client';

// Aurora Background — 3 animated gradient blobs + subtle noise texture
// Runs purely on GPU compositor thread (CSS @keyframes on transform/opacity only)
export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Aurora blobs */}
      <div className="aurora-purple" />
      <div className="aurora-cyan" />
      <div className="aurora-indigo" />

      {/* Noise grain overlay via light CSS background (SVG feTurbulence causes GPU lag!) */}
      <div className="aurora-noise" />
    </div>
  );
}
