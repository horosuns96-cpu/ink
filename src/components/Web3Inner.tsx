'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
  injectedWallet,
  metaMaskWallet,
  safeWallet,
  krakenWallet,
  zerionWallet,
  okxWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi';
import { QueryClientProvider, QueryClient, useQueryClient } from '@tanstack/react-query';
import { defineChain } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Loader2 } from 'lucide-react';
import { BalanceProvider } from './BalanceProvider';
import { watchAccount } from '@wagmi/core';
import { toast } from 'sonner';

const inkSepolia = defineChain({
  id: 763373,
  name: 'Ink Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-gel-sepolia.inkonchain.com'] },
    public: { http: ['https://rpc-gel-sepolia.inkonchain.com'] },
  },
  blockExplorers: {
    default: { name: 'Ink Explorer', url: 'https://explorer-sepolia.inkonchain.com' },
  },
  testnet: true,
});

// Determine appUrl dynamically so WalletConnect metadata matches the actual running host
const getAppUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return 'https://inkonchain.com';
};

export const config = getDefaultConfig({
  appName: 'InkLaunch Protocol',
  projectId: 'e6e6a80c62bfd3d095c47aaa8b2e439e',
  chains: [inkSepolia, baseSepolia],
  ssr: false,
  multiInjectedProviderDiscovery: true,
  appDescription: 'InkLaunch is a multichain no-code ERC-20 token factory. Supports Ink Sepolia and Base Sepolia.',
  appUrl: getAppUrl(),
  appIcon: 'https://inkonchain.com/favicon.ico',
  wallets: [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet, rainbowWallet, krakenWallet],
    },
    {
      groupName: 'More',
      wallets: [zerionWallet, okxWallet, safeWallet, injectedWallet],
    },
  ],
});


function FullScreenLoader() {
  const { isReconnecting } = useAccount();

  if (!isReconnecting) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 animate-in fade-in duration-300">
      <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
      <h3 className="text-xl font-black text-white tracking-widest uppercase mb-2">Restoring Session</h3>
      <p className="text-xs text-purple-400 font-medium">Please wait a moment...</p>
    </div>
  );
}

function SessionManager() {
  const { status } = useAccount();
  const { disconnect } = useDisconnect();
  const queryClient = useQueryClient();

  // 0a. watchAccount — fires on WalletConnect mobile confirm
  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange(data) {
        if (data.status === 'connected') {
          queryClient.invalidateQueries();
        }
      }
    });
    return () => unwatch();
  }, [queryClient]);

  // 0b. status watcher — belt-and-suspenders for WC sync
  useEffect(() => {
    if (status === 'connected') {
      queryClient.invalidateQueries();
    }
  }, [status, queryClient]);

  // 1. Storage cleanup on explicit disconnect
  useEffect(() => {
    if (status === 'disconnected') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('wc@2')) {
          localStorage.removeItem(key);
        }
      }
    }
  }, [status]);

  // 2. Fatal Session Error Interceptor
  useEffect(() => {
    const handleRejection = (e: PromiseRejectionEvent) => {
      const msg = e.reason?.message?.toLowerCase() || '';
      if (msg.includes("session topic doesn't exist") || msg.includes('missing or invalid') || msg.includes('no matching key')) {
        console.error('[SessionManager] Fatal WalletConnect error caught. Purging session silently...');
        e.preventDefault();

        toast.dismiss();
        disconnect();

        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('wc@2') || key.includes('wagmi.store'))) {
            localStorage.removeItem(key);
          }
        }
      }
    };
    
    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, [disconnect]);

  return <FullScreenLoader />;
}

export function Web3Inner({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#A855F7',
            accentColorForeground: 'white',
            borderRadius: 'large',
            fontStack: 'system',
          })}
          locale="en-US"
        >
          <BalanceProvider>
            <SessionManager />
            {children}
          </BalanceProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
