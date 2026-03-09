import { fetchAllLatBusCategories } from "@/collections/LatBusCategories/data";
import { fetchExibithors } from "@/collections/LatBusExibithors/data";
import { Button } from "@/components/Button";
import { FilterExibithors } from "@/components/FilterExibithors";
import { PayloadImage } from "@/components/Payload/Image";
import { WhatsApp } from "@/components/SocialIcon";

import { SectionHeading, SectionHeadingTitle } from "@/components/TitleWithDivider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LatBusCategory, Media } from "@/payload-types";
import { createMetadata } from "@/utilities/create-metadata";
import { Mail } from "lucide-react";

type PageArgs = {
  searchParams: Promise<{
    s?: string;
    categoria?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageArgs) {
  const { s } = await searchParams;

  return createMetadata({
    path: "/guia-de-expositores-lat-bus-2026",
    title: "Guia dos expositores Lat.Bus 2026",
    description:
      "Explore o Guia dos Expositores da Lat.Bus 2026 e descubra as empresas e marcas que estarão presentes no evento. Encontre informações sobre os expositores, suas ofertas e como entrar em contato.",
  });
}

export default async function Exibithors({ searchParams }: PageArgs) {
  const { s: searchTerm, categoria } = await searchParams;

  const categories = await fetchAllLatBusCategories();

  const query: any = { and: [] };

  if (searchTerm) {
    query.and.push({
      or: [{ title: { like: searchTerm } }, { description: { like: searchTerm } }],
    });
  }

  if (categoria) {
    const selectedCategory = categories.find((c: any) => c.title === categoria);
    if (selectedCategory) {
      query.and.push({ category: { in: [selectedCategory.id] } });
    }
  }

  const where = query.and.length > 0 ? query : undefined;

  const exibithors = await fetchExibithors(where);

  return (
    <main className="pt-4 pb-24">
      <div className="container">
        <div className="space-y-6">
          <SectionHeading>
            <SectionHeadingTitle size="lg" asChild>
              <h1>Guia dos expositores Lat.Bus 2026</h1>
            </SectionHeadingTitle>
          </SectionHeading>

          <FilterExibithors categories={categories as LatBusCategory[]} initialCategory={categoria} initialSearch={searchTerm} />
        </div>

        {exibithors.length === 0 ? (
          <div className="mx-auto max-w-2xl space-y-3 p-12 text-center">
            <p className="subheading text-brand-primary text-2xl">Nenhum expositor encontrado</p>
            <p className="text-secondary">
              Não encontramos algo que corresponda aos seus critérios de busca. <br />
              Tente ajustar os filtros ou a palavra-chave para encontrar o que procura.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {exibithors.map((exibithor) => {
              const firstCategory = exibithor.category?.[0];
              const categoryTitle = typeof firstCategory === "object" && firstCategory !== null ? firstCategory.title : "Sem Categoria";

              return (
                <div key={exibithor.id} className="flex h-full flex-col gap-4 rounded-xl">
                  <div className="bg-secondary flex items-center justify-center rounded-lg p-6">
                    {exibithor.logo ? (
                      <PayloadImage image={exibithor.logo as Media} alt={exibithor.title} disableCaption className="aspect-[4/3] object-contain p-[15%]" />
                    ) : (
                      <span className="grid aspect-[4/3] size-full place-items-center text-center text-lg font-semibold text-balance text-[#0a1e3f]">{exibithor.title}</span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <span className="uppertitle">{categoryTitle}</span>
                    <h2 className="text-brand-primary mb-2 line-clamp-2 text-lg font-semibold">{exibithor.title}</h2>

                    {exibithor.website && (
                      <a href={exibithor.website} target="_blank" rel="noopener noreferrer" className="link block truncate text-sm">
                        {exibithor.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="primary" className="w-full">
                        Ver detalhes <span className="sr-only">sobre {exibithor.title}</span>
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-[640px]">
                      <DialogHeader className="space-y-4">
                        <div className="bg-secondary flex max-w-32 items-center justify-center rounded-lg p-6">
                          {exibithor.logo ? (
                            <PayloadImage image={exibithor.logo as Media} alt={exibithor.title} disableCaption className="aspect-[4/3] max-h-52 object-contain" />
                          ) : (
                            <span className="grid aspect-[4/3] w-full place-items-center text-center text-base font-semibold text-balance text-[#0a1e3f]">{exibithor.title}</span>
                          )}
                        </div>
                        <DialogTitle className="text-brand-primary text-xl">{exibithor.title}</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="uppertitle">{categoryTitle}</p>

                          {exibithor.description && <p className="text-sm leading-relaxed text-gray-600">{exibithor.description}</p>}

                          {exibithor.website && (
                            <a href={exibithor.website} target="_blank" rel="noopener noreferrer" className="link block text-sm">
                              {exibithor.website}
                            </a>
                          )}
                        </div>

                        <div className="border-secondary space-y-3 border-t pt-4">
                          {exibithor.contact?.name && <p className="text-primary text-sm font-semibold">{exibithor.contact.name} (Contato comercial)</p>}
                          {exibithor.contact?.whatsapp && (
                            <div className="link flex items-center gap-2 text-sm">
                              <WhatsApp className="size-4" />
                              <span>{exibithor.contact.whatsapp}</span>
                            </div>
                          )}

                          {exibithor.contact?.email && (
                            <div className="link flex items-center gap-2 text-sm">
                              <Mail className="size-4" />
                              <a href={`mailto:${exibithor.contact.email}`} className="truncate hover:text-blue-600">
                                {exibithor.contact.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
