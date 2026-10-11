// Risbe sprednjih strani ploščic (SVG, viewBox 0 0 100 128). Klasičen kitajski slog, malo okrasja.
import { GLIFI } from "./glifi";

const IV = "#f4ecd8";            // slonokoščena (barva ozadja ploščice)
const RDECA = "#ab3428", ZELENA = "#2d7a4c", MODRA = "#2c5190", CRNILO = "#1e2a48";

/** Kitajski znak, centriran na (cx, cy); velikost je velikost »em« kvadrata. */
function znak(ch: string, cx: number, cy: number, size: number, fill: string): string {
  const G = GLIFI[ch]; const [x0, y0, x1, y1] = G.b;
  const k = size / G.upm, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  return `<path d="${G.d}" fill="${fill}" transform="translate(${cx} ${cy}) scale(${k.toFixed(5)} ${(-k).toFixed(5)}) translate(${-mx} ${-my})"/>`;
}

/* ---------- pike (krogi) ---------- */
function kovanec(cx: number, cy: number, r: number, c: string): string {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * .8}" fill="${IV}"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r * .62}" fill="none" stroke="${c}" stroke-width="${r * .14}"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r * .3}" fill="${c}"/><circle cx="${cx}" cy="${cy}" r="${r * .11}" fill="${IV}"/>`;
  if (r >= 13) for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, x = cx + Math.cos(a) * r * .45, y = cy + Math.sin(a) * r * .45;
    s += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(r * .06).toFixed(2)}" fill="${c}"/>`;
  }
  return s;
}
function pika1(): string {
  let s = `<circle cx="50" cy="64" r="40" fill="${ZELENA}"/><circle cx="50" cy="64" r="35.5" fill="${IV}"/>`;
  for (let i = 0; i < 16; i++) {
    const a = i * 22.5;
    s += `<ellipse cx="50" cy="${64 - 26}" rx="4.2" ry="7.5" fill="${RDECA}" transform="rotate(${a} 50 64)"/>`;
  }
  s += `<circle cx="50" cy="64" r="18" fill="${MODRA}"/><circle cx="50" cy="64" r="12.5" fill="${IV}"/>`
    + `<circle cx="50" cy="64" r="8" fill="${RDECA}"/><circle cx="50" cy="64" r="3" fill="${IV}"/>`;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; s += `<circle cx="${(50 + Math.cos(a) * 15.3).toFixed(2)}" cy="${(64 + Math.sin(a) * 15.3).toFixed(2)}" r="1.3" fill="${IV}"/>`; }
  return s;
}
const PIKE: Record<number, [number, number, number, string][]> = {
  2: [[50, 36, 21, ZELENA], [50, 92, 21, MODRA]],
  3: [[25, 27, 17, MODRA], [50, 64, 17, RDECA], [75, 101, 17, ZELENA]],
  4: [[29, 37, 18, MODRA], [71, 37, 18, ZELENA], [29, 91, 18, ZELENA], [71, 91, 18, MODRA]],
  5: [[27, 29, 15.5, MODRA], [73, 29, 15.5, ZELENA], [50, 64, 15.5, RDECA], [27, 99, 15.5, ZELENA], [73, 99, 15.5, MODRA]],
  6: [[30, 23, 14, ZELENA], [70, 23, 14, ZELENA], [30, 70, 14, RDECA], [70, 70, 14, RDECA], [30, 104, 14, RDECA], [70, 104, 14, RDECA]],
  7: [[24, 18, 12, ZELENA], [50, 31, 12, ZELENA], [76, 44, 12, ZELENA], [31, 78, 13, RDECA], [69, 78, 13, RDECA], [31, 108, 13, RDECA], [69, 108, 13, RDECA]],
  8: [[31, 19, 12.5, MODRA], [69, 19, 12.5, MODRA], [31, 49, 12.5, MODRA], [69, 49, 12.5, MODRA], [31, 79, 12.5, MODRA], [69, 79, 12.5, MODRA], [31, 109, 12.5, MODRA], [69, 109, 12.5, MODRA]],
  9: [[22, 25, 12.5, MODRA], [50, 25, 12.5, MODRA], [78, 25, 12.5, MODRA], [22, 64, 12.5, RDECA], [50, 64, 12.5, RDECA], [78, 64, 12.5, RDECA], [22, 103, 12.5, ZELENA], [50, 103, 12.5, ZELENA], [78, 103, 12.5, ZELENA]],
};

