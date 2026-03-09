import { createMetadata } from "@/utilities/create-metadata";

import { fetchLatestPosts, fetchPostsByCategorySlug, fetchPostsByTagSlug } from "@/collections/Posts/data";
import { getPostIds } from "@/utilities/get-post-ids";

import { Card } from "@/components/Card";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import { SectionHeading, SectionHeadingActions, SectionHeadingTitle } from "@/components/TitleWithDivider";

import { Ads } from "@/components/Ads";
import { Button } from "@/components/Button";
import { LatbusMarquee } from "@/components/LatbusMarquee";
import { PostGrid } from "@/components/PostGrid";
import { Sidebar } from "@/components/Sidebar";
import { SectionLatestMagazines } from "@/sections/LatestMagazines";
import Image from "next/image";
import Link from "next/link";

export function generateMetadata() {
  return createMetadata({
    path: "/",
    title: "Technibus | Transporte coletivo e mobilidade urbana",
    description: "A mais tradicional revista brasileira dedicada ao transporte de passageiros por ônibus.",
  });
}

export default async function Page() {
  const featuredPosts = await fetchPostsByTagSlug("destaque", 3);
  const secondaryFeaturedPosts = await fetchPostsByTagSlug("subdestaque", 2, getPostIds(featuredPosts));
  const technibusHistoryPosts = await fetchPostsByCategorySlug("technibus-na-historia", 1);
  const interviewAndOpinionPosts = await fetchPostsByCategorySlug("entrevista-e-opiniao", 1);
  const latbusPosts = await fetchPostsByCategorySlug("latbus", 2);

  const latestPosts = await fetchLatestPosts({
    excludeIds: [
      ...getPostIds(featuredPosts),
      ...getPostIds(secondaryFeaturedPosts),
      ...getPostIds(technibusHistoryPosts),
      ...getPostIds(interviewAndOpinionPosts),
      ...getPostIds(latbusPosts),
    ],
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
                  <Image className="h-auto w-full rounded" src="/latbus-banner.svg" alt="" width={236} height={351} />
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
              <PostGrid className="lg:hidden" variant="2-cols">
                <Ads className="lg:hidden" variant="sidebarTopo" />
                <Ads className="max-md:hidden lg:hidden" variant="sidebarMeio" />
              </PostGrid>

              {/* Latest */}
              <div className="space-y-6">
                <SectionHeading>
                  <SectionHeadingTitle size="lg">Últimas publicações</SectionHeadingTitle>
                </SectionHeading>
                <PostGrid>
                  {latestPosts.map((post) => (
                    <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
                  ))}
                </PostGrid>
              </div>

              {/* Ads */}
              <PostGrid className="lg:hidden" variant="2-cols">
                <Ads className="lg:hidden" variant="sidebarMeio2" />
                <Ads className="max-md:hidden lg:hidden" variant="sidebarBase" />
              </PostGrid>

              {/* Specials */}
              <PostGrid variant="2-cols">
                <div className="space-y-6">
                  <SectionHeading>
                    <SectionHeadingTitle size="lg">Technibus na história</SectionHeadingTitle>
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
            <Sidebar />
          </div>
        </div>
      </section>

      <SectionLatestMagazines />
    </main>
  );
}
