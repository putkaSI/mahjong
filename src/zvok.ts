// Zvok: nežen zvonček ob paru (sintetiziran), melodija ob zmagi in izbirna glasba v ozadju.
import { S, shrani } from "./shramba";

const BASE = import.meta.env.BASE_URL;
let ctx: AudioContext | null = null;
const PENTATONIKA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

function avdio(): AudioContext | null {
  if (!ctx) { try { ctx = new AudioContext(); } catch { return null; } }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** En udarec zvončka: osnovni ton in nekaj višjih delnih tonov z dolgim izzvenevanjem. */
function zvoncek(f: number, kdaj = 0, glasnost = .14): void {
  const a = avdio(); if (!a) return;
  const t = a.currentTime + kdaj, g = a.createGain();
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(glasnost * S.nastavitve.glasnost, t + .008);
  g.gain.exponentialRampToValueAtTime(.0001, t + 2.2);
  g.connect(a.destination);
  for (const [mult, jakost] of [[1, 1], [2.76, .35], [5.4, .12]] as const) {
    const o = a.createOscillator(), og = a.createGain();
    o.type = "sine"; o.frequency.value = f * mult; og.gain.value = jakost;
    o.connect(og).connect(g); o.start(t); o.stop(t + 2.3);
  }
}

export function zvokPar(): void {
  if (!S.nastavitve.zvok) return;
  zvoncek(PENTATONIKA[Math.floor(Math.random() * 4)]);
}
export function zvokZmaga(): void {
  if (!S.nastavitve.zvok) return;
  [0, 2, 4, 3, 5].forEach((k, i) => zvoncek(PENTATONIKA[k], i * .28, .12));
}

/* ---------- glasba v ozadju (datoteke v public/zvok) ---------- */
const SEZNAMI: Record<string, string[]> = { glasba: ["glasba-1.mp3", "glasba-2.mp3", "glasba-3.mp3", "glasba-4.mp3"] };
/** Izbire glasbe, ki jih ponudimo (zvoki narave pridejo, ko bo datoteka na voljo). */
export const IZBIRE_GLASBE: [string, string][] = [["brez", "Brez glasbe"], ["glasba", "Mirna kitajska glasba"]];

/** Hitri vklop in izklop glasbe (zapomni si zadnjo izbiro). */
export function preklopiGlasbo(): void {
  const n = S.nastavitve;
  if (n.glasba === "brez") n.glasba = (n.zadnjaGlasba in SEZNAMI ? n.zadnjaGlasba : "glasba") as typeof n.glasba;
  else { n.zadnjaGlasba = n.glasba; n.glasba = "brez"; }
  shrani(); posodobiGlasbo();
}
let predvajalnik: HTMLAudioElement | null = null, seznam = "", indeks = 0;

function predvajaj(): void {
  const s = SEZNAMI[seznam]; if (!s) return;
  predvajalnik?.pause();
  predvajalnik = new Audio(`${BASE}zvok/${s[indeks % s.length]}`);
  predvajalnik.loop = s.length === 1;
  predvajalnik.volume = Math.min(1, .35 * S.nastavitve.glasnost);
  predvajalnik.onended = () => { indeks++; predvajaj(); };
  predvajalnik.onerror = () => { if (s.length > 1 && indeks < s.length * 2) { indeks++; predvajaj(); } };
  predvajalnik.play().catch(() => { /* počaka na prvi klik */ });
}

export function posodobiGlasbo(): void {
  const izbira = S.nastavitve.glasba;
  if (!(izbira in SEZNAMI)) { predvajalnik?.pause(); return; }
  if (izbira !== seznam || !predvajalnik) { seznam = izbira; indeks = Math.floor(Math.random() * SEZNAMI[izbira].length); predvajaj(); return; }
  predvajalnik.volume = Math.min(1, .35 * S.nastavitve.glasnost);
  if (predvajalnik.paused) predvajalnik.play().catch(() => {});
}

/** Brskalnik dovoli zvok šele po prvem kliku. */
export function odkleniZvokObKliku(): void {
  const enkrat = () => { avdio(); posodobiGlasbo(); removeEventListener("pointerdown", enkrat); };
  addEventListener("pointerdown", enkrat);
}
