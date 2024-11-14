import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'www.meteorshowers.org',
        port: '',
        pathname: '/**'
      },
    ]
  }
};

export default nextConfig;
