/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "bufferutil": false,
      "utf-8-validate": false,
      "net": false,
      "tls": false,
      "fs": false,
      "path": false,
      "os": false,
      "crypto": false,
      "stream": false,
      "http": false,
      "https": false,
      "zlib": false,
    };
    return config;
  },
  transpilePackages: ["@wagmi/connectors"],
};

export default nextConfig;
