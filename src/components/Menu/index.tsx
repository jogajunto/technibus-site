"use client";

import { RefObject, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { MenuIcon, Search, X } from "lucide-react";

import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Category } from "@/payload-types";
import { Button } from "../Button";
import { Input } from "../ui/input";

type MenuProps = {
  categories: Category[];
};

export function Menu({ categories }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((v) => !v);

  useFocusTrap(menuRef as RefObject<HTMLElement>, isOpen);
  useEscapeKey(() => setIsOpen(false));

  return (
    <div className={`left-0 z-10 w-full backdrop-blur-xl ${isOpen ? "border-primary border-b pb-4" : "h-auto"}`} ref={menuRef}>
      <div className="container h-full max-lg:py-4">
        <div className="border-secondary hidden items-center justify-between border-b px-4 py-6 lg:flex">
          <div className="flex items-center gap-6">
            <Link className="block rounded" href="/">
              <Image className="h-14 w-auto" src="/logo.svg" width={377} height={190} alt="Technibus 35 Anos" />
              <span className="sr-only">Página inicial</span>
            </Link>
            <p className="text-secondary max-w-[38ch] text-sm">
              A <strong className="text-primary font-semibold">mais tradicional</strong> revista brasileira dedicada ao transporte de passageiros por ônibus.{" "}
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary">Assine gratuitamente</Button>
          </div>
        </div>

        <div className="flex w-full items-center justify-between max-lg:flex-wrap lg:justify-center">
          <div className="flex items-center justify-start gap-4 lg:hidden">
            <Link className="block rounded" href="/">
              <Image className="h-14 w-auto" src="/logo.svg" width={377} height={190} alt="Technibus 35 Anos" />
              <span className="sr-only">Página inicial</span>
            </Link>
            <p className="text-secondary max-w-[38ch] text-sm max-sm:max-w-[28ch] max-sm:text-xs">
              A <strong className="text-primary font-semibold">mais tradicional</strong> revista brasileira dedicada ao transporte de passageiros por ônibus.{" "}
            </p>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center justify-center lg:hidden">
            <Button variant="ghost" size="icon" onClick={toggleOpen} aria-expanded={isOpen} aria-controls="main-navigation" aria-label={isOpen ? "Fechar menu" : "Abrir menu"}>
              {isOpen ? <X className="size-6" /> : <MenuIcon className="size-6" />}
            </Button>
          </div>

          <div className="flex items-center gap-4 max-lg:basis-full max-lg:flex-wrap">
            <nav id="main-navigation" className={`basis-full items-center lg:basis-auto lg:justify-center lg:py-0 ${isOpen ? "pt-10" : ""}`}>
              {/* Desktop Menu */}
              <ul className="hidden max-w-3xl justify-center pt-6 lg:flex lg:flex-wrap lg:items-center">
                <li>
                  <div className="relative">
                    <Input placeholder="Pesquisar" />
                    <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                  </div>
                </li>
                {categories.map((category) => (
                  <li key={category.id} className="mb-2 lg:mb-0">
                    <Button className="max-lg:w-full max-lg:justify-start" size="lg" variant="ghost" asChild>
                      <Link href={category.relPermalink}>{category.title}</Link>
                    </Button>
                  </li>
                ))}
              </ul>

              {/* Mobile Menu */}
              <ul className={`-ml-3 lg:hidden ${isOpen ? "block" : "hidden"}`}>
                <li>
                  <div className="relative mb-3">
                    <Input placeholder="Pesquisar" />
                    <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                  </div>
                </li>
                {categories.map((category) => (
                  <li key={category.id} className="">
                    <Button className="max-lg:w-full max-lg:justify-start" size="lg" variant="ghost" asChild>
                      <Link href={category.relPermalink} onClick={() => setIsOpen(false)}>
                        {category.title}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
