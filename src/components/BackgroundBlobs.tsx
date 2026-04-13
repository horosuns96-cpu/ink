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

      <style>{`
        .aurora-purple {
          position: absolute;
          width: 55vw;
          height: 55vw;
          max-width: 750px;
          max-height: 750px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #A855F7 0%, #7C3AED 50%, transparent 80%);
          opacity: 0.12;
          filter: blur(90px);
          top: -15%;
          left: -10%;
          will-change: transform;
          animation: auroraPurple 32s ease-in-out infinite alternate;
        }
        .aurora-cyan {
          position: absolute;
          width: 48vw;
          height: 48vw;
          max-width: 650px;
          max-height: 650px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #06B6D4 0%, #0891B2 50%, transparent 80%);
          opacity: 0.10;
          filter: blur(100px);
          bottom: -15%;
          right: -8%;
          will-change: transform;
          animation: auroraCyan 26s ease-in-out infinite alternate;
        }
        .aurora-indigo {
          position: absolute;
          width: 40vw;
          height: 40vw;
          max-width: 560px;
          max-height: 560px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #6366F1 0%, #4F46E5 40%, transparent 80%);
          opacity: 0.07;
          filter: blur(110px);
          top: 35%;
          left: 30%;
          will-change: transform;
          animation: auroraIndigo 38s ease-in-out infinite alternate;
        }
        .aurora-noise {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.04;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 150px 150px;
        }

        @keyframes auroraPurple {
          0%   { transform: translate(0%, 0%) scale(1); }
          30%  { transform: translate(18%, 12%) scale(1.08); }
          60%  { transform: translate(8%, 28%) scale(0.96); }
          100% { transform: translate(28%, 8%) scale(1.04); }
        }
        @keyframes auroraCyan {
          0%   { transform: translate(0%, 0%) scale(1); }
          40%  { transform: translate(-22%, -18%) scale(1.06); }
          70%  { transform: translate(-8%, -32%) scale(0.97); }
          100% { transform: translate(-28%, -12%) scale(1.03); }
        }
        @keyframes auroraIndigo {
          0%   { transform: translate(0%, 0%) scale(1); }
          25%  { transform: translate(15%, -20%) scale(1.1); }
          55%  { transform: translate(-18%, 10%) scale(0.92); }
          80%  { transform: translate(10%, 25%) scale(1.05); }
          100% { transform: translate(-10%, -15%) scale(0.98); }
        }

        @media (prefers-reduced-motion: reduce) {
          .aurora-purple,
          .aurora-cyan,
          .aurora-indigo { animation: none; }
        }
      `}</style>
    </div>
  );
}
