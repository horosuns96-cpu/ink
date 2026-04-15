/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@rainbow-me/rainbowkit',
      '@tanstack/react-query',
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
      '@metamask/sdk': false,
      '@metamask/sdk-communication-layer': false,
      '@metamask/sdk-install-modal-web': false,
    };
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false, net: false, tls: false
        };
    }
    return config;
  },
};

export default nextConfig;
