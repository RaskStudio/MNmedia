import tabel from "./bogstavbredder.json";

/**
 * Hvor bred bliver en overskrift, før den er tegnet?
 *
 * Sitets overskrifter har et loft på skriftgraden, så et langt dansk ord ikke
 * bliver hakket over på en telefon. Loftet var før håndmålte tal — 11.75 em
 * for «FOR VIRKSOMHEDER» i heroen, 14.98 for «En samarbejdspartner» i
 * om-blokken. Det holdt, så længe teksten stod i koden ved siden af tallet.
 *
 * I det øjeblik teksten kan rettes i CMS'et, er et håndmålt tal en fælde:
 * Markus retter overskriften, tallet bliver forkert, og fejlen viser sig kun
 * på smalle skærme — uden at nogen får besked. Derfor regnes bredden nu ud af
 * skriftens egne bogstavbredder i stedet.
 *
 * Tabellen bygges af scripts/byg-skrift.py sammen med selve skriften, ved
 * netop det punkt på akserne, overskrifterne bruger (wdth 112, vægt 600).
 * Ændrer skriften sig, ændrer tallene sig med.
 *
 * Udregningen ligger 1 % HØJERE end browserens, fordi den ikke kender
 * knibning — browseren strammer visse bogstavpar. Det er den rigtige
 * fejlretning for et sikkerhedsloft: den gætter for bredt, aldrig for smalt,
 * så resultatet er en anelse mindre skrift frem for et ord, der løber over.
 *
 * Kontrolleret mod browseren: «FOR VIRKSOMHEDER» giver 11.748 mod det
 * håndmålte 11.75, «SAMARBEJDSPARTNER» 13.25 mod målte 13.16.
 */

const TEGN = tabel.tegn as Record<string, number>;

/** Ukendte tegn regnes som det bredeste i skriften — hellere for lidt end for meget. */
const UKENDT = tabel.bredeste;

/**
 * Bredden af én linje i em, med sporingen lagt til.
 *
 * `sporing` er den samme værdi som CSS'ens letter-spacing i em, altså negativ
 * for overskrifterne. Browseren lægger den efter hvert tegn, også det sidste.
 */
export function tekstbredde(tekst: string, sporing: number): number {
  const store = tekst.toUpperCase();
  let bredde = 0;
  for (const tegn of store) bredde += TEGN[tegn] ?? UKENDT;
  return bredde + sporing * store.length;
}

/**
 * Den bredeste enhed, der ikke kan brydes — og dermed den, loftet skal regnes
 * efter.
 *
 * Er linjerne givet (heroen sætter dem i hånden), er det den bredeste linje:
 * de SKAL kunne stå hver for sig. Er der kun én tekst, er det det bredeste
 * ord, for kun inde i et ord er brud ikke tilladt. Resten må browseren
 * ombryde, som den vil.
 */
export function bredesteEnhed(
  tekst: string | string[],
  sporing: number,
): number {
  const linjer = Array.isArray(tekst) ? tekst : tekst.split("\n");

  // Er overskriften brudt i linjer — enten som liste eller med linjeskift i
  // teksten — skal HVER LINJE kunne stå hel; det er en komposition, og det
  // ville være meningsløst at bryde den, browseren fik at vide skulle holde.
  //
  // Står den som én linje uden brud, er det kun det bredeste ORD, der skal
  // kunne stå: resten må browseren ombryde, som pladsen tillader. Uden den
  // skelnen ville en almindelig overskrift blive målt i sin fulde længde og
  // presset ned i en absurd lille grad for at stå på én linje.
  const enheder = linjer.length > 1 ? linjer : linjer[0].split(/\s+/);
  return Math.max(...enheder.map((e) => tekstbredde(e, sporing)));
}

/**
 * Loftet, klar til at sætte i en style.
 *
 * `luft` er spaltens polstring plus lidt luft, i rem — de samme 4.5rem som
 * heroen brugte i hånden: 3rem sidepolstring plus 1.5rem, så versalerne ikke
 * lander på selve kanten.
 */
export function graderLoft(
  tekst: string | string[],
  {
    sporing,
    grad,
    luft = 4.5,
  }: { sporing: number; grad: string; luft?: number },
): string {
  const em = bredesteEnhed(tekst, sporing).toFixed(2);
  return `min(${grad}, (100vw - ${luft}rem) / ${em})`;
}
