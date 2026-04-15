'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain, useWatchAsset } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Loader2, CheckCircle, Globe, ExternalLink, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { parseEther, decodeEventLog } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { INK_FACTORY_ABI, getFactoryAddress, getExplorerUrl, SUPPORTED_CHAIN_IDS } from '@/lib/contracts';
import { useGlobalBalance } from '@/components/BalanceProvider';
import Link from 'next/link';

const BASED_NAMES = [
  'Based Pepe', 'Ink Master', 'Blue Chip Gem', 'Superchain Hero',
  'Onchain Legend', 'Ink Protocol', 'Based Builder', 'Chain Surfer',
  'Ink Wizard', 'Base Degen', 'Superchain Star', 'Ink Punk',
  'Based OG', 'Chain Max', 'Ink Rush', 'Base Maxi', 'Onchain Pioneer',
  'Ink Spark', 'Layer Zero', 'Block Sage',
];

// Right col preview
function PreviewCard({ name, symbol, supply, chainId }: { name: string; symbol: string; supply: string; chainId: number }) {
  const chainName = chainId === 763373 ? 'Ink Sepolia' : chainId === 84532 ? 'Base Sepolia' : 'Testnet';
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="xl:col-span-2 rounded-3xl bg-neutral-900 border border-cyan-500/10 p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden group transform-gpu"
    >
       {/* Decorative background grid inside preview */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}} />
       
       <p className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest mb-8 absolute top-8 border border-cyan-500/20 px-3 py-1 rounded-full"><span className="animate-pulse w-1.5 h-1.5 bg-cyan-400 inline-block rounded-full mr-2"/>UI PREVIEW</p>
       
       <div className="w-full max-w-[280px] bg-black border border-white/10 rounded-3xl p-6 shadow-2xl relative z-10 hover:border-cyan-500/30 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-500">
         <div className="flex items-center justify-between mb-8">
           <div className="text-white/40 text-[10px] font-bold">MetaMask View</div>
           <ShieldCheck className="w-4 h-4 text-emerald-500" />
         </div>
         
         <div className="flex flex-col items-center mb-6">
           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 mb-4 flex items-center justify-center shadow-inner shadow-black/80 text-white font-black text-xl border border-white/20">
             {symbol.slice(0,2) || '??'}
           </div>
           <h3 className="text-lg font-bold tracking-tight text-white text-center w-full truncate px-1" title={name || 'Your Token'}>{name || 'Your Token'}</h3>
           <p className="text-white/40 text-sm font-mono mt-1">Asset ID</p>
         </div>

         <div className="rounded-xl bg-white/5 p-4 border border-white/5">
            <div className="flex justify-between items-center mb-2">
               <span className="text-xs text-white/50 font-bold">Balance</span>
               <span className="text-xs text-white/50 font-bold font-mono">{chainName}</span>
            </div>
            <div className="text-xl font-medium text-white">{Number(supply || 0).toLocaleString()} <span className="text-cyan-400 text-sm font-bold uppercase">{symbol || 'TKN'}</span></div>
         </div>
       </div>
    </motion.div>
  );
}

