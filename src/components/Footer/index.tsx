import Link from "next/link";

// import { fetchSocials } from "@/globals/Social/data";

import { fetchAllCategories } from "@/collections/Categories/data";
import { Button } from "@/components/Button";

const OTMEDITORA_MENU = [
  { title: "OTM Editora", relPermalink: "/" },
  { title: "OTM Inteligência", relPermalink: "/" },
  { title: "OTM Acervo Digital", relPermalink: "/" },
  { title: "Transporte Moderno", relPermalink: "/" },
  { title: "Contato", relPermalink: "/" },
];

export async function Footer() {
  const categories = await fetchAllCategories();

  return (
    <footer className="bg-primary text-primary py-12" data-theme="dark">
      <div className="container grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-3">
          <h2 className="border-primary text-primary border-b pb-3 font-semibold">Editorias</h2>
          <ul className="-ml-3 columns-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Button variant="ghost">
                  <Link href={category.relPermalink}>{category.title}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-1 space-y-4">
          <h2 className="border-primary text-primary border-b pb-3 font-semibold">OTM Editora</h2>
          <ul className="-ml-3">
            {OTMEDITORA_MENU.map((category) => (
              <li key={category.title}>
                <Button variant="ghost">
                  <Link href={category.relPermalink}>{category.title}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
