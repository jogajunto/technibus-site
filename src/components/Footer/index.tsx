import Image from "next/image";
import Link from "next/link";

import { fetchAllCategories } from "@/collections/Categories/data";
import { Button } from "@/components/Button";
import { NewsletterDialogButton } from "@/providers/newsletter-dialog";
import { getCurrentYear } from "@/utilities/get-current-year";
import { ArrowUp } from "lucide-react";
import { LinkedIn } from "../SocialIcon";

const MENU_TECHNIBUS = [
  { label: "Anuncie", url: "https://drive.google.com/file/d/1wni4LYDSQLuVfAqOwpokSJ5em5j1swRI/view?usp=sharing" },
  { label: "Canal no WhatsApp", url: "https://whatsapp.com/channel/0029VatKJymGufIo6ZNsYt2H" },
  { label: "Fale com a redação", url: "mailto:otmeditora@otmeditora.com" },
  { label: "Revistas Technibus", url: "https://acervodigitalotm.com.br/todas-publicacoes?page=1&publication=Technibus" },
];

const MENU_SOCIAL = [
  { label: "Canal no WhatsApp", url: "https://whatsapp.com/channel/0029VatKJymGufIo6ZNsYt2H" },
  { label: "Facebook", url: "https://www.facebook.com/otmeditora" },
  { label: "Instagram (OTM Editora)", url: "https://www.instagram.com/otmeditora/" },
  { label: "Linkedin", url: "https://www.linkedin.com/in/otm-editora-a23367a5/" },
  { label: "Spotify (Podcast do Transporte)", url: "https://open.spotify.com/show/1C1TOcA6B2FrupnMNxCByu" },
  { label: "Youtube (OTM Editora)", url: "https://www.youtube.com/@otmeditora" },
];

const MENU_OTMEDITORA = [
  { label: "Acervo Digital OTM", url: "https://acervodigitalotm.com.br/" },
  { label: "Agência Transporte Moderno", url: "https://transportemoderno.com.br/" },
  { label: "Eventos", url: "https://otmeditora.com/eventos" },
  { label: "OTM Editora", url: "https://otmeditora.com/" },
  { label: "OTM Inteligência", url: "https://otminteligencia.com.br/" },
];

