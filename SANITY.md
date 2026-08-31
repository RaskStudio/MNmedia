# Sanity — cases i et CMS

Markus skal selv kunne lægge cases ind. Alt andet indhold bliver i koden;
kun cases flyttes, fordi kun cases vokser med hver ny kunde.

**Sitet virker allerede uden Sanity.** Så længe `NEXT_PUBLIC_SANITY_PROJECT_ID`
ikke er sat, hentes cases fra `src/content/cases.ts`, præcis som før. Det er
med vilje: sitet skulle kunne bygge og deploye, før projektet fandtes. Når
trinnene herunder er kørt, skal den rampe fjernes — se trin 6.

## 1. Opret projektet

```
npx sanity@latest login
npx sanity@latest projects create "MNmedia"
```

Skriv projekt-id'et ned. Datasættet skal hedde `production`.

På gratisniveauet er datasæt **public**. Det betyder, at indhold kan læses af
enhver, der kender projekt-id'et — også kladder. For et site, hvis indhold
alligevel udgives, er det uden betydning, men det giver én regel:

> **Kunden godkender casen, før den skrives ind.**

## 2. Sæt miljøvariablerne

Lokalt i `.env.local`, og i Vercel under Settings → Environment Variables:

| Variabel | Værdi | Hvor |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | projekt-id'et fra trin 1 | Lokalt + Vercel |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Lokalt + Vercel |
| `SANITY_WEBHOOK_SECRET` | en tilfældig streng, du selv vælger | Vercel |
| `SANITY_WRITE_TOKEN` | token fra trin 3 | Kun lokalt, kun til importen |

`NEXT_PUBLIC_`-variablerne ender i browserbundtet. Det er i orden — de er
ikke hemmelige. De to andre er, og de må aldrig få det præfiks.

## 3. Flyt de eksisterende cases ind

Lav en token i [sanity.io/manage](https://sanity.io/manage) under
API → Tokens med rollen **Editor**. Se så, hvad der ville ske:

```
npm run sanity:import -- --torvejr
```

Og kør det:

```
npm run sanity:import
```

Scriptet uploader billederne fra `public/` — dem `build-assets.mjs` allerede
har komprimeret ned fra originalerne. Hver case får et fast id ud fra sit
slug, så en ekstra kørsel opdaterer frem for at lave dubletter.

## 4. Se dem i studiet

```
npm run dev
```

Åbn `/studio`. Log ind med den samme konto som i trin 1. Alle tre cases skal
være der, med billeder.

**Sæt et fokuspunkt på hvert billede.** Klik billedet, vælg Hotspot, og træk
cirklen hen på det, der skal blive i billedet. Det er dét, der afgør, hvor
beskæringen falder, når det samme billede vises i 4:5 og 16:9 — uden det
beskærer Sanity midt i billedet, hvilket på et portræt typisk er en mave.

## 5. Sæt webhooken op

Uden den udgiver Markus en case, og der sker ingenting, før nogen deployer.

I [sanity.io/manage](https://sanity.io/manage) under API → Webhooks:

| Felt | Værdi |
| --- | --- |
| URL | `https://mnmedia.dk/api/revalider` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type == "case"` |
| Secret | samme streng som `SANITY_WEBHOOK_SECRET` |
| HTTP method | POST |
| API version | `v2026-08-31` |

Prøv den: ret en overskrift i studiet, udgiv, og genindlæs siden. Ændringen
skal være der inden for få sekunder.

## 6. Fjern rampen

Når trin 1–5 virker, og casene er på sitet fra Sanity:

1. Slet `cases`-arrayet i `src/content/cases.ts`.
2. Behold typerne (`Case`, `Billede`, `Fakta`, `Ydelse`) og `kundeLogoer`.
3. Fjern `if (!konfigureret) return froCases;` og importen af `froCases` i
   `src/sanity/hent.ts`.

**Spring ikke det her trin over.** To kilder til de samme cases er præcis dét,
opsætningen er lavet for at undgå: så snart begge findes, kan de være uenige,
og ingen opdager hvilken der vandt.

## Hvad der IKKE er i CMS'et — og hvorfor

| Indhold | Hvorfor det bliver i koden |
| --- | --- |
| Ydelser | Fire bokse med ikoner fra et fast sæt. Et «vælg ikon»-felt er mere bøvl end værdi. |
| Om-siden | Ændrer sig næsten aldrig. |
| Adresse, telefon, sociale links | En pull request én gang om året. |
| Kundelogoer | `skala` er optisk justering, ikke data — den kræver et øje, ikke et felt. |
| Hero-klippene | Bygges af `build-assets.mjs` med håndvalgte klipvinduer, valgt så de er fri for indbrændte undertekster. Den omhu forsvinder i en upload-knap. |

## Sådan lægger Markus en ny case ind

1. `/studio` → Case → nyt dokument.
2. Kunde, tryk **Generate** ved adressen.
3. Kort beskrivelse (én sætning), lang beskrivelse.
4. Ydelser og tal — fire tal står pænest.
5. Cover (4:5), bredt topbillede (16:9), fire gallerbilleder. Fokuspunkt på
   hvert.
6. Udtalelse, hvis der er en. Ellers udelad den.
7. **Publish.**

Sitet opdaterer sig selv inden for få sekunder.
