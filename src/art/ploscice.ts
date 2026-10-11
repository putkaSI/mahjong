// Risbe sprednjih strani ploščic (SVG, viewBox 0 0 100 128). Osnovne risbe so klasične;
// vsaka tema (teme.ts) jih prebarva ali zamenja s svojimi (dragulji, porcelan, lak, tuš, sodoben …).
import { A, C, znak, oznaka, temnejsa } from "./osnova";
import { TEME, jeSlikovni, type SlogPloscic } from "./teme";

export type { SlogPloscic };
export { jeSlikovni };
const BASE: string = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";

/** HTML lica ploščice: risba iz skritega SVG ali slika (pri slogih, ki jih je naslikala umetna inteligenca). */
export function liceHTML(id: string, slog: SlogPloscic): string {
  return jeSlikovni(slog)
    ? `<img class="pl-slika" src="${BASE}ploscice/${slog}/${id}.webp" alt="" draggable="false">`
    : `<svg class="pl-lice" viewBox="0 0 100 128" aria-hidden="true"><use href="#t-${id}"/></svg>`;
}
/** Samostojno lice za predogled (brez skritega SVG). */
export function liceSamostojno(id: string, slog: SlogPloscic): string {
  return jeSlikovni(slog) ? liceHTML(id, slog) : `<svg class="pl-lice" viewBox="0 0 100 128" aria-hidden="true">${risba(id, slog)}</svg>`;
}
export const SLOGI_PLOSCIC = Object.values(TEME).map(t => ({ id: t.id as SlogPloscic, ime: t.ime, opis: t.opis }));
const T = () => A.T;

/* ---------- pike (krogi) ---------- */
function kovanec(cx: number, cy: number, r: number, c: string): string {
  const t = T();
  if (t.kovanec) return t.kovanec(cx, cy, r, c);
  const iv = t.iv;
  if (t.razlocno) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * .7}" fill="${iv}"/><circle cx="${cx}" cy="${cy}" r="${r * .42}" fill="${c}"/>`;
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * .8}" fill="${iv}"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r * .62}" fill="none" stroke="${c}" stroke-width="${r * .14}"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r * .3}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * .11}" fill="${iv}"/>`;
  if (r >= 13) for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, x = cx + Math.cos(a) * r * .45, y = cy + Math.sin(a) * r * .45;
    s += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(r * .06).toFixed(2)}" fill="${c}"/>`;
  }
  if (t.zlato) s += `<circle cx="${cx}" cy="${cy}" r="${r * .9}" fill="none" stroke="${t.zlata}" stroke-width="${Math.max(1, r * .07)}"/>`;
  return s;
}
function pika1(): string {
  const t = T();
  if (t.pika1) return t.pika1();
  const iv = t.iv;
  let s = `<circle cx="50" cy="64" r="40" fill="${t.zelena}"/><circle cx="50" cy="64" r="35.5" fill="${iv}"/>`;
  if (t.zlato) s += `<circle cx="50" cy="64" r="37.8" fill="none" stroke="${t.zlata}" stroke-width="1.6"/>`;
  for (let i = 0; i < 16; i++) s += `<ellipse cx="50" cy="${64 - 26}" rx="4.2" ry="7.5" fill="${t.rdeca}" transform="rotate(${i * 22.5} 50 64)"/>`;
  s += `<circle cx="50" cy="64" r="18" fill="${t.modra}"/><circle cx="50" cy="64" r="12.5" fill="${iv}"/>`
    + `<circle cx="50" cy="64" r="8" fill="${t.rdeca}"/><circle cx="50" cy="64" r="3" fill="${iv}"/>`;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; s += `<circle cx="${(50 + Math.cos(a) * 15.3).toFixed(2)}" cy="${(64 + Math.sin(a) * 15.3).toFixed(2)}" r="1.3" fill="${iv}"/>`; }
  return s;
}
/** Položaji krogov za pike 2–9 (x, y, polmer, barva). */
export function polozajiPik(n: number): [number, number, number, string][] {
  const t = T(), R = t.rdeca, Z = t.zelena, M = t.modra;
  const p: Record<number, [number, number, number, string][]> = {
    2: [[50, 36, 21, Z], [50, 92, 21, M]],
    3: [[25, 27, 17, M], [50, 64, 17, R], [75, 101, 17, Z]],
    4: [[29, 37, 18, M], [71, 37, 18, Z], [29, 91, 18, Z], [71, 91, 18, M]],
    5: [[27, 29, 15.5, M], [73, 29, 15.5, Z], [50, 64, 15.5, R], [27, 99, 15.5, Z], [73, 99, 15.5, M]],
    6: [[30, 23, 14, Z], [70, 23, 14, Z], [30, 70, 14, R], [70, 70, 14, R], [30, 104, 14, R], [70, 104, 14, R]],
    7: [[24, 18, 12, Z], [50, 31, 12, Z], [76, 44, 12, Z], [31, 78, 13, R], [69, 78, 13, R], [31, 108, 13, R], [69, 108, 13, R]],
    8: [[31, 19, 12.5, M], [69, 19, 12.5, M], [31, 49, 12.5, M], [69, 49, 12.5, M], [31, 79, 12.5, M], [69, 79, 12.5, M], [31, 109, 12.5, M], [69, 109, 12.5, M]],
    9: [[22, 25, 12.5, M], [50, 25, 12.5, M], [78, 25, 12.5, M], [22, 64, 12.5, R], [50, 64, 12.5, R], [78, 64, 12.5, R], [22, 103, 12.5, Z], [50, 103, 12.5, Z], [78, 103, 12.5, Z]],
  };
  return p[n];
}
function pike(n: number): string {
  const vecje = T().razlocno ? 1.08 : 1;
  return polozajiPik(n).map(([x, y, r, c]) => kovanec(x, y, r * vecje, c)).join("");
}

