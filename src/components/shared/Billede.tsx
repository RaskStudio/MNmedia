import Image from "next/image";
import { Hjoerner } from "@/components/shared/Frame";
import { cn } from "@/lib/cn";

/**
 * Ét billede med søgerens hjørnemarkører omkring sig.
 *
 * Vinklerne ligger uden for motivet, ikke oven på det. Oven på et foto
 * forsvinder hårstregerne mod de lyse partier — himmel, lyst træ — og rammen
 * bliver kun halvt synlig. Uden for står de på sitets sorte bund.
 *
 * `sizes` er ikke valgfri i praksis: uden den henter next/image et billede
 * beregnet til fuld viewportbredde, og så er komprimeringen spildt på et
 * kort der i virkeligheden er en tredjedel så bredt.
 */
export function Billede({
  src,
  alt,
  sizes,
  ratio = "aspect-4/5",
  className,
  billedeClassName,
  priority,
  corners = true,
}: {
  src: string;
  alt: string;
  sizes: string;
  ratio?: string;
  className?: string;
  /** Klasser på selve billedrammen — fx en kant der skal flugte med et kort. */
  billedeClassName?: string;
  priority?: boolean;
  /**
   * Hjørner slås fra hvor billedet støder op til andet indhold (kort med
   * kant, fire-op-gallerier) — dér ville vinklerne lægge sig oven i naboen
   * eller blive til støj i mængde.
   */
  corners?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden bg-ink-soft",
          ratio,
          billedeClassName,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>

      {corners && (
        <Hjoerner
          inset="-inset-2 md:-inset-3"
          className="text-grey-600 transition-colors duration-500 group-hover:text-paper/70"
        />
      )}
    </div>
  );
}
