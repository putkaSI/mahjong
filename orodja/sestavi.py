# Sestavi končna lica ploščic enega sloga.
# 1) Prazno ozadje materiala: za vsako točko mediana vseh AI ploščic, ki imajo tam prazno površino
#    (po izvorni risbi). Posamezni izmišljeni dodatki tako izginejo, material ostane enak.
# 2) Končno lice: AI slika okoli pravih simbolov, drugje prazno ozadje, z mehkim prehodom.
# Uporaba: python orodja/sestavi.py <mapa-sloga> [id ...]
import sys, os, re
import numpy as np
from PIL import Image, ImageFilter

mapa = sys.argv[1]
vir = "orodja/lica/klasicen"
LICE = np.array([0xf4, 0xec, 0xd8], dtype=np.int16)
vsi = sorted(f[:-4] for f in os.listdir(vir) if f.endswith(".png") and not f.startswith("_"))
ids = sys.argv[2:] or vsi

def maska_simbolov(id, razsiri):
    src = np.asarray(Image.open(os.path.join(vir, id + ".png")).convert("RGB"), dtype=np.int16)
    m = Image.fromarray(((np.abs(src - LICE).sum(axis=2) > 30) * 255).astype(np.uint8))
    for _ in range(razsiri):
        m = m.filter(ImageFilter.MaxFilter(9))
    return m

velikost = Image.open(os.path.join(vir, vsi[0] + ".png")).size
ozadje_pot = os.path.join(mapa, "_ozadje.png")
if not os.path.exists(ozadje_pot):
    vzorci, prazno = [], []
    for id in vsi:
        p = os.path.join(mapa, id + ".png")
        if not os.path.exists(p):
            continue
        gen = np.asarray(Image.open(p).convert("RGB").resize(velikost, Image.LANCZOS), dtype=np.float32)
        m = np.asarray(maska_simbolov(id, 4)) == 0      # daleč od simbolov
        vzorci.append(np.where(m[..., None], gen, np.nan)); prazno.append(m)
    sklad = np.stack(vzorci)
    med = np.nanmedian(sklad, axis=0)
    luknje = np.isnan(med[..., 0])
    if luknje.any():                                    # točke brez vzorca: zapolni z zameglitvijo okolice
        povp = np.nanmean(med.reshape(-1, 3), axis=0)
        med[luknje] = povp
        zamegljeno = np.asarray(Image.fromarray(med.clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(25)), dtype=np.float32)
        med[luknje] = zamegljeno[luknje]
    Image.fromarray(med.clip(0, 255).astype(np.uint8)).save(ozadje_pot)
    print("Ozadje materiala iz", len(vzorci), "ploščic")

import json
popravki = json.load(open("orodja/popravki.json", encoding="utf-8")).get(os.path.basename(os.path.normpath(mapa)), {})

def prebarvaj(img, id, barva):
    """Modre točke v območju simbola prebarva v želeno barvo (zlate žičke ostanejo)."""
    hsv = np.asarray(img.convert("HSV"), dtype=np.float32)
    m = np.asarray(maska_simbolov(id, 1)) > 0
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    modro = m & (h > 120) & (h < 200) & (s > 40)
    cilj = np.asarray(Image.new("RGB", (1, 1), barva).convert("HSV"), dtype=np.float32)[0, 0]
    hsv[..., 0] = np.where(modro, cilj[0], h)
    hsv[..., 1] = np.where(modro, np.maximum(s, cilj[1] * .85), s)
    hsv[..., 2] = np.where(modro, np.clip(np.maximum(v * 1.7, cilj[2] * .8), 0, 255), v)
    return Image.fromarray(hsv.astype(np.uint8), "HSV").convert("RGB")

def kotni_znak(img, id, oz):
    """Znak v zgornjem desnem kotu (rože, letni časi): kot pobriše do materiala in nariše pravi znak iz izvorne risbe."""
    src = Image.open(os.path.join(vir, id + ".png")).convert("RGB")
    w, h = src.size
    x0, y0, x1, y1 = int(w * .66), int(h * .055), int(w * .935), int(h * .28)   # znotraj tankega okvirja
    s = np.asarray(src, dtype=np.int16)
    out = np.asarray(img).copy()
    out[y0:y1, x0:x1] = np.asarray(oz)[y0:y1, x0:x1]
    m = np.zeros(s.shape[:2], bool)
    m[y0:y1, x0:x1] = np.abs(s[y0:y1, x0:x1] - LICE).sum(axis=2) > 60
    out[m] = (s[m] * .85).astype(np.uint8)
    return Image.fromarray(out)

ozadje = Image.open(ozadje_pot).convert("RGB")
os.makedirs(os.path.join(mapa, "koncno"), exist_ok=True)
for id in ids:
    ime = id + ("-" + popravki["izbira"][id] if id in popravki.get("izbira", {}) else "")
    gen = Image.open(os.path.join(mapa, ime + ".png")).convert("RGB").resize(velikost, Image.LANCZOS)
    if id in popravki.get("barva", {}):
        gen = prebarvaj(gen, id, popravki["barva"][id])
    if id in popravki.get("iz_risbe", []):
        # simbol iz natančne risbe na materialu, z rahlo senco (vgravirano)
        src = Image.open(os.path.join(vir, id + ".png")).convert("RGB")
        m = maska_simbolov(id, 0)
        senca = m.filter(ImageFilter.GaussianBlur(3)).point(lambda v: int(v * .45))
        k = Image.composite(Image.new("RGB", velikost, (60, 40, 20)), ozadje, Image.fromarray(np.roll(np.asarray(senca), (4, 3), axis=(0, 1))))
        Image.composite(src, k, m.filter(ImageFilter.GaussianBlur(1))).save(os.path.join(mapa, "koncno", id + ".png"))
        continue
    if re.match(r"^(z\d|v[VJZS]|d[RG])$", id) and id not in popravki.get("sestavi", []):
        # znaki: model ne dodaja ničesar, sestavljanje bi zaradi rahlega zamika obrezalo poteze
        gen.save(os.path.join(mapa, "koncno", id + ".png"))
        continue
    tesno = id in popravki.get("tesno", [])
    maska = maska_simbolov(id, 0 if tesno else 2).filter(ImageFilter.GaussianBlur(2 if tesno else 4))   # okoli simbolov za vgravirane sence
    koncno = Image.composite(gen, ozadje, maska)
    if id in popravki.get("kot", []):
        koncno = kotni_znak(koncno, id, ozadje)
    if id in popravki.get("brez_rdece", []):   # ploščica brez rdečih delov: rdeče ostanke zamenja material
        hsv = np.asarray(koncno.convert("HSV"), dtype=np.int16)
        rdece = ((hsv[..., 0] < 18) | (hsv[..., 0] > 235)) & (hsv[..., 1] > 70)
        rdece = np.asarray(Image.fromarray((rdece * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
        k = np.asarray(koncno).copy(); k[rdece] = np.asarray(ozadje)[rdece]; koncno = Image.fromarray(k)
    koncno.save(os.path.join(mapa, "koncno", id + ".png"))
print("Sestavljenih", len(ids))
