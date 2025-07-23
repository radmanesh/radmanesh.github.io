import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/radmanesh.github.io.ts',
  assetPrefix: '/radmanesh.github.io.ts/',
};

export default withContentlayer(nextConfig);
