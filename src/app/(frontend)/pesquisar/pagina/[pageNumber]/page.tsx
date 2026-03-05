import { notFound } from "next/navigation";

import { createMetadata } from "@/utilities/create-metadata";

import { fetchPaginatedSearch } from "@/collections/Search/data";
import { Pagination } from "@/components/Pagination";
import { PaginationRange } from "@/components/PostRange";
import { PostArchive } from "@/components/PostsArchive";
import { SearchArea } from "@/components/SerachArea";
import Head from "next/head";

type PageArgs = {
  params: Promise<{ pageNumber: string }>;
  searchParams: Promise<{ s?: string }> | { s?: string };
};

export async function generateMetadata({ params, searchParams }: PageArgs) {
  const { pageNumber } = await params;
  const { s } = await searchParams;

  return createMetadata({
    path: `/pesquisar/pagina/${pageNumber}`,
    title: `Pesquisar "${s || "Todos os posts"}" (Página ${pageNumber})`,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  });
}

export default async function Page({ params, searchParams }: PageArgs) {
  const { pageNumber } = await params;
  const { s: searchTerm } = await searchParams;

  const sanitizedPageNumber = Number(pageNumber);

  const where = searchTerm
    ? {
        or: [{ title: { like: searchTerm } }, { content: { like: searchTerm } }],
      }
    : undefined;

  const posts = await fetchPaginatedSearch(sanitizedPageNumber, where);

  if (!Number.isInteger(sanitizedPageNumber) || !posts) {
    notFound();
  }

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}/pagina/${posts.page + 1}`} />}
      </Head>

      <main>
        <section className="py-24">
          <div className="container space-y-10">
            <SearchArea searchTerm={searchTerm || ""} />
            <PaginationRange currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs} />
            <PostArchive posts={posts.docs} />
            <Pagination page={posts.page} totalPages={posts.totalPages} path={`/pesquisar`} />
          </div>
        </section>
      </main>
    </>
  );
}
