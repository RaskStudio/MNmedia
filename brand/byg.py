#!/usr/bin/env python3
"""Genskaber alle afledte udgaver af MNmedias mærke.

    python3 brand/byg.py            (køres fra web/)

Originalen er tegningen i src/components/layout/Logo.tsx. Det her script
LÆSER de tal derfra frem for at gentage dem, så der ikke kan opstå to
sandheder: ændrer du stregmål eller punkter i komponenten, kører du scriptet,
og alt andet følger med. Kan tallene ikke findes, stopper scriptet — det
gætter aldrig.

Ud kommer:
  brand/svg, brand/png, brand/pdf   filer til tryk, folie og sociale medier
  src/app/icon.svg                  faneikon
  src/app/favicon.ico               faneikon, 16/32/48 til ældre browsere
  src/app/apple-icon.png            hjemmeskærm på iOS
  src/app/{opengraph,twitter}-image.png   billedet når nogen deler et link

Kræver: Python med fontTools og Pillow, og netadgang til Google Fonts (ordet
MEDIA lægges ud i konturer, og det kræver selve skriftfilen). Google Chrome
bruges til PNG og PDF; mangler den, skrives SVG'erne alligevel, og resten
springes over med en besked.
"""

import os
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import urllib.request

ROD = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROD, "brand")
APP = os.path.join(ROD, "src", "app")
LOGO_TSX = os.path.join(ROD, "src", "components", "layout", "Logo.tsx")

ARCHIVO = "https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Ordets opsætning. Den står også i Logo.tsx, men som CSS — og CSS kan ikke
# læses ud herfra på nogen måde, der er til at stole på. Ændrer du den ene,
# så ret den anden.
ORD, VAEGT, BREDDE_AKSE, SPAERRING, GAB, MAERKE_EM = "MEDIA", 500, 80, 0.15, 0.5, 0.72

INK, PAPER = "#0a0a0a", "#ffffff"

# Delebilledet: skriftgraden låsen sættes i, og luften ned til mono-linjen.
# Gabet måles fra låsens boks, som er stram om stregerne — derfor større end
# det ser ud, når man skriver det.
OG_GRAD, OG_GAB = 104, 52


def laes_tegningen():
    """Henter bredde, stregmål og de tre baner ud af Logo.tsx."""
    kilde = open(LOGO_TSX, encoding="utf-8").read()

    bredde = re.search(r"const BREDDE = (\d+);", kilde)
    streger = re.search(r"const STREGER = \[(.*?)\];", kilde, re.S)
    streg = re.search(r'strokeWidth="(\d+)"', kilde)
    if not (bredde and streger and streg):
        sys.exit(
            "Kunne ikke læse tegningen ud af Logo.tsx. Er BREDDE, STREGER "
            "eller strokeWidth skrevet om? Ret regexerne i byg.py — lad være "
            "med at taste tallene ind her."
        )

    baner = re.findall(r'"([^"]+)"', streger.group(1))
    if len(baner) != 3:
        sys.exit(f"Forventede 3 baner i STREGER, fandt {len(baner)}.")
    return int(bredde.group(1)), 100, int(streg.group(1)), baner


M_B, M_H, STREG, STREGER = laes_tegningen()
print(f"Tegning fra Logo.tsx: {M_B}x{M_H}, stregmål {STREG}, {len(STREGER)} baner")


# --- Skriften -------------------------------------------------------------
def hent_skrift(mappe):
    sti = os.path.join(mappe, "Archivo.ttf")
    urllib.request.urlretrieve(ARCHIVO, sti)
    return sti


def ordets_baner(ttf):
    """MEDIA som konturer plus ordets samlede bredde i em."""
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont

    f = instantiateVariableFont(TTFont(ttf), {"wght": VAEGT, "wdth": BREDDE_AKSE})
    upem, cmap, gs, hmtx = (
        f["head"].unitsPerEm, f.getBestCmap(), f.getGlyphSet(), f["hmtx"],
    )
    baner, x = [], 0.0
    for tegn in ORD:
        navn = cmap[ord(tegn)]
        pen = SVGPathPen(gs)
        gs[navn].draw(pen)
        baner.append((pen.getCommands(), x))
        x += hmtx[navn][0] / upem + SPAERRING
    # Den sidste spærring tæller ikke med — jf. margin-right i Logo.tsx.
    return baner, x - SPAERRING, upem


# --- Tegning --------------------------------------------------------------
EM = 1000


def maerke_baner(farve, streg_id=None):
    ident = f' id="{streg_id}"' if streg_id else ""
    return (
        f'<g{ident} fill="none" stroke="{farve}" stroke-width="{STREG}" '
        f'stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8">'
        + "".join(f'<path d="{d}"/>' for d in STREGER)
        + "</g>"
    )


