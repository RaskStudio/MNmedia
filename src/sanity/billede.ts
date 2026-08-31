import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { datasaet, projektId } from "./env";

/** Samme grund som ved klienten: byggeren laves først, når den bruges. */
let bygger: ReturnType<typeof createImageUrlBuilder> | undefined;

/**
 * Formaterne sitet viser billeder i. De er ikke tilfældige — 9:16 er
 * heroens klip, 4:5 er stillbillederne, 16:9 er toppen af en case. Står de
 * her ét sted, kan de ikke drive fra styleguiden.
 */
export const FORMAT = {
  /** Cover og galleri — stående, som stillbillederne er skudt. */
  staaende: { bredde: 1200, hoejde: 1500 },
  /** Toppen af en case. */
  bred: { bredde: 2000, hoejde: 1125 },
} as const;

/**
 * URL til et Sanity-billede, beskåret til et af sitets formater.
 *
 * Beskæringen sker i URL'en og ikke med CSS. Det er hele pointen med
 * hotspot: `fit: crop` lader Sanity beskære omkring det fokuspunkt, Markus
 * har sat. Overlader vi beskæringen til object-cover, rammer den altid
 * midten — og på et portræt er midten typisk en mave.
 */
export function billedeUrl(
  kilde: SanityImageSource,
  format: keyof typeof FORMAT,
) {
  const { bredde, hoejde } = FORMAT[format];
  bygger ??= createImageUrlBuilder({ projectId: projektId, dataset: datasaet });
  return bygger
    .image(kilde)
    .width(bredde)
    .height(hoejde)
    .fit("crop")
    .auto("format")
    .url();
}
