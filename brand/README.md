# MNmedia — logofiler

Forslag **01 Smal**, godkendt af Markus. Tegningen findes ét sted som kilde:
`src/components/layout/Logo.tsx`. Alt i denne mappe er genereret ud fra den —
retter du geometrien, skal filerne her laves om, ikke omvendt.

## Hvad ligger hvor

| Mappe  | Til hvad |
| ------ | -------- |
| `svg/` | Originalen. Skalerer i det uendelige. Til web, skiltefolie, broderi, alt hvor nogen skal have en vektor. |
| `pdf/` | Samme vektor, pakket som PDF. Det er den, en trykker eller en foliemand beder om. |
| `png/` | 2400 px bred, gennemsigtig bund. Til alt hvor der ikke kan lægges en vektor ind — sociale medier, PowerPoint, Word. |

Hvert format findes i tre udgaver:

- **`-hvid`** — hvid streg, gennemsigtig bund. Til mørke flader og til billeder med ro i.
- **`-sort`** — sort streg, gennemsigtig bund. Til hvidt papir og lyse flader.
- **`-hvid-paa-sort`** — hvid streg med sort firkant bagved. Til profilbillede, faneikon og alle de steder, hvor du ikke selv bestemmer bunden. Luften er bygget ind i filen, fordi firkanten er det: låsen har en halv mærkehøjde hele vejen rundt, og mærket alene står på et kvadrat og fylder 74 % af bredden.

Og i to opsætninger: **`-laas`** (mærket med ordet MEDIA) og **`-maerke`**
(monogrammet alene). Låsen er standarden. Mærket alene bruges kun, hvor der
ikke er plads til ordet — ikonet, profilbilledet, et broderi på et bryst.

## Når tegningen ændrer sig

```
python3 brand/byg.py
```

Scriptet læser stregmål og baner ud af `Logo.tsx` — det gentager dem ikke, så
der kan ikke opstå to sandheder. Kan det ikke finde tallene, stopper det frem
for at gætte. Ud kommer både filerne her i mappen og sitets egne flader:
faneikon, favicon, Apple-ikon og delebilledet. Kør det, commit det hele
sammen, og så er der aldrig en kopi tilbage, der viser et gammelt mærke.

Det kræver Python med `fontTools` og `Pillow`, netadgang (Archivo hentes, så
MEDIA kan lægges ud i konturer) og Google Chrome til PNG og PDF. Mangler
Chrome, skrives SVG'erne alligevel, og resten springes over med en besked.

## Designguiden

`brand/guide/` bygger den guide, Markus kan hente filerne fra:

```
python3 brand/guide/saml.py
```

Den læser de samme tal ud af `Logo.tsx` og pakker filerne fra `svg/`, `pdf/`
og `png/` ind i siden, så de kan hentes direkte. Kør `byg.py` først, hvis
tegningen har ændret sig — ellers pakker guiden de gamle filer ind.
Resultatet, `designguide.html`, er ikke versioneret; kilderne er.

## Reglerne

**Luft.** Der skal være mindst en halv mærkehøjde frit hele vejen rundt. Står
mærket 40 px højt, skal der være 20 px til nærmeste tekst, kant eller motiv.

**Mindste størrelse.** Låsen: 90 px eller 24 mm bred. Mærket alene: 16 px
eller 6 mm bredt. Under det lukker stregerne sig om hinanden.

**Farver.** Sort er `#0a0a0a`, hvid er `#ffffff`. Den lilla, `#6e3bff`, hører
til knapper på sitet — aldrig til mærket.

**Skriften.** MEDIA er Archivo i smalt snit (wdth 80, vægt 500, spærring
0.15em). I filerne her er den lagt ud i konturer, så den ikke kan falde
tilbage til noget andet. Skal du sætte ordet på ny, er det de tal, der gælder.

## Det man ikke gør

- Farver mærket. Det findes i sort og hvid, og det er dét.
- Sætter hjørnemarkører om mærket. De er sitets søger og hører til på det, man
  ser på — foto og film. Ligger de også om afsenderen, holder de op med at
  betyde noget.
- Trækker det bredere eller smallere. Bredden er en del af tegningen.
- Skiller M og N ad. De deler den lodrette streg — det er hele mærket.
- Lægger den hvide udgave på et lyst eller uroligt billede uden at dæmpe
  billedet først. 01 Smal er den mest afdæmpede af de fire forslag; den vil
  gerne have ro bag sig.