def byg_svg(farve, baggrund, kun_maerke, baner, ord_b, upem):
    maerke_b = MAERKE_EM * M_B / M_H
    b = (maerke_b if kun_maerke else maerke_b + GAB + ord_b) * EM
    h = MAERKE_EM * EM
    ud = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {b:.1f} {h:.1f}" '
        f'width="{b:.1f}" height="{h:.1f}">',
        # Klippet er ikke pynt: punkterne ligger med vilje uden for
        # versalbåndet, og det er klippet, der giver de flade snit for- og
        # foroven. Uden det bliver mærket til to spidser.
        f'<clipPath id="versalbaand"><rect x="0" y="0" '
        f'width="{maerke_b * EM:.1f}" height="{h:.1f}"/></clipPath>',
    ]
    if baggrund:
        ud.append(f'<rect width="{b:.1f}" height="{h:.1f}" fill="{baggrund}"/>')
    ud.append(
        f'<g clip-path="url(#versalbaand)">'
        f'<g transform="scale({MAERKE_EM * EM / M_H:.4f})">{maerke_baner(farve)}</g></g>'
    )
    if not kun_maerke:
        # Grundlinjen ligger i bunden; y vendes, fordi skrifter regner opad.
        ox, s = (maerke_b + GAB) * EM, EM / upem
        ud.append(
            f'<g fill="{farve}" transform="translate({ox:.1f} {h:.1f}) '
            f'scale({s:.4f} -{s:.4f})">'
            + "".join(
                f'<path transform="translate({gx * upem:.1f} 0)" d="{d}"/>'
                for d, gx in baner
            )
            + "</g>"
        )
    ud.append("</svg>")
    return "\n".join(ud)


def skriv_faneikon():
    """Mærket i en firkant. 74 % af bredden — samme luft som profilbilledet."""
    n, andel = 64, 0.74
    mb = n * andel
    mh = mb * M_H / M_B
    return (
        "<!-- Genereret af brand/byg.py ud fra Logo.tsx. Ret ikke i hånden. -->\n"
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" width="{n}" height="{n}">\n'
        f'  <rect width="{n}" height="{n}" fill="{INK}"/>\n'
        f'  <svg x="{(n - mb) / 2:.1f}" y="{(n - mh) / 2:.1f}" width="{mb:.1f}" '
        f'height="{mh:.1f}" viewBox="0 0 {M_B} {M_H}">\n    {maerke_baner(PAPER)}\n  </svg>\n'
        "</svg>\n"
    )


# --- Chrome ---------------------------------------------------------------
def har_chrome():
    return os.path.exists(CHROME)


def skud(html, ud, bredde, hoejde, gennemsigtig=False):
    args = [CHROME, "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
            "--virtual-time-budget=4000", f"--window-size={bredde},{hoejde}",
            f"--screenshot={ud}"]
    if gennemsigtig:
        args.insert(-1, "--default-background-color=00000000")
    subprocess.run(args + [f"file://{html}"], capture_output=True)


def til_pdf(html, ud):
    subprocess.run(
        [CHROME, "--headless", "--disable-gpu", "--no-sandbox",
         "--no-pdf-header-footer", "--virtual-time-budget=4000",
         f"--print-to-pdf={ud}", f"file://{html}"], capture_output=True)


def side(krop, bredde, hoejde, papir=None, bg="transparent"):
    sidestil = f"@page{{size:{papir};margin:0}}" if papir else ""
    return (f"<!doctype html><meta charset=utf-8><style>{sidestil}"
            f"*{{margin:0;padding:0;box-sizing:border-box}}"
            f"html,body{{width:{bredde}px;height:{hoejde}px;background:{bg};"
            f"display:flex;align-items:center;justify-content:center}}"
            f"svg,img{{display:block}}</style>{krop}")


