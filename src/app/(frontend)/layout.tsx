import type { Metadata } from "next";

import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import { Ads } from "@/components/Ads";
import { NewsletterDialogProvider } from "@/providers/newsletter-dialog";

import { Suspense } from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.SITE_URL}`),
  title: {
    default: `${process.env.SITE_TITLE}`,
    template: `%s | ${process.env.SITE_TITLE}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`} id="topo">
        <NewsletterDialogProvider>
          <Header />
          <div className="container" id="conteudo">
            <Suspense fallback={<div className="mx-auto mb-6 h-[90px] w-full max-w-5xl animate-pulse rounded bg-neutral-200 max-md:hidden" />}>
              <Ads className="mx-auto mb-6 max-w-5xl max-md:hidden" variant="principalDesktop" />
            </Suspense>

            <Suspense fallback={<div className="mx-auto mb-6 h-[250px] w-full max-w-5xl animate-pulse rounded bg-neutral-200 md:hidden" />}>
              <Ads className="mx-auto mb-6 max-w-5xl md:hidden" variant="principalMobile" />
            </Suspense>
          </div>
          {children}
          {process.env.NEXT_PUBLIC_ENV === "production" && <GoogleTagManager gtmId="GTM-58L35CT" />}
          <Footer />
        </NewsletterDialogProvider>
      </body>
    </html>
  );
}
