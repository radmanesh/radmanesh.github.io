import { MetadataRoute } from "next";

import { allPosts } from "contentlayer/generated";
import LABS from "@/content/labs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://radmanesh.vercel.app";

  const staticRoutes = ["", "/about", "/blog", "/projects", "/lab"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const blogPostRoutes = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post._raw.flattenedPath}`,
    lastModified: new Date(post.publishedAt).toISOString(),
  }));

  const labExperimentRoutes = LABS.map((exp) => ({
    url: `${baseUrl}/lab/${exp.slug}`,
    lastModified: new Date().toISOString(),
  }));

  return [...staticRoutes, ...blogPostRoutes, ...labExperimentRoutes];
}
