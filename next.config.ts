import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-only overlay badge reads as "the page is still loading" on a dark,
  // cinematic hero. It has no effect on the production build either way.
  devIndicators: false,
};

export default nextConfig;
