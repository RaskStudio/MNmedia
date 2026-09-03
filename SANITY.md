# Sanity — cases i et CMS

Markus lægger selv cases ind. Alt andet indhold ligger i koden; kun cases er
flyttet, fordi kun cases vokser med hver ny kunde.

| | |
| --- | --- |
| Projekt | `dgmcy88b` — [sanity.io/manage](https://www.sanity.io/manage/project/dgmcy88b) |
| Datasæt | `production` |
| Studio | `/studio` på sitet |

## Sådan lægger Markus en ny case ind

1. `/studio` → **Case** → nyt dokument.
2. Kunde, og tryk **Generate** ved adressen.
3. Kort beskrivelse (én sætning), lang beskrivelse.
4. Ydelser, tal og rækkefølge. Fire tal står pænest; laveste rækkefølge
   øverst.
5. Cover (4:5), bredt topbillede (16:9) og fire gallerbilleder.
6. **Sæt et fokuspunkt på hvert billede.** Klik billedet → Hotspot → træk
   cirklen hen på det, der skal blive i billedet. Det er dét, der afgør, hvor
   beskæringen falder, når det samme billede vises i både 4:5 og 16:9. Uden
   det beskærer Sanity midt i billedet, hvilket på et portræt typisk er en
   mave.
7. Udtalelse, hvis der er en. Ellers udelad den.
8. **Publish.**

**En case dukker først op, når den er færdig.** Sitet viser kun cases, der har
kunde, adresse, begge beskrivelser og begge billeder. Mangler ét af dem, står
casen i studiet, men ikke på sitet — den kommer af sig selv, når feltet er
udfyldt.

Det er med vilje: Sanity advarer om tomme felter, men forhindrer ikke
udgivelse. Uden filteret kunne en halvfærdig case tage hele /cases ned med en
fejlside.

## Hvad der ikke er i CMS'et — og hvorfor

| Indhold | Hvorfor det bliver i koden |
| --- | --- |
| Ydelser | Fire bokse med ikoner fra et fast sæt. Et «vælg ikon»-felt er mere bøvl end værdi. |
| Om-siden | Ændrer sig næsten aldrig. |
| Adresse, telefon, sociale links | En pull request én gang om året. |
| Kundelogoer | `skala` er optisk justering, ikke data — den kræver et øje, ikke et felt. |
| Hero-klippene | Bygges af `build-assets.mjs` med håndvalgte klipvinduer, valgt så de er fri for indbrændte undertekster. Den omhu forsvinder i en upload-knap. |

## Sådan hænger det sammen

`src/sanity/hent.ts` er det eneste sted, sitet henter cases. Den oversætter
Sanitys svar til `Case`-typen i `src/content/cases.ts` — den samme form,
komponenterne arbejdede med, da indholdet lå i koden. Det var dét, der gjorde
flytningen til et query-skift frem for en omskrivning.

**Der er ingen reserve.** Under migreringen lå der en kopi af casene i koden,
så sitet kunne bygge før projektet fandtes. Den er væk. Mangler
`NEXT_PUBLIC_SANITY_PROJECT_ID`, fejler byggeriet med en besked, der siger
hvad der mangler — frem for stille at vise noget forældet.

Billederne beskæres i URL'en, ikke med CSS. `src/sanity/billede.ts` beder
Sanity om det format, sitet skal bruge, og Sanity beskærer omkring
fokuspunktet. Overlod vi det til `object-cover`, ville beskæringen altid ramme
midten, og fokuspunktet ville være pynt.

## Webhooken — den kører

Uden den udgiver Markus en case, og der sker ingenting, før nogen deployer.
Den er oprettet og leverer.

| | |
| --- | --- |
| Navn | `mnmedia` |
| URL | `https://mn-media-seven.vercel.app/api/revalider` |
| Datasæt | `production` |

Tjek at den stadig virker:

```
npx sanity hook logs mnmedia
```

Linjerne skal sige `success` og `200`. Vil du hellere prøve den i praksis:
ret en overskrift i studiet, udgiv, og genindlæs siden. Ændringen skal være
der ved **første** genindlæsning — det kostede en runde at få rigtigt, så
dukker den først op ved anden, er der noget galt.

Selve ruten kan du banke på uden at røre indhold:

```
curl -X POST -d '{"_type":"case"}' https://mn-media.dk/api/revalider
```

`401 Ugyldig signatur` er det rigtige svar — den afviser et kald uden
underskrift, og hemmeligheden er altså på plads i begge ender. Svarer den
`500 Webhooken er ikke sat op`, mangler `SANITY_WEBHOOK_SECRET` i Vercel.

**URL'en peger på vercel.app-adressen, ikke på mn-media.dk.** Begge svarer
det samme, så den virker — men det står der ved en tilfældighed, ikke
med vilje. Den bliver stående, fordi `sanity hook` kun kan create og delete,
ikke update: at flytte den betyder at slette webhooken og lave en ny, og så
skal der findes en ny hemmelighed og lægges i Vercel igen. Prisen er et
vindue, hvor genopfriskning er død, for at rette en adresse der virker. Gør
det næste gang hemmeligheden alligevel skal skiftes.

## Hvis webhooken skal laves om

Hemmeligheden er en delt streng: Sanity underskriver hvert kald med den, og
sitet tjekker underskriften med den samme værdi. Er de ikke ens, afvises
kaldet med 401 — det er dét, der forhindrer en fremmed i at finde adressen og
tvinge sitet til at genopfriske sig selv i en uendelighed.

**Find på den, når du opretter webhooken, og læg den derefter i Vercel.**
Ikke omvendt: Vercel giver ikke krypterede værdier tilbage, så en hemmelighed,
der kun står dér, kan du ikke slå op igen.

Lav den med denne kommando i terminalen:

```
openssl rand -hex 24
```

Den SKRIVER en tilfældig streng på 48 tegn — noget i retning af
`9f3a1c...`. Det er dén streng, der skal i Secret-feltet. Ikke kommandoen
selv. Kopiér den, mens du har den: hverken Sanity eller Vercel viser den
igen bagefter.

Opret webhooken i
[sanity.io/manage](https://www.sanity.io/manage/project/dgmcy88b) under
API → Webhooks:

| Felt | Værdi |
| --- | --- |
| URL | `https://mn-media.dk/api/revalider` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type == "case"` |
| Secret | strengen fra `openssl` ovenfor |
| HTTP method | POST |
| API version | `v2026-08-31` |

Læg så den samme streng i Vercel og deploy, så den kommer med:

```
npx vercel env rm SANITY_WEBHOOK_SECRET production
npx vercel env add SANITY_WEBHOOK_SECRET production
```

## Det, der stadig mangler

**Fokuspunkterne.** Ingen af de importerede billeder har et — 0 ud af 18,
talt i datasættet. De ser rigtige ud nu, fordi beskæringen tilfældigvis
rammer, men det er held: samme billede vises i både 4:5 og 16:9, og uden et
fokuspunkt beskærer Sanity om midten. Sæt dem, mens du alligevel er i
studiet. Se punkt 6 i opskriften øverst.

Sådan tæller du dem selv:

```
npx sanity documents query --api-version 2026-08-31 \
  '*[_type=="case"]{kunde,"cover":defined(cover.hotspot),"bred":defined(bred.hotspot)}'
```

## Adgang

Studiet er ikke i menuen. Adgangen styres af Sanity: uden et login på
projektet ser man en login-skærm.

Skal Markus have adgang, inviteres han i
[sanity.io/manage](https://www.sanity.io/manage/project/dgmcy88b) under
Members. Gratisniveauet giver 20 pladser.

Datasættet er **public** på gratisniveauet. Indhold kan altså læses af enhver,
der kender projekt-id'et — også kladder. For et site, hvis indhold alligevel
udgives, er det uden betydning, men det giver én regel:

> **Kunden godkender casen, før den skrives ind.**

## Backup

`npx sanity dataset export production` henter det hele — dokumenter og
billeder — som ét arkiv. Kør det, før du laver noget, du ikke kan fortryde.
