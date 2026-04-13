'use client';

import { type ReactNode } from 'react';
import dynamic from 'next/dynamic';

const InnerProvider = dynamic(
  () => import('@/components/Web3Inner').then(m => ({ default: m.Web3Inner })),
  { ssr: false }
);

export function Web3Provider({ children }: { children: ReactNode }) {
  return <InnerProvider>{children}</InnerProvider>;
}
