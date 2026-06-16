import { Post } from "@/payload-types";
import configPromise from "@payload-config";
import { getPayload } from "payload";

export async function getTopPosts(daysAgo: number = 15, limit: number = 5) {
  const payload = await getPayload({ config: configPromise });

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - daysAgo);
  const pastDateAtMidnight = new Date(Date.UTC(pastDate.getUTCFullYear(), pastDate.getUTCMonth(), pastDate.getUTCDate())).toISOString();

  const { docs: recentPosts } = await payload.find({
    collection: "posts",
    where: {
      publishedDate: { greater_than_equal: pastDateAtMidnight },
    },
    depth: 0,
    limit: 1000,
    pagination: false,
  });

  const recentPostIds = new Set(recentPosts.map((p) => String(p.id)));

  const { docs: viewRecords } = await payload.find({
    collection: "daily-views",
    where: {
      date: { greater_than_equal: pastDateAtMidnight },
    },
    limit: 5000,
    pagination: false,
    depth: 0,
  });

  const aggregatedViews: Record<string, number> = {};

  viewRecords.forEach((record) => {
    const postId = typeof record.post === "object" ? record.post?.id : record.post;
    if (!postId) return;

    if (!recentPostIds.has(String(postId))) return;

    if (!aggregatedViews[postId]) {
      aggregatedViews[postId] = 0;
    }
    aggregatedViews[postId] += record.views;
  });

  const topPostIds = Object.entries(aggregatedViews)
    .sort(([, viewsA], [, viewsB]) => viewsB - viewsA)
    .slice(0, limit)
    .map(([id]) => id);

  if (topPostIds.length === 0) return [];

  const { docs: topPostsData } = await payload.find({
    collection: "posts",
    where: {
      id: { in: topPostIds },
    },
    depth: 1,
    limit: limit,
  });

  const result = topPostIds
    .map((id) => {
      // O banco não devolve na mesma ordem do 'in', então temos que alinhar
      const postData = topPostsData.find((p) => String(p.id) === String(id));
      return {
        post: postData as Post,
        totalViews: aggregatedViews[id],
      };
    })
    .filter((item) => item.post !== undefined);

  return result;
}
