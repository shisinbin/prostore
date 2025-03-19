import type { NextConfig } from 'next';

const APP_ID = process.env.UPLOADTHING_APPID || 'lyt6ymthqu';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${APP_ID}.ufs.sh`,
        pathname: '/f/*',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/f/*',
      },
    ],
  },
  experimental: {
    serverComponentsHmrCache: false, // defaults to true
  },
};

export default nextConfig;
