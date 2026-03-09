import Head from "next/head";
import { notFound } from "next/navigation";

import { fetchCategoryBySlug } from "@/collections/Categories/data";
import { fetchPaginatedPostsByCategory } from "@/collections/Posts/data";
import { createMetadata } from "@/utilities/create-metadata";

import { PostArchive, PostArchiveFeed, PostArchiveHeader } from "@/components/PostArchive";
import { SectionHeading, SectionHeadingTitle } from "@/components/TitleWithDivider";

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

  if (!posts.totalDocs) {
    notFound();
  }

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}${category.relPermalink}/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}${category.relPermalink}/pagina/${posts.page + 1}`} />}
      </Head>

      <main>
        <PostArchive>
          <PostArchiveHeader currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs}>
            <SectionHeading className="max-sm:justify-center">
              <SectionHeadingTitle size="lg" asChild>
                <h1>{category.title}</h1>
              </SectionHeadingTitle>
            </SectionHeading>
          </PostArchiveHeader>
          <PostArchiveFeed cardDisable={{ excerpt: true, category: true }} posts={posts.docs} page={posts.page} totalPages={posts.totalPages} path={category.relPermalink} />
        </PostArchive>
      </main>
    </>
  );
}
