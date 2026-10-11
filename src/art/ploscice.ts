// Risbe sprednjih strani ploščic (SVG, viewBox 0 0 100 128) v treh slogih:
// klasičen (slonovina in les), razločen (debelejši znaki in številke za branje brez očal), žad (tradicionalen, zlati poudarki).
import { GLIFI } from "./glifi";

export type SlogPloscic = "klasicen" | "razlocen" | "zad";
type Paleta = { iv: string; rdeca: string; zelena: string; modra: string; crnilo: string; zlata: string; debelo: number; razlocno: boolean; zlato: boolean };
const PALETE: Record<SlogPloscic, Paleta> = {
  klasicen: { iv: "#f4ecd8", rdeca: "#ab3428", zelena: "#2d7a4c", modra: "#2c5190", crnilo: "#1e2a48", zlata: "#b8892f", debelo: 0, razlocno: false, zlato: false },
  razlocen: { iv: "#fbf6ea", rdeca: "#b3170c", zelena: "#0b6a37", modra: "#0f3c96", crnilo: "#0a1430", zlata: "#a8741c", debelo: 26, razlocno: true, zlato: false },
  zad: { iv: "#f2e8cc", rdeca: "#b2311c", zelena: "#1d6648", modra: "#203d78", crnilo: "#141b2e", zlata: "#b98a2c", debelo: 8, razlocno: false, zlato: true },
};
export const SLOGI_PLOSCIC: { id: SlogPloscic; ime: string; opis: string }[] = [
  { id: "klasicen", ime: "Klasičen", opis: "Slonokoščene ploščice z lesenim robom" },
  { id: "razlocen", ime: "Razločen", opis: "Večji, debelejši znaki in številke v kotu, za branje brez očal" },
  { id: "zad", ime: "Žad", opis: "Tradicionalne ploščice z zelenim hrbtom in zlatimi poudarki" },
];
let P = PALETE.klasicen;

