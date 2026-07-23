import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/tags`, changeFrequency: "weekly", priority: 0.3 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
