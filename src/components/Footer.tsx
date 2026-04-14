import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const INK_LINKS = [
  { label: 'Ink Website', href: 'https://inkonchain.com' },
  { label: 'Explorer', href: 'https://explorer-sepolia.inkonchain.com' },
  { label: 'Faucet', href: 'https://faucet.inkonchain.com' },
  { label: 'Docs', href: 'https://docs.inkonchain.com' },
  { label: 'Twitter / X', href: 'https://x.com/inkonchain' },
];

const APP_LINKS = [
  { label: 'Launch Token', href: '/launch' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'GitHub', href: 'https://github.com/horosuns96-cpu/ink', external: true },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 mt-24 py-12 px-4 sm:px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <span className="text-[10px] font-black text-white">IL</span>
              </div>
              <span className="font-bold text-white tracking-tight">InkLaunch</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed max-w-[200px]">
              No-code ERC-20 token deployment on Ink Sepolia. Built for builders.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-purple-500/20 bg-purple-500/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Ink Sepolia</span>
            </div>
          </div>

          {/* App links */}
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">App</p>
            <ul className="space-y-2.5">
              {APP_LINKS.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {label} <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  ) : (
                    <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Ink ecosystem links */}
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Ink Ecosystem</p>
            <ul className="space-y-2.5">
              {INK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-white/50 hover:text-cyan-400 transition-colors"
                  >
                    {label} <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/25">
            © {new Date().getFullYear()} InkLaunch — MIT License
          </p>
          <p className="text-[11px] text-white/25">
            Built on{' '}
            <a href="https://inkonchain.com" target="_blank" rel="noopener noreferrer" className="text-purple-400/70 hover:text-purple-400 transition-colors">
              Ink
            </a>
            {' '}· Powered by RainbowKit + wagmi + viem
          </p>
        </div>
      </div>
    </footer>
  );
}