/** Kitajski znak, centriran na (cx, cy); velikost je velikost »em« kvadrata. */
function znak(ch: string, cx: number, cy: number, size: number, fill: string): string {
  const G = GLIFI[ch]; const [x0, y0, x1, y1] = G.b;
  const k = size / G.upm, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const obroba = P.debelo ? ` stroke="${fill}" stroke-width="${P.debelo}" stroke-linejoin="round"` : "";
  return `<path d="${G.d}" fill="${fill}"${obroba} transform="translate(${cx} ${cy}) scale(${k.toFixed(5)} ${(-k).toFixed(5)}) translate(${-mx} ${-my})"/>`;
}
/** Oznaka v kotu (številka ali črka) na svetli podlagi. */
function oznaka(t: string, barva: string, x = 4, y = 4, w = 26): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="30" rx="6" fill="${P.iv}" fill-opacity=".94"/>`
    + `<text x="${x + w / 2}" y="${y + 25}" text-anchor="middle" font-size="28" font-weight="700" fill="${barva}" style="font-family:var(--pisava, sans-serif)">${t}</text>`;
}

/* ---------- pike (krogi) ---------- */
function kovanec(cx: number, cy: number, r: number, c: string): string {
  const iv = P.iv;
  if (P.razlocno) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * .7}" fill="${iv}"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${r * .42}" fill="${c}"/>`;
  }
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * .8}" fill="${iv}"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r * .62}" fill="none" stroke="${c}" stroke-width="${r * .14}"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r * .3}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * .11}" fill="${iv}"/>`;
  if (r >= 13) for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, x = cx + Math.cos(a) * r * .45, y = cy + Math.sin(a) * r * .45;
    s += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(r * .06).toFixed(2)}" fill="${c}"/>`;
  }
  if (P.zlato) s += `<circle cx="${cx}" cy="${cy}" r="${r * .9}" fill="none" stroke="${P.zlata}" stroke-width="${Math.max(1, r * .07)}"/>`;
  return s;
}
function pika1(): string {
  const iv = P.iv;
  let s = `<circle cx="50" cy="64" r="40" fill="${P.zelena}"/><circle cx="50" cy="64" r="35.5" fill="${iv}"/>`;
  if (P.zlato) s += `<circle cx="50" cy="64" r="37.8" fill="none" stroke="${P.zlata}" stroke-width="1.6"/>`;
  for (let i = 0; i < 16; i++) s += `<ellipse cx="50" cy="${64 - 26}" rx="4.2" ry="7.5" fill="${P.rdeca}" transform="rotate(${i * 22.5} 50 64)"/>`;
  s += `<circle cx="50" cy="64" r="18" fill="${P.modra}"/><circle cx="50" cy="64" r="12.5" fill="${iv}"/>`
    + `<circle cx="50" cy="64" r="8" fill="${P.rdeca}"/><circle cx="50" cy="64" r="3" fill="${iv}"/>`;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; s += `<circle cx="${(50 + Math.cos(a) * 15.3).toFixed(2)}" cy="${(64 + Math.sin(a) * 15.3).toFixed(2)}" r="1.3" fill="${iv}"/>`; }
  return s;
}
function pike(n: number): string {
  const R = P.rdeca, Z = P.zelena, M = P.modra;
  const t: Record<number, [number, number, number, string][]> = {
    2: [[50, 36, 21, Z], [50, 92, 21, M]],
    3: [[25, 27, 17, M], [50, 64, 17, R], [75, 101, 17, Z]],
    4: [[29, 37, 18, M], [71, 37, 18, Z], [29, 91, 18, Z], [71, 91, 18, M]],
    5: [[27, 29, 15.5, M], [73, 29, 15.5, Z], [50, 64, 15.5, R], [27, 99, 15.5, Z], [73, 99, 15.5, M]],
    6: [[30, 23, 14, Z], [70, 23, 14, Z], [30, 70, 14, R], [70, 70, 14, R], [30, 104, 14, R], [70, 104, 14, R]],
    7: [[24, 18, 12, Z], [50, 31, 12, Z], [76, 44, 12, Z], [31, 78, 13, R], [69, 78, 13, R], [31, 108, 13, R], [69, 108, 13, R]],
    8: [[31, 19, 12.5, M], [69, 19, 12.5, M], [31, 49, 12.5, M], [69, 49, 12.5, M], [31, 79, 12.5, M], [69, 79, 12.5, M], [31, 109, 12.5, M], [69, 109, 12.5, M]],
    9: [[22, 25, 12.5, M], [50, 25, 12.5, M], [78, 25, 12.5, M], [22, 64, 12.5, R], [50, 64, 12.5, R], [78, 64, 12.5, R], [22, 103, 12.5, Z], [50, 103, 12.5, Z], [78, 103, 12.5, Z]],
  };
  const vecje = P.razlocno ? 1.08 : 1;
  return t[n].map(([x, y, r, c]) => kovanec(x, y, r * vecje, c)).join("");
}

