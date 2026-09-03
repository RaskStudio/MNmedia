/**
 * Bygger sitets billeder og videoklip ud fra originalerne.
 *
 * Originalerne (1,8 GB rå kamerafiler) ligger UDEN FOR repoet i ../raw-assets,
 * fordi alt i public/ deployes råt. Her komprimeres de ned til det sitet
 * faktisk skal bruge — typisk 1-2 % af kildestørrelsen.
 *
 * Kør:  node scripts/build-assets.mjs
 * Nyt materiale: læg filen i raw-assets, tilføj en linje i manifestet, kør igen.
 * Scriptet er idempotent — det overskriver, det tilføjer ikke.
 */
import sharp from "sharp";
import { execFile } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { promisify } from "node:util";
import { dirname, join, resolve } from "node:path";

const run = promisify(execFile);
const RAW = resolve(process.env.RAW_DIR ?? "../raw-assets");
const OUT = resolve("public");

/* ---------------------------------------------------------------- manifest */

/** Hero: lodrette 9:16-klip. `start` er valgt så vinduet er fri for
 *  indbrændte undertekster og titelkort — se kommentaren ved hvert klip. */
const hero = [
  {
    ud: "hero/01-tagudskiftning",
    kilde: "Videoer/Majvej-kopi.mp4",
    start: 0,
    laengde: 10,
    alt: "Droneoptagelse af en tagudskiftning under arbejde",
  },
  {
    // 0-4 s er et titelkort og fra ~27 s kommer et RS-outro. Klippet
    // "Video, plutovej" blev valgt fra: det er tekstet hele vejen igennem,
    // og undertekst-fragmenter midt i en sætning ser uafsluttet ud i en loop.
    ud: "hero/02-tilbygning",
    kilde: "copy_049FD313-3979-4295-A80E-880BDA88B28B-kopi.MOV",
    fraMappe: "Videoer",
    start: 8,
    laengde: 10,
    alt: "Tilbygning under opførelse i Aarhus",
  },
  {
    ud: "hero/03-tagarbejde",
    kilde: "Videoer/Den rigtige-kopi.mp4",
    start: 6,
    laengde: 10,
    alt: "Tømrer i gang med tagarbejde",
  },
];

/** Styleguidens eget eksempelbillede.
 *
 * Her lå før hele case-produktionen — cover, bredt topbillede og fire
 * gallerbilleder per case, 18 filer i alt. Den er væk, fordi cases flyttede
 * til Sanity: Markus lægger billederne op i studiet, og filerne i public/
 * blev derfor hverken vist eller vedligeholdt. De lå bare og blev deployet.
 *
 * Tilbage er dette ene, fordi styleguiden skal kunne vise 4:5-formatet uden
 * at hænge på indhold, en anden kan slette. Sikkerhedsnettet for casene er
 * originalerne i raw-assets og `sanity dataset export` — se SANITY.md.
 */
const styleguide = [
  {
    ud: "styleguide/eksempel-4-5",
    kilde: "RS tømrer/DSC06129.jpg",
    b: 720,
    h: 900,
  },
];

/** Hvide logoer på transparent baggrund.
 *  Bemærk: Logoer/Viston-logo.jpg er ubrugelig (100 % hvid, altså tom) —
 *  brug logo-viston-hvid.png, som er den rigtige fil. */
const logoer = [
  { ud: "logoer/rs-tomrer", kilde: "Logoer/RS tømrer logo hvid.png" },
  { ud: "logoer/mc-tag", kilde: "Logoer/Logo-fil-MC-tag-kopi.png" },
  { ud: "logoer/ao-byggeri", kilde: "Logoer/ao-png-kopi.png", behold: 0.79 },
  { ud: "logoer/viston", kilde: "Logoer/logo-viston-hvid.png" },
];

/** Løse billeder til ydelses- og om-siden. */
const sider = [
  { ud: "sider/ydelser-hero", kilde: "MC TAG/DSC07490.jpg", b: 1400, h: 1050 },
  // Dronebilledet frem for endnu en varevogn: to køretøjer ved siden af
  // hinanden på ydelsessiden læste som gentagelse, ikke som to ydelser.
  {
    ud: "sider/some",
    kilde:
      "MC TAG/dji_fly_20260611_114934_263_1781347658648_photo_optimized.jpg",
    b: 1200,
    h: 750,
  },
  { ud: "sider/annoncering", kilde: "MC TAG/DSC07964.jpg", b: 1200, h: 750 },
  { ud: "sider/branding", kilde: "RS tømrer/DSC06483.jpg", b: 1200, h: 750 },
  // Bemærk: der er ikke noget om-billede her. Om-siden har et tomt felt,
  // hvor der skal stå et portræt af Markus, og det billede findes ikke endnu.
  // Der lå før et her, men det var en håndværker fra RS Tømrers mappe — en
  // anden mands medarbejder sat ind som "personen bag". Feltet bliver stående
  // tomt, til Markus leverer sit eget.
];

