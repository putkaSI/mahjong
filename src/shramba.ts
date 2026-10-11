// Shranjevanje nastavitev, napredka in trenutne igre v brskalnik (brez računa, deluje brez interneta).
import type { ShranjenaIgra } from "./igra/stanje";
import type { Tezavnost } from "./igra/pravila";

export type Glasba = "brez" | "narava" | "glasba";
export type Nastavitve = {
  ime: string; rojstniDan: string;      // "dan.mesec"
  zvok: boolean; glasba: Glasba; zadnjaGlasba: string; glasnost: number;
  ozadje: string;                     // "samodejno" ali id slike
  gibanje: boolean; pomoc: boolean; mehko: boolean;
};
export type Napredek = {
  resitve: Record<string, number>;      // postavitev -> kolikokrat rešena
  potovanje: Record<string, number>;    // kraj -> število rešenih stopenj (0..4)
  namigi: number; tezavnost: Tezavnost; krog: number;
};
type Vse = { nastavitve: Nastavitve; napredek: Napredek; igra: ShranjenaIgra | null };

const KLJUC = "mahjong-v1";
const PRIVZETO: Vse = {
  nastavitve: { ime: "", rojstniDan: "", zvok: true, glasba: "brez", zadnjaGlasba: "glasba", glasnost: .6, ozadje: "samodejno", gibanje: true, pomoc: false, mehko: false },
  napredek: { resitve: {}, potovanje: {}, namigi: 3, tezavnost: "srednja", krog: 0 },
  igra: null,
};

function preberi(): Vse {
  try {
    const d = JSON.parse(localStorage.getItem(KLJUC) || "null");
    if (d) return { nastavitve: { ...PRIVZETO.nastavitve, ...d.nastavitve }, napredek: { ...PRIVZETO.napredek, ...d.napredek }, igra: d.igra ?? null };
  } catch { /* prazna shramba */ }
  return structuredClone(PRIVZETO);
}
export const S: Vse = preberi();
export function shrani(): void { try { localStorage.setItem(KLJUC, JSON.stringify(S)); } catch { /* polna shramba */ } }

/** Ime in rojstni dan lahko pridejo iz povezave (?ime=…&rd=dan.mesec), da nista zapisana v kodi. */
export function preberiPovezavo(): void {
  const u = new URL(location.href);
  const ime = u.searchParams.get("ime"), rd = u.searchParams.get("rd");
  if (ime) S.nastavitve.ime = ime.slice(0, 30);
  if (rd && /^\d{1,2}\.\d{1,2}$/.test(rd)) S.nastavitve.rojstniDan = rd;
  if (ime || rd) { shrani(); u.searchParams.delete("ime"); u.searchParams.delete("rd"); history.replaceState(null, "", u.pathname + u.hash); }
}

/** Trajna shramba, da je brskalnik ne pobriše sam od sebe. */
export function prosiZaTrajnoShrambo(): void { navigator.storage?.persist?.().catch(() => {}); }
