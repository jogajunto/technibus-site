import Head from "next/head";
import { notFound } from "next/navigation";

import { fetchPaginatedPostsByAuthor } from "@/collections/Posts/data";
import { fetchUserBySlug } from "@/collections/Users/data";
import { createMetadata } from "@/utilities/create-metadata";

import { AuthorBio } from "@/components/AutorBio";
import { PostArchive, PostArchiveFeed, PostArchiveHeader } from "@/components/PostArchive";

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
        <PostArchive>
          <PostArchiveHeader currentPage={posts.page || 1} totalPages={posts.totalPages} totalDocs={posts.totalDocs}>
            <AuthorBio {...author} />
          </PostArchiveHeader>
          <PostArchiveFeed posts={posts.docs} page={posts.page} totalPages={posts.totalPages} path={author.relPermalink} />
        </PostArchive>
      </main>
    </>
  );
}
