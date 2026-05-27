import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Category, Media, User } from "@/payload-types";
import { createMetadata } from "@/utilities/create-metadata";
import { generateMetaDescription } from "@/utilities/generate-meta-description";
import { articleSchema } from "@/utilities/schema";

import { fetchPostBySlug, fetchPostsForBuild } from "@/collections/Posts/data";
import { PayloadImage } from "@/components/Payload/Image";
import RefreshRouteOnSave from "@/components/Payload/LivePreviewListener";
import { RelatedPosts, SkeletonRelatedPosts } from "@/components/RelatedPosts";
import { RichText } from "@/components/RichText";
import { Sidebar } from "@/components/Sidebar";
import { Facebook, LinkedIn, Threads, WhatsApp, X } from "@/components/SocialIcon";
import { TrackView } from "@/components/TrackView";
import { fetchCTA } from "@/globals/CTA/data";

type PageArgs = {
  params: Promise<{
    slug: string;
  }>;
};

function SkeletonSidebar() {
  return <div className="h-[800px] w-full animate-pulse rounded-lg bg-neutral-200"></div>;
}

export async function generateMetadata({ params }: PageArgs) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) return {};

  const media = post.image as Media | undefined;

  // Lógica de fallback inteligente:
  // 1. Tenta pegar a versão grande de 1024px (jpeg)
  // 2. Se não existir, tenta pegar a pequena convertida (jpeg)
  // 3. Se tudo falhar, pega a imagem original como último recurso
  const safeImage = media?.sizes?.ogImage || media?.sizes?.ogImageSmall || media || undefined;

  return createMetadata({
    path: post.relPermalink,
    title: post.title,
    description: post.excerpt || generateMetaDescription(post.content),
    image: (safeImage as Media) ?? undefined,
  });
}

export async function generateStaticParams() {
  const posts = await fetchPostsForBuild();

  if (!posts || posts.length === 0) return [];

  return posts
    .map((post) => {
      // Garante que o slug é uma string. Se por erro for objeto, tenta pegar a propriedade.
      const slugValue = typeof post.slug === "string" ? post.slug : String(post.slug || "");

      // Se não houver slug, ignore este post para não quebrar o build
      if (!slugValue) return null;

      const date = post.publishedDate ? new Date(post.publishedDate) : new Date();

      return {
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString().padStart(2, "0"),
        day: date.getDate().toString().padStart(2, "0"),
        slug: slugValue,
      };
    })
    .filter(Boolean); // Remove posts que retornaram null por falta de slug
}

export default async function Page({ params }: PageArgs) {
  const { slug } = await params;

  const { isEnabled: isDraftMode } = await draftMode();

  const [post, cta] = await Promise.all([fetchPostBySlug(slug, isDraftMode), fetchCTA(isDraftMode)]);

  if (!post) {
    notFound();
  }

  const firstCategory = (post.category as Category[])?.[0];

  return (
    <>
      {isDraftMode && <RefreshRouteOnSave />}

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
                {post.image && <PayloadImage className="border-secondary bg-secondary w-full rounded-md border" image={post.image as Media} payloadSize="large" />}
                <div className="grid gap-8 sm:grid-cols-2 lg:hidden">
                  {/* <AdsSlot variant="sidebarTopo" slotId="sidebar-topo-3" />
                  <AdsSlot variant="sidebarMeio" slotId="sidebar-meio-3" /> */}
                </div>
                {post.content && <RichText data={post.content} />}
                {cta?.content && <RichText data={cta.content} />}
                {firstCategory && (
                  <Suspense fallback={<SkeletonRelatedPosts />}>
                    <RelatedPosts categorySlug={firstCategory.slug!} postId={post.id} />
                  </Suspense>
                )}
              </div>
              <Suspense fallback={<SkeletonSidebar />}>
                <Sidebar />
              </Suspense>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
