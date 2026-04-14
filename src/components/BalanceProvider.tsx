'use client';

import { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useAccount, useBalance } from 'wagmi';

type BalanceContextType = {
  balanceFormatted: string;
  hasBalance: boolean;
  refetchBalance: () => void;
  isLoading: boolean;
};

const BalanceContext = createContext<BalanceContextType>({
  balanceFormatted: '0.0000',
  hasBalance: false,
  refetchBalance: () => {},
  isLoading: false,
});

export function BalanceProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  
  const { data, refetch, isLoading } = useBalance({
    address,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 5000,
    },
  });

  const activeBalance = isConnected && data?.formatted ? Number(data.formatted) : 0;
  const balanceFormatted = activeBalance.toFixed(4);
  const hasBalance = activeBalance > 0;

  const refetchBalance = useCallback(() => {
    if (isConnected) refetch();
  }, [isConnected, refetch]);

  const contextValue = useMemo(() => ({
    balanceFormatted,
    hasBalance,
    refetchBalance,
    isLoading: isConnected && isLoading,
  }), [balanceFormatted, hasBalance, refetchBalance, isConnected, isLoading]);

  return (
    <BalanceContext.Provider value={contextValue}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useGlobalBalance() {
  return useContext(BalanceContext);
}
