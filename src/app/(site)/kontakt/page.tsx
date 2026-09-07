import type { Metadata } from "next";

import { Sektioner } from "@/components/sektioner/Sektioner";
import { hentSide } from "@/sanity/sider";

/**
 * Kontaktsiden. Selve formularen ligger i koden.
 *
 * Siden henter sit indhold fra Sanity og gengiver de sektioner, der ligger
 * der, i den rækkefølge de ligger i. Rækkefølgen og udvalget er Markus',
 * ikke kodens — se src/components/sektioner/Sektioner.tsx for oversættelsen
 * fra sektion til komponent.
 */

export async function generateMetadata(): Promise<Metadata> {
  const side = await hentSide("kontaktSide");
  return { title: side.sidetitel, description: side.sidebeskrivelse };
}

export default async function KontaktPage() {
  const side = await hentSide("kontaktSide");
  return <Sektioner sektioner={side.sektioner} />;
}
