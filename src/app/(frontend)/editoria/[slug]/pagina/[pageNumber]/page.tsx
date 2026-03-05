import Head from "next/head";
import { notFound } from "next/navigation";

import { fetchCategoryBySlug } from "@/collections/Categories/data";
import { fetchPaginatedPostsByCategory } from "@/collections/Posts/data";
import { createMetadata } from "@/utilities/create-metadata";

import { Card } from "@/components/Card";
import { Pagination } from "@/components/Pagination";
import { PaginationRange } from "@/components/PostRange";
import { PostArchive } from "@/components/PostsArchive";
import { Sidebar } from "@/components/Sidebar";

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
        <section className="relative z-0 pt-4 pb-24">
          <div className="container grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-brand-primary border-secondary subheading border-b pb-3 max-sm:text-center">{category.title}</h2>
                <PaginationRange currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs} />
              </div>
              <PostArchive>
                {posts.docs.map((post) => (
                  <Card {...post} disable={{ excerpt: true }} key={post.id} size="sm" />
                ))}
              </PostArchive>
              <Pagination page={posts.page} totalPages={posts.totalPages} path={category.relPermalink} />
            </div>
            <Sidebar />
          </div>
        </section>
      </main>
    </>
  );
}