export async function Footer() {
  const categories = await fetchAllCategories();

  return (
    <footer>
      <div className="bg-secondary border-secondary border-y py-24">
        <div className="container grid gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="border-secondary border-b pb-2 font-semibold">CEO</h2>
              <p>
                Marcelo Fontana <br />
                <a className="link" href="mailto:marcelofontana@otmeditora.com">
                  marcelofontana@otmeditora.com
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="border-secondary border-b pb-2 font-semibold">Editora</h2>
              <p>
                Márcia Pinna Raspanti <br />
                <a className="link" href="mailto:marciapinna@otmeditora.com">
                  marciapinna@otmeditora.com
                </a>
                <a className="link flex items-center gap-0.5" href="https://www.linkedin.com/in/márcia-pinna-raspanti-4a929720/" target="_blank" rel="noopener">
                  <LinkedIn className="size-4 translate-y-0.5" />
                  <span>/marcia-pinna</span>
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="border-secondary border-b pb-2 font-semibold">Repórter</h2>
              <p>
                Alexandre Asquini <br />
                <a className="link" href="mailto:alexandreasquini@otmeditora.com">
                  alexandreasquini@otmeditora.com
                </a>{" "}
                <br />
                <a className="link flex items-center gap-0.5" href="https://www.linkedin.com/in/alexandre-asquini-b1b387140/" target="_blank" rel="noopener">
                  <LinkedIn className="size-4 translate-y-0.5" />
                  <span>/alexandre-asquini</span>
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="border-secondary border-b pb-2 font-semibold">Executivo de contas</h2>
              <p>
                Tânia Nascimento <br />
                <a className="link" href="mailto:tanianascimento@otmeditora.com">
                  tanianascimento@otmeditora.com
                </a>
              </p>
              <p>
                Raul Urrutia <br />
                <a className="link" href="mailto:raulurrutia@otmeditora.com">
                  raulurrutia@otmeditora.com
                </a>
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="border-secondary border-b pb-2 font-semibold">Financeiro</h2>
              <p>
                Vidal Rodrigues <br />
                <a className="link" href="mailto:vidalrodrigues@otmeditora.com">
                  vidalrodrigues@otmeditora.com
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="border-secondary border-b pb-2 font-semibold">Eventos corporativos / Marketing</h2>
              <p>
                Barbara Chelen <br />
                <a className="link" href="mailto:barbaraghelen@otmeditora.com">
                  barbaraghelen@otmeditora.com
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="border-secondary border-b pb-2 font-semibold">Publicidade</h2>
              <p>
                Karoline Jones <br />
                <a className="link" href="mailto:karolinejones@otmeditora.com">
                  karolinejones@otmeditora.com
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="border-secondary border-b pb-2 font-semibold">Representante região Sul (PR/RS/SC)</h2>
              <p>
                Gilberto A. Paulin <br />
                <a className="link" href="tel:+554130290563">
                  +55 (41) 3029-0563
                </a>
              </p>
              <p>
                João Batista A. Silva <br />
                <a className="link" href="mailto:joaobatistaasilva@gmail.com">
                  joaobatistaasilva@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <Image src="/logo-otm-editora-positive.svg" alt="OTM Editora" width={113} height={68} />
            <div className="space-y-3">
              <h2 className="font-semibold">Redação, Administração, Publicidade e Correspondência:</h2>
              <p>Av. Vereador José Diniz, 3300, 7° andar, cj. 707, Campo Belo. CEP 04604-006 – São Paulo / SP</p>
              <p>
                <a className="link" href="tel:+551150968104">
                  +55 (11) 5096-8104
                </a>
                <br />
                <a className="link" href="mailto:redacao@otmeditora.com">
                  redacao@otmeditora.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary text-primary py-12" data-theme="dark">
        <div className="container space-y-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h2 className="border-primary text-primary border-b pb-3 font-semibold">Editorias</h2>
              <ul className="-ml-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Button variant="ghost" asChild>
                      <Link href={category.relPermalink} rel="noopener" target="_blank">
                        {category.title}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-1 space-y-4">
              <h2 className="border-primary text-primary border-b pb-3 font-semibold">Technibus</h2>
              <ul className="-ml-3">
                <li>
                  <NewsletterDialogButton variant="ghost">Newsletter</NewsletterDialogButton>
                </li>
                {MENU_TECHNIBUS.map((item) => (
                  <li key={item.label}>
                    <Button variant="ghost" asChild>
                      <Link href={item.url} rel="noopener" target="_blank">
                        {item.label}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-1 space-y-4">
              <h2 className="border-primary text-primary border-b pb-3 font-semibold">OTM Editora</h2>
              <ul className="-ml-3">
                {MENU_OTMEDITORA.map((item) => (
                  <li key={item.label}>
                    <Button variant="ghost" asChild>
                      <Link href={item.url} rel="noopener" target="_blank">
                        {item.label}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-1 space-y-4">
              <h2 className="border-primary text-primary border-b pb-3 font-semibold">Redes sociais</h2>
              <ul className="-ml-3">
                {MENU_SOCIAL.map((item) => (
                  <li key={item.label}>
                    <Button variant="ghost" asChild>
                      <Link href={item.url} rel="noopener" target="_blank">
                        {item.label}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="text-secondary text-sm text-balance">
              @{getCurrentYear()} OTM Editora. Todos os direitos reservados. <br />É proibida a reprodução do conteúdo desta página em qualquer meio de comunicação, eletrônico ou
              impresso, sem autorização escrita da OTM Editora.
            </p>
          </div>
        </div>
      </div>

      <Button className="back-to-top" asChild>
        <a href="#topo">
          Voltar ao topo
          <ArrowUp className="size-4" />
        </a>
      </Button>
    </footer>
  );
}
