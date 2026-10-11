// Shranjevanje nastavitev, napredka in trenutne igre v brskalnik (brez računa, deluje brez interneta).
import type { ShranjenaIgra } from "./igra/stanje";
import type { Tezavnost } from "./igra/pravila";
import type { SlogPloscic } from "./art/ploscice";

export type Glasba = "brez" | "narava" | "glasba";
export type Nastavitve = {
  ime: string; rojstniDan: string;      // "dan.mesec"
  zvok: boolean; glasba: Glasba; zadnjaGlasba: string; glasnost: number;
  ozadje: string;                     // "samodejno" ali id slike
  gibanje: boolean; pomoc: boolean; mehko: boolean;
  slogPloscic: SlogPloscic;
};
export type Napredek = {
  resitve: Record<string, number>;      // postavitev -> kolikokrat rešena
  potovanje: Record<string, number>;    // kraj -> število rešenih stopenj (0..4)
  namigi: number; tezavnost: Tezavnost; krog: number;
};
type Vse = { nastavitve: Nastavitve; napredek: Napredek; igra: ShranjenaIgra | null };

const KLJUC = "mahjong-v1";
const PRIVZETO: Vse = {
  nastavitve: { ime: "", rojstniDan: "", zvok: true, glasba: "brez", zadnjaGlasba: "glasba", glasnost: .6, ozadje: "samodejno", gibanje: true, pomoc: false, mehko: false, slogPloscic: "klasicen" },
  napredek: { resitve: {}, potovanje: {}, namigi: 3, tezavnost: "srednja", krog: 0 },
  igra: null,
};

/** Telefon (dotik in majhen zaslon naprave, ne glede na velikost okna). */
export function jeMobilnaNaprava(): boolean {
  try { return matchMedia("(pointer: coarse)").matches && Math.min(screen.width, screen.height) < 700; } catch { return false; }
}
// Na telefonu se začeta igra hrani samo do popolnega zaprtja aplikacije (mamina želja);
// ob hitrem preklopu na drugo aplikacijo ostane. Na računalniku se hrani trajno.
const KLJUC_SEJA = "mahjong-v1-igra";
const MOBILNO = jeMobilnaNaprava();

function preberi(): Vse {
  let igraSeje: ShranjenaIgra | null = null;
  try { igraSeje = JSON.parse(sessionStorage.getItem(KLJUC_SEJA) || "null"); } catch { /* ni seje */ }
  try {
    const d = JSON.parse(localStorage.getItem(KLJUC) || "null");
    if (d) return { nastavitve: { ...PRIVZETO.nastavitve, slogPloscic: privzetiSlog(), ...d.nastavitve }, napredek: { ...PRIVZETO.napredek, ...d.napredek }, igra: MOBILNO ? igraSeje : d.igra ?? null };
  } catch { /* prazna shramba */ }
  const v = structuredClone(PRIVZETO); v.nastavitve.slogPloscic = privzetiSlog(); v.igra = MOBILNO ? igraSeje : null;
  return v;
}
/** Na telefonu so privzete razločne ploščice (branje brez očal), drugje klasične. */
function privzetiSlog(): SlogPloscic { return MOBILNO ? "razlocen" : "klasicen"; }
export const S: Vse = preberi();
export function shrani(): void {
  try {
    if (MOBILNO) {
      sessionStorage.setItem(KLJUC_SEJA, JSON.stringify(S.igra));
      localStorage.setItem(KLJUC, JSON.stringify({ ...S, igra: null }));
    } else localStorage.setItem(KLJUC, JSON.stringify(S));
  } catch { /* polna shramba */ }
}

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
