import config from "@payload-config";
import { getPayload } from "payload";

import { Category } from "@/payload-types";
import { cache } from "react";

const payload = await getPayload({ config });

export const fetchAllCategories = cache(async (draft: boolean = false): Promise<Category[]> => {
  const { docs: categories } = await payload.find({
    collection: "categories",
    depth: 1,
    draft,
    limit: 0,
    sort: "title",
    where: {
      and: [...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  const filtered = categories.filter((category: Category) => {
    const posts = category?.posts?.docs ?? [];
    return posts.length > 0;
  });

  return filtered;
});

export const fetchCategoryBySlug = async (slug: string, draft: boolean = false): Promise<Category> => {
  const data = await payload.find({
    collection: "categories",
    depth: 1,
    draft,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, ...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data.docs[0];
};
