import { createMetadata } from "@/utilities/create-metadata";

import { fetchLatestPosts, fetchPostsByCategorySlug, fetchPostsByTagSlug } from "@/collections/Posts/data";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Countdown } from "@/components/Countdown";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import { MostRead } from "@/components/MostRead";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Category, Media } from "@/payload-types";
import { getPostIds } from "@/utilities/get-post-ids";
import { BookOpen, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function generateMetadata() {
  return createMetadata({
    path: "/",
    title: "Technibus | Transporte coletivo e mobilidade urbana",
    description: "A mais tradicional revista brasileira dedicada ao transporte de passageiros por ônibus.",
  });
}

const REVISTAS = [
  { thumb: "/images/thumb-maiores-e-melhores.webp", url: "/", title: "", edition: "38º Edição", date: "Nov/2025" },
  { thumb: "/images/thumb-transporte-moderno.webp", url: "/", title: "", edition: "30º Edição", date: "Ago/2025" },
  { thumb: "/images/thumb-anuario-do-onibus.webp", url: "/", title: "", edition: "33º Edição", date: "Mai/2025" },
  { thumb: "/images/thumb-global.webp", url: "/", title: "", edition: "7º Edição", date: "Abr/2025" },
  { thumb: "/images/thumb-especial.webp", url: "/", title: "", edition: "1º Edição", date: "Nov/2024" },
];

export default async function Page() {
  const featuredPosts = await fetchPostsByTagSlug("destaque", 3);
  const secondaryFeaturedPosts = await fetchPostsByTagSlug("subdestaque", 2, getPostIds(featuredPosts));
  const technibusHistoryPosts = await fetchPostsByCategorySlug("technibus-na-historia", 1);
  const interviewAndOpinionPosts = await fetchPostsByCategorySlug("entrevista-e-opiniao", 1);
  const excludedPostIds = [...getPostIds(featuredPosts), ...getPostIds(secondaryFeaturedPosts), ...getPostIds(technibusHistoryPosts), ...getPostIds(interviewAndOpinionPosts)];
  const latestPosts = await fetchLatestPosts({ excludeIds: excludedPostIds });

  return (
    <main>
      <section className="relative z-0 min-w-0 pt-10 pb-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-9">
            <div className="space-y-3">
              <h2 className="subheading border-secondary text-brand-primary border-b pb-3">Destaques</h2>
              <div className="mb-8 grid gap-3 lg:grid-cols-12">
                <div className="min-w-0 lg:col-span-8">
                  <FeaturedPosts posts={featuredPosts} />
                </div>
                <div className="grid gap-3 max-lg:grid-cols-2 max-md:grid-cols-1 lg:col-span-4">
                  {secondaryFeaturedPosts.map((post) => (
                    <Card
                      key={post.id}
                      url={post.relPermalink}
                      categories={post.category as Category[]}
                      title={post.title}
                      description={post.excerpt}
                      image={post.image as Media}
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid items-start gap-x-3 gap-y-10 md:grid-cols-2">
              <div className="space-y-3">
                <h2 className="text-brand-primary border-secondary max-md:subheading border-b pb-3 text-xl font-medium">Technibus na história</h2>
                {technibusHistoryPosts.map((post) => (
                  <Card
                    key={post.id}
                    url={post.relPermalink}
                    categories={post.category as Category[]}
                    title={post.title}
                    description={post.excerpt}
                    image={post.image as Media}
                    size="lg"
                  />
                ))}
              </div>
              <div className="space-y-3">
                <h2 className="text-brand-primary border-secondary max-md:subheading border-b pb-3 text-xl font-medium">Entrevista & Opinião</h2>
                {interviewAndOpinionPosts.map((post) => (
                  <Card
                    key={post.id}
                    url={post.relPermalink}
                    categories={post.category as Category[]}
                    title={post.title}
                    description={post.excerpt}
                    image={post.image as Media}
                    size="lg"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-brand-primary border-secondary subheading border-b pb-3">Últimas publicações</h2>
              <div className="grid auto-rows-min gap-3 sm:grid-cols-2 md:grid-cols-3">
                {latestPosts.map((post) => (
                  <Card key={post.id} url={post.relPermalink} categories={post.category as Category[]} title={post.title} description={post.excerpt} size="sm" />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <MostRead />
          </div>
        </div>
      </section>

      <section className="bg-primary relative pt-24 max-md:pb-24">
        <div className="container flex flex-col gap-8 px-0">
          <div className="border-secondary relative mx-6 flex flex-wrap items-center gap-6 border-b pb-3">
            <h2 className="text-brand-primary subheading">Revistas mais recentes</h2>
            <Button className="max-md:hidden" size="sm" asChild>
              <Link href="https://acervodigitalotm.com.br/" target="_blank" rel="noopener">
                Ver todas edições
              </Link>
            </Button>
          </div>
          <ScrollArea className="max-w-full rounded-md pb-3">
            <div className="flex min-w-max grid-cols-5 gap-3 px-6 pb-5">
              {REVISTAS.map((magazine, index) => (
                <Link
                  key={index}
                  href={magazine.url}
                  className="group hover:bg-primary max-sm:bg-primary relative flex w-[80vw] min-w-0 flex-col gap-2 rounded-lg p-2 transition-all duration-300 hover:shadow-lg max-sm:shadow-lg sm:w-[220px]"
                >
                  <div className="relative">
                    <Image className="bg-tertiary-hover aspect-3/4 w-full rounded-sm object-cover" src={magazine.thumb} alt={magazine.title} width={858} height={977} />
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="text-secondary flex justify-between text-xs">
                      <p>{magazine.edition}</p>
                      <p>{magazine.date}</p>
                    </div>
                  </div>
                  <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100 max-sm:hidden">
                    <Button variant="subtle" size="sm" asChild>
                      <span>
                        <BookOpen />
                        Ler agora
                      </span>
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="text-center md:hidden">
            <Button asChild>
              <Link href="https://acervodigitalotm.com.br/" target="_blank" rel="noopener">
                Ver todas edições
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary max-md:bg-latbus-blue py-24 md:pt-12">
        <div className="container">
          <div className="text-on-brand-primary bg-latbus-blue grid items-center gap-x-10 rounded-xl md:p-16 lg:grid-cols-12">
            <div className="col-span-8 space-y-6">
              <Countdown className="justify-start" targetDate="2026-03-13T03:00:00.000Z" />
              <h2 className="heading">
                <span className="text-latbus-green">LAT.BUS 2026:</span> A maior feira de transporte público e de ônibus da América Latina
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-latbus-green size-6" />
                  <p>11, 12 e 13 de agosto de 2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-latbus-green size-6" />
                  <p>São Paulo Expo – Exhibition & Convention Center</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="neutral" className="bg-latbus-green text-primary">
                  <Link href="/">Saiba mais</Link>
                </Button>
                <Button variant="ghost">
                  <Link href="/">Lista de expositores</Link>
                </Button>
              </div>
            </div>
            <div className="col-span-4">
              <Image className="mx-auto" src="/logo-latbus.svg" alt="Lat.bus" width="266" height="368" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
