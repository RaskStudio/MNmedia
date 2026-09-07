import { graderLoft } from "@/lib/tekstbredde";
import { cn } from "@/lib/cn";

/**
 * En overskrift, der ikke kan hakke et ord over.
 *
 * Den findes, fordi overskrifterne nu kommer fra CMS'et. Da de stod i koden,
 * kunne man måle den enkelte og sætte et loft i hånden; det kan man ikke,
 * når teksten kan ændre sig i morgen. Loftet regnes derfor ud af tekstens
 * egne bogstavbredder — se src/lib/tekstbredde.ts.
 *
 * `whitespace-pre-line` er halvdelen af pointen: skriver Markus overskriften
 * i ét stykke, ombryder browseren den frit, og loftet sikrer bare, at det
 * længste ORD kan stå. Sætter han selv et linjeskift, står det, og loftet
 * sikrer, at hver LINJE kan stå hel. Et linjeskift er dermed et
 * designværktøj, ikke en tilfældighed — og det er usynligt, indtil han
 * bruger det.
 *
 * `sporing` skal matche den grad-klasse, kalderen sætter: text-h1 har
 * -0.012em, text-h2 har -0.01em, text-display -0.015em. Passer de to ikke,
 * er loftet regnet på en anden tekst end den, der tegnes.
 */
export function Overskrift({
  tekst,
  som: Tag = "h2",
  grad = "var(--text-h1)",
  sporing = -0.012,
  className,
}: {
  tekst: string;
  som?: "h1" | "h2";
  /** CSS-værdien, loftet skal ligge under. Typisk et af --text-*-tokenerne. */
  grad?: string;
  /** letter-spacing i em, som den er sat i grad-klassen. */
  sporing?: number;
  className?: string;
}) {
  return (
    <Tag
      className={cn("headline whitespace-pre-line", className)}
      style={{ fontSize: graderLoft(tekst, { sporing, grad }) }}
    >
      {tekst}
    </Tag>
  );
}
