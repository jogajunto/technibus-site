import { getTopPosts } from "@/collections/DailyViews/data";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

const getCachedTopPosts = unstable_cache(async () => await getTopPosts(15, 5), ["most-read-ranking"], {
  revalidate: 1800,
  tags: ["most-read"],
});

export async function GET() {
  try {
    const posts = await getCachedTopPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
