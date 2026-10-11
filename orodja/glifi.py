# Iz pisave LXGW WenKai TC (krepka) izvleče obrise kitajskih znakov za ploščice kot SVG poti.
# Uporaba: py orodja/glifi.py  -> src/art/glifi.ts
import glob, json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

ZNAKI = "一二三四五六七八九萬東南西北中發梅蘭菊竹春夏秋冬"
najdeni = {}
for f in sorted(glob.glob("node_modules/@fontsource/lxgw-wenkai-tc/files/*-700-normal.woff2")):
    font = TTFont(f)
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    upm = font["head"].unitsPerEm
    for ch in ZNAKI:
        if ch in najdeni or ord(ch) not in cmap:
            continue
        name = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[name].draw(pen)
        bp = BoundsPen(gs)
        gs[name].draw(bp)
        x0, y0, x1, y1 = bp.bounds
        # y os v pisavi gre navzgor; v SVG jo obrnemo s transformom ob izrisu
        najdeni[ch] = {"d": pen.getCommands(), "upm": upm, "b": [round(x0), round(y0), round(x1), round(y1)]}

manjka = [c for c in ZNAKI if c not in najdeni]
if manjka:
    raise SystemExit("Manjkajo znaki: " + "".join(manjka))
with open("src/art/glifi.ts", "w", encoding="utf-8") as out:
    out.write("// Samodejno ustvarjeno z orodja/glifi.py iz pisave LXGW WenKai TC (SIL OFL 1.1). Ne urejaj ročno.\n")
    out.write("export type Glif = { d: string; upm: number; b: [number, number, number, number] };\n")
    out.write("export const GLIFI: Record<string, Glif> = " + json.dumps(najdeni, ensure_ascii=False) + ";\n")
print("OK", len(najdeni), "znakov")
