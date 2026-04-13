/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
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
