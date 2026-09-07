import type { Metadata } from "next";

import { Sektioner } from "@/components/sektioner/Sektioner";
import { hentSide } from "@/sanity/sider";

/**
 * Forsiden.
 *
 * Siden henter sit indhold fra Sanity og gengiver de sektioner, der ligger
 * der, i den rækkefølge de ligger i. Rækkefølgen og udvalget er Markus',
 * ikke kodens — se src/components/sektioner/Sektioner.tsx for oversættelsen
 * fra sektion til komponent.
 */

export async function generateMetadata(): Promise<Metadata> {
  const side = await hentSide("forside");
  // Ingen title her: root-layoutet sætter forsidens egen, som er den fulde
  // «MNmedia — Branding, sociale medier og annoncering». Sætter vi den igen,
  // bliver den kørt gennem skabelonen og ender som «Forside — MNmedia».
  return { description: side.sidebeskrivelse };
}

export default async function Forside() {
  const side = await hentSide("forside");
  return <Sektioner sektioner={side.sektioner} />;
}
