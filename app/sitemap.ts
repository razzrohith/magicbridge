import type { MetadataRoute } from "next";

// Required by output: "export" so this metadata route is prerendered to a
// static file instead of being treated as server-rendered.
export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://magicbridge.razzrohith.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
