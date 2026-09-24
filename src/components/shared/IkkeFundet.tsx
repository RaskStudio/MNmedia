import { Eyebrow } from "@/components/shared/Section";
import { Button, ArrowRight } from "@/components/shared/Button";

/**
 * 404-indholdet. Det bruges to steder, fordi Next viser to forskellige
 * not-found-filer: app/(site)/not-found.tsx, når en side selv siger
 * notFound() — fx en case, der ikke findes — og app/not-found.tsx, når
 * adressen slet ikke matcher en rute. Den første ligger inde i sitets layout
 * og får header og fod med; den anden gør ikke og sætter dem selv på.
 *
 * Uden de to filer stod Next' engelske standardside der: sort, uden header,
 * med «This page could not be found.»
 */
export function IkkeFundet() {
  return (
    <section className="pt-36 pb-section md:pt-44">
      <div className="mx-auto w-full max-w-320 px-6 md:px-10">
        <Eyebrow>404</Eyebrow>
        <h1 className="headline max-w-3xl text-h1">Siden findes ikke</h1>
        <p className="mt-7 max-w-xl text-lead text-grey-400">
          Adressen er måske skrevet forkert, eller siden er flyttet. Prøv
          forsiden, eller se hvad vi har lavet for andre.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/">Til forsiden</Button>
          <Button href="/cases" variant="secondary">
            Se cases <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
