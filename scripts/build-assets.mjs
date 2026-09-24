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
 *  indbrændte undertekster, titelkort, logoer og outro — se kommentaren ved
 *  hvert klip. Vinduerne er fundet ved at trække en ramme ud hvert sekund og
 *  se på dem, og `start` ligger lige efter et klip i kilden, så loopet ikke
 *  åbner med et glimt af den forrige indstilling.
 *
 *  Rækkefølgen betyder noget. Det FØRSTE klip er det eneste, en telefon
 *  henter, og dets poster er sidens største billede. På desktop skifter
 *  heroen klip hvert 6. sekund (SLIDE_MS i Hero.tsx) og spoler til start, så
 *  af klip 2 og frem ses kun de første seks sekunder. */
const hero = [
  {
    // Præstelodden. Ingen tekst i hele filen, så vinduet er valgt efter
    // motivet: det starter på klippet ved 9,06 s — tæt på taget, hvor der
    // lægges lægter — og har tømrerne i arbejde både oppefra og tæt på. Det
    // er det mest håndværk per sekund i materialet, og derfor står det
    // forrest. Før 9 s er der mest oversigt og landskab.
    ud: "hero/01-laegter",
    kilde: "Videoer/Præstelodden, real deal.mp4",
    start: 9.2,
    laengde: 10,
    alt: "Droneoptagelse af et tag under renovering, hvor tømrere lægger nye lægter på det grønne undertag",
  },
  {
    // Sognegården. Heller ingen tekst. Filen åbner med et vidt billede,
    // hvor bygningen er en prik ved kirken, og derefter sække med gamle
    // tagsten. Vinduet starter på klippet ved 4,02 s med en mand i
    // beskyttelsesdragt på stilladset, og oversigten over det afdækkede tag
    // når at komme med inden for de seks sekunder, desktop viser.
    ud: "hero/02-tagnedrivning",
    kilde: "Videoer/Sognegården Real.mp4",
    start: 4.1,
    laengde: 10,
    alt: "Håndværkere i hvide beskyttelsesdragter på stilladset, mens det gamle tag tages af en bygning ved kirkegården",
  },
  {
    // Aarhus Fremad ("test 2" i filnavnet, men den er færdigklippet med
    // musik og outro). 0-2 s er AO Byggeris varebil med logoet på siden,
    // og fra 20,16 s er der et hvidt outro-kort med logo og telefonnummer.
    // Det oplagte vindue, 10,12-20,12, fyldte 1.082 KiB — tungere end det
    // tungeste af de gamle klip. Det her starter ved klippet på 6,08 s og
    // vejer 782 KiB. Klipperen har lagt en sløret swipe-overgang ved hvert
    // klip, fire rammer lang, så start er 6,3 og ikke 6,1 — ellers åbner
    // klippet og posteren på et udtværet billede. De sidste 0,3 s krydser
    // næste overgang, men af klip 3 viser desktop kun de første seks.
    // Klubmærket på facaden (8-10 s) er malet på bygningen, ikke lagt på i
    // klipningen, og det er bygningens eget navn.
    ud: "hero/03-klubhus",
    kilde: "Videoer/Aarhus Fremad test 2.mp4",
    start: 6.3,
    laengde: 10,
    alt: "Droneoptagelse af Aarhus Fremads klubhus ved fodboldbanerne, fra råhus til færdigt tag med ovenlys",
  },
  {
    // Stadion Allé. Tekstet næsten hele vejen, og der er INTET rent vindue
    // på ti sekunder: det længste løber fra klippet ved 14,24 s til omkring
    // 20,9 s, hvor "I udestuen har vi fået ..." kommer på. Derfor 6,4 s og
    // ikke 10. Det holder, fordi desktop alligevel kun viser seks sekunder af
    // klip 2 og frem — men klippet må IKKE flyttes forrest, hvor mobilen
    // looper det. Og SLIDE_MS må ikke komme over 6,4 s.
    // Pergolaen ved 30,13-36,85 s er det andet rene vindue; den blev valgt
    // fra, fordi huset og trappen siger mere om arbejdet end havemøblerne.
    ud: "hero/04-terrasse",
    kilde: "Videoer/Stadion allé, video.mp4",
    start: 14.3,
    laengde: 6.4,
    alt: "Hvidt pudset hus med ny trætrappe, terrasse og udestue med sprossede glasdøre",
  },
  // "makrelvej real" er valgt fra. Den er en rundvisning med en fortæller,
  // der taler hele vejen, og underteksterne står der næsten uafbrudt — det
  // længste stykke uden tekst er tre sekunder. Der er desuden en ramme med
  // farvede blokke ved 7 s, der ligner en fejl i eksporten.
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

/* Billederne til ydelses- og om-siden lå her før, som public/sider/*.webp.
 * De flyttede til Sanity med siderne 7. september og blev ikke læst af
 * noget bagefter — de blev bare bygget og deployet. Markus skifter dem i
 * studiet nu. */

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

async function klip({ kilde, ud, start, laengde }) {
  const ind = join(RAW, kilde);
  if (!existsSync(ind)) throw new Error(`Mangler kilde: ${ind}`);
  await mkdir(dirname(join(OUT, ud)), { recursive: true });

  // -ss før -i er hurtigt søg. 720x1280 er rigeligt til en hero-loop — og
  // både til mobil og desktop: på desktop vises klippet i 303 px bredde,
  // altså SMALLERE end på en telefon, hvor det fylder hele skærmen. Mobilen
  // er den krævende af de to, og derfor er der én fil og ikke to.
  //
  // CRF 36 frem for 32. Det første klip er den fil, hver eneste besøgende
  // henter, og ved 32 var det daværende første klip (droneoptagelser med
  // masser af løv) 1,7 MB — 77 % af forsidens vægt. Ved 36 holder alle klip
  // sig under ~1 MB; det nuværende første, 01-laegter, er 989 KiB.
  //
  // Grænsen er fundet ved at sammenligne rammer ved 1179 px, som er hvad en
  // telefon med DPR 3 faktisk viser. Ved 36 holder lægterne og
  // ovenlysrammen; ved 38 begynder kanterne at smuldre. Prøvet blev også en
  // lavere opløsning — 540x960 ved CRF 34 fylder det samme som 720 ved 38,
  // men ser tydeligt blødere ud. Bits er bedre brugt på pixels her.
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
    // fps før scale: kilderne er optaget i 25, 50, 59,94 og 100 fps, og alle
    // klip skal ud i de samme 30. Står fps først, skaleres kun de billeder,
    // der faktisk kommer med — ved 100 fps er det under en tredjedel.
    "fps=30,scale=720:1280:flags=lanczos",
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-crf",
    "36",
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
  // PNG som mellemstation, ikke JPEG: filen bliver alligevel slettet om lidt,
  // og en JPEG ville lægge et tabsgivende trin ind, før sharp koder til webp.
  // Masteren skal have så meget som muligt at give af — next/image koder den
  // om igen per skærm. Målt: 322 KiB via PNG mod 270 via JPEG for det samme
  // billede, altså detaljer der ellers var smidt væk før tid.
  const poster = join(OUT, `${ud}-poster.png`);
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

for (const g of styleguide) {
  await billede(g.kilde, g.ud, g.b, g.h);
  console.log("guide  ", g.ud);
}

for (const h of hero) {
  await klip(h);
  console.log("klip   ", h.ud);
}

console.log("\nFærdig.");
