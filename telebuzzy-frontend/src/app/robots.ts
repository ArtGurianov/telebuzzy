import type { MetadataRoute } from "next";
import { absoluteUrl, isSiteIndexable } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!isSiteIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /billing stays crawlable so its noindex is seen
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
