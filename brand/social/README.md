# MNmedia — grafik til sociale profiler

Genereret af `brand/social.py` ud fra de samme filer som resten af
materialet. Ændrer mærket sig, køres `python3 brand/byg.py` og derefter
`python3 brand/social.py`.

## Profilbillede

`profil/profil-sort-1080.png` er den, der skal bruges alle steder —
Instagram, Facebook, LinkedIn, TikTok og YouTube. Ét billede rækker:
platformene skalerer selv ned, og mærket overlever den runde beskæring,
fordi det kun fylder 74 % af bredden.

`profil-hvid-1080.png` er til de få steder, hvor en lys baggrund er
påkrævet. Brug den ikke som standard — brandet står på sort.

## Bannere

| Fil | Til | Sikker zone |
| --- | --- | --- |
| `cover/facebook-cover-1640x664.png` | 1640×664 | 1090×500 — Telefonen beskærer til et smallere udsnit end computeren; zonen er fællesmængden af de to. |
| `cover/linkedin-firmacover-1128x376.png` | 1128×376 | 720×300 — Firmalogoet dækker cirka 160 px inde fra venstre kant; zonen er smallere end platformens eget mål, så vinklen går fri af det. |
| `cover/linkedin-banner-1584x396.png` | 1584×396 | 1100×320 — Profilbilledet lægger sig oven i venstre hjørne. |
| `cover/youtube-kanalbanner-2560x1440.png` | 2560×1440 | 1546×423 — Fjernsyn viser hele fladen, telefonen kun midterfeltet på 1546×423. |

Låsen står midt i alle bannere. Det er ikke en æstetisk beslutning:
midten er det eneste sted, der overlever både telefonens beskæring og
det profilbillede, platformene lægger oven i venstre hjørne.

Hjørnemarkørerne viser den sikre zone. De er samtidig sitets eget greb —
søgeren — og hører til her, fordi et banner er noget, man ser på.

## Instagram-highlights

Seks omslag i `highlights/`. Sæt dem som første billede i den story,
highlightet bygges af, og vælg dem som omslag.

Ord frem for ikoner, fordi et omslag vises som en cirkel på 161 px —
dér forsvinder et stregikon på 1,4 px. Et versalord i Archivo holder.

## Det her dækker ikke

Opslagsskabeloner, story-skabeloner og thumbnails. Det er en anden
opgave: den skal bruge rigtige billeder og rigtige tekster, ikke bare
mærket på en flade.
