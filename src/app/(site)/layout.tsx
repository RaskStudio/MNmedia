import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Rammen om det offentlige site: header, indhold, sidefod og kornlaget.
 *
 * Den ligger i en rutegruppe frem for i root-layoutet, fordi /studio ikke
 * skal have den. Sanity Studio er et program, der bruger hele skærmen —
 * lægger man sitets header og fod om det, mister det plads foroven og
 * forneden, og kornlaget lægger sig oven i redigeringsfladen.
 *
 * Gruppen ændrer ingen adresser: (site) står i parentes, så den ikke tælles
 * med i URL'en. Forsiden er stadig /.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Kornlaget ligger øverst og fanger ingen klik — se globals.css */}
      <div aria-hidden className="grain" />
    </>
  );
}
