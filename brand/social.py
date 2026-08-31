#!/usr/bin/env python3
"""Bygger det grafiske til MNmedias sociale profiler.

    python3 brand/social.py            (køres fra web/)

Kør brand/byg.py FØRST — det her script bruger de færdige SVG'er derfra som
kilde, så profilbilledet og bannerne viser præcis det samme mærke som sitet.

Ud kommer brand/social/:
  profil/       profilbillede, kvadratisk, i sort og hvid
  cover/        bannere til Facebook, LinkedIn og YouTube
  highlights/   runde omslag til Instagram-highlights

Hvert format er tegnet efter platformens egne mål OG dens sikre zone: det er
ikke det samme. Facebook beskærer sit cover til et andet forhold på telefon
end på computer, og LinkedIn og YouTube lægger profilbilledet oven i hjørnet
af banneret. Derfor står låsen midt i alle bannere — det er det eneste sted,
der overlever hver beskæring.

Kræver Google Chrome. Uden den kan billederne ikke rendres.
"""

import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request

ARCHIVO = "https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf"

ROD = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROD, "brand")
UD = os.path.join(BRAND, "social")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

INK, PAPER, HAIR, GREY = "#0a0a0a", "#ffffff", "#232328", "#8a8a92"

FONTE = (
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
    "family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400"
    '&display=block">'
)


def laas(farve="hvid"):
    """Låsen som fil-URL. Den er allerede konturlagt af byg.py."""
    return "file://" + os.path.join(BRAND, "svg", f"mnmedia-laas-{farve}.svg")


def maerke(farve="hvid"):
    return "file://" + os.path.join(BRAND, "svg", f"mnmedia-maerke-{farve}.svg")


def side(bredde, hoejde, krop, bg=INK, stil=""):
    return (
        f"<!doctype html><meta charset=utf-8>{FONTE}<style>"
        f"*{{margin:0;padding:0;box-sizing:border-box}}"
        f"html,body{{width:{bredde}px;height:{hoejde}px;background:{bg};overflow:hidden}}"
        f"body{{position:relative;display:flex;align-items:center;justify-content:center}}"
        f"img{{display:block}}"
        f"{stil}</style>{krop}"
    )


def hjoerner(inset, stoerrelse, tykkelse=1, farve=HAIR):
    """Søgeren. Fire vinkler, ikke en kasse — samme greb som på sitet."""
    b = f"position:absolute;width:{stoerrelse}px;height:{stoerrelse}px;border:0 solid {farve}"
    return "".join(
        f'<span style="{b};{a}:{inset}px;{c}:{inset}px;'
        f"border-{a}-width:{tykkelse}px;border-{c}-width:{tykkelse}px\"></span>"
        for a in ("top", "bottom")
        for c in ("left", "right")
    )


def render(html, ud, bredde, hoejde):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as fh:
        fh.write(html)
        sti = fh.name
    try:
        subprocess.run(
            [
                CHROME, "--headless", "--disable-gpu", "--no-sandbox",
                "--hide-scrollbars", "--virtual-time-budget=5000",
                f"--window-size={bredde},{hoejde}", f"--screenshot={ud}",
                f"file://{sti}",
            ],
            capture_output=True,
        )
    finally:
        os.unlink(sti)


# --------------------------------------------------------------------------
# Profilbillede
# --------------------------------------------------------------------------
def profilbilleder():
    """Kvadratisk, mærket på 74 % af bredden.

    Alle platforme beskærer profilbilledet til en cirkel. Mærkets hjørner
    ligger i 0,418 gange sidelængden fra midten, cirklen i 0,5 — så det
    overlever beskæringen med luft til overs. Derfor er der ingen særskilt
    rund udgave: den firkantede ER den runde.
    """
    mappe = os.path.join(UD, "profil")
    os.makedirs(mappe, exist_ok=True)
    n = 1080
    for navn, farve, bg in (
        ("profil-sort", "hvid", INK),
        ("profil-hvid", "sort", PAPER),
    ):
        krop = f'<img src="{maerke(farve)}" style="width:74%">'
        render(side(n, n, krop, bg=bg), os.path.join(mappe, f"{navn}-{n}.png"), n, n)
    print(f"profil/  2 filer · {n}×{n}")


