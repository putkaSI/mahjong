// Skupne osnove za risanje ploščic: barvne pomožne funkcije, trenutna tema, kitajski znaki in oznake.
import { GLIFI } from "./glifi";

export type Tema = {
  id: string; ime: string; opis: string;
  iv: string;                          // barva lica (za notranja polnila)
  rdeca: string; zelena: string; modra: string; crnilo: string; zlata: string; vej: string;
  okvirRoza: string; okvirCas: string;
  debelo: number;                      // odebelitev kitajskih znakov (v enotah pisave)
  razlocno: boolean;                   // številke in črke v kotu
  zlato: boolean;                      // zlati poudarki
  barva?: (c: string) => string;       // prebarvanje okrasnih barv (rože, ptič …)
  kovanec?: (cx: number, cy: number, r: number, c: string) => string;
  pika1?: () => string;
  palica?: (cx: number, cy: number, len: number, c: string, rot: number) => string;
  ptic?: () => string;
  znakSt?: (n: number) => string;
  veter?: (k: string) => string;
  zmaj?: (k: string) => string;
  roza?: (n: number) => string;
  letniCas?: (n: number) => string;
  okras?: () => string;                // okras, ki se nariše na vsako ploščico
};

/** Trenutna tema (nastavi jo risba()). */
export const A = { T: undefined as unknown as Tema };

/* ---------- barve ---------- */
export function rgb(c: string): [number, number, number] { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
export function hexa(v: number[]): string { return "#" + v.map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join(""); }
export function mesaj(a: string, b: string, t: number): string { const A1 = rgb(a), B = rgb(b); return hexa(A1.map((v, i) => v + (B[i] - v) * t)); }
export function svetlost(c: string): number { const [r, g, b] = rgb(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }
export type Odtenek = "rdeca" | "oranzna" | "rumena" | "zelena" | "modra" | "vijolicna" | "temna" | "svetla";
/** Grobo razvrsti barvo po odtenku, da jo tema lahko zamenja s svojo. */
export function odtenek(c: string): Odtenek {
  const [r, g, b] = rgb(c), max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (max === 0 || d / max < 0.2) return svetlost(c) < 0.45 ? "temna" : "svetla";
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  if (h < 18 || h >= 330) return "rdeca";
  if (h < 45) return "oranzna";
  if (h < 70) return "rumena";
  if (h < 170) return "zelena";
  if (h < 255) return "modra";
  return "vijolicna";
}
/** Okrasna barva, prebarvana po trenutni temi. */
export const C = (c: string) => A.T.barva ? A.T.barva(c) : c;
export const temnejsa = (c: string, t = .4) => mesaj(c, "#000000", t);
export const svetlejsa = (c: string, t = .45) => mesaj(c, "#ffffff", t);

/* ---------- znaki in oznake ---------- */
/** Kitajski znak, centriran na (cx, cy); velikost je velikost »em« kvadrata. */
export function znak(ch: string, cx: number, cy: number, size: number, fill: string, debelo = A.T.debelo): string {
  const G = GLIFI[ch]; const [x0, y0, x1, y1] = G.b;
  const k = size / G.upm, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const obroba = debelo ? ` stroke="${fill}" stroke-width="${debelo}" stroke-linejoin="round"` : "";
  return `<path d="${G.d}" fill="${fill}"${obroba} transform="translate(${cx} ${cy}) scale(${k.toFixed(5)} ${(-k).toFixed(5)}) translate(${-mx} ${-my})"/>`;
}
/** Številka ali črka v kotu, na podlagi barve lica. */
export function oznaka(t: string, barva: string, x = 4, y = 4, w = 26): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="30" rx="6" fill="${A.T.iv}" fill-opacity=".94"/>`
    + `<text x="${x + w / 2}" y="${y + 25}" text-anchor="middle" font-size="28" font-weight="700" fill="${barva}" style="font-family:var(--pisava, sans-serif)">${t}</text>`;
}
/** Velik napis (številka, črka) v pisavi igre. */
export function napis(t: string, x: number, y: number, size: number, fill: string, anchor = "middle"): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="700" fill="${fill}" style="font-family:var(--pisava, sans-serif)">${t}</text>`;
}
