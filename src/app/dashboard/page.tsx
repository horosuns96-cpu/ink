'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContract, useWatchAsset, useSwitchChain, useChainId } from 'wagmi';
import { INK_FACTORY_ABI, INK_FACTORY_ADDRESS } from '@/lib/contracts';
import { formatEther } from 'viem';
import { useGlobalBalance } from '@/components/BalanceProvider';
import { motion } from 'framer-motion';
import { Rocket, ExternalLink, Copy, CheckCircle, Coins, LayoutDashboard, Plus, Loader2, Package, Wallet, Search, ArrowDownAZ, ArrowUpAZ, Clock } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner';
import { use3DTilt } from '@/hooks/use3DTilt';

const INK_SEPOLIA_CHAIN_ID = 763373;

const ERC20_BALANCE_OF_ABI = [
  { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const;

type SortMode = 'newest' | 'oldest';

const TokenCard = React.memo(function TokenCard({ tokenAddress, userAddress, index }: { tokenAddress: string; userAddress: string; index: number }) {
  const [copied, setCopied] = useState(false);

  const { data: name } = useReadContract({ address: tokenAddress as `0x${string}`, abi: ERC20_BALANCE_OF_ABI, functionName: 'name', query: { staleTime: 60_000, gcTime: 300_000 } });
  const { data: symbol } = useReadContract({ address: tokenAddress as `0x${string}`, abi: ERC20_BALANCE_OF_ABI, functionName: 'symbol', query: { staleTime: 60_000, gcTime: 300_000 } });
  const { data: totalSupply } = useReadContract({ address: tokenAddress as `0x${string}`, abi: ERC20_BALANCE_OF_ABI, functionName: 'totalSupply', query: { staleTime: 60_000, gcTime: 300_000 } });
  const { data: balance } = useReadContract({ address: tokenAddress as `0x${string}`, abi: ERC20_BALANCE_OF_ABI, functionName: 'balanceOf', args: [userAddress as `0x${string}`], query: { staleTime: 30_000, gcTime: 120_000 } });
  const { watchAsset, isSupported } = useWatchAsset();

  const isOwner = balance && totalSupply && balance === totalSupply;

  const copy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(tokenAddress);
      } else {
        const el = document.createElement('textarea');
        el.value = tokenAddress;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const { ref: tiltRef, onMouseMove, onMouseEnter, onMouseLeave } = use3DTilt({ max: 10, scale: 1.02 });

  return (
    <motion.div
      ref={tiltRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.3 }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="p-6 space-y-4 rounded-3xl bg-neutral-900 border border-purple-500/10 hover:border-purple-500/30 transition-colors duration-200 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] flex flex-col justify-between transform-gpu"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center font-black text-xs text-cyan-400 shrink-0">
            {symbol ? String(symbol).slice(0, 2) : '??'}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-white text-base tracking-tight truncate">{name || <span className="animate-pulse bg-white/10 rounded w-20 h-4 inline-block" />}</div>
            <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">${symbol || '...'}</div>
          </div>
        </div>
        {isOwner && (
          <div className="text-[9px] font-black text-cyan-400 uppercase tracking-widest px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 shrink-0">
            Owner
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="px-3 py-2.5 rounded-2xl bg-black/40 border border-white/5">
          <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Supply</div>
          <div className="text-xs font-mono text-white/90 truncate">
            {totalSupply ? Number(formatEther(totalSupply as bigint)).toLocaleString() : '...'}
          </div>
        </div>
        <div className="px-3 py-2.5 rounded-2xl bg-black/40 border border-white/5">
          <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Balance</div>
          <div className="text-xs font-mono text-cyan-400 truncate">
            {balance ? Number(formatEther(balance as bigint)).toLocaleString() : '...'}
          </div>
        </div>
      </div>

      {/* Address short */}
      <div className="text-[10px] font-mono text-white/30 truncate px-1">
        {tokenAddress.slice(0, 10)}…{tokenAddress.slice(-8)}
      </div>

      <div className="flex gap-2">
        <button onClick={copy} className="flex-1 flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/5 transition-colors text-white/60 hover:text-white active:scale-95">
          {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
        <button
          disabled={!isSupported}
          onClick={async () => {
            if (!symbol) return;
            try {
              await watchAsset({ type: 'ERC20', options: { address: tokenAddress, symbol: String(symbol), decimals: 18 } });
              toast.success(`$${String(symbol)} added to wallet!`);
            } catch {}
          }}
          className={`flex-1 flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl border transition-colors active:scale-95 ${isSupported ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-purple-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-500 opacity-50 cursor-not-allowed'}`}
        >
          <Wallet className="w-4 h-4" />
        </button>
        <a
          href={`https://explorer-sepolia.inkonchain.com/token/${tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center px-3 py-2.5 rounded-xl bg-black/40 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/20 border border-white/5 transition-colors text-white/60 active:scale-95"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
});


// Stat card with 3D tilt
function TiltStatCard({ stat }: { stat: { label: string; value: string; icon: React.ReactNode; action?: () => void } }) {
  const { ref, onMouseMove, onMouseEnter, onMouseLeave } = use3DTilt({ max: 8, scale: 1.02 });
  return (
    <div
      ref={ref}
      onClick={stat.action}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`p-6 rounded-3xl bg-neutral-900 border border-white/5 transform-gpu transition-colors ${stat.action ? 'cursor-pointer hover:border-red-500/30 hover:bg-neutral-800' : ''}`}
    >
      <div className="flex items-center gap-2 mb-3">{stat.icon}<span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</span></div>
      <div className="text-2xl font-medium tracking-tight text-white">{stat.value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');


  const { address, isConnected, isReconnecting, status } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { balanceFormatted } = useGlobalBalance();

  const { data: allTokens, isLoading } = useReadContract({
    address: INK_FACTORY_ADDRESS,
    abi: INK_FACTORY_ABI,
    functionName: 'getDeployedTokens',
    query: { staleTime: 30_000 }
  });

  useEffect(() => { setMounted(true); }, []);

  const tokenList = useMemo(() => {
    const raw = (allTokens as string[] | undefined) || [];
    // Sort
    const sorted = sortMode === 'newest' ? [...raw].reverse() : [...raw];
    // Filter by address substring
    if (!search.trim()) return sorted;
    const q = search.trim().toLowerCase();
    return sorted.filter(addr => addr.toLowerCase().includes(q));
  }, [allTokens, sortMode, search]);

  if (!mounted || isReconnecting || status === 'reconnecting') return null;

  const totalCount = ((allTokens as string[] | undefined) || []).length;

  return (
    <div className="relative pt-24 pb-16 px-4">
      <main className="relative z-10 w-full max-w-[1600px] mx-auto">
        {!isConnected ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto rounded-[2rem] bg-neutral-900 border border-purple-500/20 p-12 text-center space-y-6 mt-20 shadow-[0_0_50px_rgba(168,85,247,0.1)] transform-gpu">
            <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <LayoutDashboard className="w-10 h-10 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-2 text-white">System Access Required</h2>
              <p className="text-sm text-white/50 mb-8 max-w-xs mx-auto">Connect your wallet to analyze your deployed contracts and network presence.</p>
              <div className="flex justify-center"><ConnectButton /></div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-white">Command Center</h1>
                <p className="text-purple-400 mt-2 font-mono text-xs tracking-widest break-all">{address}</p>
              </div>
              <Link href="/launch" className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shrink-0">
                <Plus className="w-4 h-4" /> New Token
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Network Power', value: `${balanceFormatted} ETH`, icon: <Coins className="w-4 h-4 text-cyan-400" /> },
                { label: 'Deployed Contracts', value: `${totalCount} Assets`, icon: <Package className="w-4 h-4 text-purple-400" /> },
                {
                  label: 'RPC Link',
                  value: chainId === INK_SEPOLIA_CHAIN_ID ? 'Connected (Ink)' : 'Wrong Network',
                  icon: <div className={`w-2 h-2 rounded-full ${chainId === INK_SEPOLIA_CHAIN_ID ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-red-500 animate-pulse'}`} />,
                  action: chainId !== INK_SEPOLIA_CHAIN_ID ? () => switchChainAsync({ chainId: INK_SEPOLIA_CHAIN_ID }) : undefined,
                },
              ].map((stat, i) => (
                <TiltStatCard key={i} stat={stat} />
              ))}
            </motion.div>

            {/* Tokens */}
            <div>
              {/* Search + Sort Bar */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by contract address…"
                    className="w-full bg-neutral-900 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>
                {/* Sort */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold hidden sm:block">Sort</span>
                  <button
                    onClick={() => setSortMode('newest')}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${sortMode === 'newest' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-neutral-900 border border-white/10 text-white/40 hover:text-white'}`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Newest
                  </button>
                  <button
                    onClick={() => setSortMode('oldest')}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${sortMode === 'oldest' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-neutral-900 border border-white/10 text-white/40 hover:text-white'}`}
                  >
                    <ArrowUpAZ className="w-3.5 h-3.5" /> Oldest
                  </button>
                </div>
              </motion.div>

              {/* Token count */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <span className="text-sm text-white/60">
                  {search ? `${tokenList.length} of ${totalCount}` : totalCount} {totalCount === 1 ? 'asset' : 'assets'}
                </span>
              </div>

              {isLoading ? (
                <div className="py-32 flex flex-col items-center justify-center gap-4 text-white/50">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                  <p className="font-mono text-sm">Syncing nodes...</p>
                </div>
              ) : totalCount === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-neutral-900 p-20 text-center flex flex-col items-center">
                  <Package className="w-12 h-12 text-white/20 mb-4" />
                  <h3 className="text-xl font-medium text-white tracking-tight mb-2">No Contracts Found</h3>
                  <p className="text-white/40 text-sm mb-6">Initialize your first deployment sequence.</p>
                  <Link href="/launch" className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    Engage
                  </Link>
                </div>
              ) : tokenList.length === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-neutral-900 p-16 text-center flex flex-col items-center">
                  <Search className="w-10 h-10 text-white/20 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No results</h3>
                  <p className="text-white/40 text-sm">No contracts match <span className="text-purple-400">"{search}"</span></p>
                  <button onClick={() => setSearch('')} className="mt-4 text-xs text-purple-400 hover:text-purple-300 underline">Clear search</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {tokenList.map((tokenAddr, i) => (
                    <TokenCard key={tokenAddr} tokenAddress={tokenAddr} userAddress={address!} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