/* ---------- bambus ---------- */
function temnejsa(c: string): string { return c === P.rdeca ? "#6e1a10" : c === P.modra ? "#132c5c" : "#124a2c"; }
function palica(cx: number, cy: number, len: number, c: string, rot = 0): string {
  const w = P.razlocno ? 11.5 : 9, x = cx - w / 2, y = cy - len / 2, d = temnejsa(c), iv = P.iv;
  return `<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${x}" y="${y}" width="${w}" height="${len}" rx="${w / 2}" fill="${c}"/>`
    + `<rect x="${x - .6}" y="${cy - 1.8}" width="${w + 1.2}" height="3.6" rx="1.4" fill="${d}"/>`
    + `<rect x="${x}" y="${y}" width="${w}" height="3.2" rx="1.6" fill="${d}"/><rect x="${x}" y="${y + len - 3.2}" width="${w}" height="3.2" rx="1.6" fill="${d}"/>`
    + (P.razlocno ? "" : `<line x1="${cx - 1.8}" y1="${y + 5}" x2="${cx - 1.8}" y2="${cy - 4}" stroke="${iv}" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/>`
      + `<line x1="${cx - 1.8}" y1="${cy + 4}" x2="${cx - 1.8}" y2="${y + len - 5}" stroke="${iv}" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/>`)
    + `</g>`;
}
function bambus(n: number): string {
  const Z = P.zelena, R = P.rdeca, M = P.modra;
  switch (n) {
    case 2: return palica(50, 36, 46, Z) + palica(50, 92, 46, M);
    case 3: return palica(50, 36, 46, Z) + palica(31, 92, 46, M) + palica(69, 92, 46, M);
    case 4: return palica(31, 36, 46, M) + palica(69, 36, 46, Z) + palica(31, 92, 46, Z) + palica(69, 92, 46, M);
    case 5: return palica(25, 36, 46, Z) + palica(75, 36, 46, M) + palica(50, 64, 50, R) + palica(25, 92, 46, M) + palica(75, 92, 46, Z);
    case 6: return [24, 50, 76].map(x => palica(x, 36, 46, Z)).join("") + [24, 50, 76].map(x => palica(x, 92, 46, M)).join("");
    case 7: return palica(50, 22, 32, R) + [24, 50, 76].map(x => palica(x, 66, 34, Z)).join("") + [24, 50, 76].map(x => palica(x, 106, 34, M)).join("");
    case 8: return palica(20, 36, 44, Z, 14) + palica(41, 36, 44, Z, -14) + palica(59, 36, 44, Z, 14) + palica(80, 36, 44, Z, -14)
      + palica(20, 92, 44, M, -14) + palica(41, 92, 44, M, 14) + palica(59, 92, 44, M, -14) + palica(80, 92, 44, M, 14);
    case 9: return [24, 50, 76].map(x => palica(x, 25, 34, x === 50 ? R : Z) + palica(x, 64, 34, x === 50 ? R : M) + palica(x, 103, 34, x === 50 ? R : Z)).join("");
  }
  return ptic();
}
/** Bambus 1: ptič na veji. */
function ptic(): string {
  const R = P.rdeca, Z = P.zelena, M = P.modra, C = P.crnilo, iv = P.iv;
  return `<path d="M14 108 Q48 98 88 110" stroke="#7a5a32" stroke-width="4" fill="none" stroke-linecap="round"/>`
    + `<path d="M70 104 l6 -9 M76 105 l3 -12" stroke="#7a5a32" stroke-width="2" stroke-linecap="round"/>`
    + `<ellipse cx="30" cy="80" rx="7" ry="26" fill="${M}" transform="rotate(52 30 80)"/>`
    + `<ellipse cx="34" cy="86" rx="7" ry="26" fill="${R}" transform="rotate(32 34 86)"/>`
    + `<ellipse cx="40" cy="90" rx="7" ry="25" fill="${Z}" transform="rotate(14 40 90)"/>`
    + [[16, 66], [21, 75], [29, 83]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${iv}"/><circle cx="${x}" cy="${y}" r="1.4" fill="${P.zlato ? P.zlata : C}"/>`).join("")
    + `<line x1="54" y1="78" x2="52" y2="100" stroke="${C}" stroke-width="2"/><line x1="62" y1="78" x2="62" y2="101" stroke="${C}" stroke-width="2"/>`
    + `<ellipse cx="57" cy="66" rx="21" ry="15" fill="${Z}" transform="rotate(-22 57 66)"/>`
    + `<path d="M44 66 Q56 52 72 60 Q62 72 46 74 Z" fill="${M}"/>`
    + `<ellipse cx="68" cy="72" rx="8" ry="10" fill="${R}"/>`
    + `<ellipse cx="66" cy="50" rx="8" ry="12" fill="${Z}"/><circle cx="70" cy="40" r="11" fill="${Z}"/>`
    + `<path d="M64 30 l-3 -10 M69 29 l0 -11 M74 30 l3 -10" stroke="${R}" stroke-width="1.6"/>`
    + `<circle cx="61" cy="19" r="2.4" fill="${R}"/><circle cx="69" cy="17" r="2.4" fill="${R}"/><circle cx="77" cy="19" r="2.4" fill="${R}"/>`
    + `<path d="M80 39 L91 43 L80 46 Z" fill="#c9822b"/><circle cx="73" cy="38" r="2.6" fill="${iv}"/><circle cx="73.6" cy="38" r="1.3" fill="${C}"/>`;
}

/* ---------- znaki ---------- */
const STEVILKE = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
function znakSt(n: number): string {
  if (P.razlocno) return oznaka(String(n), P.rdeca, 3, 4, 28) + znak(STEVILKE[n], 64, 32, 56, P.crnilo) + znak("萬", 50, 92, 62, P.rdeca);
  return znak(STEVILKE[n], 50, 36, 64, P.crnilo) + znak("萬", 50, 93, 66, P.rdeca);
}

/* ---------- rože in letni časi ---------- */
function cvet(cx: number, cy: number, r: number, c: string, sred = "#e8c25a"): string {
  let s = "";
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; s += `<circle cx="${(cx + Math.cos(a) * r * .55).toFixed(2)}" cy="${(cy + Math.sin(a) * r * .55).toFixed(2)}" r="${(r * .5).toFixed(2)}" fill="${c}"/>`; }
  return s + `<circle cx="${cx}" cy="${cy}" r="${(r * .28).toFixed(2)}" fill="${sred}"/>`;
}
function list(cx: number, cy: number, rx: number, ry: number, rot: number, c: string): string {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" transform="rotate(${rot} ${cx} ${cy})"/>`;
}
function javor(cx: number, cy: number, r: number, c: string, rot: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r * (i === 4 || i === 6 ? .75 : 1); pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`); }
  return `<g transform="rotate(${rot} ${cx} ${cy})"><polygon points="${pts.join(" ")}" fill="${c}" stroke="${c}" stroke-width="3" stroke-linejoin="round"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + r * 1.2}" stroke="#7a4a22" stroke-width="2"/></g>`;
}
function snezinka(cx: number, cy: number, r: number, c: string): string {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += `<g transform="rotate(${i * 60} ${cx} ${cy})"><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r}" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>`
      + `<path d="M${cx - r * .28} ${cy - r * .62} L${cx} ${cy - r * .42} L${cx + r * .28} ${cy - r * .62}" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r * .14}" fill="${c}"/>`;
}
const ROZA_OKVIR = "#b2555a", CAS_OKVIR = "#3f7f86";
function okvirCvet(barva: string, n: number, ch: string, chBarva: string): string {
  const okvir = P.zlato ? P.zlata : barva, debel = P.razlocno ? 3.6 : 2.4;
  return `<rect x="5" y="5" width="90" height="118" rx="7" fill="none" stroke="${okvir}" stroke-width="${debel}" stroke-opacity="${P.razlocno ? .9 : .6}"/>`
    + (P.razlocno ? oznaka(String(n), barva, 6, 6, 26) : `<text x="13" y="27" font-size="19" font-weight="700" fill="${barva}" style="font-family:var(--pisava-stevilke, Georgia, serif)">${n}</text>`)
    + znak(ch, 80, 21, P.razlocno ? 30 : 26, chBarva);
}
function roza(n: number): string {
  const vej = "#5b3d24", Z = P.zelena;
  switch (n) {
    case 1: return okvirCvet(ROZA_OKVIR, 1, "梅", P.rdeca)
      + `<path d="M22 112 Q40 84 52 70 Q64 56 82 40 M52 70 Q66 74 78 90 M40 86 Q30 72 30 56" stroke="${vej}" stroke-width="4" fill="none" stroke-linecap="round"/>`
      + cvet(30, 56, 13, "#b8343c") + cvet(80, 44, 12, "#b8343c") + cvet(76, 90, 12, "#c44850") + cvet(52, 70, 10, "#c44850") + `<circle cx="64" cy="56" r="3.5" fill="#b8343c"/><circle cx="40" cy="98" r="3" fill="#b8343c"/>`;
    case 2: return okvirCvet(ROZA_OKVIR, 2, "蘭", "#6e4c98")
      + `<path d="M50 116 Q30 80 16 50 M52 116 Q60 74 86 54 M48 116 Q44 86 50 62" stroke="${Z}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
      + [[46, 60], [64, 74]].map(([x, y]) => [0, 120, 240].map(a => `<ellipse cx="${x}" cy="${y - 9}" rx="5" ry="10" fill="#7d58a8" transform="rotate(${a} ${x} ${y})"/>`).join("") + `<circle cx="${x}" cy="${y}" r="3.4" fill="#e8c25a"/>`).join("");
    case 3: {
      let s = okvirCvet(ROZA_OKVIR, 3, "菊", "#b26a1c") + `<path d="M50 118 Q52 96 50 78" stroke="${Z}" stroke-width="3.4" fill="none"/>` + list(36, 102, 6, 13, -50, Z) + list(64, 98, 6, 13, 50, Z);
      for (let i = 0; i < 18; i++) s += `<ellipse cx="50" cy="${62 - 17}" rx="3.6" ry="11" fill="${i % 2 ? "#d9902e" : "#c97a22"}" transform="rotate(${i * 20} 50 62)"/>`;
      return s + `<circle cx="50" cy="62" r="8" fill="#b4561c"/><circle cx="50" cy="62" r="3.4" fill="#e8c25a"/>`;
    }
    default: return okvirCvet(ROZA_OKVIR, 4, "竹", Z)
      + palica(36, 76, 82, Z, -6) + palica(62, 82, 68, "#3a8a55", 8)
      + list(76, 48, 4, 15, 55, Z) + list(82, 60, 4, 14, 75, Z) + list(24, 50, 4, 14, -60, Z) + list(20, 64, 4, 13, -80, "#3a8a55") + list(72, 104, 4, 12, 60, "#3a8a55");
  }
}
function letniCas(n: number): string {
  switch (n) {
    case 1: return okvirCvet(CAS_OKVIR, 1, "春", "#c4607a")
      + `<path d="M14 102 Q44 82 60 62 Q72 48 88 38" stroke="#8a6448" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
      + cvet(32, 84, 11, "#e9a3b6", "#f4d77a") + cvet(60, 60, 12, "#e9a3b6", "#f4d77a") + cvet(84, 38, 10, "#f0b8c6", "#f4d77a")
      + list(46, 68, 3.5, 8, 40, "#8db86a") + list(74, 52, 3.5, 8, -30, "#8db86a") + `<circle cx="22" cy="94" r="3" fill="#e9a3b6"/>`;
    case 2: return okvirCvet(CAS_OKVIR, 2, "夏", "#2f7f73")
      + `<ellipse cx="50" cy="100" rx="38" ry="12" fill="#3f8a72"/><path d="M50 100 L18 96 M50 100 L30 108 M50 100 L70 109 M50 100 L84 96" stroke="#2c6b56" stroke-width="1.6"/>`
      + `<path d="M50 96 Q48 82 50 76" stroke="#2c6b56" stroke-width="3" fill="none"/>`
      + [-50, -25, 0, 25, 50].map(a => `<path d="M50 76 Q42 60 50 44 Q58 60 50 76 Z" fill="${a === 0 ? "#e07a8e" : "#ea98a8"}" transform="rotate(${a} 50 76)"/>`).join("");
    case 3: return okvirCvet(CAS_OKVIR, 3, "秋", "#b4481e")
      + javor(36, 64, 22, "#c4522a", -18) + javor(68, 84, 18, "#d98a2a", 22) + javor(64, 48, 12, "#b8402a", 40);
    default: return okvirCvet(CAS_OKVIR, 4, "冬", P.modra)
      + snezinka(50, 72, 32, "#4a70a8") + `<circle cx="20" cy="48" r="2.4" fill="#7d98c4"/><circle cx="82" cy="106" r="2.4" fill="#7d98c4"/><circle cx="84" cy="54" r="1.8" fill="#7d98c4"/><circle cx="18" cy="106" r="1.8" fill="#7d98c4"/>`;
  }
}