# --------------------------------------------------------------------------
# Bannere
# --------------------------------------------------------------------------
# (filnavn, bredde, højde, låsens bredde, sikker zone b×h, hvad zonen dækker)
BANNERE = [
    ("facebook-cover", 1640, 664, 560, (1090, 500),
     "Telefonen beskærer til et smallere udsnit end computeren; zonen er "
     "fællesmængden af de to."),
    ("linkedin-firmacover", 1128, 376, 420, (720, 300),
     "Firmalogoet dækker cirka 160 px inde fra venstre kant; zonen er smallere "
     "end platformens eget mål, så vinklen går fri af det."),
    ("linkedin-banner", 1584, 396, 460, (1100, 320),
     "Profilbilledet lægger sig oven i venstre hjørne."),
    ("youtube-kanalbanner", 2560, 1440, 620, (1546, 423),
     "Fjernsyn viser hele fladen, telefonen kun midterfeltet på 1546×423."),
]


def bannere():
    mappe = os.path.join(UD, "cover")
    os.makedirs(mappe, exist_ok=True)
    for navn, b, h, laas_b, (zb, zh), _ in BANNERE:
        # Vinklerne markerer den sikre zone. De er ikke pynt her: de viser,
        # hvor langt indholdet må gå, og de er samtidig sitets eget greb.
        #
        # De sættes 28 px INDE i zonen, ikke på kanten af den. Ligger de på
        # kanten, skærer telefonens beskæring lige igennem dem — så er det
        # ikke en ramme længere, men fire halve streger i hjørnerne.
        inset_x = (b - zb) // 2 + 28
        inset_y = (h - zh) // 2 + 28
        hj = "".join(
            f'<span style="position:absolute;width:34px;height:34px;'
            f"border:0 solid {HAIR};{a}:{inset_y}px;{c}:{inset_x}px;"
            f"border-{a}-width:1px;border-{c}-width:1px\"></span>"
            for a in ("top", "bottom")
            for c in ("left", "right")
        )
        krop = (
            hj
            + '<div style="display:flex;flex-direction:column;align-items:center;'
            f'gap:{round(laas_b * 0.085)}px">'
            f'<img src="{laas()}" style="width:{laas_b}px">'
            '<p style="font-family:\'Geist Mono\',monospace;'
            f"font-size:{max(12, round(laas_b * 0.031))}px;letter-spacing:.22em;"
            f'text-transform:uppercase;color:{GREY}">'
            "Branding &middot; Sociale medier &middot; Annoncering</p></div>"
        )
        render(side(b, h, krop), os.path.join(mappe, f"{navn}-{b}x{h}.png"), b, h)
    print(f"cover/   {len(BANNERE)} filer")


# --------------------------------------------------------------------------
# Instagram-highlights
# --------------------------------------------------------------------------
# Ordene frem for ikoner: et omslag vises som en cirkel på 161 px, og dér er
# et stregikon på 1,4 px vægt væk. Et versalord i Archivo holder.
HIGHLIGHTS = ["Some", "Video", "Annoncer", "Branding", "Cases", "Om os"]


def ordbredder(ord_liste):
    """Hvert ords bredde i em, målt i selve skriften.

    Uden målingen ville et sæt omslag have seks forskellige ordbredder, og
    sat ved siden af hinanden i en profil ser det tilfældigt ud. Med den kan
    hver skriftgrad regnes ud, så alle ord bliver præcis lige brede.
    """
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont

    with tempfile.TemporaryDirectory() as tmp:
        sti = os.path.join(tmp, "a.ttf")
        urllib.request.urlretrieve(ARCHIVO, sti)
        f = instantiateVariableFont(TTFont(sti), {"wght": 600, "wdth": 112})
        upem, cmap, hmtx = f["head"].unitsPerEm, f.getBestCmap(), f["hmtx"]
        SPORING = -0.015  # samme sporing som .headline på sitet
        return {
            o: sum(hmtx[cmap[ord(c)]][0] for c in o.upper()) / upem
            + SPORING * len(o)
            for o in ord_liste
        }


