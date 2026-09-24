import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IkkeFundet } from "@/components/shared/IkkeFundet";

/**
 * Adresser, der ikke matcher nogen rute. De rammer root-layoutet, ikke
 * sitets — derfor sætter den selv header, fod og kornlag på, som
 * app/(site)/layout.tsx gør. Se IkkeFundet.tsx.
 */
export const metadata: Metadata = { title: "Siden findes ikke" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <IkkeFundet />
      </main>
      <Footer />
      <div aria-hidden className="grain" />
    </>
  );
}
