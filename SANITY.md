# Sanity — sitets indhold

Markus retter selv sitet. Alle fem sider og alle cases ligger i CMS'et; det,
der bliver i koden, står i tabellen længere nede sammen med grunden.

|         |                                                                                |
| ------- | ------------------------------------------------------------------------------ |
| Projekt | `dgmcy88b` — [sanity.io/manage](https://www.sanity.io/manage/project/dgmcy88b) |
| Datasæt | `production`                                                                   |
| Studio  | `/studio` på sitet                                                             |

## Sådan retter Markus en side

I studiet står fem sider øverst — Forside, Ydelser, Cases, Om MNmedia,
Kontakt — og casene nedenunder for sig. Siderne er faste: der er hverken en
«opret ny» eller en «slet». Det er med vilje. Sitet har fem adresser, skrevet
i koden, og en sjette side ville være indhold, der aldrig kom nogen steder.

Hver side er en liste af sektioner, og på den kan han:

- **Rette al tekst** — overskrifter, brødtekst, punkter, tekst på knapper, og
  det Google viser (fanen «Google og deling»).
- **Bytte om på rækkefølgen** ved at trække i håndtaget til venstre for en
  sektion.
- **Slå en sektion fra** med «Skjul sektionen». Den bliver stående med sit
  indhold, men vises ikke. Brug den frem for at slette: en sektion, der skal
  væk et halvt år, skal ikke koste et genskrivningsjob.
- **Skifte billeder** ud. Husk fokuspunktet — se punkt 6 i case-opskriften.

### Et linjeskift i en overskrift er et designværktøj

Det er den ene ting, der er værd at læse, før han går i gang, fordi den ikke
kan gættes.

Overskrifterne er sat i brede versaler, og dér afgør ombrydningen rytmen.
Derfor gør et linjeskift i overskriftsfeltet noget:

- **Skriver han overskriften i ét stykke,** ombryder browseren den, hvor der
  bliver plads. På en bred skærm står den måske i to linjer, på en telefon i
  tre, og han bestemmer det ikke.
- **Sætter han selv linjeskiftene,** står de — på alle skærme, helt ned til
  den smalleste telefon.

Prisen for at bestemme selv er skriftgrad: sitet skruer graden ned, indtil den
længste linje kan stå hel. Jo længere en linje han sætter, jo mindre bliver
overskriften på en telefon.

Han kan ikke lave det i stykker. Sitet regner grænsen ud af overskriftens egne
bogstaver, så et ord aldrig bliver hakket over, uanset hvad han skriver.
Værktøjet bestemmer kun, hvor rytmen ligger.

## Sådan lægger Markus en ny case ind

1. `/studio` → **Cases** → nyt dokument.
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
udfyldt. Listen i studiet siger, hvad der mangler.

Det er med vilje: Sanity advarer om tomme felter, men forhindrer ikke
udgivelse. Uden filteret kunne en halvfærdig case tage hele /cases ned med en
fejlside.

## Hvad der ikke er i CMS'et — og hvorfor

Reglen bag tabellen er den samme hver gang: **kan feltet ikke udfyldes rigtigt
uden et øje for det, hører det ikke hjemme i et felt.**

| Indhold                         | Hvorfor det bliver i koden                                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kundelogoerne                   | Hvert mærke har en `skala`, der retter den optiske vægt op — et bredt mærke fylder mere end et cirkulært ved samme højde. Tallet er justeret i øjet, ikke udregnet. Kun teksten over rækken kan rettes. |
| Hero-klippene                   | Bygges af `build-assets.mjs` med håndvalgte klipvinduer, valgt så de er fri for indbrændte undertekster. Den omhu forsvinder i en upload-knap.                                                          |
| Adresse, telefon, sociale links | En pull request én gang om året — og de står tre steder: kontaktsiden, sidefoden og strukturdataene til Google. Tre felter, der skal rettes samtidig, er tre steder at glemme det ene.                  |
| Ikonernes tegning               | Markus vælger frit mellem de syv, der findes. Et nyt ikon skal tegnes, ikke skrives.                                                                                                                    |
| Kontaktformularen               | Felterne, valideringen og afsendelsen er ikke indhold. Teksten omkring den kan rettes.                                                                                                                  |

**Ydelserne og om-siden stod her engang.** Argumentet var, at et
«vælg ikon»-felt var mere bøvl end værdi, og at om-siden næsten aldrig ændrer
sig. Det holdt ikke, da hele siden skulle kunne rettes: ikonfeltet blev en
dropdown over de syv, og det tog en halv time. Vi skiftede mening, og det er
værd at vide — argumentet «det ændrer sig næsten aldrig» er svagt, når
alternativet er, at nogen skal bede om hjælp for at rette en tastefejl.

## Sådan hænger det sammen

To steder henter sitet indhold, og begge oversætter Sanitys form til den,
komponenterne kender:

- **`src/sanity/hent.ts`** — casene. Den oversætter til `Case`-typen i
  `src/content/cases.ts`, den samme form komponenterne arbejdede med, da
  indholdet lå i koden. Det var dét, der gjorde flytningen til et query-skift
  frem for en omskrivning.
- **`src/sanity/sider.ts`** — siderne. Skjulte sektioner filtreres fra i selve
  forespørgslen, ikke i React: filtrerer man i komponenten, er indholdet
  allerede sendt til browseren, og «skjult» bliver noget, man kan læse i
  kildekoden.

`src/components/sektioner/Sektioner.tsx` er det ene sted, hvor en sektion fra
Sanity bliver til noget på skærmen. Kommer der en sektionstype til i skemaet,
og glemmer nogen at koble den her, fejler typetjekket — frem for at siden
stille mangler et stykke.

**Der er ingen reserve.** Under migreringen lå der en kopi af indholdet i
koden, så sitet kunne bygge før projektet fandtes. Den er væk. Mangler
`NEXT_PUBLIC_SANITY_PROJECT_ID`, fejler byggeriet med en besked, der siger
hvad der mangler — frem for stille at vise noget forældet.

Billederne beskæres i URL'en, ikke med CSS. `src/sanity/billede.ts` beder
Sanity om det format, sitet skal bruge, og Sanity beskærer omkring
fokuspunktet. Overlod vi det til `object-cover`, ville beskæringen altid ramme
midten, og fokuspunktet ville være pynt.

## Webhooken — den kører

Uden den retter Markus noget, og der sker ingenting, før nogen deployer.

|         |                                     |
| ------- | ----------------------------------- |
| Navn    | `mnmedia`                           |
| URL     | `https://mn-media.dk/api/revalider` |
| Datasæt | `production`                        |
| Filter  | tomt — med vilje, se nedenfor       |

**Filteret skal være tomt.** Det stod på `_type == "case"`, dengang cases var
det eneste i CMS'et. Ruten afgør nu selv, hvad der skal genopfriskes, ud fra
den dokumenttype den får, og den liste står i `src/app/api/revalider/route.ts`
ved siden af de mærker, den handler om. Et filter i en webhook-opsætning er én
tekststreng, ingen ser igen: glemmer man at udvide den, når der kommer en ny
dokumenttype, fejler ingenting synligt. Man udgiver bare noget, der aldrig
kommer frem.

Tjek at den virker:

```
npx sanity hook logs mnmedia
```

Linjerne skal sige `success` og `200`. I praksis: ret en overskrift i studiet,
udgiv, og genindlæs siden. Ændringen skal være der ved **første**
genindlæsning — det kostede en runde at få rigtigt, så dukker den først op ved
anden, er der noget galt. Målt 7. september: ti sekunder fra Publish til
ændringen stod på sitet, og den blev der.

Selve ruten kan du banke på uden at røre indhold:

```
curl -X POST -d '{"_type":"case"}' https://mn-media.dk/api/revalider
```

`401 Ugyldig signatur` er det rigtige svar — den afviser et kald uden
underskrift, og hemmeligheden er altså på plads i begge ender. Svarer den
`500 Webhooken er ikke sat op`, mangler `SANITY_WEBHOOK_SECRET` i Vercel.

> Her stod tidligere, at webhookens URL ikke kunne rettes uden at slette og
> oprette den på ny med en ny hemmelighed, og at det derfor ikke var besværet
> værd. **Det var forkert.** `sanity hook` kan kun create og delete, men
> Sanitys egen brugerflade har en «Edit webhook», hvor både URL og filter kan
> rettes uden at røre hemmeligheden. Det tog et minut. Sætningen stod der,
> fordi jeg konkluderede ud fra hvad kommandolinjen kunne, og ikke tjekkede
> fladen.

## Hvis webhooken skal laves om

Skal du kun rette URL eller filter, så brug **Edit webhook** i
[sanity.io/manage](https://www.sanity.io/manage/project/dgmcy88b) —
hemmeligheden skal ikke røres. Resten her gælder kun, hvis den skal laves helt
forfra.

Hemmeligheden er en delt streng: Sanity underskriver hvert kald med den, og
sitet tjekker underskriften med den samme værdi. Er de ikke ens, afvises
kaldet med 401 — det er dét, der forhindrer en fremmed i at finde adressen og
tvinge sitet til at genopfriske sig selv i en uendelighed.

**Find på hemmeligheden, når du opretter webhooken, og læg den derefter i
Vercel.** Ikke omvendt: Vercel giver ikke krypterede værdier tilbage, så en
hemmelighed, der kun står dér, kan du ikke slå op igen.

Lav den med denne kommando i terminalen:

```
openssl rand -hex 24
```

Den SKRIVER en tilfældig streng på 48 tegn — noget i retning af
`9f3a1c...`. Det er dén streng, der skal i Secret-feltet. Ikke kommandoen
selv. Kopiér den, mens du har den: hverken Sanity eller Vercel viser den
igen bagefter.

Opret webhooken under API → Webhooks:

| Felt        | Værdi                               |
| ----------- | ----------------------------------- |
| URL         | `https://mn-media.dk/api/revalider` |
| Dataset     | `production`                        |
| Trigger on  | Create, Update, Delete              |
| Filter      | **tomt**                            |
| Secret      | strengen fra `openssl` ovenfor      |
| HTTP method | POST                                |
| API version | `v2026-08-31`                       |

Læg så den samme streng i Vercel og deploy, så den kommer med:

```
npx vercel env rm SANITY_WEBHOOK_SECRET production
npx vercel env add SANITY_WEBHOOK_SECRET production
```

## Det, der stadig mangler

**Fokuspunkterne på de importerede billeder.** De billeder, der kom ind ved
migreringen, har ingen. De ser rigtige ud, fordi beskæringen tilfældigvis
rammer, men det er held: samme billede vises i både 4:5 og 16:9, og uden et
fokuspunkt beskærer Sanity om midten. Sæt dem, mens du alligevel er i studiet.

Sådan tæller du, hvor mange der mangler. Brug kommandoen frem for at stole på
et tal i et dokument — her stod «0 ud af 18», og det var forældet inden for et
døgn, fordi nogen satte det første:

```
npx sanity documents query --api-version 2026-08-31 \
  '*[_type=="case"]{kunde,"cover":defined(cover.hotspot),"bred":defined(bred.hotspot)}'
```

**Portrættet af Markus.** Om-siden har et tomt felt, hvor det skal stå. Det
bliver stående tomt, indtil der er et rigtigt billede: der lå engang et i
mappen, men det var en håndværker fra en kundes materiale, sat ind under
overskriften «Mød personen bag MNmedia». Et tomt felt er bedre end en anden
mands medarbejder.

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

```
npx sanity dataset export production
```

Henter det hele — cases, sider, tekst og billeder — som ét arkiv. Kør det, før
du laver noget, du ikke kan fortryde.

Det gælder nu også sidernes indhold. En gendannelse ruller derfor Markus'
sideændringer tilbage sammen med casene, til det arkivet indeholder — så tag
en ny, før du gendanner en gammel:

```
npx sanity dataset import <arkiv.tar.gz> production --replace
```
