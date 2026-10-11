// Slogi z drugačnimi podobami (svetla podlaga, dobra vidnost): Vrt, Morje in Art deco.
import { A, temnejsa, svetlejsa, napis, type Tema } from "./osnova";

const f = (v: number) => v.toFixed(1);
const krog = (cx: number, cy: number, r: number, fill: string, extra = "") => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"${extra}/>`;
const elipsa = (cx: number, cy: number, rx: number, ry: number, rot: number, fill: string, extra = "") =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" transform="rotate(${f(rot)} ${f(cx)} ${f(cy)})"${extra}/>`;
const pol = (cx: number, cy: number, r: number, kot: number) => { const a = kot * Math.PI / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
/** Številka v kotu: krog ali zaobljen kvadrat (rože/letni časi). */
export function znacka(n: number, barva: string, kvadrat: boolean): string {
  return (kvadrat ? `<rect x="6" y="6" width="25" height="25" rx="6" fill="${barva}"/>` : krog(18.5, 18.5, 13, barva)) + napis(String(n), 18.5, 27, 20, "#ffffff");
}
/** Elegantna številka (pisava DM Serif Display). */
export function stevilka(n: number | string, x: number, y: number, size: number, fill: string): string {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${fill}" style="font-family:var(--naslovi, Georgia, serif)">${n}</text>`;
}
/** Kompas: tanek obroč, štirje kraki, poudarjen krak v smeri vetra, črka spodaj. */
export function kompas(k: string, obroc: string, krak: string, poudarek: string, crka: string, okrasno = false): string {
  const smer: Record<string, number> = { S: 0, V: 90, J: 180, Z: 270 };
  let s = krog(50, 54, 31, "none", ` stroke="${obroc}" stroke-width="2.6"`) + krog(50, 54, 25.5, "none", ` stroke="${obroc}" stroke-width="1"`);
  for (const a of [0, 90, 180, 270]) {
    const aktiven = a === smer[k];
    s += `<path d="M50 ${aktiven ? 22 : 31} L55 56 L50 60 L45 56 Z" fill="${aktiven ? poudarek : krak}" transform="rotate(${a} 50 56)"/>`;
  }
  if (okrasno) for (const a of [45, 135, 225, 315]) s += `<path d="M50 36 L52.5 56 L50 58 L47.5 56 Z" fill="${krak}" opacity=".6" transform="rotate(${a} 50 56)"/>`;
  return s + krog(50, 56, 4.5, poudarek) + krog(50, 56, 2, "#ffffff") + stevilka(k, 50, 122, 33, crka);
}

/* ============================ VRT ============================ */
/** Skupne razlage za pomoč: rože in letni časi imajo značko s številko, vetrovi puščico in črko. */
export const ZNACKE = { r: "Okrogla značka s številko v kotu.", c: "Kvadratna značka s številko v kotu.", v: "Puščica kaže smer neba, spodaj je črka V, J, Z ali S." };
const V = { roza: "#d4566a", koral: "#e98a63", ognjic: "#e59a2f", vijol: "#7b83c9", zajbelj: "#6f9d6b", list: "#4e8a4c", zlata: "#d9a441", crnilo: "#3a3947", krem: "#fdfaf3", rozaS: "#f4b6c2", jesen: "#d9734e", tur: "#3f8f8a" };
/** Cvet s petimi venčnimi listi; zelena pika postane rumen ognjič (zelen cvet bi bil čuden). */
function cvetVrt(cx: number, cy: number, r: number, c: string): string {
  const rumen = c === V.zajbelj;
  if (rumen) c = V.ognjic;
  let s = "";
  for (let i = 0; i < 5; i++) { const a = i * 72 - 90, [x, y] = pol(cx, cy, r * .47, a); s += elipsa(x, y, r * .42, r * .56, a + 90, c); }
  const sv = svetlejsa(c, .38);
  for (let i = 0; i < 5; i++) { const a = i * 72 - 54, [x, y] = pol(cx, cy, r * .28, a); s += elipsa(x, y, r * .23, r * .33, a + 90, sv); }
  const sred = rumen ? "#8a5a2b" : V.zlata;
  s += krog(cx, cy, r * .2, sred);
  for (let i = 0; i < 6; i++) { const [x, y] = pol(cx, cy, r * .3, i * 60); s += krog(x, y, r * .05, temnejsa(sred, .25)); }
  return s;
}
function listVrt(cx: number, cy: number, len: number, c: string, rot: number): string {
  const t = A.T, barva = c === t.rdeca ? V.jesen : c === t.modra ? V.tur : V.list;
  const w = Math.min(16, len * .36), y0 = cy - len / 2, y1 = cy + len / 2;
  let s = `<path d="M${cx} ${y0} C${cx + w} ${cy - len / 4} ${cx + w} ${cy + len / 4} ${cx} ${y1} C${cx - w} ${cy + len / 4} ${cx - w} ${cy - len / 4} ${cx} ${y0} Z" fill="${barva}"/>`;
  s += `<path d="M${cx} ${y0 + 2} L${cx} ${y1 - 1}" stroke="${svetlejsa(barva, .45)}" stroke-width="1.2" stroke-linecap="round"/>`;
  for (const k of [.3, .5, .7]) { const y = y0 + len * k; s += `<path d="M${cx} ${f(y)} L${f(cx + w * .55)} ${f(y - len * .08)} M${cx} ${f(y)} L${f(cx - w * .55)} ${f(y - len * .08)}" stroke="${svetlejsa(barva, .45)}" stroke-width=".8" stroke-linecap="round"/>`; }
  return `<g transform="rotate(${rot} ${cx} ${cy})">${s}</g>`;
}
function vrtnica(cx: number, cy: number, r: number): string {
  let s = elipsa(cx - r * .9, cy + r * .9, r * .28, r * .6, -50, V.list) + elipsa(cx + r * .9, cy + r * .9, r * .28, r * .6, 50, V.list);
  const plasti: [number, number, string][] = [[1, 7, "#b8394c"], [.74, 6, "#cc4a5d"], [.5, 5, "#de6575"]];
  plasti.forEach(([k, n, c], j) => { for (let i = 0; i < n; i++) { const a = i * 360 / n + j * 20, [x, y] = pol(cx, cy, r * k * .5, a); s += elipsa(x, y, r * k * .5, r * k * .62, a + 90, c); } });
  return s + `<path d="M${cx - r * .16} ${cy} a${r * .16} ${r * .16} 0 1 1 ${r * .2} ${r * .1} a${r * .09} ${r * .09} 0 1 1 -${r * .1} -${r * .1}" stroke="#9e2c3e" stroke-width="2" fill="none"/>`;
}
const VRT: Tema = {
  id: "vrt", ime: "Vrt", opis: "Cvetovi namesto krogov, listi namesto palic, kolibri in vrtnica",
  iv: V.krem, rdeca: V.roza, zelena: V.zajbelj, modra: V.vijol, crnilo: V.crnilo, zlata: V.zlata, vej: "#7a6450",
  okvirRoza: V.koral, okvirCas: V.zajbelj, debelo: 0, razlocno: true, zlato: false,
  besedila: { ...ZNACKE, p: "Šteješ cvetove.", b: "Šteješ liste. Eden sam je kolibri.", z: "Velika številka nad šopkom cvetov.", d: "Vrtnica, praprot in lovorov venec." },
  kovanec: cvetVrt,
  pika1: () => {
    let s = elipsa(28, 98, 8, 17, -45, V.list) + elipsa(72, 98, 8, 17, 45, V.list);
    const plasti: [number, number, string][] = [[32, 8, V.roza], [22, 8, "#e47a8a"], [13, 5, V.rozaS]];
    plasti.forEach(([r, n, c], j) => { for (let i = 0; i < n; i++) { const a = i * 360 / n + j * 22, [x, y] = pol(50, 62, r * .52, a); s += elipsa(x, y, r * .42, r * .56, a + 90, c); } });
    s += krog(50, 62, 6.5, V.zlata);
    for (let i = 0; i < 10; i++) { const [x, y] = pol(50, 62, 9.5, i * 36); s += `<line x1="50" y1="62" x2="${f(x)}" y2="${f(y)}" stroke="${V.zlata}" stroke-width=".9"/>` + krog(x, y, 1.3, temnejsa(V.zlata, .2)); }
    return s;
  },
  palica: listVrt,
  ptic: () => `<path d="M76 116 Q74 94 80 76" stroke="${V.list}" stroke-width="2.4" fill="none"/>` + elipsa(70, 100, 4, 10, -40, V.list)
    + `<path d="M80 76 Q72 66 76 56 Q82 64 80 76 Z" fill="${V.roza}"/><path d="M80 76 Q90 68 86 58 Q80 66 80 76 Z" fill="#e47a8a"/><path d="M80 76 L78 84 M80 76 L82 85" stroke="${V.rozaS}" stroke-width="1.4"/>`
    + `<path d="M22 60 L10 50 L14 66 Z" fill="${V.tur}"/><path d="M22 62 L8 64 L18 72 Z" fill="${temnejsa(V.tur, .2)}"/>`
    + elipsa(34, 60, 15, 8.5, -20, V.tur) + elipsa(36, 64, 9, 4.5, -20, "#9bd3c8")
    + `<path d="M32 54 Q40 30 56 34 Q46 44 38 56 Z" fill="${svetlejsa(V.tur, .3)}"/>`
    + krog(48, 52, 6.5, V.tur) + `<path d="M54 51 L74 55 L54 54 Z" fill="${V.crnilo}"/>` + krog(49.5, 50.5, 1.8, "#ffffff") + krog(49.8, 50.5, .9, V.crnilo)
    + krog(46, 56, 2.4, V.roza),
  znakSt: n => stevilka(n, 50, 78, 72, V.crnilo) + elipsa(40, 111, 4, 9, -60, V.list) + elipsa(60, 111, 4, 9, 60, V.list) + cvetVrt(36, 103, 8, V.roza) + cvetVrt(64, 103, 8, V.koral) + cvetVrt(50, 106, 9, V.vijol),
  veter: k => kompas(k, "#8f826c", "#b3a78f", V.roza, V.crnilo),
  zmaj: k => {
    if (k === "R") return vrtnica(50, 60, 34);
    if (k === "G") {
      let s = `<path d="M50 112 Q46 70 56 22" stroke="${V.list}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      for (let i = 0; i < 9; i++) { const t = i / 9, y = 104 - t * 80, x = 49 + t * 6, d = 16 * (1 - t * .6); s += elipsa(x - d * .7, y - 2, d * .55, 3.6, -20, V.list) + elipsa(x + d * .7, y - 2, d * .55, 3.6, 20, V.zajbelj); }
      return s;
    }
    let s = "";
    // lovorov venec: dve veji od spodaj navzgor, listi v parih
    for (const st of [-1, 1]) {
      const [x0, y0] = pol(50, 64, 33, 90 - st * 12), [x1, y1] = pol(50, 64, 33, 90 - st * 152);
      s += `<path d="M${f(x0)} ${f(y0)} A33 33 0 0 ${st < 0 ? 1 : 0} ${f(x1)} ${f(y1)}" stroke="${V.list}" stroke-width="2.2" fill="none"/>`;
      for (let i = 0; i < 7; i++) {
        const a = 90 - st * (22 + i * 19), [xo, yo] = pol(50, 64, 38, a), [xi, yi] = pol(50, 64, 28, a), t = a + 90 - st * 90;
        s += elipsa(xo, yo, 3.6, 8.5, t - st * 30, i % 2 ? V.zajbelj : V.list) + elipsa(xi, yi, 3.2, 7.5, t + st * 30, i % 2 ? V.list : V.zajbelj);
      }
    }
    return s + krog(50, 98, 4, V.roza) + krog(44, 101, 3, V.roza) + krog(56, 101, 3, V.roza);
  },
  roza: n => {
    const risbe = [
      `<path d="M18 112 Q42 92 52 72 Q62 54 84 42" stroke="#8a6d58" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M52 72 Q66 74 76 88" stroke="#8a6d58" stroke-width="2.2" fill="none"/>` + cvetVrt(34, 92, 10, V.rozaS) + cvetVrt(56, 66, 11, "#f08fa3") + cvetVrt(84, 42, 9, V.rozaS) + cvetVrt(76, 88, 8, "#f08fa3") + krog(70, 54, 3, V.roza),
      `<path d="M50 116 L50 70" stroke="${V.list}" stroke-width="3"/>` + elipsa(38, 98, 6, 20, -25, V.list) + elipsa(62, 100, 6, 18, 28, V.zajbelj)
        + `<path d="M36 50 Q36 74 50 76 Q64 74 64 50 Q57 58 50 46 Q43 58 36 50 Z" fill="${V.koral}"/><path d="M50 46 Q44 60 50 76 Q56 60 50 46 Z" fill="${temnejsa(V.koral, .15)}"/>`,
      Array.from({ length: 16 }, (_, i) => elipsa(50 + Math.cos(i * Math.PI / 8) * 20, 64 + Math.sin(i * Math.PI / 8) * 20, 5, 11, i * 22.5 + 90, i % 2 ? "#f2bf3a" : V.zlata)).join("") + krog(50, 64, 12, "#7a4e2d") + krog(50, 64, 7, "#94633a"),
      `<path d="M58 116 Q56 80 40 50" stroke="${V.list}" stroke-width="2.4" fill="none"/>` + elipsa(70, 92, 9, 26, 12, V.list) + elipsa(30, 96, 8, 22, -18, V.zajbelj)
        + [[42, 54], [46, 64], [50, 74], [53, 84], [55, 94]].map(([x, y]) => `<path d="M${x - 5} ${y} Q${x} ${y - 9} ${x + 5} ${y} Q${x} ${y + 3} ${x - 5} ${y} Z" fill="#ffffff" stroke="${V.zajbelj}" stroke-width="1.2"/>`).join(""),
    ];
    return znacka(n, V.koral, false) + risbe[n - 1];
  },
  letniCas: n => {
    const risbe = [
      `<path d="M12 104 Q50 80 88 104 L88 120 L12 120 Z" fill="#a9c98f"/>` + `<path d="M50 104 L50 80" stroke="${V.list}" stroke-width="2.4"/>` + elipsa(43, 84, 4, 9, -45, V.list) + elipsa(57, 82, 4, 9, 45, V.list) + krog(72, 50, 12, "#f6c453") + Array.from({ length: 8 }, (_, i) => { const [x, y] = pol(72, 50, 19, i * 45); return krog(x, y, 2, "#f6c453"); }).join(""),
      Array.from({ length: 12 }, (_, i) => `<path d="M50 30 L53 44 L47 44 Z" fill="${i % 2 ? "#f3b03c" : "#f6c453"}" transform="rotate(${i * 30} 50 64)"/>`).join("") + krog(50, 64, 17, "#f6c453") + krog(50, 64, 12, "#f9d77a"),
      `<path d="M50 30 L57 48 L76 42 L67 60 L82 70 L63 75 L66 94 L50 84 L34 94 L37 75 L18 70 L33 60 L24 42 L43 48 Z" fill="${V.jesen}"/><path d="M50 40 L50 108 M50 62 L66 50 M50 62 L34 50 M50 74 L68 72 M50 74 L32 72" stroke="${temnejsa(V.jesen, .25)}" stroke-width="1.4" fill="none"/>`,
      Array.from({ length: 6 }, (_, i) => `<g transform="rotate(${i * 60} 50 64)"><path d="M50 64 L50 32" stroke="${V.vijol}" stroke-width="3.2" stroke-linecap="round"/><path d="M42 40 L50 47 L58 40 M44 50 L50 55 L56 50" stroke="${V.vijol}" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`).join("") + krog(50, 64, 4, V.vijol),
    ];
    return znacka(n, V.zajbelj, true) + risbe[n - 1];
  },
};

/* ============================ MORJE ============================ */
const M = { koral: "#e4685a", tur: "#2a9d8f", modra: "#2f5d9e", pesek: "#e2b65c", roza: "#f2b5a7", crnilo: "#23395b", krem: "#fbf8f1", morje: "#7cc4d6" };
function skoljka(cx: number, cy: number, r: number, c: string): string {
  const C = [cx, cy + r * .28], R = r * 1.02, H = [cx, cy + r * .82], n = 7;
  const tocke = Array.from({ length: n + 1 }, (_, i) => pol(C[0], C[1], R, 200 + i * 140 / n));
  let d = `M${f(H[0])} ${f(H[1])} L${f(tocke[0][0])} ${f(tocke[0][1])}`;
  for (let i = 0; i < n; i++) { const [mx, my] = pol(C[0], C[1], R * 1.14, 200 + (i + .5) * 140 / n); d += ` Q${f(mx)} ${f(my)} ${f(tocke[i + 1][0])} ${f(tocke[i + 1][1])}`; }
  d += " Z";
  let s = `<path d="${d}" fill="${c}"/>`;
  for (let i = 1; i < n; i++) s += `<path d="M${f(H[0])} ${f(H[1])} L${f(tocke[i][0])} ${f(tocke[i][1])}" stroke="${temnejsa(c, .22)}" stroke-width="${f(r * .06)}" stroke-linecap="round"/>`;
  s += `<path d="M${f(cx - r * .32)} ${f(cy + r * .78)} L${f(cx + r * .32)} ${f(cy + r * .78)} L${f(cx + r * .18)} ${f(cy + r * .98)} L${f(cx - r * .18)} ${f(cy + r * .98)} Z" fill="${temnejsa(c, .12)}"/>`;
  return s + `<path d="${d}" fill="none" stroke="${svetlejsa(c, .35)}" stroke-width="${f(r * .05)}"/>`;
}
function alga(cx: number, cy: number, len: number, c: string, rot: number): string {
  const w = 11, y0 = cy - len / 2, n = 12, lev: string[] = [], des: string[] = [];
  for (let i = 0; i <= n; i++) { const y = y0 + len * i / n, o = Math.sin(i * 1.1) * 2.2, z = w / 2 * (i === 0 || i === n ? .4 : 1); lev.push(`${f(cx - z + o)},${f(y)}`); des.unshift(`${f(cx + z + o)},${f(y)}`); }
  return `<g transform="rotate(${rot} ${cx} ${cy})"><polygon points="${lev.join(" ")} ${des.join(" ")}" fill="${c}" stroke="${temnejsa(c, .2)}" stroke-width=".8" stroke-linejoin="round"/>`
    + `<path d="M${cx} ${y0 + 3} Q${cx + 2} ${cy} ${cx} ${y0 + len - 3}" stroke="${svetlejsa(c, .45)}" stroke-width="1" fill="none"/>` + krog(cx, y0 + 2, 2.4, svetlejsa(c, .3)) + `</g>`;
}
const MORJE: Tema = {
  id: "morje", ime: "Morje", opis: "Školjke namesto krogov, morske alge, ribe in pomorski kompas",
  iv: M.krem, rdeca: M.koral, zelena: M.tur, modra: M.modra, crnilo: M.crnilo, zlata: M.pesek, vej: "#9a7b56",
  okvirRoza: M.koral, okvirCas: M.tur, debelo: 0, razlocno: true, zlato: false,
  besedila: { ...ZNACKE, p: "Šteješ školjke.", b: "Šteješ morske alge. Ena sama je riba.", z: "Velika številka nad valovi.", d: "Korala, želva in okroglo ladijsko okno." },
  kovanec: skoljka,
  pika1: () => {
    let s = krog(50, 64, 36, "#ead2a0") + krog(50, 64, 36, "none", ` stroke="${temnejsa("#ead2a0", .2)}" stroke-width="2"`);
    for (let i = 0; i < 5; i++) { const a = i * 72 - 90, [x, y] = pol(50, 64, 15, a); s += elipsa(x, y, 4.5, 13, a + 90, "#f6e7c6", ` stroke="${temnejsa("#ead2a0", .25)}" stroke-width="1"`); }
    for (let i = 0; i < 24; i++) { const [x, y] = pol(50, 64, 30, i * 15); s += krog(x, y, 1, temnejsa("#ead2a0", .3)); }
    return s + krog(50, 64, 4, temnejsa("#ead2a0", .35));
  },
  palica: alga,
  ptic: () => [[22, 30, 3], [28, 22, 2], [18, 20, 1.6]].map(([x, y, r]) => krog(x, y, r, "none", ` stroke="${M.morje}" stroke-width="1.2"`)).join("")
    + `<path d="M76 66 L94 50 L92 82 Z" fill="${temnejsa(M.koral, .1)}"/>` + elipsa(50, 66, 30, 17, 0, M.koral)
    + Array.from({ length: 4 }, (_, i) => `<path d="M${46 + i * 7} 56 q4 10 0 20" stroke="${svetlejsa(M.koral, .35)}" stroke-width="1.6" fill="none"/>`).join("")
    + `<path d="M44 50 Q52 34 64 50 Z" fill="${temnejsa(M.koral, .15)}"/><path d="M48 82 Q54 94 62 82 Z" fill="${temnejsa(M.koral, .15)}"/>`
    + krog(30, 62, 4, "#ffffff") + krog(29, 62, 2, M.crnilo) + `<path d="M22 70 Q26 73 30 71" stroke="${M.crnilo}" stroke-width="1.3" fill="none"/>`
    + `<path d="M10 108 Q30 100 50 108 T90 108" stroke="${M.morje}" stroke-width="2.4" fill="none"/>`,
  znakSt: n => stevilka(n, 50, 78, 74, M.crnilo) + `<path d="M24 98 q6.5 -6 13 0 t13 0 t13 0 t13 0" stroke="${M.tur}" stroke-width="2.6" fill="none"/><path d="M24 108 q6.5 -6 13 0 t13 0 t13 0 t13 0" stroke="${M.morje}" stroke-width="2.2" fill="none"/>`,
  veter: k => kompas(k, M.crnilo, "#9fb3c8", M.koral, M.crnilo, true),
  zmaj: k => {
    if (k === "R") return `<g stroke="${M.koral}" stroke-linecap="round" fill="none"><path d="M50 116 L50 80 L36 58 L32 36 M36 58 L22 48 M50 80 L64 60 L62 34 M64 60 L80 50 L84 30 M50 92 L74 84" stroke-width="6"/><path d="M32 36 L28 26 M62 34 L66 24 M84 30 L80 22 M22 48 L14 42" stroke-width="4"/></g>` + [[32, 36], [62, 34], [84, 30], [22, 48], [74, 84]].map(([x, y]) => krog(x, y, 3.5, "#f08a7e")).join("");
    if (k === "G") {
      let s = elipsa(28, 54, 9, 5, -30, "#7fb08a") + elipsa(72, 54, 9, 5, 30, "#7fb08a") + elipsa(30, 86, 8, 5, 30, "#7fb08a") + elipsa(70, 86, 8, 5, -30, "#7fb08a") + krog(50, 32, 8, "#7fb08a") + krog(47, 30, 1.4, M.crnilo) + krog(53, 30, 1.4, M.crnilo);
      s += elipsa(50, 70, 22, 27, 0, M.tur);
      for (const [x, y] of [[50, 58], [40, 70], [60, 70], [50, 82], [50, 70]]) s += `<polygon points="${Array.from({ length: 6 }, (_, i) => pol(x, y, 6.5, i * 60 + 30).map(f).join(",")).join(" ")}" fill="${svetlejsa(M.tur, .25)}" stroke="${temnejsa(M.tur, .25)}" stroke-width="1"/>`;
      return s;
    }
    let s = krog(50, 64, 36, "none", ` stroke="${M.crnilo}" stroke-width="5"`) + krog(50, 64, 28, "none", ` stroke="${M.pesek}" stroke-width="2.5"`);
    for (let i = 0; i < 8; i++) { const [x, y] = pol(50, 64, 32, i * 45 + 22.5); s += krog(x, y, 1.8, M.pesek); }
    return s;
  },
  roza: n => {
    const risbe = [
      Array.from({ length: 14 }, (_, i) => `<path d="M50 74 Q${50 + Math.cos(i * .45 - 3) * 18} ${74 + Math.sin(i * .45 - 3) * 20} ${f(50 + Math.cos(i * .45 - 3.1) * 30)} ${f(70 + Math.sin(i * .45 - 3.1) * 30)}" stroke="${i % 2 ? M.koral : "#f08a7e"}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("") + elipsa(50, 92, 14, 16, 0, temnejsa(M.koral, .15)),
      `<polygon points="${Array.from({ length: 10 }, (_, i) => pol(50, 66, i % 2 ? 12 : 32, i * 36 - 90).map(f).join(",")).join(" ")}" fill="${M.pesek}" stroke="${temnejsa(M.pesek, .25)}" stroke-width="1.6" stroke-linejoin="round"/>` + Array.from({ length: 5 }, (_, i) => [1, 2, 3].map(j => { const [x, y] = pol(50, 66, 8 + j * 6, i * 72 - 90); return krog(x, y, 1.5, temnejsa(M.pesek, .3)); }).join("")).join(""),
      krog(50, 66, 15, "#8e6bb8") + Array.from({ length: 20 }, (_, i) => { const [x1, y1] = pol(50, 66, 14, i * 18), [x2, y2] = pol(50, 66, 30, i * 18); return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#8e6bb8" stroke-width="2" stroke-linecap="round"/>`; }).join("") + krog(46, 62, 4, "#b39ad3"),
      `<path d="M26 66 Q26 36 50 36 Q74 36 74 66 Z" fill="${M.roza}"/><path d="M26 66 Q50 74 74 66" stroke="${temnejsa(M.roza, .2)}" stroke-width="1.6" fill="none"/>` + [32, 41, 50, 59, 68].map((x, i) => `<path d="M${x} 68 q${i % 2 ? 4 : -4} 12 0 22 t0 22" stroke="${temnejsa(M.roza, .15)}" stroke-width="2" fill="none"/>`).join(""),
    ];
    return znacka(n, M.koral, false) + risbe[n - 1];
  },
  letniCas: n => {
    const val = (y: number, c: string) => `<path d="M8 ${y} q7 -7 14 0 t14 0 t14 0 t14 0 t14 0 t14 0" stroke="${c}" stroke-width="2.6" fill="none"/>`;
    const risbe = [
      val(98, M.morje) + val(108, M.tur) + `<path d="M30 58 Q40 50 50 58 Q60 50 70 58" stroke="${M.crnilo}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M58 44 Q64 40 70 44 Q76 40 82 44" stroke="${M.crnilo}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
      Array.from({ length: 8 }, (_, i) => { const [x1, y1] = pol(50, 60, 22, i * 45 - 90), [x2, y2] = pol(50, 60, 30, i * 45 - 90); return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#f3b03c" stroke-width="3" stroke-linecap="round"/>`; }).join("") + krog(50, 60, 17, "#f6c453") + val(100, M.morje) + val(110, M.tur),
      `<path d="M28 56 Q30 40 46 44 Q52 30 66 38 Q80 36 78 52 Q86 60 74 64 L32 64 Q20 62 28 56 Z" fill="#b8c4d0"/>` + [36, 50, 64].map(x => `<line x1="${x}" y1="70" x2="${x - 5}" y2="84" stroke="${M.modra}" stroke-width="2.4" stroke-linecap="round"/>`).join("") + val(100, M.morje) + val(110, M.tur),
      `<path d="M26 92 L40 52 L52 66 L60 46 L76 92 Z" fill="#eaf3f8" stroke="${M.morje}" stroke-width="2" stroke-linejoin="round"/><path d="M40 52 L44 72 L52 66 M60 46 L62 70" stroke="${M.morje}" stroke-width="1.4" fill="none"/>` + val(100, M.morje) + val(110, M.tur),
    ];
    return znacka(n, M.tur, true) + risbe[n - 1];
  },
};

