import Head from "next/head";
import { notFound } from "next/navigation";

import { fetchCategoryBySlug } from "@/collections/Categories/data";
import { fetchPaginatedPostsByCategory } from "@/collections/Posts/data";
import { PostArchive, PostArchiveFeed, PostArchiveHeader } from "@/components/PostArchive";
import { SectionHeading, SectionHeadingTitle } from "@/components/TitleWithDivider";
import { createMetadata } from "@/utilities/create-metadata";

type PageArgs = {
  params: Promise<{
    slug: string;
    pageNumber: string;
  }>;
};

export async function generateMetadata({ params }: PageArgs) {
  const { slug, pageNumber } = await params;
  const category = await fetchCategoryBySlug(slug);

  return createMetadata({
    path: `${category.relPermalink}/pagina/${pageNumber}`,
    title: `Editoria: ${category.title} (Página ${pageNumber})`,
    description: category.description || "",
  });
}

export default async function Page({ params: paramsPromise }: PageArgs) {
  const { slug, pageNumber } = await paramsPromise;

  const sanitizedPageNumber = Number(pageNumber);

  const category = await fetchCategoryBySlug(slug);
  const posts = await fetchPaginatedPostsByCategory(category.id, sanitizedPageNumber);

  if (!Number.isInteger(sanitizedPageNumber) || !posts) {
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
          <PostArchiveFeed posts={posts.docs} page={posts.page} totalPages={posts.totalPages} path={category.relPermalink} />
        </PostArchive>
      </main>
    </>
  );
}