/* ---------- bambus ---------- */
function temnejsa(c: string): string { return c === RDECA ? "#7a2219" : c === MODRA ? "#1d3766" : "#1d5636"; }
function palica(cx: number, cy: number, len: number, c: string, rot = 0): string {
  const w = 9, x = cx - w / 2, y = cy - len / 2, d = temnejsa(c);
  return `<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${x}" y="${y}" width="${w}" height="${len}" rx="4.5" fill="${c}"/>`
    + `<rect x="${x - .6}" y="${cy - 1.8}" width="${w + 1.2}" height="3.6" rx="1.4" fill="${d}"/>`
    + `<rect x="${x}" y="${y}" width="${w}" height="3.2" rx="1.6" fill="${d}"/><rect x="${x}" y="${y + len - 3.2}" width="${w}" height="3.2" rx="1.6" fill="${d}"/>`
    + `<line x1="${cx - 1.8}" y1="${y + 5}" x2="${cx - 1.8}" y2="${cy - 4}" stroke="${IV}" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/>`
    + `<line x1="${cx - 1.8}" y1="${cy + 4}" x2="${cx - 1.8}" y2="${y + len - 5}" stroke="${IV}" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/></g>`;
}
function bambus(n: number): string {
  const Z = ZELENA, R = RDECA;
  switch (n) {
    case 2: return palica(50, 36, 46, Z) + palica(50, 92, 46, MODRA);
    case 3: return palica(50, 36, 46, Z) + palica(31, 92, 46, MODRA) + palica(69, 92, 46, MODRA);
    case 4: return palica(31, 36, 46, MODRA) + palica(69, 36, 46, Z) + palica(31, 92, 46, Z) + palica(69, 92, 46, MODRA);
    case 5: return palica(25, 36, 46, Z) + palica(75, 36, 46, MODRA) + palica(50, 64, 50, R) + palica(25, 92, 46, MODRA) + palica(75, 92, 46, Z);
    case 6: return [24, 50, 76].map(x => palica(x, 36, 46, Z)).join("") + [24, 50, 76].map(x => palica(x, 92, 46, MODRA)).join("");
    case 7: return palica(50, 22, 32, R) + [24, 50, 76].map(x => palica(x, 66, 34, Z)).join("") + [24, 50, 76].map(x => palica(x, 106, 34, MODRA)).join("");
    case 8: return palica(20, 36, 44, Z, 14) + palica(41, 36, 44, Z, -14) + palica(59, 36, 44, Z, 14) + palica(80, 36, 44, Z, -14)
      + palica(20, 92, 44, MODRA, -14) + palica(41, 92, 44, MODRA, 14) + palica(59, 92, 44, MODRA, -14) + palica(80, 92, 44, MODRA, 14);
    case 9: return [24, 50, 76].map(x => palica(x, 25, 34, x === 50 ? R : Z) + palica(x, 64, 34, x === 50 ? R : MODRA) + palica(x, 103, 34, x === 50 ? R : Z)).join("");
  }
  return ptic();
}
/** Bambus 1: ptič na veji. */
function ptic(): string {
  return `<path d="M14 108 Q48 98 88 110" stroke="#7a5a32" stroke-width="4" fill="none" stroke-linecap="round"/>`
    + `<path d="M70 104 l6 -9 M76 105 l3 -12" stroke="#7a5a32" stroke-width="2" stroke-linecap="round"/>`
    + `<ellipse cx="30" cy="80" rx="7" ry="26" fill="${MODRA}" transform="rotate(52 30 80)"/>`
    + `<ellipse cx="34" cy="86" rx="7" ry="26" fill="${RDECA}" transform="rotate(32 34 86)"/>`
    + `<ellipse cx="40" cy="90" rx="7" ry="25" fill="${ZELENA}" transform="rotate(14 40 90)"/>`
    + [[16, 66], [21, 75], [29, 83]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${IV}"/><circle cx="${x}" cy="${y}" r="1.4" fill="${CRNILO}"/>`).join("")
    + `<line x1="54" y1="78" x2="52" y2="100" stroke="${CRNILO}" stroke-width="2"/><line x1="62" y1="78" x2="62" y2="101" stroke="${CRNILO}" stroke-width="2"/>`
    + `<ellipse cx="57" cy="66" rx="21" ry="15" fill="${ZELENA}" transform="rotate(-22 57 66)"/>`
    + `<path d="M44 66 Q56 52 72 60 Q62 72 46 74 Z" fill="${MODRA}"/>`
    + `<ellipse cx="68" cy="72" rx="8" ry="10" fill="${RDECA}"/>`
    + `<ellipse cx="66" cy="50" rx="8" ry="12" fill="${ZELENA}"/><circle cx="70" cy="40" r="11" fill="${ZELENA}"/>`
    + `<path d="M64 30 l-3 -10 M69 29 l0 -11 M74 30 l3 -10" stroke="${RDECA}" stroke-width="1.6"/>`
    + `<circle cx="61" cy="19" r="2.4" fill="${RDECA}"/><circle cx="69" cy="17" r="2.4" fill="${RDECA}"/><circle cx="77" cy="19" r="2.4" fill="${RDECA}"/>`
    + `<path d="M80 39 L91 43 L80 46 Z" fill="#c9822b"/><circle cx="73" cy="38" r="2.6" fill="${IV}"/><circle cx="73.6" cy="38" r="1.3" fill="${CRNILO}"/>`;
}

/* ---------- znaki ---------- */
const STEVILKE = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
function znakSt(n: number): string { return znak(STEVILKE[n], 50, 36, 64, CRNILO) + znak("萬", 50, 93, 66, RDECA); }

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
    const a = i * 60;
    s += `<g transform="rotate(${a} ${cx} ${cy})"><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r}" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>`
      + `<path d="M${cx - r * .28} ${cy - r * .62} L${cx} ${cy - r * .42} L${cx + r * .28} ${cy - r * .62}" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r * .14}" fill="${c}"/>`;
}
function okvirCvet(barva: string, n: number, ch: string, chBarva: string): string {
  return `<rect x="5" y="5" width="90" height="118" rx="7" fill="none" stroke="${barva}" stroke-width="2.4" stroke-opacity=".6"/>`
    + `<text x="13" y="27" font-size="19" font-weight="700" fill="${barva}" font-family="var(--pisava-stevilke, Georgia, serif)">${n}</text>`
    + znak(ch, 80, 20, 26, chBarva);
}
const ROZA_OKVIR = "#b2555a", CAS_OKVIR = "#3f7f86";
function roza(n: number): string {
  const vej = "#5b3d24";
  switch (n) {
    case 1: return okvirCvet(ROZA_OKVIR, 1, "梅", RDECA)
      + `<path d="M22 112 Q40 84 52 70 Q64 56 82 40 M52 70 Q66 74 78 90 M40 86 Q30 72 30 56" stroke="${vej}" stroke-width="4" fill="none" stroke-linecap="round"/>`
      + cvet(30, 54, 13, "#b8343c") + cvet(80, 40, 12, "#b8343c") + cvet(76, 90, 12, "#c44850") + cvet(52, 70, 10, "#c44850") + `<circle cx="64" cy="54" r="3.5" fill="#b8343c"/><circle cx="40" cy="98" r="3" fill="#b8343c"/>`;
    case 2: return okvirCvet(ROZA_OKVIR, 2, "蘭", "#6e4c98")
      + `<path d="M50 116 Q30 80 16 48 M52 116 Q60 74 86 52 M48 116 Q44 86 50 60" stroke="${ZELENA}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
      + [[46, 58], [64, 72]].map(([x, y]) => [0, 120, 240].map(a => `<ellipse cx="${x}" cy="${y - 9}" rx="5" ry="10" fill="#7d58a8" transform="rotate(${a} ${x} ${y})"/>`).join("") + `<circle cx="${x}" cy="${y}" r="3.4" fill="#e8c25a"/>`).join("");
    case 3: {
      let s = okvirCvet(ROZA_OKVIR, 3, "菊", "#b26a1c") + `<path d="M50 118 Q52 96 50 76" stroke="${ZELENA}" stroke-width="3.4" fill="none"/>` + list(36, 100, 6, 13, -50, ZELENA) + list(64, 96, 6, 13, 50, ZELENA);
      for (let i = 0; i < 18; i++) s += `<ellipse cx="50" cy="${60 - 17}" rx="3.6" ry="11" fill="${i % 2 ? "#d9902e" : "#c97a22"}" transform="rotate(${i * 20} 50 60)"/>`;
      return s + `<circle cx="50" cy="60" r="8" fill="#b4561c"/><circle cx="50" cy="60" r="3.4" fill="#e8c25a"/>`;
    }
    default: return okvirCvet(ROZA_OKVIR, 4, "竹", ZELENA)
      + palica(36, 74, 84, ZELENA, -6) + palica(62, 80, 70, "#3a8a55", 8)
      + list(76, 46, 4, 15, 55, ZELENA) + list(82, 58, 4, 14, 75, ZELENA) + list(24, 46, 4, 14, -60, ZELENA) + list(20, 60, 4, 13, -80, "#3a8a55") + list(72, 104, 4, 12, 60, "#3a8a55");
  }
}
function letniCas(n: number): string {
  switch (n) {
    case 1: return okvirCvet(CAS_OKVIR, 1, "春", "#c4607a")
      + `<path d="M14 100 Q44 80 60 60 Q72 46 88 34" stroke="#8a6448" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
      + cvet(32, 82, 11, "#e9a3b6", "#f4d77a") + cvet(60, 58, 12, "#e9a3b6", "#f4d77a") + cvet(84, 34, 10, "#f0b8c6", "#f4d77a")
      + list(46, 66, 3.5, 8, 40, "#8db86a") + list(74, 50, 3.5, 8, -30, "#8db86a") + `<circle cx="22" cy="92" r="3" fill="#e9a3b6"/>`;
    case 2: return okvirCvet(CAS_OKVIR, 2, "夏", "#2f7f73")
      + `<ellipse cx="50" cy="100" rx="38" ry="12" fill="#3f8a72"/><path d="M50 100 L18 96 M50 100 L30 108 M50 100 L70 109 M50 100 L84 96" stroke="#2c6b56" stroke-width="1.6"/>`
      + `<path d="M50 96 Q48 82 50 74" stroke="#2c6b56" stroke-width="3" fill="none"/>`
      + [-50, -25, 0, 25, 50].map(a => `<path d="M50 74 Q${50 - 8} 58 50 42 Q${50 + 8} 58 50 74 Z" fill="${a === 0 ? "#e07a8e" : "#ea98a8"}" transform="rotate(${a} 50 74)"/>`).join("");
    case 3: return okvirCvet(CAS_OKVIR, 3, "秋", "#b4481e")
      + javor(36, 62, 22, "#c4522a", -18) + javor(68, 82, 18, "#d98a2a", 22) + javor(64, 44, 12, "#b8402a", 40);
    default: return okvirCvet(CAS_OKVIR, 4, "冬", MODRA)
      + snezinka(50, 70, 32, "#4a70a8") + `<circle cx="20" cy="44" r="2.4" fill="#7d98c4"/><circle cx="82" cy="104" r="2.4" fill="#7d98c4"/><circle cx="84" cy="50" r="1.8" fill="#7d98c4"/><circle cx="18" cy="104" r="1.8" fill="#7d98c4"/>`;
  }
}

