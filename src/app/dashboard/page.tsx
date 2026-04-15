'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useAccount, useReadContract, useReadContracts, useWatchAsset, useSwitchChain, useChainId, usePublicClient } from 'wagmi';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { parseAbiItem } from 'viem';
import { INK_FACTORY_ABI, INK_FACTORY_ADDRESS, getFactoryAddress, getExplorerUrl, SUPPORTED_CHAIN_IDS } from '@/lib/contracts';
import { formatEther } from 'viem';
import { useGlobalBalance } from '@/components/BalanceProvider';
import { Rocket, ExternalLink, Copy, CheckCircle, Coins, LayoutDashboard, Plus, Loader2, Package, Wallet, Search, ArrowDownAZ, ArrowUpAZ, Clock, TrendingDown, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'sonner';

const ERC20_BALANCE_OF_ABI = [
  { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const;

type SortMode = 'newest' | 'oldest' | 'mine' | 'supply_desc' | 'supply_asc';

interface TokenData {
  name?: string;
  symbol?: string;
  totalSupply?: bigint;
  balance?: bigint;
}

const TokenCard = React.memo(function TokenCard({ tokenAddress, tokenData, index, explorerUrl }: { tokenAddress: string; tokenData: TokenData; index: number; explorerUrl: string }) {
  const [copied, setCopied] = useState(false);
  const { watchAsset } = useWatchAsset();

  const { name, symbol, totalSupply, balance } = tokenData;

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

  return (
    <div className="p-6 space-y-4 rounded-3xl bg-neutral-900 border border-purple-500/10 hover:border-purple-500/30 transition-colors duration-200 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] flex flex-col justify-between">
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
          onClick={async () => {
            if (!symbol) return;
            try {
              await watchAsset({ type: 'ERC20', options: { address: tokenAddress, symbol: String(symbol), decimals: 18 } });
              toast.success(`$${String(symbol)} added to wallet!`);
            } catch {}
          }}
          className="flex-1 flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl border transition-colors active:scale-95 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-purple-400"
        >
          <Wallet className="w-4 h-4" />
        </button>
        <a
          href={`${explorerUrl}/token/${tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center px-3 py-2.5 rounded-xl bg-black/40 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/20 border border-white/5 transition-colors text-white/60 active:scale-95"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
});


function TiltStatCard({ stat }: { stat: { label: string; value: string; sub?: string; icon: React.ReactNode; action?: () => void } }) {
  return (
    <div
      onClick={stat.action}
      className={`p-6 rounded-3xl bg-neutral-900 border border-white/5 transition-colors ${stat.action ? 'cursor-pointer hover:border-red-500/30 hover:bg-neutral-800' : ''}`}
    >
      <div className="flex items-center gap-2 mb-3">{stat.icon}<span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</span></div>
      <div className="text-2xl font-medium tracking-tight text-white">{stat.value}</div>
      {stat.sub && <div className="text-[10px] text-white/30 mt-1">{stat.sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  const { address, isConnected, isReconnecting } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { balanceFormatted } = useGlobalBalance();

  const factoryAddress = getFactoryAddress(chainId);
  const explorerUrl = getExplorerUrl(chainId);
  const isOnSupportedChain = (SUPPORTED_CHAIN_IDS as readonly number[]).includes(chainId);

  const { data: allTokens, isLoading } = useReadContract({
    address: factoryAddress ?? INK_FACTORY_ADDRESS,
    abi: INK_FACTORY_ABI,
    functionName: 'getDeployedTokens',
    query: { staleTime: 300_000, enabled: !!factoryAddress }
  });

  const publicClient = usePublicClient();
  const publicClientRef = useRef(publicClient);
  publicClientRef.current = publicClient;

  const { data: myTokenAddresses = [], isFetching: isLoadingOwned } = useQuery({
    queryKey: ['owned-tokens', address, chainId],
    queryFn: async () => {
      const client = publicClientRef.current;
      if (!address || !client) return [];

      const cacheKey = `inklaunch-owned-${address}-${chainId}`;
      try {
        const stored = sessionStorage.getItem(cacheKey);
        if (stored) return JSON.parse(stored) as string[];
      } catch {}

      const logAddress = getFactoryAddress(chainId) ?? INK_FACTORY_ADDRESS;
      const CHUNK = chainId === 84532 ? BigInt(9999) : BigInt(99000);
      const latest = await client.getBlockNumber();
      const startBlock = chainId === 763373
        ? BigInt(46850539)
        : BigInt(39200000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allLogs: any[] = [];
      let from = startBlock;
      while (from <= latest) {
        const to = from + CHUNK > latest ? latest : from + CHUNK;
        const chunk = await client.getLogs({
          address: logAddress,
          event: parseAbiItem('event TokenCreated(address indexed tokenAddress, string name, string symbol, uint256 initialSupply, address owner)'),
          fromBlock: from,
          toBlock: to,
        });
        allLogs.push(...chunk);
        from = to + BigInt(1);
        if (from <= latest) await new Promise(r => setTimeout(r, 150));
      }

      const mine = allLogs
        .filter(l => l.args.owner?.toLowerCase() === address.toLowerCase())
        .map(l => l.args.tokenAddress as string);

      try { sessionStorage.setItem(cacheKey, JSON.stringify(mine)); } catch {}
      return mine;
    },
    enabled: !!address,
    staleTime: Infinity,
    gcTime: 600_000,
    placeholderData: keepPreviousData,
  });

  const tokenList = useMemo(() => {
    const raw = (allTokens as string[] | undefined) || [];
    let list = sortMode === 'oldest' ? [...raw] : [...raw].reverse();
    if (sortMode === 'mine') {
      list = list.filter(addr => myTokenAddresses.includes(addr));
    }
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(addr => addr.toLowerCase().includes(q));
  }, [allTokens, sortMode, search, myTokenAddresses]);

  const batchContracts = useMemo(() =>
    tokenList.flatMap(addr => [
      { address: addr as `0x${string}`, abi: ERC20_BALANCE_OF_ABI, functionName: 'name' as const },
      { address: addr as `0x${string}`, abi: ERC20_BALANCE_OF_ABI, functionName: 'symbol' as const },
      { address: addr as `0x${string}`, abi: ERC20_BALANCE_OF_ABI, functionName: 'totalSupply' as const },
      { address: addr as `0x${string}`, abi: ERC20_BALANCE_OF_ABI, functionName: 'balanceOf' as const, args: [address as `0x${string}`] },
    ]),
    [tokenList, address]
  );

  const { data: batchData } = useReadContracts({
    contracts: batchContracts,
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    query: { staleTime: 180_000, gcTime: 300_000, enabled: tokenList.length > 0 && !!address },
  });

  const tokenDataMap = useMemo((): Record<string, TokenData> => {
    if (!batchData) return {};
    return Object.fromEntries(
      tokenList.map((addr, i) => [
        addr,
        {
          name: batchData[i * 4]?.result as string | undefined,
          symbol: batchData[i * 4 + 1]?.result as string | undefined,
          totalSupply: batchData[i * 4 + 2]?.result as bigint | undefined,
          balance: batchData[i * 4 + 3]?.result as bigint | undefined,
        },
      ])
    );
  }, [batchData, tokenList]);

  const displayList = useMemo(() => {
    if (sortMode === 'supply_desc') {
      return [...tokenList].sort((a, b) => {
        const supA = tokenDataMap[a]?.totalSupply ?? BigInt(0);
        const supB = tokenDataMap[b]?.totalSupply ?? BigInt(0);
        return supB > supA ? 1 : -1;
      });
    }
    if (sortMode === 'supply_asc') {
      return [...tokenList].sort((a, b) => {
        const supA = tokenDataMap[a]?.totalSupply ?? BigInt(0);
        const supB = tokenDataMap[b]?.totalSupply ?? BigInt(0);
        return supA > supB ? 1 : -1;
      });
    }
    return tokenList;
  }, [tokenList, sortMode, tokenDataMap]);

  if (isReconnecting) return null;

  const totalCount = ((allTokens as string[] | undefined) || []).length;

  return (
    <div className="relative pt-24 pb-16 px-4">
      <main className="relative z-10 w-full max-w-[1600px] mx-auto">
        {!isConnected ? (
          <div className="max-w-md mx-auto rounded-[2rem] bg-neutral-900 border border-purple-500/20 p-12 text-center space-y-6 mt-20 shadow-[0_0_50px_rgba(168,85,247,0.1)] transform-gpu">
            <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <LayoutDashboard className="w-10 h-10 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-2 text-white">System Access Required</h2>
              <p className="text-sm text-white/50 mb-8 max-w-xs mx-auto">Connect your wallet to analyze your deployed contracts and network presence.</p>
              <div className="flex justify-center mb-6"><ConnectButton /></div>
              <p className="text-[11px] text-yellow-500/70 max-w-xs mx-auto leading-relaxed">⚠️ Recommended: MetaMask or Coinbase Wallet browser extension. Mobile wallets may not support Ink Sepolia yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-white">Command Center</h1>
                <p className="text-purple-400 mt-2 font-mono text-xs tracking-widest break-all">{address}</p>
              </div>
              <Link href="/launch" className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shrink-0">
                <Plus className="w-4 h-4" /> New Token
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Network Power', value: `${balanceFormatted} ETH`, icon: <Coins className="w-4 h-4 text-cyan-400" /> },
                { label: 'Deployed Contracts', value: `${totalCount} Total`, sub: isLoadingOwned ? 'Scanning events...' : myTokenAddresses.length > 0 ? `${myTokenAddresses.length} deployed by you` : 'None deployed yet', icon: <Package className="w-4 h-4 text-purple-400" /> },
                {
                  label: 'RPC Link',
                  value: isOnSupportedChain ? (chainId === 763373 ? 'Ink Sepolia' : 'Base Sepolia') : 'Wrong Network',
                  icon: <div className={`w-2 h-2 rounded-full ${isOnSupportedChain ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-red-500 animate-pulse'}`} />,
                  action: !isOnSupportedChain ? () => switchChainAsync({ chainId: 763373 }) : undefined,
                },
              ].map((stat, i) => (
                <TiltStatCard key={i} stat={stat} />
              ))}
            </div>

            {/* Tokens */}
            <div>
              {/* Search + Sort Bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold hidden sm:block">Sort</span>
                  {([
                    { mode: 'newest' as SortMode, icon: <Clock className="w-3.5 h-3.5" />, label: 'Newest' },
                    { mode: 'oldest' as SortMode, icon: <ArrowUpAZ className="w-3.5 h-3.5" />, label: 'Oldest' },
                    { mode: 'mine' as SortMode, icon: <Star className="w-3.5 h-3.5" />, label: 'Mine' },
                    { mode: 'supply_desc' as SortMode, icon: <TrendingDown className="w-3.5 h-3.5" />, label: 'Supply ↓' },
                    { mode: 'supply_asc' as SortMode, icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Supply ↑' },
                  ] as const).map(({ mode, icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setSortMode(mode)}
                      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                        sortMode === mode
                          ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'bg-neutral-900 border border-white/10 text-white/40 hover:text-white'
                      }`}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Token count */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <span className="text-sm text-white/60">
                  {sortMode === 'mine'
                    ? `${displayList.length} owned by you`
                    : search
                    ? `${displayList.length} of ${totalCount}`
                    : totalCount} {totalCount === 1 ? 'asset' : 'assets'}
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
              ) : displayList.length === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-neutral-900 p-16 text-center flex flex-col items-center">
                  {sortMode === 'mine' ? (
                    <><Star className="w-10 h-10 text-white/20 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No owned tokens</h3>
                    <p className="text-white/40 text-sm">You haven't deployed any tokens yet.</p></>
                  ) : (
                    <><Search className="w-10 h-10 text-white/20 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No results</h3>
                    <p className="text-white/40 text-sm">No contracts match <span className="text-purple-400">"{search}"</span></p>
                    <button onClick={() => setSearch('')} className="mt-4 text-xs text-purple-400 hover:text-purple-300 underline">Clear search</button></>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {displayList.map((tokenAddr, i) => (
                    <TokenCard key={tokenAddr} tokenAddress={tokenAddr} tokenData={tokenDataMap[tokenAddr] ?? {}} index={i} explorerUrl={explorerUrl} />
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
