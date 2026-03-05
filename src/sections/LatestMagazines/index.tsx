import Image from "next/image";
import Link from "next/link";

import { BookOpen } from "lucide-react";

import { Button } from "@/components/Button";
import { SectionHeading, SectionHeadingActions, SectionHeadingTitle } from "@/components/TitleWithDivider";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const REVISTAS = [
  { thumb: "/images/thumb-maiores-e-melhores.webp", url: "/", title: "", edition: "38º Edição", date: "Nov/2025" },
  { thumb: "/images/thumb-transporte-moderno.webp", url: "/", title: "", edition: "30º Edição", date: "Ago/2025" },
  { thumb: "/images/thumb-anuario-do-onibus.webp", url: "/", title: "", edition: "33º Edição", date: "Mai/2025" },
  { thumb: "/images/thumb-global.webp", url: "/", title: "", edition: "7º Edição", date: "Abr/2025" },
  { thumb: "/images/thumb-especial.webp", url: "/", title: "", edition: "1º Edição", date: "Nov/2024" },
];

export function SectionLatestMagazines() {
  return (
    <section className="bg-primary relative py-24 max-md:pb-16">
      <div className="container flex flex-col gap-8 px-0">
        <SectionHeading className="mx-6">
          <SectionHeadingTitle size="lg">Revistas mais recentes</SectionHeadingTitle>
          <SectionHeadingActions>
            <Button size="sm" asChild>
              <Link href="https://acervodigitalotm.com.br/" target="_blank" rel="noopener">
                Ver todas edições
              </Link>
            </Button>
          </SectionHeadingActions>
        </SectionHeading>
        <ScrollArea className="max-w-full rounded-md pb-3">
          <div className="flex min-w-max grid-cols-5 gap-6 px-6 pb-5">
            {REVISTAS.map((magazine, index) => (
              <Link
                key={index}
                href={magazine.url}
                className="group hover:bg-primary max-sm:bg-primary relative flex w-[80vw] min-w-0 flex-col gap-2 rounded-lg p-2 transition-all duration-300 hover:shadow-lg max-sm:shadow-lg sm:w-[226px]"
              >
                <div className="relative">
                  <Image className="bg-tertiary-hover aspect-3/4 w-full rounded-sm object-cover" src={magazine.thumb} alt={magazine.title} width={858} height={977} />
                </div>
                <div className="flex flex-1 flex-col gap-6">
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
  );
}
