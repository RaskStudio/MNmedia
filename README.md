# MNmedia

Sitet for MNmedia — Next.js 16, Tailwind 4, hostet på Vercel.

```bash
npm install
npm run dev
```

## Hvor tingene ligger

| Sti | Hvad |
| --- | --- |
| `src/app/` | Siderne. Fem offentlige, plus `/styleguide` og `/studio`. |
| `src/components/` | Komponenterne. `shared/` er byggestenene, `layout/` er header og fod. |
| `src/content/` | Tekst, der ikke er i CMS'et — ydelser, om-siden, kontaktoplysninger. |
| `src/sanity/` | Datalaget for cases, og skemaet studiet bygger på. |
| `brand/` | Logofiler, grafik til sociale profiler, og scripterne der bygger dem. |
| `scripts/` | Billed- og videobygning fra `../raw-assets`. |

## De tre dokumenter, der betyder noget

- **`/styleguide`** på sitet — mærket, farver, skrifter, komponenter og
  reglerne bag dem. Linket i sidefoden. Det er opslagsværket.
- **`SANITY.md`** — hvordan Markus lægger en case ind, hvad der bevidst ikke
  er i CMS'et, og hvad der stadig mangler at blive sat op.
- **`brand/README.md`** — logofilerne, hvad de bruges til, og hvordan de
  genskabes.

## Kommandoer

| | |
| --- | --- |
| `npm run dev` | Udviklingsserver |
| `npm run build` | Byg |
| `npm run lint` | ESLint |
| `npm run brand` | Genskaber alle logofiler og sociale formater ud fra `Logo.tsx` |
| `node scripts/build-assets.mjs` | Bygger billeder og klip fra `../raw-assets` |

## Miljøvariabler

Kopiér `.env.example` til `.env.local`. Sanity-variablerne er påkrævede —
cases ligger i CMS'et, og der er ingen kopi i koden at falde tilbage på.
Resend er valgfri: uden nøglen siger kontaktformularen ærligt, at beskeden
ikke kunne sendes, og henviser til mail og telefon.

## To ting, der er værd at vide

**Originalerne ligger uden for repoet.** `../raw-assets` er 1,8 GB rå
kamerafiler, som `scripts/build-assets.mjs` komprimerer ned til det, sitet
faktisk bruger — typisk 1-2 % af kildestørrelsen. Alt i `public/` deployes
råt, så originalerne må ikke ligge der.

**Mærkets geometri findes ét sted:** `src/components/layout/Logo.tsx`. Ikon,
favicon, delebillede og alle filerne i `brand/` er genereret ud fra de tal.
Ændrer du dem, kører du `npm run brand`.
