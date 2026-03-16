import Link from "next/link";
import { notFound } from "next/navigation";

import { Category, Media, User } from "@/payload-types";

import config from "@payload-config";

import { createMetadata } from "@/utilities/create-metadata";
import { generateMetaDescription } from "@/utilities/generate-meta-description";
import { articleSchema } from "@/utilities/schema";

import RefreshRouteOnSave from "@/components/Payload/LivePreviewListener";

import { fetchPostBySlug, fetchPostsByCategorySlug } from "@/collections/Posts/data";
import { Ads } from "@/components/Ads";
import { Card } from "@/components/Card";
import { PostGrid } from "@/components/PostGrid";
import { RichText } from "@/components/RichText";
import { Sidebar } from "@/components/Sidebar";
import { Facebook, LinkedIn, Threads, WhatsApp, X } from "@/components/SocialIcon";
import { SectionHeading, SectionHeadingTitle } from "@/components/TitleWithDivider";

import { PayloadImage } from "@/components/Payload/Image";
import { TrackView } from "@/components/TrackView";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";

type PageArgs = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageArgs) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  return createMetadata({
    path: post.relPermalink,
    title: post.title,
    description: post.excerpt || generateMetaDescription(post.content),
    image: post.image ? ((post.image as Media) ?? undefined) : undefined,
  });
}

export default async function Page({ params }: PageArgs) {
  const { slug } = await params;

  const payload = await getPayload({ config });
  const headers = await getHeaders();

  const { user } = await payload.auth({ headers });

  const post = await fetchPostBySlug(slug, Boolean(user));

  if (!post) {
    notFound();
  }

  const firstCategory = (post.category as Category[])[0];
  const relatedPosts = firstCategory ? await fetchPostsByCategorySlug(firstCategory.slug, 3, [post.id]) : [];

  return (
    <>
      <RefreshRouteOnSave />

      <TrackView postId={post.id} />

      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema(post)),
          }}
        />

        <article className="pt-4 pb-24">
          <div className="container space-y-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <ul className="relative z-10 flex flex-wrap gap-2">
                      {post.category.map((cat, index) => {
                        const c = cat as Category;
                        return (
                          <li key={c.id || index}>
                            <Link className="tag" href={c.relPermalink || "#"}>
                              {c.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    <h1 className="text-primary text-4xl font-medium">{post.title}</h1>
                  </div>
                  {post.excerpt && <p className="text-secondary text-pretty">{post.excerpt}</p>}
                </div>
                <div className="flex flex-wrap justify-between gap-4">
                  <p className="text-secondary">
                    Publicado em {new Date(post.publishedDate).toLocaleDateString("pt-BR")} por{" "}
                    {(post.author as User)?.relPermalink ? (
                      <Link className="link" href={(post.author as User).relPermalink}>
                        {(post.author as User).name}
                      </Link>
                    ) : (
                      <span>{(post.author as User)?.name || "Autor desconhecido"}</span>
                    )}
                  </p>
                  {post.relPermalink && (
                    <ul className="flex gap-4">
                      <li>
                        <Link
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(process.env.SITE_URL! + post.relPermalink)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedIn className="icon-brand-primary size-6" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.SITE_URL! + post.relPermalink)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Facebook className="icon-brand-primary size-6" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`https://x.com/intent/tweet?url=${encodeURIComponent(process.env.SITE_URL! + post.relPermalink)}&text=${encodeURIComponent(post.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <X className="icon-brand-primary size-6" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`https://www.threads.net/intent/post?text=${encodeURIComponent(post.title + " " + process.env.SITE_URL! + post.relPermalink)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Threads className="icon-brand-primary size-6" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + process.env.SITE_URL! + post.relPermalink)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsApp className="icon-brand-primary size-6" />
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
                {post.image && <PayloadImage className="border-secondary bg-secondary w-full rounded-md border" image={post.image as Media} />}
                <div className="grid gap-8 sm:grid-cols-2 lg:hidden">
                  <Ads variant="sidebarTopo" />
                  <Ads variant="sidebarMeio" />
                </div>
                {post.content && <RichText data={post.content} />}
                <Ads className="lg:hidden" variant="sidebarMeio2" />
                <div className="space-y-6">
                  <SectionHeading>
                    <SectionHeadingTitle>Publicações relacionadas</SectionHeadingTitle>
                  </SectionHeading>
                  <PostGrid>
                    {relatedPosts.map((post) => (
                      <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
                    ))}
                  </PostGrid>
                </div>
                <Ads className="lg:hidden" variant="sidebarBase" />
              </div>
              <Sidebar />
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
