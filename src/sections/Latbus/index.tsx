import Image from "next/image";
import Link from "next/link";

import { fetchPostsByCategorySlug } from "@/collections/Posts/data";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PostGrid } from "@/components/PostGrid";
import { SectionHeading, SectionHeadingActions, SectionHeadingTitle } from "@/components/TitleWithDivider";

export async function SectionLatbus() {
  const posts = await fetchPostsByCategorySlug("latbus", 3);

  return (
    <section className="bg-secondary border-secondary border-y py-24">
      <div className="container space-y-6">
        <SectionHeading>
          <SectionHeadingTitle size="lg">Lat.bus</SectionHeadingTitle>
          <SectionHeadingActions>
            <Button size="sm" asChild>
              <Link href="https://acervodigitalotm.com.br/" target="_blank" rel="noopener">
                Ver todas publicações
              </Link>
            </Button>
          </SectionHeadingActions>
        </SectionHeading>
        <PostGrid variant="4-cols">
          <div className="flex">
            <Image className="h-auto w-full rounded" src="/latbus-banner.svg" alt="" width={236} height={351} />
          </div>
          {posts.map((post) => (
            <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
          ))}
        </PostGrid>
      </div>
    </section>
  );
}
