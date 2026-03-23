import Head from "next/head";
import { notFound } from "next/navigation";

import { fetchCategoryBySlug } from "@/collections/Categories/data";
import { fetchPaginatedPostsByCategory } from "@/collections/Posts/data";
import { createMetadata } from "@/utilities/create-metadata";

import { Button } from "@/components/Button";
import { LatbusMarquee } from "@/components/LatbusMarquee";
import { PostArchive, PostArchiveFeed, PostArchiveHeader } from "@/components/PostArchive";
import { SectionHeading, SectionHeadingTitle } from "@/components/TitleWithDivider";
import Link from "next/link";

type PageArgs = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageArgs) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  return createMetadata({
    path: category.relPermalink,
    title: `Editoria: ${category.title}`,
    description: category.description || "",
  });
}

export default async function Page({ params }: PageArgs) {
  const { slug } = await params;

  const category = await fetchCategoryBySlug(slug);
  const posts = await fetchPaginatedPostsByCategory(category.id);

  const isLatbusCategory = category.slug === "latbus";

  if (!posts.totalDocs) {
    notFound();
  }

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}${category.relPermalink}/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}${category.relPermalink}/pagina/${posts.page + 1}`} />}
      </Head>

      <main className="min-w-0">
        <PostArchive>
          <PostArchiveHeader currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs}>
            <SectionHeading className="max-sm:justify-center">
              <SectionHeadingTitle size="lg" asChild>
                <h1>{category.title}</h1>
              </SectionHeadingTitle>
            </SectionHeading>
          </PostArchiveHeader>

          {isLatbusCategory && (
            <div className="bg-secondary border-secondary flex flex-col items-center gap-2 overflow-hidden rounded-lg border pt-8 pb-2 text-center">
              <div className="flex flex-wrap items-center justify-center gap-4 px-6">
                <h3 className="text-xl font-semibold">Guia dos expositores Lat.Bus 2026</h3>
                <Button className="shrink-0" size="sm" variant="secondary" asChild>
                  <Link href="/guia-de-expositores-lat-bus-2026">Ver todos expositores</Link>
                </Button>
              </div>
              <LatbusMarquee />
            </div>
          )}

          <PostArchiveFeed cardDisable={{ excerpt: true, category: true }} posts={posts.docs} page={posts.page} totalPages={posts.totalPages} path={category.relPermalink} />
        </PostArchive>
      </main>
    </>
  );
}
