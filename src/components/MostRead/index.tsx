import { fetchPostBySlug } from "@/collections/Posts/data";
import { Card } from "../Card";
import { SectionHeading, SectionHeadingTitle } from "../TitleWithDivider";

export async function MostRead() {
  const post01 = await fetchPostBySlug("o-historico-teste-do-primeiro-double-decker-brasileiro");
  const post02 = await fetchPostBySlug("camara-aprova-regime-de-urgencia-para-votar-marco-legal-do-transporte-publico");
  const post03 = await fetchPostBySlug("mercedes-benz-comercializa-50-chassis-of-1519-r-para-fretamento-rural");
  const post04 = await fetchPostBySlug("operacao-da-antt-em-mg-retira-26-veiculos-clandestinos-de-circulacao");
  const post05 = await fetchPostBySlug("consorcio-nova-via-mobilidade-e-habilitado-para-substituir-supervia-no-rio-de-janeiro");

  const posts = [post01, post02, post03, post04, post05];

  return (
    <div className="space-y-8">
      <SectionHeading>
        <SectionHeadingTitle>Mais lidos</SectionHeadingTitle>
      </SectionHeading>
      <ol className="space-y-2">
        {posts.map((post, index) => (
          <div className="flex gap-2" key={index}>
            <span className="translate-y-0.5 pt-5 font-semibold">{index + 1}.</span>
            <Card {...post} disable={{ image: true, excerpt: true }} key={post.id} size="sm" />
          </div>
        ))}
      </ol>
    </div>
  );
}