/* ============================ ART DECO ============================ */
const D = { mornar: "#1d2a4d", tur: "#17807e", koral: "#d2553f", zlata: "#c49a3c", zlataS: "#e2c47a", zad: "#2f8f68", slon: "#fbf7ec", roza: "#e7a3a0" };
/** Medaljon: obroč v barvi, tanek zlat obroč, sončni žarki in sredica. */
function medaljon(cx: number, cy: number, r: number, c: string): string {
  let s = krog(cx, cy, r, c) + krog(cx, cy, r * .7, D.slon) + krog(cx, cy, r * .61, "none", ` stroke="${D.zlata}" stroke-width="${f(Math.max(1, r * .06))}"`);
  for (let i = 0; i < 12; i++) { const [x1, y1] = pol(cx, cy, r * .3, i * 30 - 6), [x2, y2] = pol(cx, cy, r * .3, i * 30 + 6), [x3, y3] = pol(cx, cy, r * .54, i * 30); s += `<polygon points="${f(x1)},${f(y1)} ${f(x3)},${f(y3)} ${f(x2)},${f(y2)}" fill="${c}"/>`; }
  return s + krog(cx, cy, r * .3, c) + krog(cx, cy, r * .12, D.zlataS);
}
/** Stopničast deco okvir (vogali izrezani v stopnice). */
function stopnice(x: number, y: number, w: number, h: number, k: number): string {
  return `M${x + 2 * k} ${y} H${x + w - 2 * k} V${y + k} H${x + w - k} V${y + 2 * k} H${x + w} V${y + h - 2 * k} H${x + w - k} V${y + h - k} H${x + w - 2 * k} V${y + h} `
    + `H${x + 2 * k} V${y + h - k} H${x + k} V${y + h - 2 * k} H${x} V${y + 2 * k} H${x + k} V${y + k} H${x + 2 * k} Z`;
}
/** Pahljača (žarki iz točke), osnova mnogih deco okrasov. */
function pahljaca(cx: number, cy: number, r: number, od: number, doo: number, n: number, c: string, c2 = c): string {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a1 = od + (doo - od) * i / n, a2 = od + (doo - od) * (i + 1) / n, [x1, y1] = pol(cx, cy, r, a1), [x2, y2] = pol(cx, cy, r, a2);
    s += `<path d="M${f(cx)} ${f(cy)} L${f(x1)} ${f(y1)} A${f(r)} ${f(r)} 0 0 1 ${f(x2)} ${f(y2)} Z" fill="${i % 2 ? c2 : c}"/>`;
  }
  return s;
}
const DECO: Tema = {
  id: "deco", ime: "Art deco", opis: "Medaljoni, stebri, pav in sončni žarki z zlato obrobo",
  iv: D.slon, rdeca: D.koral, zelena: D.zad, modra: D.mornar, crnilo: D.mornar, zlata: D.zlata, vej: D.zlata,
  okvirRoza: D.koral, okvirCas: D.tur, debelo: 0, razlocno: true, zlato: true,
  besedila: { ...ZNACKE, p: "Šteješ medaljone.", b: "Šteješ stebre. Eden sam je pav.", z: "Velika številka v okvirju.", d: "Sončni vzhod, zelena pahljača in prazen okvir." },
  okras: () => `<path d="${stopnice(4, 4, 92, 120, 4)}" fill="none" stroke="${D.zlata}" stroke-width="1.3" stroke-opacity=".8"/>`,
  kovanec: medaljon,
  pika1: () => {
    let s = pahljaca(50, 64, 40, 0, 360, 32, D.zlataS, D.slon) + krog(50, 64, 40, "none", ` stroke="${D.zlata}" stroke-width="2"`);
    s += krog(50, 64, 27, D.mornar) + krog(50, 64, 23, "none", ` stroke="${D.zlata}" stroke-width="1.4"`);
    for (let i = 0; i < 8; i++) { const [x, y] = pol(50, 64, 15, i * 45); s += `<path d="M50 64 L${f(pol(50, 64, 8, i * 45 - 20)[0])} ${f(pol(50, 64, 8, i * 45 - 20)[1])} L${f(x)} ${f(y)} L${f(pol(50, 64, 8, i * 45 + 20)[0])} ${f(pol(50, 64, 8, i * 45 + 20)[1])} Z" fill="${i % 2 ? D.tur : D.koral}"/>`; }
    return s + krog(50, 64, 5, D.zlataS);
  },
  palica: (cx, cy, len, c, rot) => {
    const w = 10, x = cx - w / 2, y = cy - len / 2, z = D.zlata;
    let s = `<rect x="${x}" y="${y + 4}" width="${w}" height="${len - 8}" fill="${c}"/>`;
    for (const dx of [-2.6, 0, 2.6]) s += `<line x1="${cx + dx}" y1="${y + 7}" x2="${cx + dx}" y2="${y + len - 7}" stroke="${svetlejsa(c, .4)}" stroke-width=".9"/>`;
    for (const [yy, smer] of [[y, 1], [y + len, -1]] as [number, number][])
      s += `<rect x="${x - 2}" y="${smer > 0 ? yy : yy - 2.5}" width="${w + 4}" height="2.5" fill="${z}"/><rect x="${x - 1}" y="${smer > 0 ? yy + 2.5 : yy - 4.5}" width="${w + 2}" height="2" fill="${temnejsa(z, .15)}"/>`;
    return `<g transform="rotate(${rot} ${cx} ${cy})">${s}</g>`;
  },
  ptic: () => {
    let s = "";
    for (let i = 0; i < 9; i++) {
      const a = -160 + i * 17.5, [x, y] = pol(50, 98, 48, a), [xo, yo] = pol(50, 98, 40, a);
      s += `<line x1="50" y1="98" x2="${f(x)}" y2="${f(y)}" stroke="${D.zlata}" stroke-width="1.2"/>` + elipsa(xo, yo, 6.5, 9, a + 90, D.tur) + elipsa(xo, yo, 3.6, 5, a + 90, D.zlataS) + krog(xo, yo, 2, D.mornar);
    }
    s += `<path d="M50 104 Q40 96 44 80 Q46 70 52 62 Q56 56 52 50" stroke="${D.mornar}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      + `<path d="M44 108 Q38 92 46 80 Q56 86 56 100 Q54 108 44 108 Z" fill="${D.mornar}"/>` + krog(52, 48, 5.5, D.mornar)
      + `<path d="M56 47 L64 49 L56 51 Z" fill="${D.zlata}"/>` + krog(53, 47, 1.3, D.slon)
      + [[48, 38], [52, 36], [56, 38]].map(([x, y]) => `<line x1="52" y1="44" x2="${x}" y2="${y}" stroke="${D.mornar}" stroke-width="1"/>` + krog(x, y, 1.6, D.zlata)).join("");
    return s + `<path d="M22 114 H78" stroke="${D.zlata}" stroke-width="2.4"/><path d="M30 118 H70" stroke="${D.zlata}" stroke-width="1.2"/>`;
  },
  znakSt: n => `<path d="${stopnice(18, 16, 64, 76, 5)}" fill="none" stroke="${D.mornar}" stroke-width="2.2"/><path d="${stopnice(22, 20, 56, 68, 4)}" fill="none" stroke="${D.zlata}" stroke-width="1"/>`
    + stevilka(n, 50, 79, 64, D.mornar) + pahljaca(50, 116, 16, 180, 360, 7, D.koral, D.zlataS) + `<path d="M28 116 H72" stroke="${D.koral}" stroke-width="1.6"/>`,
  veter: k => {
    const smer: Record<string, number> = { S: 0, V: 90, J: 180, Z: 270 };
    let s = krog(50, 56, 32, "none", ` stroke="${D.zlata}" stroke-width="1.6"`) + krog(50, 56, 27, "none", ` stroke="${D.mornar}" stroke-width=".8"`);
    for (let i = 0; i < 24; i++) { const [x1, y1] = pol(50, 56, 32, i * 15), [x2, y2] = pol(50, 56, i % 2 ? 35 : 37, i * 15); s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${D.zlata}" stroke-width="1.2"/>`; }
    s += `<g transform="rotate(${smer[k]} 50 56)"><path d="M50 26 L60 42 L53 40 L53 80 L47 80 L47 40 L40 42 Z" fill="${D.koral}"/>`
      + [64, 71, 78].map(y => `<path d="M42 ${y + 6} L50 ${y} L58 ${y + 6}" stroke="${D.mornar}" stroke-width="2.4" fill="none"/>`).join("") + `</g>`;
    return s + stevilka(k, 50, 122, 33, D.mornar);
  },
  zmaj: k => {
    if (k === "R") {
      let s = pahljaca(50, 82, 38, 180, 360, 11, D.koral, "#e98a6f") + krog(50, 82, 15, D.zlataS) + `<path d="M35 82 A15 15 0 0 1 65 82 Z" fill="${D.zlata}"/>`;
      for (const [y, w] of [[86, 64], [92, 52], [98, 40], [104, 28]]) s += `<rect x="${50 - w / 2}" y="${y}" width="${w}" height="4" fill="${D.mornar}"/>`;
      return s;
    }
    if (k === "G") {
      let s = pahljaca(50, 98, 42, 205, 335, 9, D.zad, "#4aa682");
      s += `<path d="M50 98 L50 116" stroke="${D.zad}" stroke-width="4" stroke-linecap="round"/>` + krog(50, 98, 8, D.zlata) + krog(50, 98, 3.5, D.slon);
      for (let i = 1; i < 9; i++) { const [x, y] = pol(50, 98, 42, 205 + i * 130 / 9); s += krog(x, y, 1.8, D.zlata); }
      return s;
    }
    return `<path d="${stopnice(15, 18, 70, 92, 6)}" fill="none" stroke="${D.mornar}" stroke-width="4.5"/><path d="${stopnice(23, 26, 54, 76, 4.5)}" fill="none" stroke="${D.zlata}" stroke-width="2"/>`
      + [[15, 18], [85, 18], [15, 110], [85, 110]].map(([x, y]) => `<rect x="${x - 3.5}" y="${y - 3.5}" width="7" height="7" fill="${D.zlata}" transform="rotate(45 ${x} ${y})"/>`).join("");
  },
  roza: n => {
    const stebel = (y: number) => `<path d="M50 116 L50 ${y}" stroke="${D.zad}" stroke-width="2.6"/>` + `<path d="M50 104 Q36 100 32 88 Q44 90 50 104 Z M50 104 Q64 100 68 88 Q56 90 50 104 Z" fill="${D.zad}"/>`;
    const risbe = [
      stebel(78) + [34, 26, 18, 10].map((r, i) => `<path d="M${50 - r} 62 A${r} ${r} 0 0 0 ${50 + r} 62" stroke="${i % 2 ? "#e98a6f" : D.koral}" stroke-width="7" fill="none"/>`).join("") + krog(50, 62, 4, D.zlata),
      stebel(80) + `<path d="M50 80 L34 60 L38 40 L50 54 L62 40 L66 60 Z" fill="${D.roza}"/><path d="M50 80 L42 58 L50 34 L58 58 Z" fill="${D.koral}"/><path d="M50 40 L50 72" stroke="${D.zlataS}" stroke-width="1.4"/>`,
      pahljaca(50, 62, 32, 0, 360, 24, "#e9a23b", "#f3c66a") + krog(50, 62, 32, "none", ` stroke="${D.zlata}" stroke-width="1.4"`) + krog(50, 62, 12, D.koral) + krog(50, 62, 6, D.zlataS),
      `<path d="M14 100 H86" stroke="${D.tur}" stroke-width="2"/>` + [[-1, 0], [1, 0], [0, 0]].map(([s]) => `<path d="M50 96 Q${50 + s * 30} 82 ${50 + s * 30} 60 Q${50 + s * 14} 70 50 96 Z" fill="${s ? D.roza : D.koral}"/>`).join("")
        + `<path d="M50 96 Q40 70 50 42 Q60 70 50 96 Z" fill="${D.koral}"/><path d="M50 50 L50 90" stroke="${D.zlataS}" stroke-width="1.2"/>` + pahljaca(50, 100, 14, 0, 180, 5, D.tur, "#4aa3a0"),
    ];
    return znacka(n, D.koral, false) + risbe[n - 1];
  },
  letniCas: n => {
    const risbe = [
      `<path d="M50 116 V70" stroke="${D.mornar}" stroke-width="3"/>` + pahljaca(50, 74, 34, 180, 360, 9, D.zad, "#6fbf8f") + [[30, 66], [44, 56], [58, 54], [70, 64]].map(([x, y]) => krog(x, y, 3, D.roza)).join("") + `<path d="M30 116 H70" stroke="${D.zlata}" stroke-width="2"/>`,
      pahljaca(50, 92, 46, 180, 360, 13, "#f0b53e", D.zlataS) + krog(50, 92, 16, D.koral) + `<rect x="10" y="92" width="80" height="4" fill="${D.mornar}"/><rect x="18" y="100" width="64" height="3" fill="${D.mornar}"/><rect x="26" y="107" width="48" height="2.4" fill="${D.mornar}"/>`,
      `<path d="M50 30 L72 64 L50 104 L28 64 Z" fill="#d9743e"/><path d="M50 30 L50 116 M50 52 L64 46 M50 52 L36 46 M50 70 L68 62 M50 70 L32 62 M50 88 L60 82 M50 88 L40 82" stroke="${D.zlataS}" stroke-width="1.6" fill="none"/>`,
      Array.from({ length: 6 }, (_, i) => `<g transform="rotate(${i * 60} 50 66)"><path d="M50 66 L50 32" stroke="${D.tur}" stroke-width="3"/><path d="M50 30 L54 36 L50 42 L46 36 Z" fill="${D.mornar}"/><path d="M43 46 L50 52 L57 46" stroke="${D.tur}" stroke-width="2.2" fill="none"/></g>`).join("") + krog(50, 66, 6, D.zlata) + krog(50, 66, 2.5, D.slon),
    ];
    return znacka(n, D.tur, true) + risbe[n - 1];
  },
};

export const TEME_NOVE = { vrt: VRT, morje: MORJE, deco: DECO };
