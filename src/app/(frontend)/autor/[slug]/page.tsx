import Head from "next/head";
import { notFound } from "next/navigation";

import { fetchPaginatedPostsByAuthor } from "@/collections/Posts/data";
import { fetchUserBySlug } from "@/collections/Users/data";
import { createMetadata } from "@/utilities/create-metadata";

import AuthorBio from "@/components/AutorBio";
import { Card } from "@/components/Card";
import { Pagination } from "@/components/Pagination";
import { PaginationRange } from "@/components/PostRange";
import { PostArchive } from "@/components/PostsArchive";
import { Sidebar } from "@/components/Sidebar";

type PageArgs = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageArgs) {
  const { slug } = await params;
  const author = await fetchUserBySlug(slug);

  return createMetadata({
    path: author.relPermalink,
    title: `Autor: ${author.name}`,
    description: author.bio || "",
  });
}

export default async function Page({ params }: PageArgs) {
  const { slug } = await params;

  const author = await fetchUserBySlug(slug);
  const posts = await fetchPaginatedPostsByAuthor(author.id);

  if (!posts.totalDocs) {
    notFound();
  }

  return (
    <>
      <Head>
        {posts.page && posts.page > 1 && <link rel="prev" href={`${process.env.SITE_URL}${author.relPermalink}/pagina/${posts.page - 1}`} />}
        {posts.page && posts.totalPages > 1 && <link rel="next" href={`${process.env.SITE_URL}${author.relPermalink}/pagina/${posts.page + 1}`} />}
      </Head>

      <main>
        <section className="relative z-0 pt-4 pb-24">
          <div className="container grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="space-y-8">
              <div className="space-y-4">
                <AuthorBio {...author} />
                <PaginationRange currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs} />
              </div>

              <PostArchive>
                {posts.docs.map((post) => (
                  <Card {...post} disable={{ excerpt: true }} key={post.id} size="sm" />
                ))}
              </PostArchive>
              <Pagination page={posts.page} totalPages={posts.totalPages} path={author.relPermalink} />
            </div>
            <Sidebar />
          </div>
        </section>
      </main>
    </>
  );
}
