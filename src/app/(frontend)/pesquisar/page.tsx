import { fetchPaginatedSearch } from "@/collections/Search/data";
import { Card } from "@/components/Card";
import { MostRead } from "@/components/MostRead";
import { Pagination } from "@/components/Pagination";
import { PaginationRange } from "@/components/PostRange";
import { SearchArea } from "@/components/SerachArea";
import { createMetadata } from "@/utilities/create-metadata";
import Head from "next/head";

interface PageArgs {
  searchParams: Promise<{ s?: string }> | { s?: string };
}

export async function generateMetadata({ searchParams }: PageArgs) {
  const { s } = await searchParams;

  return createMetadata({
    path: `/pesquisar`,
    title: `Pesquisar "${s || "Todos os posts"}"`,
    description: `Resultados de busca para ${s || "Todos os posts"}`,
  });
}

export default async function SearchPage({ searchParams }: PageArgs) {
  const { s: searchTerm } = await searchParams;

  let currentPage = 1;

  const where = searchTerm
    ? {
        or: [{ title: { like: searchTerm } }, { content: { like: searchTerm } }],
      }
    : undefined;
  const posts = await fetchPaginatedSearch(currentPage, where);

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}/pesquisar/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}/pesquisar/pagina/${posts.page + 1}`} />}
      </Head>

      <main>
        <section className="relative z-0 min-w-0 pt-10 pb-24">
          <div className="container grid gap-10 lg:grid-cols-12">
            <div className="space-y-10 lg:col-span-9">
              <div className="space-y-3">
                <SearchArea searchTerm={searchTerm || ""} />
                {/* <h2 className="text-brand-primary border-secondary subheading border-b pb-3">{category.title}</h2> */}
                <PaginationRange currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs} />
                <div className="grid auto-rows-min gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {posts.docs.map((post) => (
                    <Card {...post} key={post.id} size="sm" />
                  ))}
                </div>
              </div>
              <Pagination page={posts.page} totalPages={posts.totalPages} path={`/pesquisar`} />
            </div>
            <div className="lg:col-span-3">
              <MostRead />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
