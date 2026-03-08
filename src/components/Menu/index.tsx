"use client";

import Link from "next/link";
import { RefObject, useEffect, useRef, useState } from "react";

import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";

import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";

import { Button } from "@/components/Button";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Category } from "@/payload-types";
import { NewsletterDialogButton } from "@/providers/newsletter-dialog";
import Image from "next/image";
import { SearchForm } from "../SearchForm";

type MenuProps = {
  categories: Category[];
};

export function Menu({ categories }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function openButton() {
    setIsOpen(!isOpen);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  useFocusTrap(menuRef as RefObject<HTMLElement>, isOpen);

  useEscapeKey(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1028) {
        setIsOpen(false);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`bg-brand-primary z-30 mb-10 w-full py-4 ${isOpen ? "border-secondary overflow-auto border-b" : "h-auto"}`} ref={menuRef}>
      <Button className="skip-to-main" asChild>
        <Link href="#main">Pular para o conteúdo</Link>
      </Button>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/">
            <span className="sr-only">Página inicial</span>
            <Image className="h-14 w-auto" src="/logo-technibus-negative.svg" width={377} height={190} alt="Technibus 35 Anos" />
          </Link>
          <div className="flex items-center justify-center lg:hidden" data-theme="dark">
            <Button variant="ghost" size="icon" onClick={openButton}>
              <span className="sr-only">Abrir/fechar menu</span>
              {isOpen ? <X className="size-6" /> : <MenuIcon className="size-6" />}
            </Button>
          </div>
          <nav className={`basis-full lg:basis-auto lg:py-0 ${isOpen ? "pt-6 pb-6" : ""}`}>
            {/* Desktop */}
            <div className={`items-center gap-3 max-lg:hidden ${isOpen ? "block" : "flex"}`}>
              <ul className="flex items-center" data-theme="dark">
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="relative z-10" variant="ghost">
                        Editorias
                        <ChevronDown className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-lg:relative" align="start">
                      {categories.map((service, idx) => (
                        <DropdownMenuItem key={`${service.title}-${idx}`} asChild>
                          <Link href={service.relPermalink!}>{service.title}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
                <li>
                  <Button variant="ghost" onClick={closeMenu} asChild>
                    <Link href="/editoria/latbus">Lat.Bus</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={closeMenu} asChild>
                    <Link href="https://acervodigitalotm.com.br/" target="_blank" rel="noopener">
                      Revistas
                    </Link>
                  </Button>
                </li>
                <li>
                  <NewsletterDialogButton variant="ghost" onClick={closeMenu}>
                    Newsletter
                  </NewsletterDialogButton>
                </li>
                <li>
                  <Button variant="ghost" onClick={closeMenu} asChild>
                    <Link href="https://whatsapp.com/channel/0029VatKJymGufIo6ZNsYt2H" target="_blank" rel="noopener">
                      Canal no Whatsapp
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={closeMenu} asChild>
                    <Link href="https://otmeditora.com/publicidade/technibus" target="_blank" rel="noopener">
                      Anuncie
                    </Link>
                  </Button>
                </li>
              </ul>
              <SearchForm />
            </div>

            {/* Mobile */}
            <div className={`items-center lg:hidden ${isOpen ? "block" : "hidden"}`}>
              <SearchForm />
              <ul className="mt-3" data-theme="dark">
                <li>
                  <Button variant="ghost" asChild>
                    <span>Editorias</span>
                  </Button>
                  <ul>
                    {categories.map((service, idx) => (
                      <li className="pl-4" key={service.id}>
                        <Button variant="ghost" key={`${service.title}-${idx}`} asChild>
                          <Link href={service.relPermalink!}>{service.title}</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <Button variant="ghost" onClick={closeMenu} asChild>
                    <Link href="/editoria/latbus">Lat.Bus</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={closeMenu} asChild>
                    <Link href="https://acervodigitalotm.com.br/" target="_blank" rel="noopener">
                      Revistas
                    </Link>
                  </Button>
                </li>
                <li>
                  <NewsletterDialogButton variant="ghost" onClick={closeMenu} asChild>
                    Newsletter
                  </NewsletterDialogButton>
                </li>
                <li>
                  <Button variant="ghost" onClick={closeMenu} asChild>
                    <Link href="https://whatsapp.com/channel/0029VatKJymGufIo6ZNsYt2H" target="_blank" rel="noopener">
                      Canal no Whatsapp
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={closeMenu} asChild>
                    <Link href="https://otmeditora.com/publicidade/technibus" target="_blank" rel="noopener">
                      Anuncie
                    </Link>
                  </Button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