export default function LaunchPage() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('1000000');
  const [deployedHash, setDeployedHash] = useState<string | null>(null);

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { refetchBalance } = useGlobalBalance();

  const { data: hash, isPending: isWalletLoading, writeContractAsync } = useWriteContract();
  const { isLoading: isMining, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });
  const { watchAsset } = useWatchAsset();

  useEffect(() => {
    if (isSuccess && hash) {
      setTimeout(() => refetchBalance(), 1500);
      setDeployedHash(hash);
      const end = Date.now() + 2000;
      const colors = ['#A855F7', '#06B6D4', '#ffffff'];
      const fire = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(fire);
      };
      requestAnimationFrame(fire);
    }
  }, [isSuccess, hash, refetchBalance]);

  const factoryAddress = getFactoryAddress(chainId);
  const explorerUrl = getExplorerUrl(chainId);
  const isWrongChain = isConnected && !(SUPPORTED_CHAIN_IDS as readonly number[]).includes(chainId);
  const isWorking = isWalletLoading || isMining;

  const deployedTokenAddress = (() => {
    if (!receipt || !factoryAddress) return null;
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() !== factoryAddress.toLowerCase()) continue;
      try {
        const decoded = decodeEventLog({ abi: INK_FACTORY_ABI, data: log.data, topics: log.topics });
        if (decoded.eventName === 'TokenCreated') return (decoded.args as { tokenAddress: string }).tokenAddress;
      } catch {}
    }
    return null;
  })();

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !supply) return;
    if (!factoryAddress) return toast.error('Factory not deployed on this network yet.');
    try {
      await writeContractAsync({
        address: factoryAddress,
        abi: INK_FACTORY_ABI,
        functionName: 'createToken',
        args: [name, symbol, parseEther(supply)],
      });
    } catch (e: any) {
      toast.error('Transaction Failed', { description: e.shortMessage || 'Rejected or reverted' });
    }
  };

  return (
    <div className="relative pt-24 pb-16 px-4 sm:px-6">
      <main className="max-w-[1600px] mx-auto">
        {!isConnected ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto rounded-[2rem] bg-neutral-900 border border-purple-500/20 p-12 text-center space-y-6 mt-20 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
            <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Rocket className="w-10 h-10 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight mb-2 text-white">Verification Needed</h2>
              <p className="text-sm text-white/50 mb-8 max-w-xs mx-auto">Link a secure enclave to initialize the compiler sequence.</p>
              <div className="flex justify-center mb-6"><ConnectButton /></div>
              <p className="text-[11px] text-yellow-500/70 max-w-xs mx-auto leading-relaxed">⚠️ Recommended: MetaMask or Coinbase Wallet browser extension. Mobile wallets may not support Ink Sepolia yet.</p>
            </div>
          </motion.div>
        ) : isWrongChain ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-red-500/20 bg-red-950/20 p-16 text-center">
            <Globe className="w-12 h-12 text-red-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-medium text-white mb-2">Unsupported Network</h2>
            <p className="text-white/50 mb-6">Switch to Ink Sepolia or Base Sepolia to continue.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => switchChainAsync({ chainId: 763373 })} disabled={isSwitching} className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors text-sm">
                {isSwitching ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Switch to Ink Sepolia'}
              </button>
              <button onClick={() => switchChainAsync({ chainId: 84532 })} disabled={isSwitching} className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors text-sm">
                {isSwitching ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Switch to Base Sepolia'}
              </button>
            </div>
          </motion.div>
        ) : deployedHash ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-cyan-500/20 bg-neutral-900 p-12 text-center max-w-2xl mx-auto shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center">
             <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-cyan-400" />
             </div>
             <h2 className="text-3xl font-medium text-white tracking-tight mb-2">Block Mined Successfully</h2>
             <p className="text-white/50 mb-8">Asset {name} ({symbol}) is permanently active on {chainId === 84532 ? 'Base Sepolia' : 'Ink Sepolia'}.</p>

             {deployedTokenAddress && (
               <div className="w-full mb-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                 <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest shrink-0">Token</span>
                 <span className="font-mono text-xs text-white/70 truncate">{deployedTokenAddress}</span>
                 <button onClick={() => { navigator.clipboard.writeText(deployedTokenAddress); toast.success('Copied!'); }} className="shrink-0 text-white/30 hover:text-white transition-colors text-xs font-bold">Copy</button>
               </div>
             )}
             
             {deployedTokenAddress && symbol && (
               <button
                 onClick={async () => { try { await watchAsset({ type: 'ERC20', options: { address: deployedTokenAddress, symbol, decimals: 18 } }); } catch {} }}
                 className="w-full mb-4 py-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white font-bold border border-purple-500/30 hover:border-purple-500/60 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
               >
                 <Wallet className="w-4 h-4" /> Add ${symbol} to Wallet
               </button>
             )}

             <div className="flex flex-col sm:flex-row gap-4 w-full mb-4">
               <button onClick={() => { setDeployedHash(null); setName(''); setSymbol(''); }} className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold tracking-tight border border-white/10 transition-colors">
                 Build New
               </button>
               <a href={`${explorerUrl}/tx/${deployedHash}`} target="_blank" className="flex-1 py-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 font-bold tracking-tight border border-cyan-500/30 transition-colors flex items-center justify-center gap-2">
                 Block Explorer <ExternalLink className="w-4 h-4" />
               </a>
             </div>

             <div className="flex flex-col sm:flex-row gap-3 w-full">
               <a
                 href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🚀 Just deployed $${symbol} (${name}) on ${chainId === 84532 ? 'Base' : 'Ink'} via InkLaunch!\n\nhttps://inklaunch.vercel.app`)}`}
                 target="_blank" rel="noopener noreferrer"
                 className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-[#1d9bf0]/20 text-white/60 hover:text-[#1d9bf0] font-bold text-sm border border-white/10 hover:border-[#1d9bf0]/30 transition-all flex items-center justify-center gap-2"
               >
                 Share on X
               </a>
               {deployedTokenAddress && (
                 <a
                   href={`${explorerUrl}/token/${deployedTokenAddress}`}
                   target="_blank" rel="noopener noreferrer"
                   className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white/60 hover:text-purple-400 font-bold text-sm border border-white/10 hover:border-purple-500/30 transition-all flex items-center justify-center gap-2"
                 >
                   Token Explorer <ExternalLink className="w-3.5 h-3.5" />
                 </a>
               )}
             </div>
          </motion.div>
        ) : (
          <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-white mb-2">Token Compiler</h1>
            <p className="text-white/50 tracking-tight">Configure parameters to generate your ERC-20 payload on {chainId === 84532 ? 'Base Sepolia' : 'Ink Sepolia'}.</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-6">
            
            {/* Left Col: Config Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-3 rounded-3xl bg-neutral-900 border border-white/5 shadow-2xl p-6 sm:p-8 transform-gpu">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center"><Rocket className="w-4 h-4 text-purple-400" /></div>
                  <h2 className="text-xl font-medium text-white">Asset Parameters</h2>
               </div>

               <form onSubmit={handleDeploy} className="space-y-6">
                 <div>
                   <div className="flex items-center justify-between mb-2">
                     <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Full Asset Name</label>
                     <button type="button" onClick={() => setName(BASED_NAMES[Math.floor(Math.random() * BASED_NAMES.length)])} className="flex items-center gap-1 text-[10px] font-bold text-purple-400/70 hover:text-purple-400 uppercase tracking-widest transition-colors">
                       <Sparkles className="w-3 h-3" /> Generate
                     </button>
                   </div>
                   <input id="token-name" name="token-name" type="text" value={name} onChange={e => setName(e.target.value.slice(0, 32))} required minLength={2} maxLength={32} autoComplete="off" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all" placeholder="e.g. Ink Protocol" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-2">Ticker Symbol</label>
                     <input id="token-symbol" name="token-symbol" type="text" value={symbol} onChange={e => setSymbol(e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase())} required minLength={2} maxLength={6} pattern="[A-Z]{2,6}" style={{ textTransform: 'uppercase'}} autoComplete="off" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono" placeholder="INK" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-2">Initial Supply</label>
                     <input id="token-supply" name="token-supply" type="number" value={supply} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ''); const n = Number(v); setSupply(n > 1_000_000_000_000 ? '1000000000000' : v); }} required min="1" max="1000000000000" onKeyDown={e => ['e','E','+','-','.'].includes(e.key) && e.preventDefault()} autoComplete="off" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 transition-all font-mono" />
                   </div>
                 </div>

                 <AnimatePresence mode="wait">
                    {isWorking ? (
                      <motion.div key="loading" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 overflow-hidden space-y-3">
                        {[
                          { label: 'Awaiting Wallet Signature', active: isWalletLoading, done: !isWalletLoading },
                          { label: `Broadcasting to ${chainId === 84532 ? 'Base Sepolia' : 'Ink Sepolia'}`, active: isMining, done: false },
                          { label: 'Indexing on-chain data', active: false, done: false },
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              step.done ? 'bg-emerald-500/20 border-emerald-500/50' :
                              step.active ? 'border-purple-400 bg-purple-500/20' :
                              'border-white/10 bg-black/20'
                            }`}>
                              {step.done ? <CheckCircle className="w-3 h-3 text-emerald-400" /> :
                               step.active ? <Loader2 className="w-3 h-3 text-purple-400 animate-spin" /> :
                               <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                            </div>
                            <span className={`text-xs font-bold tracking-tight transition-colors ${
                              step.done ? 'text-emerald-400' : step.active ? 'text-purple-300' : 'text-white/30'
                            }`}>{step.label}</span>
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.button key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} type="submit" className="w-full rounded-xl bg-white text-black hover:bg-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] py-4 font-bold text-sm uppercase tracking-widest transition-all duration-300">
                         Compile & Deploy
                      </motion.button>
                    )}
                 </AnimatePresence>
               </form>
            </motion.div>

            {/* Right Col: Live Preview */}
            <PreviewCard name={name} symbol={symbol} supply={supply} chainId={chainId} />

          </div>
          </>
        )}
      </main>
    </div>
  );
}
