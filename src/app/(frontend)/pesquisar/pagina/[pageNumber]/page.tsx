import Head from "next/head";
import { notFound } from "next/navigation";

import { fetchPaginatedSearch } from "@/collections/Search/data";
import { createMetadata } from "@/utilities/create-metadata";

import { PostArchive, PostArchiveFeed, PostArchiveHeader } from "@/components/PostArchive";
import { SearchForm } from "@/components/SearchForm";
import { SectionHeading, SectionHeadingTitle } from "@/components/TitleWithDivider";
import { unstable_cache } from "next/cache";

const getCachedSearch = unstable_cache(async (page: number, term: string) => fetchPaginatedSearch(page, term), ["search-results-key"], {
  revalidate: 60,
  tags: ["search-results"],
});

type PageArgs = {
  params: Promise<{ pageNumber: string }>;
  searchParams: Promise<{
    s: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: PageArgs) {
  const { pageNumber } = await params;
  const { s } = await searchParams;

  return createMetadata({
    path: `/pesquisar/pagina/${pageNumber}`,
    title: `Pesquisar: "${s || "Todos os posts"}" (Página ${pageNumber})`,
    description: `Resultados de busca para ${s || "Todos os posts"} - página ${pageNumber}.`,
  });
}

export default async function Page({ params, searchParams }: PageArgs) {
  const { pageNumber } = await params;
  const { s: searchTerm } = await searchParams;
  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) {
    notFound();
  }

  const posts = await getCachedSearch(sanitizedPageNumber, searchTerm || "");

  if (!posts) {
    notFound();
  }

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}/pesquisar/pagina/${posts.page - 1}${searchTerm ? `?s=${searchTerm}` : ""}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}/pesquisar/pagina/${posts.page + 1}${searchTerm ? `?s=${searchTerm}` : ""}`} />}
      </Head>

      <main>
        <PostArchive>
          <PostArchiveHeader currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs}>
            <SectionHeading>
              <SectionHeadingTitle size="lg" asChild>
                <h1>Resultados para &ldquo;{searchTerm || "Todos os posts"}&rdquo;</h1>
              </SectionHeadingTitle>
            </SectionHeading>
            <SearchForm searchTerm={searchTerm || ""} />
          </PostArchiveHeader>
          <PostArchiveFeed posts={posts.docs} page={posts.page} totalPages={posts.totalPages} path="/pesquisar" query={searchTerm} />
        </PostArchive>
      </main>
    </>
  );
}
