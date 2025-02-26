import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'media2.edu.metropolia.fi',
      },
      {
        hostname: 'place-hold.it',
      },
    ],
  },
};

export default nextConfig;
