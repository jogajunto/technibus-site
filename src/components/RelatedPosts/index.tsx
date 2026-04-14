import { fetchPostsByCategorySlug } from "@/collections/Posts/data";
import { Card } from "../Card";
import { PostGrid } from "../PostGrid";
import { SectionHeading, SectionHeadingTitle } from "../TitleWithDivider";

export function SkeletonRelatedPosts() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded bg-neutral-200" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-neutral-200" />
        ))}
      </div>
    </div>
  );
}

export async function RelatedPosts({ categorySlug, postId }: { categorySlug: string; postId: string | number }) {
  const relatedPosts = await fetchPostsByCategorySlug(categorySlug, 3, [postId]);

  if (!relatedPosts || relatedPosts.length === 0) return null;

  return (
    <div className="space-y-6">
      <SectionHeading>
        <SectionHeadingTitle>Publicações relacionadas</SectionHeadingTitle>
      </SectionHeading>
      <PostGrid>
        {relatedPosts.map((post) => (
          <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
        ))}
      </PostGrid>
    </div>
  );
}
