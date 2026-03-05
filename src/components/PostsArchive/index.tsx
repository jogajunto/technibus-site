import { Post, Search } from "@/payload-types";

import { Card } from "../Card";

type PostArchiveProps = {
  posts: Post[] | Search[];
};

export function PostArchive({ posts }: PostArchiveProps) {
  return (
    <div className="container grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <Card key={index} {...post} />
      ))}
    </div>
  );
}
