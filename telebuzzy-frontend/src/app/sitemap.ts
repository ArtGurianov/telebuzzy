import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

// The landing page is the only public, indexable route
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
