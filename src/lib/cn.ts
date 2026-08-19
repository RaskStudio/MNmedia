/**
 * Minimal klassenavn-sammensætning. Vi har ikke konfliktende utility-klasser
 * nok til at retfærdiggøre tailwind-merge som afhængighed.
 */
export function cn(...parts: unknown[]) {
  // Tager imod unknown, fordi `noget && "klasse"` kan give 0 eller "" når
  // venstresiden er en ReactNode. Vi beholder kun de faktiske strenge.
  return parts
    .filter((p): p is string => typeof p === "string" && p !== "")
    .join(" ");
}
