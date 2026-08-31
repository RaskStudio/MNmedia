/**
 * Flytter de eksisterende cases fra koden ind i Sanity — én gang.
 *
 *   npm run sanity:import
 *   npm run sanity:import -- --torvejr
 *
 * Billederne uploades med, fra public/. Det er dem, build-assets.mjs allerede
 * har komprimeret ned fra originalerne — der er ingen grund til at sende 1,8
 * GB rå kamerafiler gennem Sanity, når de færdige derivater er dét, sitet har
 * vist hele tiden.
 *
 * Scriptet er idempotent: hver case får et fast _id ud fra sit slug, så en
 * ekstra kørsel opdaterer frem for at oprette dubletter. Billeder uploades
 * dog på ny hver gang — derfor `--torvejr`, som kun viser, hvad der ville ske.
 *
 * Når det er kørt, og du har set casene i studiet, skal `cases`-arrayet i
 * src/content/cases.ts slettes. Se SANITY.md.
 */
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const TOERVEJR = process.argv.includes("--torvejr");
const ROD = resolve(import.meta.dirname, "..");
const OFFENTLIG = join(ROD, "public");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID mangler. Se SANITY.md.");
  process.exit(1);
}
if (!token && !TOERVEJR) {
  console.error(
    "SANITY_WRITE_TOKEN mangler.\n" +
      "Lav en i sanity.io/manage under API → Tokens med rollen Editor.\n" +
      "Kør med --torvejr for at se, hvad der ville blive sendt, uden en token.",
  );
  process.exit(1);
}

const klient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-08-31",
  token,
  useCdn: false,
});

/**
 * Læser cases direkte ud af TypeScript-filen.
 *
 * Node kan selv fjerne typerne (--experimental-strip-types), så der skal
 * hverken bygges eller installeres en TypeScript-loader for at køre et
 * script, der bruges én gang. Se npm-scriptet `sanity:import`.
 */
async function laesCases() {
  const modul = await import(
    pathToFileURL(join(ROD, "src/content/cases.ts")).href
  );
  return modul.cases;
}

/** Uploader ét billede fra public/ og giver referencen tilbage. */
async function uploadBillede({ url, alt }) {
  const fil = join(OFFENTLIG, url.replace(/^\//, ""));
  if (TOERVEJR) return { _type: "image", _torvejr: fil, alt };

  const data = await readFile(fil);
  const asset = await klient.assets.upload("image", data, {
    filename: basename(fil),
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

async function main() {
  const cases = await laesCases();
  console.log(
    `${cases.length} cases fundet${TOERVEJR ? " (tørvejr — intet sendes)" : ""}\n`,
  );

  for (const c of cases) {
    console.log(`${c.kunde}`);

    const cover = await uploadBillede(c.cover);
    const bred = await uploadBillede(c.bred);
    const galleri = [];
    for (const g of c.galleri) {
      galleri.push({ ...(await uploadBillede(g)), _key: basename(g.url) });
    }
    console.log(`  ${2 + galleri.length} billeder`);

    const dok = {
      _id: `case-${c.slug}`,
      _type: "case",
      kunde: c.kunde,
      slug: { _type: "slug", current: c.slug },
      kortBeskrivelse: c.kortBeskrivelse,
      langBeskrivelse: c.langBeskrivelse,
      ydelser: c.ydelser,
      // _key er ikke valgfri i Sanity-arrays: uden den kan studiet ikke skelne
      // to rækker fra hinanden, og redigering opfører sig uforudsigeligt.
      fakta: c.fakta.map((f, i) => ({ ...f, _key: `faktum-${i}` })),
      visPaaForsiden: c.visPaaForsiden,
      cover,
      bred,
      galleri,
      ...(c.udtalelse ? { udtalelse: c.udtalelse } : {}),
    };

    if (TOERVEJR) {
      console.log(`  ville skrive ${dok._id}\n`);
      continue;
    }

    await klient.createOrReplace(dok);
    console.log(`  skrevet som ${dok._id}\n`);
  }

  console.log(
    TOERVEJR
      ? "Tørvejr slut — intet er ændret."
      : "Færdig. Se dem på /studio, og slet så cases-arrayet i src/content/cases.ts.",
  );
}

main().catch((f) => {
  console.error("\nImporten fejlede:", f.message);
  process.exit(1);
});
