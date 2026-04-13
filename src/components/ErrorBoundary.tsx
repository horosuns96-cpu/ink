'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const msg = error.message?.toLowerCase() || '';
    if (msg.includes("session topic doesn't exist") || msg.includes('missing or invalid') || msg.includes('no matching key')) {
        // Silently intercept fatal WC session errors and perform side-effect reload here where it is safe
        if (typeof window !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('wc@2') || key.includes('wagmi.store'))) {
                    localStorage.removeItem(key);
                }
            }
            window.location.reload();
        }
        return;
    }
    // In production you'd send this to Sentry / Datadog
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 1) Suppress UI for silent reloads
      const msg = this.state.error?.message?.toLowerCase() || '';
      if (msg.includes("session topic doesn't exist") || msg.includes('missing or invalid') || msg.includes('no matching key')) {
          return null; // Return empty DOM while page reloads to prevent red flashes
      }
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#09090b]">
          <div
            className="glass-card p-10 max-w-md w-full text-center space-y-6"
            style={{ animation: 'none' }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-2">Something went wrong</h2>
              <p className="text-xs text-gray-500 font-mono bg-black/40 rounded-xl p-4 text-left break-all leading-relaxed">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn-primary inline-flex items-center gap-2 text-sm mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
