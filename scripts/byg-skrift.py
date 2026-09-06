"""
Bygger sitets overskriftsskrift.

Archivo hentes fra Google Fonts som variabel skrift med to akser: bredde
(wdth 62-125) og vægt (wght 100-900). Latin-udsnittet af den fylder 88 KiB,
og den bærer sitets LCP-element — overskrifterne og ordet i mærket.

Sitet bruger to punkter på de akser, og kun to:

    wdth 112 / vægt 600   overskrifter (.headline i globals.css)
    wdth  80 / vægt 500   ordet «media» i mærket (Logo.tsx)

Alt uden for det er data, ingen ser. Scriptet her klipper akserne ned til
80-112 og 500-600 og skriver resultatet til src/app/fonts/. Det halverer
filen, og fordi den hentes fra samme kilde som next/font gjorde, er den
resterende del bit for bit den samme skrift — ikke en anden version.

Båndet er bevidst lidt bredere end de to punkter. Bredde-aksen er sitets
signatur, og globals.css lægger op til at den kan justeres; inden for 80-112
kan den justeres uden at køre scriptet igen. Skal den uden for, så ret
AKSER herunder og kør igen.

Kør:
    python3 -m venv .venv && .venv/bin/pip install fonttools brotli
    .venv/bin/python scripts/byg-skrift.py
"""

import re
import urllib.request
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

# Hele det udsnit, Google udleverer — vi beder om alt og klipper selv, så
# filen kan sammenlignes med den, next/font hentede.
KILDE = (
    "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900"
)
UDSNIT = "latin"
AKSER = {"wght": (500, 600, 600), "wdth": (80, 100, 112)}
UD = Path("src/app/fonts/archivo-mnmedia.woff2")

# Uden en browser-agent svarer Google med truetype frem for woff2.
AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
)


def hent(url: str) -> bytes:
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": AGENT})
    ).read()


css = hent(KILDE).decode()
blok = re.search(rf"/\*\s*{UDSNIT}\s*\*/\s*@font-face\s*\{{([^}}]*)\}}", css)
if not blok:
    raise SystemExit(f"Fandt ikke «{UDSNIT}» i svaret fra Google.")
raa = hent(re.search(r"url\((https[^)]+)\)", blok.group(1)).group(1))

skrift = TTFont(__import__("io").BytesIO(raa))
instancer.instantiateVariableFont(skrift, AKSER, inplace=True)
skrift.flavor = "woff2"
UD.parent.mkdir(parents=True, exist_ok=True)
skrift.save(UD)

print(f"{UDSNIT}: {len(raa) / 1024:.1f} KiB → {UD.stat().st_size / 1024:.1f} KiB")
for tag, (lav, _, hoej) in AKSER.items():
    print(f"  {tag} {lav}-{hoej}")
