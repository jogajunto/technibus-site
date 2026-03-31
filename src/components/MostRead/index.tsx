import { getTopPosts } from "@/collections/DailyViews/data";
import { Card } from "../Card";
import { SectionHeading, SectionHeadingTitle } from "../TitleWithDivider";

export async function MostRead() {
  const posts = await getTopPosts(15, 5);

  return (
    <div className="space-y-8">
      <SectionHeading>
        <SectionHeadingTitle>As mais lidas</SectionHeadingTitle>
      </SectionHeading>
      <ol className="space-y-2">
        {posts.map(({ post }, index) => {
          return (
            <li className="flex gap-2" key={index}>
              <span className="font-semibold">{index + 1}.</span>
              <Card {...post} disable={{ image: true, excerpt: true }} key={post.id} size="sm" />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