/* ---------- bambus ---------- */
function palica(cx: number, cy: number, len: number, c: string, rot = 0): string {
  const t = T();
  if (t.palica) return t.palica(cx, cy, len, c, rot);
  const w = t.razlocno ? 11.5 : 9, x = cx - w / 2, y = cy - len / 2, d = temnejsa(c, .42), iv = t.iv;
  return `<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${x}" y="${y}" width="${w}" height="${len}" rx="${w / 2}" fill="${c}"/>`
    + `<rect x="${x - .6}" y="${cy - 1.8}" width="${w + 1.2}" height="3.6" rx="1.4" fill="${d}"/>`
    + `<rect x="${x}" y="${y}" width="${w}" height="3.2" rx="1.6" fill="${d}"/><rect x="${x}" y="${y + len - 3.2}" width="${w}" height="3.2" rx="1.6" fill="${d}"/>`
    + (t.razlocno ? "" : `<line x1="${cx - 1.8}" y1="${y + 5}" x2="${cx - 1.8}" y2="${cy - 4}" stroke="${iv}" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/>`
      + `<line x1="${cx - 1.8}" y1="${cy + 4}" x2="${cx - 1.8}" y2="${y + len - 5}" stroke="${iv}" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/>`)
    + `</g>`;
}
function bambus(n: number): string {
  const t = T(), Z = t.zelena, R = t.rdeca, M = t.modra;
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
  const t = T();
  if (t.ptic) return t.ptic();
  const R = t.rdeca, Z = t.zelena, M = t.modra, Cr = t.crnilo, iv = t.iv, vej = t.vej;
  return `<path d="M14 108 Q48 98 88 110" stroke="${vej}" stroke-width="4" fill="none" stroke-linecap="round"/>`
    + `<path d="M70 104 l6 -9 M76 105 l3 -12" stroke="${vej}" stroke-width="2" stroke-linecap="round"/>`
    + `<ellipse cx="30" cy="80" rx="7" ry="26" fill="${M}" transform="rotate(52 30 80)"/>`
    + `<ellipse cx="34" cy="86" rx="7" ry="26" fill="${R}" transform="rotate(32 34 86)"/>`
    + `<ellipse cx="40" cy="90" rx="7" ry="25" fill="${Z}" transform="rotate(14 40 90)"/>`
    + [[16, 66], [21, 75], [29, 83]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${iv}"/><circle cx="${x}" cy="${y}" r="1.4" fill="${t.zlato ? t.zlata : Cr}"/>`).join("")
    + `<line x1="54" y1="78" x2="52" y2="100" stroke="${Cr}" stroke-width="2"/><line x1="62" y1="78" x2="62" y2="101" stroke="${Cr}" stroke-width="2"/>`
    + `<ellipse cx="57" cy="66" rx="21" ry="15" fill="${Z}" transform="rotate(-22 57 66)"/>`
    + `<path d="M44 66 Q56 52 72 60 Q62 72 46 74 Z" fill="${M}"/>`
    + `<ellipse cx="68" cy="72" rx="8" ry="10" fill="${R}"/>`
    + `<ellipse cx="66" cy="50" rx="8" ry="12" fill="${Z}"/><circle cx="70" cy="40" r="11" fill="${Z}"/>`
    + `<path d="M64 30 l-3 -10 M69 29 l0 -11 M74 30 l3 -10" stroke="${R}" stroke-width="1.6"/>`
    + `<circle cx="61" cy="19" r="2.4" fill="${R}"/><circle cx="69" cy="17" r="2.4" fill="${R}"/><circle cx="77" cy="19" r="2.4" fill="${R}"/>`
    + `<path d="M80 39 L91 43 L80 46 Z" fill="${C("#c9822b")}"/><circle cx="73" cy="38" r="2.6" fill="${iv}"/><circle cx="73.6" cy="38" r="1.3" fill="${Cr}"/>`;
}

/* ---------- znaki ---------- */
export const STEVILKE = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
function znakSt(n: number): string {
  const t = T();
  if (t.znakSt) return t.znakSt(n);
  if (t.razlocno) return oznaka(String(n), t.rdeca, 3, 4, 28) + znak(STEVILKE[n], 64, 32, 56, t.crnilo) + znak("萬", 50, 92, 62, t.rdeca);
  return znak(STEVILKE[n], 50, 36, 64, t.crnilo) + znak("萬", 50, 93, 66, t.rdeca);
}

/* ---------- rože in letni časi ---------- */
export function cvet(cx: number, cy: number, r: number, c: string, sred = "#e8c25a"): string {
  let s = "";
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; s += `<circle cx="${(cx + Math.cos(a) * r * .55).toFixed(2)}" cy="${(cy + Math.sin(a) * r * .55).toFixed(2)}" r="${(r * .5).toFixed(2)}" fill="${C(c)}"/>`; }
  return s + `<circle cx="${cx}" cy="${cy}" r="${(r * .28).toFixed(2)}" fill="${C(sred)}"/>`;
}
export function list(cx: number, cy: number, rx: number, ry: number, rot: number, c: string): string {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C(c)}" transform="rotate(${rot} ${cx} ${cy})"/>`;
}
export function javor(cx: number, cy: number, r: number, c: string, rot: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r * (i === 4 || i === 6 ? .75 : 1); pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`); }
  return `<g transform="rotate(${rot} ${cx} ${cy})"><polygon points="${pts.join(" ")}" fill="${C(c)}" stroke="${C(c)}" stroke-width="3" stroke-linejoin="round"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + r * 1.2}" stroke="${C("#7a4a22")}" stroke-width="2"/></g>`;
}
export function snezinka(cx: number, cy: number, r: number, c: string): string {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += `<g transform="rotate(${i * 60} ${cx} ${cy})"><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r}" stroke="${C(c)}" stroke-width="3.4" stroke-linecap="round"/>`
      + `<path d="M${cx - r * .28} ${cy - r * .62} L${cx} ${cy - r * .42} L${cx + r * .28} ${cy - r * .62}" stroke="${C(c)}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r * .14}" fill="${C(c)}"/>`;
}
function okvirCvet(barva: string, n: number, ch: string, chBarva: string): string {
  const t = T(), okvir = t.zlato ? t.zlata : barva, debel = t.razlocno ? 3.6 : 2.4;
  return `<rect x="5" y="5" width="90" height="118" rx="7" fill="none" stroke="${okvir}" stroke-width="${debel}" stroke-opacity="${t.razlocno ? .9 : .6}"/>`
    + (t.razlocno ? oznaka(String(n), barva, 6, 6, 26) : `<text x="13" y="27" font-size="19" font-weight="700" fill="${barva}" style="font-family:var(--pisava-stevilke, Georgia, serif)">${n}</text>`)
    + znak(ch, 80, 21, t.razlocno ? 30 : 26, chBarva);
}
function roza(n: number): string {
  const t = T();
  if (t.roza) return t.roza(n);
  const vej = t.vej, Z = t.zelena, F = t.okvirRoza;
  switch (n) {
    case 1: return okvirCvet(F, 1, "梅", t.rdeca)
      + `<path d="M22 112 Q40 84 52 70 Q64 56 82 40 M52 70 Q66 74 78 90 M40 86 Q30 72 30 56" stroke="${vej}" stroke-width="4" fill="none" stroke-linecap="round"/>`
      + cvet(30, 56, 13, "#b8343c") + cvet(80, 44, 12, "#b8343c") + cvet(76, 90, 12, "#c44850") + cvet(52, 70, 10, "#c44850") + `<circle cx="64" cy="56" r="3.5" fill="${C("#b8343c")}"/><circle cx="40" cy="98" r="3" fill="${C("#b8343c")}"/>`;
    case 2: return okvirCvet(F, 2, "蘭", C("#6e4c98"))
      + `<path d="M50 116 Q30 80 16 50 M52 116 Q60 74 86 54 M48 116 Q44 86 50 62" stroke="${Z}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
      + [[46, 60], [64, 74]].map(([x, y]) => [0, 120, 240].map(a => `<ellipse cx="${x}" cy="${y - 9}" rx="5" ry="10" fill="${C("#7d58a8")}" transform="rotate(${a} ${x} ${y})"/>`).join("") + `<circle cx="${x}" cy="${y}" r="3.4" fill="${C("#e8c25a")}"/>`).join("");
    case 3: {
      let s = okvirCvet(F, 3, "菊", C("#b26a1c")) + `<path d="M50 118 Q52 96 50 78" stroke="${Z}" stroke-width="3.4" fill="none"/>` + list(36, 102, 6, 13, -50, Z) + list(64, 98, 6, 13, 50, Z);
      for (let i = 0; i < 18; i++) s += `<ellipse cx="50" cy="${62 - 17}" rx="3.6" ry="11" fill="${C(i % 2 ? "#d9902e" : "#c97a22")}" transform="rotate(${i * 20} 50 62)"/>`;
      return s + `<circle cx="50" cy="62" r="8" fill="${C("#b4561c")}"/><circle cx="50" cy="62" r="3.4" fill="${C("#e8c25a")}"/>`;
    }
    default: return okvirCvet(F, 4, "竹", Z)
      + palica(36, 76, 82, Z, -6) + palica(62, 82, 68, C("#3a8a55"), 8)
      + list(76, 48, 4, 15, 55, Z) + list(82, 60, 4, 14, 75, Z) + list(24, 50, 4, 14, -60, Z) + list(20, 64, 4, 13, -80, "#3a8a55") + list(72, 104, 4, 12, 60, "#3a8a55");
  }
}
function letniCas(n: number): string {
  const t = T();
  if (t.letniCas) return t.letniCas(n);
  const F = t.okvirCas;
  switch (n) {
    case 1: return okvirCvet(F, 1, "春", C("#c4607a"))
      + `<path d="M14 102 Q44 82 60 62 Q72 48 88 38" stroke="${C("#8a6448")}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
      + cvet(32, 84, 11, "#e9a3b6", "#f4d77a") + cvet(60, 60, 12, "#e9a3b6", "#f4d77a") + cvet(84, 38, 10, "#f0b8c6", "#f4d77a")
      + list(46, 68, 3.5, 8, 40, "#8db86a") + list(74, 52, 3.5, 8, -30, "#8db86a") + `<circle cx="22" cy="94" r="3" fill="${C("#e9a3b6")}"/>`;
    case 2: return okvirCvet(F, 2, "夏", C("#2f7f73"))
      + `<ellipse cx="50" cy="100" rx="38" ry="12" fill="${C("#3f8a72")}"/><path d="M50 100 L18 96 M50 100 L30 108 M50 100 L70 109 M50 100 L84 96" stroke="${C("#2c6b56")}" stroke-width="1.6"/>`
      + `<path d="M50 96 Q48 82 50 76" stroke="${C("#2c6b56")}" stroke-width="3" fill="none"/>`
      + [-50, -25, 0, 25, 50].map(a => `<path d="M50 76 Q42 60 50 44 Q58 60 50 76 Z" fill="${C(a === 0 ? "#e07a8e" : "#ea98a8")}" transform="rotate(${a} 50 76)"/>`).join("");
    case 3: return okvirCvet(F, 3, "秋", C("#b4481e"))
      + javor(36, 64, 22, "#c4522a", -18) + javor(68, 84, 18, "#d98a2a", 22) + javor(64, 48, 12, "#b8402a", 40);
    default: return okvirCvet(F, 4, "冬", t.modra)
      + snezinka(50, 72, 32, "#4a70a8") + [[20, 48, 2.4], [82, 106, 2.4], [84, 54, 1.8], [18, 106, 1.8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C("#7d98c4")}"/>`).join("");
  }
}

/* ---------- vetrovi in zmaji ---------- */
export const VETROVI: Record<string, string> = { V: "東", J: "南", Z: "西", S: "北" };
function veter(k: string): string {
  const t = T();
  if (t.veter) return t.veter(k);
  if (t.razlocno) return znak(VETROVI[k], 54, 72, 86, t.crnilo) + oznaka(k, t.rdeca, 3, 4, 28);
  return znak(VETROVI[k], 50, 64, 90, t.crnilo);
}
function zmaj(k: string): string {
  const t = T();
  if (t.zmaj) return t.zmaj(k);
  if (k === "R") return znak("中", 50, 64, t.razlocno ? 96 : 92, t.rdeca);
  if (k === "G") return znak("發", 50, 64, t.razlocno ? 96 : 92, t.zelena);
  const M = t.modra, w = t.razlocno ? 7 : 5;
  return `<rect x="16" y="16" width="68" height="96" rx="5" fill="none" stroke="${M}" stroke-width="${w}"/>`
    + `<rect x="25" y="25" width="50" height="78" rx="3" fill="none" stroke="${t.zlato ? t.zlata : M}" stroke-width="2.4"/>`
    + [[16, 16], [84, 16], [16, 112], [84, 112]].map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${t.iv}" stroke="${M}" stroke-width="2.4" transform="rotate(45 ${x} ${y})"/>`).join("");
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
  A.T = TEME[slog] ?? TEME.klasicen;
  const n = Number(id.slice(1));
  let s = "";
  switch (id[0]) {
    case "p": s = n === 1 ? pika1() : pike(n); break;
    case "b": s = bambus(n); break;
    case "z": s = znakSt(n); break;
    case "v": s = veter(id[1]); break;
    case "d": s = zmaj(id[1]); break;
    case "r": s = roza(n); break;
    case "c": s = letniCas(n); break;
  }
  return (A.T.okras?.() ?? "") + s;
}
/** Ali slog že sam nariše številke in črke (potem pomožnih oznak ne dodajamo). */
export const imaOznake = (slog: SlogPloscic) => TEME[slog]?.razlocno ?? false;

/** Skriti SVG z vsemi risbami kot <symbol>, da jih ploščice uporabijo z <use>. Ob menjavi sloga se zamenja. */
export function vstaviSimbole(slog: SlogPloscic = "klasicen"): void {
  if (!TEME[slog]) slog = "klasicen";
  document.getElementById("simboli-ploscic")?.remove();
  const s = VRSTE.map(v => `<symbol id="t-${v.id}" viewBox="0 0 100 128">${risba(v.id, slog)}</symbol>`).join("");
  const div = document.createElement("div");
  div.innerHTML = `<svg id="simboli-ploscic" width="0" height="0" style="position:absolute" aria-hidden="true">${s}</svg>`;
  document.body.prepend(div.firstElementChild!);
  document.body.dataset.slog = slog;
}
