import { MetadataRoute } from "next";

import { allPosts } from "contentlayer/generated";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://radmanesh.github.io/radmanesh.github.io.ts";

  const staticRoutes = ["", "/about", "/blog", "/projects"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const blogPostRoutes = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post._raw.flattenedPath}`,
    lastModified: new Date(post.publishedAt).toISOString(),
  }));

  return [...staticRoutes, ...blogPostRoutes];
}
