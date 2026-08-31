"""Samler designguiden til én HTML-fil, klar til at udgive.

    python3 brand/guide/saml.py

Den læser mærkets tal ud af Logo.tsx — samme kilde som brand/byg.py — og
lægger de færdige filer fra brand/{svg,pdf,png} ind i siden som base64, så de
kan hentes direkte fra guiden. Kør brand/byg.py FØRST, hvis tegningen har
ændret sig; ellers pakker den de gamle filer ind i en ny guide.
"""
import base64, json, os, re, sys

G = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(G))
FOTO = os.path.join(G, "don-t-foto.jpg")

# Samme kilde som brand/byg.py: tallene læses, ikke gentages.
kilde = open(os.path.join(REPO, "src/components/layout/Logo.tsx")).read()
BREDDE = int(re.search(r"const BREDDE = (\d+);", kilde).group(1))
STREG = int(re.search(r'strokeWidth="(\d+)"', kilde).group(1))
STREGER = re.findall(r'"([^"]+)"', re.search(r"const STREGER = \[(.*?)\];", kilde, re.S).group(1))
assert len(STREGER) == 3

def maerke(farve="currentColor", ident="m", klip=True):
    baner = "".join(f'<path d="{d}"/>' for d in STREGER)
    g = (f'<g fill="none" stroke="{farve}" stroke-width="{STREG}" stroke-linecap="butt" '
         f'stroke-linejoin="miter" stroke-miterlimit="8">{baner}</g>')
    if not klip:
        return g
    return (f'<defs><clipPath id="{ident}"><rect x="0" y="0" width="{BREDDE}" height="100"/>'
            f'</clipPath></defs><g clip-path="url(#{ident})">{g}</g>')

def svg_maerke(ident):
    return (f'<svg viewBox="0 0 {BREDDE} 100" role="img" aria-label="MN">'
            f'{maerke("currentColor", ident)}</svg>')

def laas(ident, grad):
    return (f'<span class="laas" style="font-size:{grad}"><span class="laas-m">'
            f'{svg_maerke(ident)}</span><span class="laas-o">media</span></span>')

# ---------- Konstruktionstegning ----------
HAIR, DYB, HVID = "#232328", "#4a4a52", "#ffffff"
# viewBoxen skal rumme labelsne, ikke kun tegningen: mono-teksten er bredere
# end den ser ud, og løber den udenfor, klipper <svg> den bare væk.
t = [f'<svg viewBox="-66 -52 380 220" role="img" aria-label="Konstruktionstegning af MN-mærket">']
t.append(f'<defs><clipPath id="baand"><rect x="0" y="0" width="{BREDDE}" height="100"/></clipPath></defs>')
# Det, klippet skærer væk — tegnet først, så det ligger bagved.
t.append(maerke(HAIR, klip=False))
# Versalbånd og delt streg
# Labels sættes OVER linjen og venstrestillet — anker "end" ville skubbe dem
# ud af boksen, og der er ikke plads til en venstremargen på 46 enheder.
for y, navn in ((0, "Versalhøjde"), (100, "Grundlinje")):
    t.append(f'<line x1="-58" y1="{y}" x2="205" y2="{y}" stroke="{DYB}" stroke-width=".7" stroke-dasharray="4 4"/>')
    t.append(f'<text x="-58" y="{y - 4}">{navn}</text>')
t.append(f'<line x1="106" y1="-44" x2="106" y2="142" stroke="{DYB}" stroke-width=".7" stroke-dasharray="4 4"/>')
# Selve mærket
t.append(f'<g clip-path="url(#baand)">{maerke(HVID, klip=False)}</g>')
# Stregmål på N’s højre stamme
t.append(f'<line x1="173.5" y1="26" x2="190.5" y2="26" stroke="{DYB}" stroke-width=".7"/>')
for x in (173.5, 190.5):
    t.append(f'<line x1="{x}" y1="21" x2="{x}" y2="31" stroke="{DYB}" stroke-width=".7"/>')
