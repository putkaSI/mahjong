// Pravila: proste ploščice, ujemanje, rešljivo deljenje, mešanje in namigi.
import { VRSTE } from "../art/ploscice";
import { rng, type Polozaj } from "./postavitve";

export type Tezavnost = "lahka" | "srednja" | "zahtevna";
const UJEMANJE: Record<string, string> = Object.fromEntries(VRSTE.map(v => [v.id, v.ujemanje]));
export const ujemanje = (vrsta: string) => UJEMANJE[vrsta];

/** Sosedstva: kdo leži na ploščici, kdo je levo in kdo desno od nje. */
export type Sosedi = { nad: number[][]; levo: number[][]; desno: number[][] };
export function sosedi(pos: Polozaj[]): Sosedi {
  const n = pos.length, nad: number[][] = [], levo: number[][] = [], desno: number[][] = [];
  for (let i = 0; i < n; i++) { nad.push([]); levo.push([]); desno.push([]); }
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i === j) continue;
    const a = pos[i], b = pos[j];
    if (Math.abs(a.y - b.y) >= 2) continue;
    if (b.z > a.z && Math.abs(a.x - b.x) < 2) nad[i].push(j);
    else if (b.z === a.z && b.x === a.x - 2) levo[i].push(j);
    else if (b.z === a.z && b.x === a.x + 2) desno[i].push(j);
  }
  return { nad, levo, desno };
}

/** Ali je ploščica i prosta, če so prisotne le ploščice z `na[j] === true`. */
export function prosta(i: number, s: Sosedi, na: boolean[]): boolean {
  if (!na[i]) return false;
  if (s.nad[i].some(j => na[j])) return false;
  return !s.levo[i].some(j => na[j]) || !s.desno[i].some(j => na[j]);
}
export function proste(s: Sosedi, na: boolean[]): number[] {
  const r: number[] = [];
  for (let i = 0; i < na.length; i++) if (prosta(i, s, na)) r.push(i);
  return r;
}

/** Celoten nabor 144 ploščic, razdeljen v 72 parov, ki se ujemajo. */
export function vsiPari(): [string, string][] {
  const pari: [string, string][] = [];
  for (const v of VRSTE) {
    if (v.ujemanje === "R" || v.ujemanje === "C") continue;
    pari.push([v.id, v.id], [v.id, v.id]);
  }
  pari.push(["r1", "r2"], ["r3", "r4"], ["c1", "c2"], ["c3", "c4"]);
  return pari;
}

/** Iz preostalih vrst sestavi pare, ki se ujemajo. */
export function pariIzVrst(vrste: string[]): [string, string][] {
  const skupine = new Map<string, string[]>();
  for (const v of vrste) { const k = ujemanje(v); skupine.set(k, [...(skupine.get(k) ?? []), v]); }
  const pari: [string, string][] = [];
  for (const g of skupine.values()) for (let i = 0; i + 1 < g.length; i += 2) pari.push([g[i], g[i + 1]]);
  return pari;
}

/** Zaporedje odstranjevanja parov (rešitev), ki zagotavlja rešljivost. */
function zaporedje(s: Sosedi, na: boolean[], z: number[], R: () => number): [number, number][] | null {
  const zdaj = na.slice(); const koraki: [number, number][] = [];
  let ostane = zdaj.filter(Boolean).length;
  while (ostane > 0) {
    const pr = proste(s, zdaj);
    if (pr.length < 2) return null;
    // višje ploščice imajo prednost, da se visoki kupčki ne zataknejo
    const izberi = (izkljuci: number) => {
      const w = pr.map(i => (i === izkljuci ? 0 : 1 + z[i] * 1.5));
      let r = R() * w.reduce((a, b) => a + b, 0);
      for (let k = 0; k < pr.length; k++) { r -= w[k]; if (r <= 0 && pr[k] !== izkljuci) return pr[k]; }
      return pr.find(i => i !== izkljuci)!;
    };
    const a = izberi(-1), b = izberi(a);
    koraki.push([a, b]); zdaj[a] = false; zdaj[b] = false; ostane -= 2;
  }
  return koraki;
}

/** Razdeli pare na položaje tako, da je igra rešljiva. Vrne vrsto za vsak položaj. */
export function razdeli(pos: Polozaj[], s: Sosedi, na: boolean[], pari: [string, string][], tez: Tezavnost, seme: number): string[] | null {
  const R = rng(seme), z = pos.map(p => p.z);
  for (let poskus = 0; poskus < 300; poskus++) {
    const kor = zaporedje(s, na, z, R);
    if (!kor) continue;
    if (kor.length !== pari.length) return null;
    const vrste: string[] = new Array(pos.length).fill("");
    const p = pari.slice();
    // premešaj pare
    for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    let razpored: [string, string][];
    if (tez === "srednja") razpored = p;
    else {
      // pari iste vrste naj bodo blizu (lahka) ali daleč (zahtevna) v zaporedju rešitve
      const poVrsti = new Map<string, [string, string][]>();
      for (const q of p) { const k = ujemanje(q[0]); poVrsti.set(k, [...(poVrsti.get(k) ?? []), q]); }
      const skupine = [...poVrsti.values()];
      razpored = [];
      if (tez === "lahka") for (const g of skupine) razpored.push(...g);
      else {
        const prvi: [string, string][] = [], drugi: [string, string][] = [];
        for (const g of skupine) g.forEach((q, i) => (i % 2 ? drugi : prvi).push(q));
        razpored = [...prvi, ...drugi];
      }
    }
    kor.forEach(([a, b], k) => { const [v1, v2] = razpored[k]; if (R() < .5) { vrste[a] = v1; vrste[b] = v2; } else { vrste[a] = v2; vrste[b] = v1; } });
    return vrste;
  }
  return null;
}

/** Poišče prost par, ki se ujema (za namig in preverjanje, ali so še poteze). */
export function prostiPari(s: Sosedi, na: boolean[], vrste: string[]): [number, number][] {
  const pr = proste(s, na), po = new Map<string, number[]>(), pari: [number, number][] = [];
  for (const i of pr) { const k = ujemanje(vrste[i]); po.set(k, [...(po.get(k) ?? []), i]); }
  for (const g of po.values()) for (let a = 0; a < g.length; a++) for (let b = a + 1; b < g.length; b++) pari.push([g[a], g[b]]);
  return pari;
}
