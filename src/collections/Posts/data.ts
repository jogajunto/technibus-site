import { draftMode } from "next/headers";

import config from "@payload-config";
import { getPayload, PaginatedDocs, Where } from "payload";

import { Post } from "@/payload-types";

const payload = await getPayload({ config });

function getPublishedWhere(draft: boolean): Where[] {
  if (draft) return [];

  return [
    {
      _status: {
        equals: "published",
      },
    },
    {
      publishedDate: {
        less_than_equal: new Date().toISOString(),
      },
    },
  ];
}

export const fetchPostBySlug = async (slug: string): Promise<Post> => {
  const { isEnabled: draft } = await draftMode();

  const data = await payload.find({
    collection: "posts",
    depth: 1,
    draft: true,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, ...getPublishedWhere(draft)],
    },
  });

  return data.docs[0];
};

export const fetchPaginatedPosts = async (page: number = 1): Promise<PaginatedDocs<Post>> => {
  const { isEnabled: draft } = await draftMode();

  return payload.find({
    collection: "posts",
    depth: 1,
    draft,
    limit: 12,
    page,
    where: {
      and: [...getPublishedWhere(draft)],
    },
  });
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  const { isEnabled: draft } = await draftMode();

  const data = await payload.find({
    collection: "posts",
    depth: 1,
    draft,
    limit: 0,
    where: {
      and: [...getPublishedWhere(draft)],
    },
  });

  return data.docs;
};

export const fetchPaginatedPostsByCategory = async (categoryId: number, page: number = 1): Promise<PaginatedDocs<Post>> => {
  const { isEnabled: draft } = await draftMode();

  return payload.find({
    collection: "posts",
    depth: 2,
    draft,
    limit: 12,
    sort: "-publishedDate",
    page,
    where: {
      and: [{ category: { equals: categoryId } }, ...getPublishedWhere(draft)],
    },
  });
};

export const fetchPaginatedPostsByAuthor = async (userId: number, page: number = 1): Promise<PaginatedDocs<Post>> => {
  const { isEnabled: draft } = await draftMode();

  return payload.find({
    collection: "posts",
    depth: 2,
    draft,
    limit: 12,
    sort: "-publishedDate",
    page,
    where: {
      and: [{ author: { equals: userId } }, ...getPublishedWhere(draft)],
    },
  });
};

export async function fetchPostsByTagSlug(slug: string, limit: number, excludeIds: (string | number)[] = []): Promise<Post[]> {
  const { isEnabled: draft } = await draftMode();

  const tagResult = await payload.find({
    collection: "tags",
    limit: 1,
    where: { slug: { equals: slug } },
  });

  const tag = tagResult.docs[0];
  if (!tag) return [];

  const posts = await payload.find({
    collection: "posts",
    depth: 2,
    draft,
    limit,
    sort: "-publishedDate",
    where: {
      and: [{ tag: { contains: tag.id } }, ...(excludeIds.length > 0 ? [{ id: { not_in: excludeIds } }] : []), ...getPublishedWhere(draft)],
    },
  });

  return posts.docs;
}

export async function fetchPostsByCategorySlug(slug: string, limit: number, excludeIds: (string | number)[] = []): Promise<Post[]> {
  const { isEnabled: draft } = await draftMode();

  const categoryResult = await payload.find({
    collection: "categories",
    limit: 1,
    where: {
      slug: { equals: slug },
    },
  });

  const category = categoryResult.docs[0];
  if (!category) return [];

  const posts = await payload.find({
    collection: "posts",
    depth: 2,
    draft,
    limit,
    sort: "-publishedDate",
    where: {
      and: [{ category: { contains: category.id } }, ...(excludeIds.length > 0 ? [{ id: { not_in: excludeIds } }] : []), ...getPublishedWhere(draft)],
    },
  });

  return posts.docs;
}

type FetchLatestPostsProps = {
  excludeIds?: (string | number)[];
  limit?: number;
};

export const fetchLatestPosts = async ({ excludeIds = [], limit = 9 }: FetchLatestPostsProps = {}): Promise<Post[]> => {
  const { isEnabled: draft } = await draftMode();

  const posts = await payload.find({
    collection: "posts",
    depth: 2,
    draft,
    limit,
    sort: "-publishedDate",
    where: {
      and: [...(excludeIds.length > 0 ? [{ id: { not_in: excludeIds } }] : []), ...getPublishedWhere(draft)],
    },
  });

  return posts.docs;
};
