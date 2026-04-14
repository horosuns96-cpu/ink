'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
  injectedWallet,
  trustWallet,
  safeWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi';
import { QueryClientProvider, QueryClient, useQueryClient } from '@tanstack/react-query';
import { defineChain } from 'viem';
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
  chains: [inkSepolia],
  ssr: false,
  multiInjectedProviderDiscovery: false,
  appDescription: 'InkLaunch is the fastest way to deploy ERC-20 tokens on Ink Sepolia.',
  appUrl: getAppUrl(),
  appIcon: 'https://inkonchain.com/favicon.ico',
  wallets: [
    {
      groupName: 'Popular',
      // injectedWallet auto-detects MetaMask, Rabby, Brave Wallet and any other injected provider
      wallets: [injectedWallet, coinbaseWallet, rainbowWallet, trustWallet],
    },
    {
      groupName: 'Other',
      // walletConnectWallet: QR code fallback — works with ALL WC-compatible wallets
      // safeWallet: Gnosis Safe multisig
      wallets: [walletConnectWallet, safeWallet],
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

  // 0. Native Wagmi Listener for Instant UI Sync on WalletConnect Confirm
  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange(data) {
        if (data.status === 'connected') {
          console.log('[SessionManager] watchAccount triggered. Invalidating cache.');
          queryClient.invalidateQueries({ refetchType: 'active' });
        }
      }
    });
    return () => unwatch();
  }, [queryClient]);

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

        // НЕ перезагружать если юзер не был подключён — иначе бесконечный reload на десктопе без кошелька
        const hasWCSession = Object.keys(localStorage).some(k => k.startsWith('wc@2'));
        if (!hasWCSession) return;

        // Muffle the auto-refresh visual errors:
        toast.dismiss(); // Clear any existing sonner toasts immediately
        
        // Disconnect immediately 
        disconnect();
        
        // Deep cleanse of local keys before hard reload to avoid reload loops
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('wc@2') || key.includes('wagmi.store'))) {
            localStorage.removeItem(key);
          }
        }
        
        setTimeout(() => window.location.reload(), 300);
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
