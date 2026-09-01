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

## Det, der stadig mangler

**Webhooken.** Uden den udgiver Markus en case, og der sker ingenting, før
nogen deployer. `SANITY_WEBHOOK_SECRET` er allerede sat i Vercel — hent den
med `npx vercel env pull` og opret så webhooken i
[sanity.io/manage](https://www.sanity.io/manage/project/dgmcy88b) under
API → Webhooks:

| Felt | Værdi |
| --- | --- |
| URL | `https://mnmedia.dk/api/revalider` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type == "case"` |
| Secret | værdien af `SANITY_WEBHOOK_SECRET` |
| HTTP method | POST |
| API version | `v2026-08-31` |

Prøv den bagefter: ret en overskrift i studiet, udgiv, og genindlæs siden.

**Fokuspunkterne.** De importerede billeder har ingen. De ser rigtige ud nu,
fordi beskæringen tilfældigvis rammer, men det er held. Sæt dem, mens du
alligevel er i studiet.

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
