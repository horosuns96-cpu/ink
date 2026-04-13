'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Shield, Layers, Code2, Globe } from 'lucide-react';
import { useReadContract } from 'wagmi';
import { INK_FACTORY_ABI, INK_FACTORY_ADDRESS } from '@/lib/contracts';
import { IntroSequence } from '@/components/IntroSequence';
import { use3DTilt } from '@/hooks/use3DTilt';

const STAGGER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', damping: 20, stiffness: 100 } 
  },
};

// Individual tilt-wrapped bento card
function BentoCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, onMouseMove, onMouseEnter, onMouseLeave } = use3DTilt({ max: 8, scale: 1.02 });
  return (
    <motion.div
      ref={ref}
      variants={ITEM_VARIANTS}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: deployedTokens } = useReadContract({
    address: INK_FACTORY_ADDRESS,
    abi: INK_FACTORY_ABI,
    functionName: 'getDeployedTokens',
  });

  const tokenCount = deployedTokens ? (deployedTokens as string[]).length : 0;

  if (!mounted) return null;

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
              Ink Sepolia Alpha
            </motion.div>
            
            <motion.h1
              variants={ITEM_VARIANTS}
              className="glitch text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] text-white transform-gpu"
              data-text="Deploy tokens."
            >
              Deploy tokens.<br />
              <span className="gradient-text drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">Zero friction.</span>
            </motion.h1>

            <motion.p variants={ITEM_VARIANTS} className="text-lg text-white/60 max-w-xl font-medium tracking-tight transform-gpu">
              InkLaunch provides an enterprise-grade compiler to launch your smart contracts on Ink. Focus on your product, not the boilerplate.
            </motion.p>

            <motion.div variants={ITEM_VARIANTS} className="flex items-center gap-4 pt-4 transform-gpu">
              <Link href="/launch" prefetch={true} className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_45px_rgba(168,85,247,0.6)] text-white font-bold tracking-widest uppercase text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 transform-gpu">
                Start Building <Rocket className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* BENTO GRID */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-medium tracking-tight text-white mb-3">Architected for Speed.</h2>
            <p className="text-purple-400/80 tracking-tight">Everything you need to launch instantly on Ink.</p>
          </div>

          <motion.div 
            variants={STAGGER_VARIANTS}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Bento Card 1: Data */}
            <BentoCard className="col-span-1 md:col-span-2 row-span-1 bg-neutral-900 border border-purple-500/10 hover:border-purple-500/30 rounded-[32px] p-5 sm:p-8 flex flex-col justify-between transform-gpu group overflow-hidden relative shadow-[0_0_20px_rgba(168,85,247,0.02)] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                 <Globe className="w-40 h-40 text-cyan-400" />
               </div>
               <div className="space-y-2 relative z-10">
                 <h3 className="text-5xl font-medium tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{tokenCount}</h3>
                 <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">Contracts Mined</p>
               </div>
               <div className="mt-12 relative z-10">
                 <p className="text-xl font-medium tracking-tight text-white max-w-sm">Tap into the Ink ecosystem with a single click. Instant distribution.</p>
               </div>
            </BentoCard>

            {/* Bento Card 2: Speed */}
            <BentoCard className="col-span-1 bg-neutral-900 border border-purple-500/10 hover:border-cyan-500/30 rounded-[32px] p-5 sm:p-8 flex flex-col gap-4 transform-gpu group shadow-[0_0_20px_rgba(168,85,247,0.02)] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500">
               <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:scale-110 transition-transform">
                 <Rocket className="w-5 h-5" />
               </div>
               <div className="mt-auto pt-16">
                 <h3 className="text-xl font-medium tracking-tight text-white mb-1">~10s Latency</h3>
                 <p className="text-white/50 text-sm tracking-tight text-balance">Optimistic rollup sequencers guarantee near-instant block times.</p>
               </div>
            </BentoCard>

            {/* Bento Card 3: Security */}
            <BentoCard className="col-span-1 bg-neutral-900 border border-purple-500/10 hover:border-purple-500/30 rounded-[32px] p-5 sm:p-8 flex flex-col gap-4 transform-gpu group shadow-[0_0_20px_rgba(168,85,247,0.02)] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500">
               <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:scale-110 transition-transform">
                 <Shield className="w-5 h-5" />
               </div>
               <div className="mt-auto pt-16">
                 <h3 className="text-xl font-medium tracking-tight text-white mb-1">Audited Core</h3>
                 <p className="text-white/50 text-sm tracking-tight text-balance">The underlying InkFactory relies on immutable standards.</p>
               </div>
            </BentoCard>

            {/* Bento Card 4: Standards */}
            <BentoCard className="col-span-1 md:col-span-2 bg-neutral-900 border border-purple-500/10 hover:border-cyan-500/30 rounded-[32px] p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-end justify-between transform-gpu group shadow-[0_0_20px_rgba(168,85,247,0.02)] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500">
               <div className="space-y-4 max-w-md">
                 <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white mb-6 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-colors">
                   <Code2 className="w-5 h-5" />
                 </div>
                 <h3 className="text-2xl font-medium tracking-tight text-white">ERC-20 Compliant</h3>
                 <p className="text-white/50 text-sm tracking-tight">Complete integration availability with Uniswap, Safe, and major DeFi protocols instantly after launch.</p>
               </div>
               <Layers className="w-24 h-24 text-white/5 mt-8 md:mt-0 group-hover:text-cyan-500/20 transition-colors" />
            </BentoCard>
          </motion.div>
        </section>
      </main>

      <footer className="mt-40 text-center pb-8 opacity-40 text-[10px] font-bold tracking-widest uppercase font-mono text-purple-400">
        InkLaunch &copy; 2026. Made for Ink Nebula.
      </footer>
    </div>
  );
}
