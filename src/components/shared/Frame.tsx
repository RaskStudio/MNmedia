import { cn } from "@/lib/cn";

/**
 * Hjørnemarkører — sitets gennemgående greb.
 *
 * Fire vinkler der markerer et felt uden at lukke en kasse om det. Betydningen
 * er hentet fra Markus' eget værktøj: det er sådan en søger afgrænser det, der
 * er i billedet. Derfor er der én regel for hvornår de må bruges:
 *
 *   De markerer noget man ser på — ikke en hvilken som helst boks.
 *
 * Det gælder optaget materiale, mærket selv, og det ene sted per side hvor vi
 * beder om mødet. Sættes de på hvert kort og hvert felt, holder de op med at
 * betyde noget og bliver til mønstertapet.
 *
 * Vigtigt om placering: på billeder skal vinklerne ligge UDEN FOR motivet, med
 * negativt inset. Hvide hårstreger oven på et foto forsvinder mod himmel og
 * lyst træ, så rammen kun bliver halvt synlig. Uden for billedet står de på
 * sitets sorte bund og kan ses hele vejen rundt.
 *
 * Farven arves via border-current, så kalderen styrer den med en text-klasse
 * og kan animere den.
 */
export function Hjoerner({
  className,
  size = "size-5",
  inset = "inset-0",
}: {
  /** Farve (text-*) og eventuelle overstyringer. */
  className?: string;
  size?: string;
  /**
   * Hvor langt vinklerne står fra kanten. Negativ værdi lægger dem uden for.
   * Egen parameter frem for noget kalderen sender via className: to
   * inset-utilities på samme element afgøres af rækkefølgen i det genererede
   * stylesheet, ikke af den rækkefølge vi skriver dem i. Samme fælde som
   * display-klasserne i Button.
   */
  inset?: string;
}) {
  const hjoerne = "absolute border-current";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute", inset, className)}
    >
      <span className={cn(hjoerne, size, "top-0 left-0 border-t border-l")} />
      <span className={cn(hjoerne, size, "top-0 right-0 border-t border-r")} />
      <span
        className={cn(hjoerne, size, "bottom-0 left-0 border-b border-l")}
      />
      <span
        className={cn(hjoerne, size, "right-0 bottom-0 border-r border-b")}
      />
    </div>
  );
}
