"use client";

import { Post } from "@/payload-types";
import { useEffect, useState } from "react";
import { Card } from "../Card";
import { SectionHeading, SectionHeadingTitle } from "../TitleWithDivider";

type MostReadPost = {
  post: Post;
};

export function MostRead() {
  const [posts, setPosts] = useState<MostReadPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMostRead() {
      try {
        const res = await fetch("/api/most-read");
        if (!res.ok) throw new Error("Erro ao carregar");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMostRead();
  }, []);

  if (isLoading) {
    return <div className="h-[400px] w-full animate-pulse rounded-lg bg-neutral-200" />;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <SectionHeading>
        <SectionHeadingTitle>As mais lidas</SectionHeadingTitle>
      </SectionHeading>
      <ol className="space-y-2">
        {posts.map(({ post }, index) => {
          return (
            <li className="flex gap-2" key={post.id || index}>
              <span className="font-semibold">{index + 1}.</span>
              <Card {...post} disable={{ image: true, excerpt: true }} size="sm" />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
