import type { MetadataRoute } from "next";

import { fetchAllCategories } from "@/collections/Categories/data";
import { fetchAllPosts } from "@/collections/Posts/data";
import { fetchAllUsers as fetchAllAuthors } from "@/collections/Users/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();
  const categories = await fetchAllCategories();
  const authors = await fetchAllAuthors();

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${process.env.SITE_URL}`,
    },
  ];

  posts.forEach((post) => {
    sitemap.push({
      url: `${process.env.SITE_URL}${post.relPermalink}`,
      lastModified: new Date(post.updatedAt),
    });
  });

  categories.forEach((category) => {
    sitemap.push({
      url: `${process.env.SITE_URL}${category.relPermalink}`,
      lastModified: new Date(category.updatedAt),
    });
  });

  authors.forEach((author) => {
    sitemap.push({
      url: `${process.env.SITE_URL}${author.relPermalink}`,
      lastModified: new Date(author.updatedAt),
    });
  });

  return sitemap;
}