def main():
    tmp = tempfile.mkdtemp()
    try:
        print("Henter Archivo …")
        ttf = hent_skrift(tmp)
        baner, ord_b, upem = ordets_baner(ttf)
        print(f"MEDIA: {ord_b:.4f} em bred ved wdth {BREDDE_AKSE} / vægt {VAEGT}")

        # 1. SVG — originalerne, alt andet er afledt af dem.
        svg_mappe = os.path.join(BRAND, "svg")
        os.makedirs(svg_mappe, exist_ok=True)
        udgaver = {
            "mnmedia-laas-hvid": (PAPER, None, False),
            "mnmedia-laas-sort": (INK, None, False),
            "mnmedia-laas-hvid-paa-sort": (PAPER, INK, False),
            "mnmedia-maerke-hvid": (PAPER, None, True),
            "mnmedia-maerke-sort": (INK, None, True),
            "mnmedia-maerke-hvid-paa-sort": (PAPER, INK, True),
        }
        for navn, (farve, bg, kun) in udgaver.items():
            with open(os.path.join(svg_mappe, navn + ".svg"), "w") as fh:
                fh.write(byg_svg(farve, bg, kun, baner, ord_b, upem))
        print(f"svg/: {len(udgaver)} filer")

        # 2. Faneikonet som SVG.
        with open(os.path.join(APP, "icon.svg"), "w") as fh:
            fh.write(skriv_faneikon())
        print("src/app/icon.svg")

        if not har_chrome():
            print("\nGoogle Chrome blev ikke fundet — PNG, PDF, favicon.ico og\n"
                  "delebilledet er sprunget over. SVG'erne er skrevet.")
            return

        from PIL import Image

        # 3. PNG og PDF af hver SVG.
        for mappe in ("png", "pdf"):
            os.makedirs(os.path.join(BRAND, mappe), exist_ok=True)
        PNG_B = 2400
        for navn in udgaver:
            sti = os.path.join(svg_mappe, navn + ".svg")
            vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', open(sti).read())
            w, h = float(vb.group(1)), float(vb.group(2))
            png_h = round(PNG_B * h / w)
            for mappe, bb, hh, papir in (("png", PNG_B, png_h, None),
                                         ("pdf", w, h, f"{w}px {h}px")):
                html = os.path.join(tmp, f"{mappe}-{navn}.html")
                with open(html, "w") as fh:
                    fh.write(side(f"<img src='file://{sti}' "
                                  f"style='width:{bb}px;height:{hh}px'>", bb, hh, papir))
                ud = os.path.join(BRAND, mappe, f"{navn}.{mappe}")
                if mappe == "png":
                    skud(html, ud, bb, hh, gennemsigtig=True)
                else:
                    til_pdf(html, ud)
        print(f"png/ og pdf/: {len(udgaver)} filer hver")

        # 4. Faneikoner i punkter. Mærket fylder 74 % som i icon.svg.
        ikoner = {}
        for n in (16, 32, 48, 180):
            mb = n * 0.74
            krop = (f"<svg width='{mb:.1f}' viewBox='0 0 {M_B} {M_H}'>"
                    f"{maerke_baner(PAPER)}</svg>")
            html = os.path.join(tmp, f"ikon-{n}.html")
            with open(html, "w") as fh:
                fh.write(side(krop, n, n, bg=INK))
            ud = os.path.join(tmp, f"ikon-{n}.png")
            skud(html, ud, n, n)
            ikoner[n] = ud

        # Pillow skriver en ægte RGBA-ICO. Turbopack afviser alt andet.
        Image.open(ikoner[48]).convert("RGBA").save(
            os.path.join(APP, "favicon.ico"), format="ICO",
            sizes=[(48, 48), (32, 32), (16, 16)])
        Image.open(ikoner[180]).convert("RGBA").save(os.path.join(APP, "apple-icon.png"))
        print("src/app/favicon.ico, apple-icon.png")

        # 5. Delebilledet. Hjørnemarkørerne er sitets søger, og et delekort er
        #    netop noget, man ser på — rammen om afsenderen i et feed.
        laas = os.path.join(svg_mappe, "mnmedia-laas-hvid.svg")
        hj = ("position:absolute;width:30px;height:30px;border:0 solid #232328")
        krop = (
            f"<div style='position:absolute;inset:0;background:{INK}'></div>"
            f"<div style='{hj};top:44px;left:44px;border-top-width:1px;border-left-width:1px'></div>"
            f"<div style='{hj};top:44px;right:44px;border-top-width:1px;border-right-width:1px'></div>"
            f"<div style='{hj};bottom:44px;left:44px;border-bottom-width:1px;border-left-width:1px'></div>"
            f"<div style='{hj};bottom:44px;right:44px;border-bottom-width:1px;border-right-width:1px'></div>"
            f"<div style='position:absolute;top:0;left:0;right:0;height:2px;background:#6e3bff'></div>"
            f"<div style='position:relative;display:flex;flex-direction:column;"
            f"align-items:center;gap:{OG_GAB}px'>"
            # SVG-boksen er 0.72em høj (mærkets højde), så en ønsket
            # skriftgrad omsættes til pixels med samme faktor. Sætter man
            # 104 direkte, bliver låsen 1/0.72 gange for stor.
            f"<img src='file://{laas}' style='height:{OG_GRAD * MAERKE_EM:.2f}px;width:auto'>"
            f"<p style=\"font-family:'Geist Mono',monospace;font-size:15px;"
            f"letter-spacing:.22em;text-transform:uppercase;color:#8a8a92\">"
            f"Branding &middot; Sociale medier &middot; Annoncering &mdash; Aarhus</p></div>"
        )
        html = os.path.join(tmp, "og.html")
        with open(html, "w") as fh:
            fh.write("<link rel=stylesheet href='https://fonts.googleapis.com/"
                     "css2?family=Geist+Mono:wght@400&display=block'>"
                     + side(krop, 1200, 630, bg=INK))
        og = os.path.join(tmp, "og.png")
        skud(html, og, 1200, 630)
        for navn in ("opengraph-image.png", "twitter-image.png"):
            Image.open(og).convert("RGBA").save(os.path.join(APP, navn))
        print("src/app/opengraph-image.png, twitter-image.png")
        print("\nFærdig.")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
