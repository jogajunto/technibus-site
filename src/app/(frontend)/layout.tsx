import type { Metadata } from "next";

import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import { NewsletterDialogProvider } from "@/providers/newsletter-dialog";

import AdsManager from "@/components/AdsManager";
import AdsSlot from "@/components/AdsSlot";
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
        <AdsManager />
        <NewsletterDialogProvider>
          <Header />
          <div className="container" id="conteudo">
            <AdsSlot className="mx-auto mb-6 max-w-5xl max-md:hidden" variant="principalDesktop" slotId="layout-principal-desktop" />
            <AdsSlot className="mx-auto mb-6 max-w-5xl md:hidden" variant="principalMobile" slotId="layout-principal-mobile" />
          </div>
          {children}
          {process.env.NEXT_PUBLIC_ENV === "production" && <GoogleTagManager gtmId="GTM-58L35CT" />}
          <Footer />
        </NewsletterDialogProvider>
      </body>
    </html>
  );
}
