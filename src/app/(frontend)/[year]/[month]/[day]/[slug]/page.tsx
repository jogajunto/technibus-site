import Link from "next/link";
import { notFound } from "next/navigation";

import { createMetadata } from "@/utilities/create-metadata";

import { fetchPostBySlug } from "@/collections/Posts/data";
import { MostRead } from "@/components/MostRead";
import { PayloadImage } from "@/components/Payload/Image";
import { RichText } from "@/components/RichText";
import { Facebook, LinkedIn, Threads, WhatsApp, X } from "@/components/SocialIcon";
import { Category, Media } from "@/payload-types";

type PageArgs = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageArgs) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  return createMetadata({
    path: `/blog/${slug}`,
    title: post.meta?.title || process.env.SITE_URL!,
    description: post.meta?.description || "",
  });
}

export default async function Page({ params }: PageArgs) {
  const { slug } = await params;

  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <article className="pt-10 pb-24">
        <div className="container space-y-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-9">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <p className="uppertitle">
                    {(post.category as Category[]).map((category, index) => {
                      const isLast = index === post.category.length - 1;

                      return (
                        <span key={category.id}>
                          <Link href={category.relPermalink}>{category.title}</Link>
                          {!isLast && ", "}
                        </span>
                      );
                    })}
                  </p>
                  <h1 className="text-primary text-4xl font-medium">{post.title}</h1>
                </div>
                <p className="text-secondary">{post.excerpt}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-secondary">Publicado em {new Date(post.publishedDate).toLocaleDateString("pt-BR")}</p>
                <ul className="flex gap-4">
                  <li>
                    <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(!post.permalink)}`} target="_blank" rel="noopener noreferrer">
                      <LinkedIn className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                  <li>
                    <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(!post.permalink)}`} target="_blank" rel="noopener noreferrer">
                      <Facebook className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`https://x.com/intent/tweet?url=${encodeURIComponent(!post.permalink)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <X className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                  <li>
                    <Link href={`https://www.threads.net/intent/post?text=${encodeURIComponent(post.title + " " + !post.permalink)}`} target="_blank" rel="noopener noreferrer">
                      <Threads className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                  <li>
                    <Link href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + !post.permalink)}`} target="_blank" rel="noopener noreferrer">
                      <WhatsApp className="text-regal-blue-950 size-6" />
                    </Link>
                  </li>
                </ul>
              </div>
              <PayloadImage className="w-full rounded-md" image={post.image as Media} />
              {post.content && <RichText data={post.content} />}
            </div>
            <div className="lg:col-span-3">
              <MostRead />
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
