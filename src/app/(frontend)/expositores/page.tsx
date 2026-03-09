import { fetchAllLatBusCategories } from "@/collections/LatBusCategories/data";
import { fetchExibithorsSearch } from "@/collections/LatBusExibithors/data";
import { FilterExibithors } from "@/components/FilterExibithors";
import { createMetadata } from "@/utilities/create-metadata";
import Image from "next/image";

type PageArgs = {
  searchParams: Promise<{
    s?: string;
    categoria?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageArgs) {
  const { s } = await searchParams;

  return createMetadata({
    path: `/expositores`,
    title: `Expositores: "${s || "Todos os expositores"}"`,
    description: `Resultados de busca para ${s || "Todos os expositores"}.`,
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

  // 4. Buscando os dados dos expositores
  const { docs: exibithors } = await fetchExibithorsSearch(where);

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-12">
      <div className="container mx-auto max-w-[1400px] px-4">
        <h1 className="mb-8 text-3xl font-semibold text-[#0a1e3f] md:text-4xl">Lista de expositores da Lat.bus 2026</h1>

        <FilterExibithors categories={categories} initialCategory={categoria} initialSearch={searchTerm} />

        {exibithors.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <p className="text-lg text-gray-500">Nenhum expositor encontrado com os filtros atuais.</p>
            <a href="/expositores" className="mt-4 inline-block text-blue-600 hover:underline">
              Limpar filtros
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {exibithors.map((exibithor) => {
              const firstCategory = exibithor.category?.[0];
              const categoryTitle = typeof firstCategory === "object" && firstCategory !== null ? firstCategory.title : "Sem Categoria";

              return (
                <div key={exibithor.id} className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
                  {/* Área do Logo */}
                  <div className="mb-6 flex h-32 items-center justify-center rounded-lg bg-[#f8f9fa] p-4">
                    {exibithor.logo && typeof exibithor.logo === "object" && exibithor.logo.url ? (
                      <Image src={exibithor.logo.url} alt={exibithor.title} width={180} height={80} className="max-h-full object-contain" />
                    ) : (
                      <span className="text-xl font-bold text-[#0a1e3f]">{exibithor.title}</span>
                    )}
                  </div>

                  {/* Informações Principais */}
                  <div className="flex-1">
                    <span className="mb-2 block text-xs font-semibold tracking-wider text-gray-400 uppercase">{categoryTitle}</span>
                    <h2 className="mb-3 line-clamp-1 text-lg font-bold text-[#0a1e3f]">{exibithor.title}</h2>
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">{exibithor.description}</p>

                    {exibithor.website && (
                      <a href={exibithor.website} target="_blank" rel="noopener noreferrer" className="mb-6 block truncate text-sm text-blue-600 hover:underline">
                        {exibithor.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>

                  {/* Rodapé do Card: Contatos */}
                  <div className="mt-auto space-y-2 border-t border-gray-50 pt-4">
                    {exibithor.contact?.name && <p className="truncate text-sm font-semibold text-gray-800">{exibithor.contact.name}</p>}

                    {exibithor.contact?.whatsapp && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="mr-2 h-4 w-4 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        {exibithor.contact.whatsapp}
                      </div>
                    )}

                    {exibithor.contact?.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="mr-2 h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <a href={`mailto:${exibithor.contact.email}`} className="truncate hover:text-blue-600">
                          {exibithor.contact.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
