'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Copy, CheckCircle, LogOut, ExternalLink, Activity } from 'lucide-react';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const INK_SEPOLIA_CHAIN_ID = 763373;

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/launch', label: 'Engine' },
  { href: '/dashboard', label: 'Dash' },
];

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

// ─── Dropdown Profile ──────────────────────────────────────────

function ProfileDropdown({ address, onClose }: { address: string; onClose: () => void }) {
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute top-14 right-0 w-[280px] rounded-2xl border border-purple-500/20 bg-black/80 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col z-[100] transform-gpu"
    >
      <div className="p-4 flex flex-col gap-1">
        <p className="text-[10px] text-purple-400/80 uppercase tracking-widest font-black mb-1">Session Data</p>
        <button
          onClick={handleCopy}
          className="flex items-center justify-between p-3 rounded-xl bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/20 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
            <span className="font-mono text-sm tracking-tight text-white/90">{truncateAddress(address)}</span>
          </div>
          {copied ? <CheckCircle className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4 text-purple-400/50 group-hover:text-purple-400 transition-colors" />}
        </button>
      </div>

      <div className="h-px bg-purple-500/20" />

      <div className="p-2 flex flex-col">
        <a
          href={`https://explorer-sepolia.inkonchain.com/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-sm text-white/60 hover:text-white"
        >
          <span className="flex items-center gap-2 text-cyan-400/80"><Activity className="w-4 h-4" /> Blockscout</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400/0 group-hover:text-cyan-400/100 transition-opacity" />
        </a>
        <button
          onClick={handleDisconnect}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-colors text-sm"
        >
          <span>Purge Link</span>
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { address, isConnected, status } = useAccount();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isProfileOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isProfileOpen]);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  const hasPersistedState = typeof window !== 'undefined' 
    ? (localStorage.getItem('wagmi.store') || '').includes('"status":"connected"') || !!localStorage.getItem('wagmi.connected')
    : false;
  const isHydratingConnection = mounted && status === 'disconnected' && hasPersistedState;
  const isLoadingSession = !mounted || status === 'connecting' || status === 'reconnecting' || isHydratingConnection;

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 px-3 sm:px-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-2">

        {/* Left spacer - only desktop */}
        <div className="hidden sm:block sm:flex-1" />

        {/* Center: Segmented Control */}
        <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 p-1 flex items-center rounded-full shadow-[0_4px_30px_rgba(168,85,247,0.1)] shrink-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 sm:px-6 py-2 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-colors z-10 min-w-[52px] text-center ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nebula-segment"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/80 to-cyan-500/80 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Auth */}
        <div className="pointer-events-auto relative sm:flex-1 flex justify-end shrink-0" ref={dropdownRef}>
          {isLoadingSession ? (
            <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
          ) : isConnected && address ? (
            <div>
              <button
                onClick={() => setIsProfileOpen(prev => !prev)}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-purple-500/30 bg-purple-900/30 text-cyan-400 font-mono text-[10px] font-black flex items-center justify-center hover:bg-purple-900/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
              >
                {address.slice(2, 4).toUpperCase()}
              </button>
              <AnimatePresence>
                {isProfileOpen && <ProfileDropdown address={address} onClose={() => setIsProfileOpen(false)} />}
              </AnimatePresence>
            </div>
          ) : (
            <ConnectButton
              accountStatus="avatar"
              showBalance={false}
              chainStatus="none"
              label="Connect"
            />
          )}
        </div>
      </div>
    </header>
  );
}
