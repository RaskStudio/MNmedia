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

/** Cases. `cover` er 4:5 fordi det er formatet stillbillederne er skudt i —
 *  vi beskærer ikke hans komposition væk for at ramme et 16:9-felt. */
const cases = [
  {
    slug: "rs-tomrer",
    mappe: "RS tømrer",
    cover: "DSC06129.jpg",
    bred: "DSC05911.jpg",
    // Tre logo-tunge billeder i træk fik galleriet til at ligne en
    // bilpark. Nu: arbejde, portræt, arbejde, ét brandbillede.
    galleri: ["DSC00702.jpg", "DSC06108.jpg", "DSC06397.jpg", "DSC06483.jpg"],
  },
  {
    slug: "mc-tag",
    mappe: "MC TAG",
    cover: "DSC07481.jpg",
    bred: "DSC07902.jpg",
    galleri: ["DSC07914.jpg", "DSC08011.jpg", "DSC07076.jpg", "DSC07490.jpg"],
  },
  {
    slug: "ao-byggeri",
    mappe: "AO byggeri",
    cover: "DSC05121.jpg",
    bred: "DSC05743.jpg",
    galleri: [
      "DSC05057.jpg",
      "DSC05603.jpg",
      "DSC05666.jpg",
      "rigtig2-kopi.jpg",
    ],
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
  { ud: "sider/om", kilde: "RS tømrer/DSC06367.jpg", b: 1000, h: 1333 },
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

  // Posterbilledet vises med det samme, så der aldrig står en sort firkant
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
    .webp({ quality: 68 })
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

for (const c of cases) {
  await billede(join(c.mappe, c.cover), `cases/${c.slug}/cover`, 1100, 1375);
  await billede(join(c.mappe, c.bred), `cases/${c.slug}/bred`, 1920, 1080);
  for (const [i, g] of c.galleri.entries()) {
    await billede(
      join(c.mappe, g),
      `cases/${c.slug}/${String(i + 1).padStart(2, "0")}`,
      900,
      1125,
      74,
    );
  }
  console.log(
    "case   ",
    c.slug,
    `(cover + bred + ${c.galleri.length} galleri)`,
  );
}

for (const h of hero) {
  await klip(h);
  console.log("klip   ", h.ud);
}

console.log("\nFærdig.");
