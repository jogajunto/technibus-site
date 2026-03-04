import { fetchLatestPosts } from "@/collections/Posts/data";
import { Card } from "../Card";

export async function MostRead() {
  const posts = await fetchLatestPosts({ limit: 5 });

  return (
    <div className="space-y-8">
      <h2 className="text-brand-primary border-secondary max-md:subheading mb-8 border-b pt-3 pb-3 text-xl font-medium">Mais lidos</h2>
      <ol className="space-y-2">
        {posts.map((post, index) => (
          <div className="flex" key={index}>
            {index + 1}
            <Card {...post} disable={{ image: true, excerpt: true }} key={post.id} size="sm" />
          </div>
        ))}
      </ol>
    </div>
  );
}
