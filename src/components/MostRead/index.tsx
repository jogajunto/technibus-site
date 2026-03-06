import { fetchLatestPosts } from "@/collections/Posts/data";
import { Card } from "../Card";
import { SectionHeading, SectionHeadingTitle } from "../TitleWithDivider";

export async function MostRead() {
  const posts = await fetchLatestPosts({ limit: 5 });

  return (
    <div className="space-y-8">
      <SectionHeading>
        <SectionHeadingTitle>Mais lidos</SectionHeadingTitle>
      </SectionHeading>
      <ol className="space-y-2">
        {posts.map((post, index) => (
          <div className="flex gap-2" key={index}>
            <span className="translate-y-0.5 pt-5 font-semibold">{index + 1}.</span>
            <Card {...post} disable={{ image: true, excerpt: true }} key={post.id} size="sm" />
          </div>
        ))}
      </ol>
    </div>
  );
}