t.append(f'<line x1="190.5" y1="26" x2="203" y2="26" stroke="{DYB}" stroke-width=".7"/>')
t.append(f'<text x="207" y="28.6">Stregmål {STREG} &#183; 17 %</text>')
# Det afskårne
t.append(f'<text x="207" y="-22">Skåret af</text>')
t.append(f'<line x1="191" y1="-25" x2="203" y2="-25" stroke="{DYB}" stroke-width=".7"/>')
t.append(f'<text x="207" y="124">Skåret af</text>')
t.append(f'<line x1="191" y1="121" x2="203" y2="121" stroke="{DYB}" stroke-width=".7"/>')
t.append(f'<text x="106" y="158" text-anchor="middle">x = 106 &#183; M og N deler stregen</text>')
t.append("</svg>")
TEGNING = "".join(t)

# ---------- Filkort ----------
UDGAVER = [
    ("mnmedia-laas-hvid", "Låsen, hvid", "Gennemsigtig bund. Til mørke flader og til billeder med ro i.", "mork"),
    ("mnmedia-laas-sort", "Låsen, sort", "Gennemsigtig bund. Til hvidt papir og lyse flader.", "lys"),
    ("mnmedia-laas-hvid-paa-sort", "Låsen på sort", "Firkanten og luften er en del af filen. Til steder hvor du ikke selv bestemmer bunden.", "lys"),
    ("mnmedia-maerke-hvid", "Mærket, hvid", "Monogrammet alene, gennemsigtig bund. Kun hvor der ikke er plads til ordet.", "mork"),
    ("mnmedia-maerke-sort", "Mærket, sort", "Monogrammet alene til lyse flader — broderi, print, stempel.", "lys"),
    ("mnmedia-maerke-hvid-paa-sort", "Mærket på sort", "Kvadratisk med luft omkring. Profilbillede og faneikon.", "lys"),
]

FILER, kort = {}, []
for stam, navn, om, bund in UDGAVER:
    knapper = []
    for fmt in ("svg", "pdf", "png"):
        sti = os.path.join(REPO, "brand", fmt, f"{stam}.{fmt}")
        n = f"{stam}.{fmt}"
        FILER[n] = base64.b64encode(open(sti, "rb").read()).decode()
        knapper.append(f'<button type="button" data-fil="{n}">{fmt}</button>')
    svg64 = FILER[f"{stam}.svg"]
    kort.append(
        f'<div class="fil"><div class="fil-proeve {bund}">'
        f'<img src="data:image/svg+xml;base64,{svg64}" alt="{navn}"></div>'
        f'<div class="fil-navn"><h3>{navn}</h3><p>{om}</p></div>'
        f'<div class="knapper">{"".join(knapper)}</div></div>'
    )

def delt_mn(ident):
    """M og N trukket fra hinanden — eksemplet på det, man ikke gør."""
    def stk(baner, x0, x1, nr):
        b = "".join(f'<path d="{d}"/>' for d in baner)
        return (f'<svg viewBox="{x0} 0 {x1 - x0} 100" style="height:100%;width:auto;display:block">'
                f'<defs><clipPath id="{ident}{nr}"><rect x="{x0}" y="0" width="{x1 - x0}" height="100"/>'
                f'</clipPath></defs><g clip-path="url(#{ident}{nr})" fill="none" stroke="currentColor" '
                f'stroke-width="{STREG}" stroke-linecap="butt" stroke-linejoin="miter" '
                f'stroke-miterlimit="8">{b}</g></svg>')
    return ('<span style="display:inline-flex;align-items:flex-end;gap:.5rem;height:1rem">'
            + stk(STREGER[:1], 2.5, 114.5, "m")
            + stk(["M106 -20V120"] + STREGER[1:], 97.5, 190.5, "n")
            + '</span>')

# ---------- Gør ikke ----------
foto64 = base64.b64encode(open(FOTO, "rb").read()).decode()
IKKE = [
    (f'<span style="color:#6e3bff">{laas("i1", "1.25rem")}</span>',
     "Farv det", "Det findes i sort og hvid. Den lilla er knappernes."),
    (f'<div class="soeger" style="padding:.5rem .75rem"><span class="hj hj-tv"></span>'
     f'<span class="hj hj-th"></span><span class="hj hj-bv"></span><span class="hj hj-bh"></span>'
     f'{laas("i2", "1.25rem")}</div>',
     "Sæt søgeren om det", "Hjørnerne markerer noget, man ser på — ikke afsenderen."),
    (f'<span style="display:inline-block;transform:scaleX(1.6)">{laas("i3", "1rem")}</span>',
     "Stræk det", "Bredden er en del af tegningen, ikke en indstilling."),
    (delt_mn("i4"),
     "Skil M og N ad", "De deler den lodrette streg. Uden den er det to bogstaver."),
    (f'<img class="foto" src="data:image/jpeg;base64,{foto64}" alt="">'
     f'<span style="position:relative">{laas("i5", "1.25rem")}</span>',
     "Læg hvid på lyst", "Dæmp billedet først. 01 Smal vil gerne have ro bag sig."),
]
ikke_html = "".join(
    f'<div class="ikke-post"><div class="ikke-vis">{vis}<span class="kryds"></span></div>'
    f'<p class="ikke-tekst"><b>{b}</b>{t}</p></div>' for vis, b, t in IKKE)

