import { IkkeFundet } from "@/components/shared/IkkeFundet";

/**
 * Når en side under sitet kalder notFound(), fx en case der ikke findes.
 * Se IkkeFundet.tsx.
 *
 * Titlen sættes med et <title>-element, som React 19 løfter op i <head>:
 * metadata-eksporten virker kun i rod-filen app/not-found.tsx. Uden den bar
 * siden forsidens titel.
 */
export default function NotFound() {
  return (
    <>
      <title>Siden findes ikke — MN Media</title>
      <IkkeFundet />
    </>
  );
}
