import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { fetchLatestPosts, fetchPostsByCategorySlug, fetchPostsByTagSlug } from "@/collections/Posts/data";
import { createMetadata } from "@/utilities/create-metadata";
import { getPostIds } from "@/utilities/get-post-ids";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import { LatbusMarquee } from "@/components/LatbusMarquee";
import { PostGrid } from "@/components/PostGrid";
import { Sidebar } from "@/components/Sidebar";
import { SectionHeading, SectionHeadingActions, SectionHeadingTitle } from "@/components/TitleWithDivider";
import { SectionLatestMagazines } from "@/sections/LatestMagazines";

export const revalidate = 60;

export function generateMetadata() {
  return createMetadata({
    path: "/",
    title: "Technibus | Transporte coletivo e mobilidade urbana",
    description: "A mais tradicional revista brasileira dedicada ao transporte de passageiros por ônibus.",
  });
}

// ----------------------------------------------------------------------
// SKELETON LOADERS
// ----------------------------------------------------------------------
function SkeletonSidebar() {
  return <div className="h-[800px] w-full animate-pulse rounded-lg bg-neutral-200"></div>;
}

function SkeletonMagazines() {
  return <div className="mt-12 h-[400px] w-full animate-pulse bg-neutral-200"></div>;
}

// ----------------------------------------------------------------------
// PÁGINA PRINCIPAL
// ----------------------------------------------------------------------

export default async function Page() {
  // 1. Buscamos os destaques principais (Precisamos deles primeiro para os subdestaques)
  const featuredPosts = await fetchPostsByTagSlug("destaque", 3);
  const featuredIds = getPostIds(featuredPosts);

  // 2. Buscamos todas as outras seções ESPECÍFICAS paralelamente (Máxima Performance)
  const [secondaryFeaturedPosts, technibusHistoryPosts, interviewAndOpinionPosts, latbusPosts] = await Promise.all([
    fetchPostsByTagSlug("subdestaque", 2, featuredIds),
    fetchPostsByCategorySlug("technibus-na-historia", 1),
    fetchPostsByCategorySlug("entrevista-e-opiniao", 1),
    fetchPostsByCategorySlug("latbus", 2),
  ]);

  // 3. Juntamos TODOS os IDs das seções acima em uma única lista
  const allUsedIds = [
    ...featuredIds,
    ...getPostIds(secondaryFeaturedPosts),
    ...getPostIds(technibusHistoryPosts),
    ...getPostIds(interviewAndOpinionPosts),
    ...getPostIds(latbusPosts),
  ];

  // 4. Buscamos as Últimas Notícias EXCLUINDO os IDs já utilizados
  const latestPosts = await fetchLatestPosts({
    excludeIds: allUsedIds,
    limit: 6, // Adicionei um limite para não puxar o banco inteiro
  });

  return (
    <main>
      <section className="relative z-0 min-w-0 pt-4 pb-24">
        <h1 className="sr-only">A mais tradicional revista brasileira dedicada ao transporte de passageiros por ônibus.</h1>
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="flex min-w-0 flex-col gap-10">
              {/* Featured */}
              <div className="space-y-3">
                <PostGrid variant="none" className="lg:grid-cols-12">
                  <div className="min-w-0 lg:col-span-8">
                    <FeaturedPosts posts={featuredPosts} />
                  </div>
                  <div className="grid auto-rows-min gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 lg:col-span-4">
                    {secondaryFeaturedPosts.map((post) => (
                      <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
                    ))}
                  </div>
                </PostGrid>
              </div>

              {/* Lat.Bus */}
              <div className="bg-brand-tertiary min-w-0 space-y-6 rounded-xl p-6 md:p-8">
                <SectionHeading className="border-brand-tertiary">
                  <SectionHeadingTitle size="lg">Lat.Bus</SectionHeadingTitle>
                  <SectionHeadingActions>
                    <Button size="sm" asChild>
                      <Link href="/editoria/latbus">Ver todas publicações</Link>
                    </Button>
                  </SectionHeadingActions>
                </SectionHeading>
                <PostGrid variant="3-cols">
                  <Image className="h-auto w-full rounded max-md:row-span-2 md:row-span-2" src="/latbus-banner.svg" alt="" width={236} height={351} />
                  {latbusPosts.map((post) => (
                    <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
                  ))}
                </PostGrid>
                <div className="bg-primary flex flex-col items-center gap-2 overflow-hidden rounded-lg pt-8 pb-2 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-4 px-6">
                    <h3 className="text-xl font-semibold">Guia dos expositores Lat.Bus 2026</h3>
                    <Button className="shrink-0" size="sm" variant="secondary" asChild>
                      <Link href="/guia-de-expositores-lat-bus-2026">Ver todos expositores</Link>
                    </Button>
                  </div>
                  <LatbusMarquee />
                </div>
              </div>

              {/* Ads */}
              {/* <PostGrid className="lg:hidden" variant="2-cols">
                <Ads className="lg:hidden" variant="sidebarTopo" />
                <Ads className="max-md:hidden lg:hidden" variant="sidebarMeio" />
              </PostGrid> */}

              {/* Latest */}
              <div className="space-y-6">
                <SectionHeading>
                  <SectionHeadingTitle size="lg">Últimas notícias</SectionHeadingTitle>
                </SectionHeading>
                <PostGrid>
                  {latestPosts.map((post) => (
                    <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
                  ))}
                </PostGrid>
              </div>

              {/* Ads */}
              {/* <PostGrid className="lg:hidden" variant="2-cols">
                <Ads className="lg:hidden" variant="sidebarMeio2" />
                <Ads className="max-md:hidden lg:hidden" variant="sidebarBase" />
              </PostGrid> */}

              {/* Specials */}
              <PostGrid variant="2-cols">
                <div className="space-y-6">
                  <SectionHeading>
                    <SectionHeadingTitle size="lg">Technibus na História</SectionHeadingTitle>
                  </SectionHeading>
                  {technibusHistoryPosts.map((post) => (
                    <Card {...post} key={post.id} size="lg" />
                  ))}
                </div>
                <div className="space-y-6">
                  <SectionHeading>
                    <SectionHeadingTitle size="lg">Entrevista & Opinião</SectionHeadingTitle>
                  </SectionHeading>
                  {interviewAndOpinionPosts.map((post) => (
                    <Card {...post} key={post.id} size="lg" />
                  ))}
                </div>
              </PostGrid>
            </div>

            {/* Mantemos o Suspense apenas na Sidebar, pois ela roda de forma isolada! */}
            <Suspense fallback={<SkeletonSidebar />}>
              <Sidebar />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Mantemos o Suspense nas Revistas! */}
      <Suspense fallback={<SkeletonMagazines />}>
        <SectionLatestMagazines />
      </Suspense>
    </main>
  );
}