/* ----------------------------------------------------------------- motorer */

async function billede(kilde, ud, b, h, kvalitet = 76) {
  const ind = join(RAW, kilde);
  if (!existsSync(ind)) throw new Error(`Mangler kilde: ${ind}`);
  await mkdir(dirname(join(OUT, ud)), { recursive: true });
  await sharp(ind)
    // attention finder motivet frem for at beskære fra midten — vigtigt når
    // et 4:5-portræt skal ned i et 16:9-felt.
    .resize(b, h, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: kvalitet })
    .toFile(join(OUT, `${ud}.webp`));
  return `${ud}.webp`;
}

async function logo(kilde, ud, behold) {
  const ind = join(RAW, kilde);
  if (!existsSync(ind)) throw new Error(`Mangler kilde: ${ind}`);
  await mkdir(dirname(join(OUT, ud)), { recursive: true });

  // trim fjerner den transparente luft, så alle logoer optisk fylder ens
  let pipe = sharp(ind).trim();
  if (behold) {
    const { width, height } = await pipe
      .toBuffer({ resolveWithObject: true })
      .then((r) => r.info);
    pipe = sharp(await sharp(ind).trim().toBuffer())
      .extract({ left: 0, top: 0, width, height: Math.round(height * behold) })
      .trim();
  }
  await pipe
    .resize({ height: 200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(join(OUT, `${ud}.webp`));
}

async function klip({ kilde, fraMappe, ud, start, laengde }) {
  const ind = join(RAW, fraMappe ? join(fraMappe, kilde) : kilde);
  if (!existsSync(ind)) throw new Error(`Mangler kilde: ${ind}`);
  await mkdir(dirname(join(OUT, ud)), { recursive: true });

  // -ss før -i er hurtigt søg. 720x1280 er rigeligt til en hero-loop.
  // CRF 32 frem for 30: det første klip er droneoptagelser med masser af
  // løv, som er dyrt at komprimere, og det er den fil hver eneste besøgende
  // henter. Forskellen er ikke synlig i en muted baggrundsloop.
  await run("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-ss",
    String(start),
    "-t",
    String(laengde),
    "-i",
    ind,
    "-an",
    "-vf",
    "scale=720:1280:flags=lanczos,fps=30",
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-crf",
    "32",
    "-preset",
    "slow",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    join(OUT, `${ud}.mp4`),
  ]);

  // Posterbilledet vises med det samme, så der aldrig står en sort firkant.
  //
  // Filen her er en MASTER, ikke det, browseren henter: heroen viser den
  // gennem next/image (se Hero.tsx), som skalerer og koder om til AVIF per
  // skærm. Derfor kvalitet 85 og ikke 68 — den skal have noget at give af,
  // når den kodes om. Den større fil koster kun plads i repoet.
  const poster = join(OUT, `${ud}-poster.jpg`);
  await run("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-ss",
    String(start + 0.1),
    "-i",
    ind,
    "-frames:v",
    "1",
    "-vf",
    "scale=720:-2",
    poster,
  ]);
  await sharp(poster)
    .webp({ quality: 85 })
    .toFile(join(OUT, `${ud}-poster.webp`));
  await rm(poster);
}

/* -------------------------------------------------------------------- kørsel */

console.log(`Kilde: ${RAW}\nMål:   ${OUT}\n`);

for (const l of logoer) {
  await logo(l.kilde, l.ud, l.behold);
  console.log("logo   ", l.ud);
}
for (const s of sider) {
  await billede(s.kilde, s.ud, s.b, s.h);
  console.log("side   ", s.ud);
}

for (const g of styleguide) {
  await billede(g.kilde, g.ud, g.b, g.h);
  console.log("guide  ", g.ud);
}

for (const h of hero) {
  await klip(h);
  console.log("klip   ", h.ud);
}

console.log("\nFærdig.");
