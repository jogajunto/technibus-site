import { Post } from "@/payload-types";

export const getPostIds = (posts: Post[]): (string | number)[] => {
  return posts.map((post) => post.id);
};