/* ---------- vetrovi in zmaji ---------- */
const VETROVI: Record<string, string> = { V: "東", J: "南", Z: "西", S: "北" };
function veter(k: string): string {
  if (P.razlocno) return znak(VETROVI[k], 54, 72, 86, P.crnilo) + oznaka(k, P.rdeca, 3, 4, 28);
  return znak(VETROVI[k], 50, 64, 90, P.crnilo);
}
function beliZmaj(): string {
  const M = P.modra, w = P.razlocno ? 7 : 5;
  return `<rect x="16" y="16" width="68" height="96" rx="5" fill="none" stroke="${M}" stroke-width="${w}"/>`
    + `<rect x="25" y="25" width="50" height="78" rx="3" fill="none" stroke="${P.zlato ? P.zlata : M}" stroke-width="2.4"/>`
    + [[16, 16], [84, 16], [16, 112], [84, 112]].map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${P.iv}" stroke="${M}" stroke-width="2.4" transform="rotate(45 ${x} ${y})"/>`).join("");
}

/** Vse vrste ploščic. Ključ ujemanja: rože med sabo in letni časi med sabo se ujemajo. */
export type Vrsta = { id: string; ujemanje: string; ime: string; pomoc: string };
export const VRSTE: Vrsta[] = [];
for (let n = 1; n <= 9; n++) VRSTE.push({ id: `p${n}`, ujemanje: `p${n}`, ime: `Pike ${n}`, pomoc: String(n) });
for (let n = 1; n <= 9; n++) VRSTE.push({ id: `b${n}`, ujemanje: `b${n}`, ime: `Bambus ${n}`, pomoc: String(n) });
for (let n = 1; n <= 9; n++) VRSTE.push({ id: `z${n}`, ujemanje: `z${n}`, ime: `Znak ${n}`, pomoc: String(n) });
for (const [k, ime] of [["V", "Vzhod"], ["J", "Jug"], ["Z", "Zahod"], ["S", "Sever"]]) VRSTE.push({ id: `v${k}`, ujemanje: `v${k}`, ime: `Veter: ${ime}`, pomoc: k });
for (const [k, ime] of [["R", "rdeči"], ["G", "zeleni"], ["B", "beli"]]) VRSTE.push({ id: `d${k}`, ujemanje: `d${k}`, ime: `Zmaj: ${ime}`, pomoc: "" });
for (let n = 1; n <= 4; n++) VRSTE.push({ id: `r${n}`, ujemanje: "R", ime: `Roža ${n}`, pomoc: "R" });
for (let n = 1; n <= 4; n++) VRSTE.push({ id: `c${n}`, ujemanje: "C", ime: `Letni čas ${n}`, pomoc: "Č" });

