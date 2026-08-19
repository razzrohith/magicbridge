import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: GitHub Pages serves plain files, no Node server.
  // Emits to out/. Everything here is prerendered already, so nothing is lost.
  output: "export",
  // The Pages host serves /foo as /foo/index.html, so emit directory-style URLs.
  trailingSlash: true,
  // next/image's optimizer needs a server; we don't use next/image, but this
  // keeps the export from failing if one is ever added.
  images: { unoptimized: true },
  // The dev-only overlay badge reads as "the page is still loading" on a dark,
  // cinematic hero. It has no effect on the production build either way.
  devIndicators: false,
};

export default nextConfig;
