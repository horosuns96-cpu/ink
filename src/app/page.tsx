'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { Rocket, Shield, Layers, Code2, Globe } from 'lucide-react';
import { useReadContract } from 'wagmi';
import { INK_FACTORY_ABI, FACTORY_ADDRESSES } from '@/lib/contracts';
import { IntroSequence } from '@/components/IntroSequence';

const STAGGER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', damping: 20, stiffness: 100 } 
  },
};

export default function LandingPage() {
  const { data: inkTokens } = useReadContract({
    address: FACTORY_ADDRESSES[763373] as `0x${string}`,
    abi: INK_FACTORY_ABI,
    functionName: 'getDeployedTokens',
    chainId: 763373,
    query: { staleTime: 300_000 },
  });

  const { data: baseTokens } = useReadContract({
    address: FACTORY_ADDRESSES[84532] as `0x${string}`,
    abi: INK_FACTORY_ABI,
    functionName: 'getDeployedTokens',
    chainId: 84532,
    query: { staleTime: 300_000 },
  });

  const inkCount = inkTokens ? (inkTokens as string[]).length : 0;
  const baseCount = baseTokens ? (baseTokens as string[]).length : 0;
  const tokenCount = inkCount + baseCount;

  return (
    <div className="relative pt-32 pb-24 px-4 sm:px-6">
      <IntroSequence />
      
      <main className="max-w-[1600px] mx-auto space-y-32 relative z-10">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <motion.div
            variants={STAGGER_VARIANTS}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center gap-6 max-w-4xl"
          >
            <motion.div variants={ITEM_VARIANTS} className="px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-xs font-medium text-purple-400 tracking-tight flex items-center gap-2 transform-gpu shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06B6D4] animate-pulse" />
              Multichain Alpha · Ink &amp; Base
            </motion.div>
            
            <motion.h1
              variants={ITEM_VARIANTS}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] text-white transform-gpu"
            >
              Deploy tokens.<br />
              <span className="gradient-text drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">Zero friction.</span>
            </motion.h1>

            <motion.p variants={ITEM_VARIANTS} className="text-lg text-white/60 max-w-xl font-medium tracking-tight transform-gpu">
              InkLaunch provides an enterprise-grade compiler to launch your smart contracts on Ink and Base. Focus on your product, not the boilerplate.
            </motion.p>

            <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-4 pt-4 transform-gpu">
              <Link href="/launch" prefetch={true} className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_45px_rgba(168,85,247,0.6)] text-white font-bold tracking-widest uppercase text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 transform-gpu">
                Start Building <Rocket className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* BENTO GRID — чистый CSS, без framer-motion */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-medium tracking-tight text-white mb-3">Architected for Speed.</h2>
            <p className="text-purple-400/80 tracking-tight">Everything you need to launch instantly on Ink.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bento Card 1: Data */}
            <div className="col-span-1 md:col-span-2 row-span-1 bg-neutral-900 border border-purple-500/10 hover:border-purple-500/30 rounded-[32px] p-5 sm:p-8 flex flex-col justify-between group overflow-hidden relative transition-colors duration-300">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                 <Globe className="w-40 h-40 text-cyan-400" />
               </div>
               <div className="space-y-2 relative z-10">
                 <h3 className="text-5xl font-medium tracking-tighter text-white">{tokenCount}</h3>
                 <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">Contracts Mined</p>
               <p className="text-white/30 text-[10px] font-mono mt-1">Ink: {inkCount} · Base: {baseCount}</p>
               </div>
               <div className="mt-12 relative z-10">
                 <p className="text-xl font-medium tracking-tight text-white max-w-sm">Tap into the Ink and Base ecosystems with a single click. Instant distribution.</p>
               </div>
            </div>

            {/* Bento Card 2: Speed */}
            <div className="col-span-1 bg-neutral-900 border border-purple-500/10 hover:border-cyan-500/30 rounded-[32px] p-5 sm:p-8 flex flex-col gap-4 group transition-colors duration-300">
               <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                 <Rocket className="w-5 h-5" />
               </div>
               <div className="mt-auto pt-16">
                 <h3 className="text-xl font-medium tracking-tight text-white mb-1">~10s Latency</h3>
                 <p className="text-white/50 text-sm tracking-tight text-balance">Optimistic rollup sequencers guarantee near-instant block times.</p>
               </div>
            </div>

            {/* Bento Card 3: Security */}
            <div className="col-span-1 bg-neutral-900 border border-purple-500/10 hover:border-purple-500/30 rounded-[32px] p-5 sm:p-8 flex flex-col gap-4 group transition-colors duration-300">
               <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                 <Shield className="w-5 h-5" />
               </div>
               <div className="mt-auto pt-16">
                 <h3 className="text-xl font-medium tracking-tight text-white mb-1">Audited Core</h3>
                 <p className="text-white/50 text-sm tracking-tight text-balance">The underlying InkFactory relies on immutable standards.</p>
               </div>
            </div>

            {/* Bento Card 4: Standards */}
            <div className="col-span-1 md:col-span-2 bg-neutral-900 border border-purple-500/10 hover:border-cyan-500/30 rounded-[32px] p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-end justify-between group transition-colors duration-300">
               <div className="space-y-4 max-w-md">
                 <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white mb-6 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-colors duration-300">
                   <Code2 className="w-5 h-5" />
                 </div>
                 <h3 className="text-2xl font-medium tracking-tight text-white">ERC-20 Compliant</h3>
                 <p className="text-white/50 text-sm tracking-tight">Complete integration availability with Uniswap, Safe, and major DeFi protocols instantly after launch.</p>
               </div>
               <Layers className="w-24 h-24 text-white/5 mt-8 md:mt-0 group-hover:text-cyan-500/20 transition-colors duration-300" />
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}