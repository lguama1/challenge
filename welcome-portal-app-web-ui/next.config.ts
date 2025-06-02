import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  output: 'export',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.map$/,
      use: 'null-loader',
    });
    return config;
  },
}

export default nextConfig
