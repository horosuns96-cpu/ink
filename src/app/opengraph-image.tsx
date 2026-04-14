import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'InkLaunch — Token Factory on Ink Sepolia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #09090b 0%, #0f0a1e 50%, #09090b 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple glow top-left */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
        }} />
        {/* Cyan glow bottom-right */}
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
        }} />

        {/* Logo badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '80px', height: '80px', borderRadius: '20px',
          background: 'linear-gradient(135deg, #A855F7, #06B6D4)',
          marginBottom: '28px',
          boxShadow: '0 0 40px rgba(168,85,247,0.5)',
        }}>
          <span style={{ fontSize: '36px' }}>🚀</span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: '72px', fontWeight: '800', color: 'white',
          letterSpacing: '-2px', marginBottom: '16px', textAlign: 'center',
          lineHeight: 1,
        }}>
          InkLaunch
        </div>

        {/* Gradient subtitle */}
        <div style={{
          fontSize: '28px', fontWeight: '600', textAlign: 'center',
          background: 'linear-gradient(90deg, #A855F7, #06B6D4)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '32px',
        }}>
          Token Factory on Ink Sepolia
        </div>

        {/* Description */}
        <div style={{
          fontSize: '20px', color: 'rgba(255,255,255,0.5)',
          textAlign: 'center', maxWidth: '700px', lineHeight: 1.5,
          marginBottom: '40px',
        }}>
          Deploy ERC-20 tokens in one click. No Solidity required.
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['One-click deploy', 'Open Source', 'MIT License'].map((tag) => (
            <div key={tag} style={{
              padding: '8px 20px', borderRadius: '999px',
              border: '1px solid rgba(168,85,247,0.3)',
              background: 'rgba(168,85,247,0.1)',
              color: 'rgba(255,255,255,0.7)', fontSize: '16px', fontWeight: '600',
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div style={{
          position: 'absolute', bottom: '32px',
          fontSize: '16px', color: 'rgba(255,255,255,0.25)', letterSpacing: '1px',
        }}>
          inklaunch.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
