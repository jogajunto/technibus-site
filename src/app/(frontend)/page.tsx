import { createMetadata } from "@/utilities/create-metadata";

import { fetchLatestPosts, fetchPostsByCategorySlug, fetchPostsByTagSlug } from "@/collections/Posts/data";
import { getPostIds } from "@/utilities/get-post-ids";

import { Card } from "@/components/Card";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import { SectionHeading, SectionHeadingTitle } from "@/components/TitleWithDivider";

import { PostGrid } from "@/components/PostGrid";
import { Sidebar } from "@/components/Sidebar";
import { SectionLatbus } from "@/sections/Latbus";
import { SectionLatestMagazines } from "@/sections/LatestMagazines";

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
  const latbusPosts = await fetchPostsByCategorySlug("latbus", 3);

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
            <div className="space-y-10">
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
              <PostGrid variant="2-cols">
                <div className="space-y-6">
                  <SectionHeading>
                    <SectionHeadingTitle>Technibus na história</SectionHeadingTitle>
                  </SectionHeading>
                  {technibusHistoryPosts.map((post) => (
                    <Card {...post} key={post.id} size="lg" />
                  ))}
                </div>
                <div className="space-y-6">
                  <SectionHeading>
                    <SectionHeadingTitle>Entrevista & Opinião</SectionHeadingTitle>
                  </SectionHeading>
                  {interviewAndOpinionPosts.map((post) => (
                    <Card {...post} key={post.id} size="lg" />
                  ))}
                </div>
              </PostGrid>
              <div className="space-y-6">
                <SectionHeading>
                  <SectionHeadingTitle>Últimas publicações</SectionHeadingTitle>
                </SectionHeading>
                <PostGrid>
                  {latestPosts.map((post) => (
                    <Card disable={{ excerpt: true }} {...post} key={post.id} size="sm" />
                  ))}
                </PostGrid>
              </div>
            </div>
            <Sidebar />
          </div>
        </div>
      </section>

      <SectionLatbus />
      <SectionLatestMagazines />
    </main>
  );
}