/* ---------- vetrovi in zmaji ---------- */
const VETROVI: Record<string, string> = { V: "東", J: "南", Z: "西", S: "北" };
function beliZmaj(): string {
  return `<rect x="16" y="16" width="68" height="96" rx="5" fill="none" stroke="${MODRA}" stroke-width="5"/>`
    + `<rect x="25" y="25" width="50" height="78" rx="3" fill="none" stroke="${MODRA}" stroke-width="2.4"/>`
    + [[16, 16], [84, 16], [16, 112], [84, 112]].map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${IV}" stroke="${MODRA}" stroke-width="2.4" transform="rotate(45 ${x} ${y})"/>`).join("");
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

export function risba(id: string): string {
  const n = Number(id.slice(1));
  switch (id[0]) {
    case "p": return n === 1 ? pika1() : PIKE[n].map(([x, y, r, c]) => kovanec(x, y, r, c)).join("");
    case "b": return bambus(n);
    case "z": return znakSt(n);
    case "v": return znak(VETROVI[id[1]], 50, 64, 90, CRNILO);
    case "d": return id[1] === "R" ? znak("中", 50, 64, 92, RDECA) : id[1] === "G" ? znak("發", 50, 64, 92, ZELENA) : beliZmaj();
    case "r": return roza(n);
    case "c": return letniCas(n);
  }
  return "";
}

/** Skriti SVG z vsemi risbami kot <symbol>, da jih ploščice uporabijo z <use>. */
export function vstaviSimbole(): void {
  if (document.getElementById("simboli-ploscic")) return;
  const s = VRSTE.map(v => `<symbol id="t-${v.id}" viewBox="0 0 100 128">${risba(v.id)}</symbol>`).join("");
  const div = document.createElement("div");
  div.innerHTML = `<svg id="simboli-ploscic" width="0" height="0" style="position:absolute" aria-hidden="true">${s}</svg>`;
  document.body.prepend(div.firstElementChild!);
}