# ---------- Farver ----------
FARVER = [
    ("#0a0a0a", "Ink", "Bunden. Alt står på den."),
    ("#16161a", "Ink soft", "Løftede felter og prøveflader."),
    ("#232328", "Hårstreg", "Skillelinjer. Aldrig tekst."),
    ("#8a8a92", "Grå", "Brødtekst og alt sekundært."),
    ("#4a4a52", "Dyb grå", "Labels og tællere."),
    ("#ffffff", "Paper", "Overskrifter og mærket."),
]
farver_html = "".join(
    f'<div class="farve"><div class="farve-flade" style="background:{h}"></div>'
    f'<dt>{n}</dt><dd>{h.upper()}</dd><p>{om}</p></div>' for h, n, om in FARVER)

# ---------- Saml ----------
hoved = open(os.path.join(G, "hoved.html")).read()
krop = open(os.path.join(G, "krop.html")).read()
krop = (krop.replace("__LAAS_STOR__", f'<span style="color:#fff">{laas("top", "clamp(2.1rem,6vw,3.4rem)")}</span>')
            .replace("__TEGNING__", TEGNING)
            .replace("__FILKORT__", "".join(kort))
            .replace("__IKKE__", ikke_html)
            .replace("__FARVER__", farver_html))

js = """
<script>
  /* Filerne ligger i siden som base64. Downloads-evnen findes kun i
     claude.ai-visningen; åbnes siden andetsteds, resolver use() null, og så
     skjuler vi knapperne frem for at love noget, der ikke virker. */
  (function () {
    var FILER = __FILER__;
    var status = document.getElementById("status");

    function sig(tekst, fejl) {
      status.textContent = tekst || "";
      if (fejl) { status.setAttribute("data-fejl", "ja"); }
      else { status.removeAttribute("data-fejl"); }
    }

    function bytes(b64) {
      var raa = atob(b64), ud = new Uint8Array(raa.length);
      for (var i = 0; i < raa.length; i++) { ud[i] = raa.charCodeAt(i); }
      return ud;
    }

    var FEJL = {
      declined: "",                       // sagde nej — ingen grund til at råbe
      rate_limited: "Vent et øjeblik, og prøv igen.",
      too_large: "Filen er for stor til at hentes her.",
      rejected_extension: "Formatet kan ikke hentes her.",
      extension_not_enabled: "Formatet kan ikke hentes i den her visning."
    };

    if (!window.claude || !window.claude.use) {
      document.body.classList.add("ingen-download");
      return;
    }

    window.claude.use("downloads").then(function (downloads) {
      if (!downloads) { document.body.classList.add("ingen-download"); return; }

      document.querySelectorAll("button[data-fil]").forEach(function (knap) {
        knap.addEventListener("click", function () {
          var navn = knap.getAttribute("data-fil");
          knap.disabled = true;
          sig("Henter " + navn + " …");
          downloads.save({ filename: navn, data: bytes(FILER[navn]) })
            .then(function () { sig(navn + " er hentet."); })
            .catch(function (f) {
              var kode = f && f.code;
              sig(Object.prototype.hasOwnProperty.call(FEJL, kode)
                    ? FEJL[kode]
                    : "Filen kunne ikke hentes her.", true);
            })
            .then(function () { knap.disabled = false; });
        });
      });
    });
  })();
</script>
"""
js = js.replace("__FILER__", json.dumps(FILER))

ud = os.path.join(G, "designguide.html")
open(ud, "w").write(hoved + krop + js)
print(ud, os.path.getsize(ud), "bytes")