/** Risba ene ploščice v danem slogu (notranjost SVG z viewBox 0 0 100 128). */
export function risba(id: string, slog: SlogPloscic = "klasicen"): string {
  P = PALETE[slog] ?? PALETE.klasicen;
  const n = Number(id.slice(1));
  switch (id[0]) {
    case "p": return n === 1 ? pika1() : pike(n);
    case "b": return bambus(n);
    case "z": return znakSt(n);
    case "v": return veter(id[1]);
    case "d": return id[1] === "R" ? znak("中", 50, 64, P.razlocno ? 96 : 92, P.rdeca) : id[1] === "G" ? znak("發", 50, 64, P.razlocno ? 96 : 92, P.zelena) : beliZmaj();
    case "r": return roza(n);
    case "c": return letniCas(n);
  }
  return "";
}
/** Ali slog že sam nariše številke in črke (potem pomožnih oznak ne dodajamo). */
export const imaOznake = (slog: SlogPloscic) => PALETE[slog]?.razlocno ?? false;

/** Skriti SVG z vsemi risbami kot <symbol>, da jih ploščice uporabijo z <use>. Ob menjavi sloga se zamenja. */
export function vstaviSimbole(slog: SlogPloscic = "klasicen"): void {
  document.getElementById("simboli-ploscic")?.remove();
  const s = VRSTE.map(v => `<symbol id="t-${v.id}" viewBox="0 0 100 128">${risba(v.id, slog)}</symbol>`).join("");
  const div = document.createElement("div");
  div.innerHTML = `<svg id="simboli-ploscic" width="0" height="0" style="position:absolute" aria-hidden="true">${s}</svg>`;
  document.body.prepend(div.firstElementChild!);
  document.body.dataset.slog = slog;
}
