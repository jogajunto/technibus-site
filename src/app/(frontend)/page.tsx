import { createMetadata } from "@/utilities/create-metadata";

import { fetchLatestPostsWithoutFeatureds, fetchPostsByCategorySlug, fetchPostsByTagSlug } from "@/collections/Posts/data";
import { Card } from "@/components/Card";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import MostRead from "@/components/MostRead";
import { Category, Media } from "@/payload-types";

export function generateMetadata() {
  return createMetadata({
    path: "/",
    title: "Technibus | Transporte coletivo e mobilidade urbana",
    description: "A mais tradicional revista brasileira dedicada ao transporte de passageiros por ônibus.",
  });
}

export default async function Page() {
  const destaques = await fetchPostsByTagSlug("destaque", 3);
  const destaquesIds = destaques.map((post) => post.id);

  const subdestaques = await fetchPostsByTagSlug("subdestaque", 2, destaquesIds);
  const subdestaquesIds = destaques.map((post) => post.id);

  const technibusNaHistoria = await fetchPostsByCategorySlug("technibus-na-historia", 1);
  const entrevistaOpniao = await fetchPostsByCategorySlug("entrevista-e-opiniao", 1);

  const excludeIds = [...destaquesIds, ...subdestaquesIds, ...technibusNaHistoria.map((post) => post.id), ...entrevistaOpniao.map((post) => post.id)];

  const latests = await fetchLatestPostsWithoutFeatureds(excludeIds);

  return (
    <main>
      <section className="relative z-0 pt-10 pb-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="col-span-9 space-y-10">
            <div className="space-y-3">
              <h2 className="subheading border-secondary text-brand-primary border-b pb-3">Destaques</h2>
              <div className="mb-8 grid gap-3 lg:grid-cols-12">
                <div className="col-span-8">
                  <FeaturedPosts posts={destaques} />
                </div>
                <div className="col-span-4 grid gap-3">
                  {subdestaques.map((post) => (
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

            <div className="grid grid-cols-2 items-start gap-x-3">
              <div className="space-y-3">
                <h2 className="text-brand-primary border-secondary border-b pt-3 pb-3 text-xl font-medium">Technibus na história</h2>
                {technibusNaHistoria.map((post) => (
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
                <h2 className="text-brand-primary border-secondary border-b pt-3 pb-3 text-xl font-medium">Entrevista & Opinião</h2>
                {entrevistaOpniao.map((post) => (
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
              <h2 className="text-brand-primary border-secondary border-b pt-3 pb-3 text-xl font-medium">Últimas publicações</h2>
              <div className="grid auto-rows-min gap-3 md:grid-cols-3">
                {latests.docs.map((post) => (
                  <Card key={post.id} url={post.relPermalink} categories={post.category as Category[]} title={post.title} description={post.excerpt} size="sm" />
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <MostRead />
          </div>
        </div>
      </section>

      <section className="bg-secondary py-24">
        <div className="container">
          <h2 className="text-primary border-secondary mb-8 border-b pb-3 text-4xl font-medium">Lat.Bus - Feira Latinoamericana do Transporte</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore cum totam suscipit, culpa et minus magni quibusdam eaque accusantium officiis!</p>
        </div>
      </section>
    </main>
  );
}