def highlights():
    mappe = os.path.join(UD, "highlights")
    os.makedirs(mappe, exist_ok=True)
    n = 1080
    # Én skriftgrad for alle seks, sat efter det længste ord. Lige BREDDE var
    # det oplagte forsøg, men det giver seks forskellige skriftgrader, og så
    # ser sættet mere tilfældigt ud, end da ordene bare var forskelligt lange.
    # Fælles grad og fælles versalhøjde er dét, der får dem til at læses som
    # ét sæt; at de korte ord fylder mindre er normalt.
    #
    # 70 % af diameteren: cirklen er 1080 bred på midten, men et ord helt ude
    # ved kanten ser ud, som om det er ved at falde ud af den.
    bredder = ordbredder(HIGHLIGHTS)
    grad = round(n * 0.70 / max(bredder.values()))
    for ord_ in HIGHLIGHTS:
        # Ingen søger her. Et omslag vises som en cirkel på 161 px, og en
        # hårstreg ville lande på under én pixel — under mærkets egen
        # mindstestørrelse. Ordet må bære det alene, og så skal det være stort.
        krop = (
            '<p style="font-family:Archivo,sans-serif;'
            'font-variation-settings:\'wdth\' 112;font-weight:600;'
            "text-transform:uppercase;letter-spacing:-.015em;white-space:nowrap;"
            f'font-size:{grad}px;color:{PAPER};line-height:1">{ord_}</p>'
        )
        fil = ord_.lower().replace(" ", "-").replace("ø", "oe")
        render(side(n, n, krop), os.path.join(mappe, f"highlight-{fil}-{n}.png"), n, n)
    print(f"highlights/ {len(HIGHLIGHTS)} filer · {n}×{n} · skriftgrad {grad} px")


def laesmig():
    linjer = [
        "# MNmedia — grafik til sociale profiler",
        "",
        "Genereret af `brand/social.py` ud fra de samme filer som resten af",
        "materialet. Ændrer mærket sig, køres `python3 brand/byg.py` og derefter",
        "`python3 brand/social.py`.",
        "",
        "## Profilbillede",
        "",
        "`profil/profil-sort-1080.png` er den, der skal bruges alle steder —",
        "Instagram, Facebook, LinkedIn, TikTok og YouTube. Ét billede rækker:",
        "platformene skalerer selv ned, og mærket overlever den runde beskæring,",
        "fordi det kun fylder 74 % af bredden.",
        "",
        "`profil-hvid-1080.png` er til de få steder, hvor en lys baggrund er",
        "påkrævet. Brug den ikke som standard — brandet står på sort.",
        "",
        "## Bannere",
        "",
        "| Fil | Til | Sikker zone |",
        "| --- | --- | --- |",
    ]
    for navn, b, h, _, (zb, zh), note in BANNERE:
        linjer.append(f"| `cover/{navn}-{b}x{h}.png` | {b}×{h} | {zb}×{zh} — {note} |")
    linjer += [
        "",
        "Låsen står midt i alle bannere. Det er ikke en æstetisk beslutning:",
        "midten er det eneste sted, der overlever både telefonens beskæring og",
        "det profilbillede, platformene lægger oven i venstre hjørne.",
        "",
        "Hjørnemarkørerne viser den sikre zone. De er samtidig sitets eget greb —",
        "søgeren — og hører til her, fordi et banner er noget, man ser på.",
        "",
        "## Instagram-highlights",
        "",
        "Seks omslag i `highlights/`. Sæt dem som første billede i den story,",
        "highlightet bygges af, og vælg dem som omslag.",
        "",
        "Ord frem for ikoner, fordi et omslag vises som en cirkel på 161 px —",
        "dér forsvinder et stregikon på 1,4 px. Et versalord i Archivo holder.",
        "",
        "## Det her dækker ikke",
        "",
        "Opslagsskabeloner, story-skabeloner og thumbnails. Det er en anden",
        "opgave: den skal bruge rigtige billeder og rigtige tekster, ikke bare",
        "mærket på en flade.",
    ]
    open(os.path.join(UD, "README.md"), "w").write("\n".join(linjer) + "\n")


def main():
    if not os.path.exists(CHROME):
        sys.exit("Google Chrome blev ikke fundet — billederne kan ikke rendres.")
    if not os.path.exists(os.path.join(BRAND, "svg", "mnmedia-laas-hvid.svg")):
        sys.exit("brand/svg mangler. Kør `python3 brand/byg.py` først.")
    shutil.rmtree(UD, ignore_errors=True)
    os.makedirs(UD, exist_ok=True)
    profilbilleder()
    bannere()
    highlights()
    laesmig()
    print("\nFærdig — brand/social/")


if __name__ == "__main__":
    main()
