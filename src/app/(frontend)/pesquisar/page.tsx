import Head from "next/head";

import { fetchPaginatedSearch } from "@/collections/Search/data";
import { createMetadata } from "@/utilities/create-metadata";

import { PostArchive, PostArchiveFeed, PostArchiveHeader } from "@/components/PostArchive";
import { SearchForm } from "@/components/SearchForm";
import { SectionHeading, SectionHeadingTitle } from "@/components/TitleWithDivider";

type PageArgs = {
  searchParams: Promise<{ s?: string }> | { s?: string };
};

export async function generateMetadata({ searchParams }: PageArgs) {
  const { s } = await searchParams;

  return createMetadata({
    path: `/pesquisar`,
    title: `Pesquisar: "${s || "Todos os posts"}"`,
    description: `Resultados de busca para ${s || "Todos os posts"}.`,
  });
}

export default async function SearchPage({ searchParams }: PageArgs) {
  const { s: searchTerm } = await searchParams;
  const currentPage = 1;
  const where = searchTerm ? { or: [{ title: { like: searchTerm } }, { content: { like: searchTerm } }] } : undefined;
  const posts = await fetchPaginatedSearch(currentPage, where);

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}/pesquisar/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}/pesquisar/pagina/${posts.page + 1}`} />}
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
