// Letni časi, prazniki in pozdrav glede na uro.
import { S } from "./shramba";

export type LetniCas = "pomlad" | "poletje" | "jesen" | "zima";
export type Praznik = "bozic" | "novoleto" | "velikanoc" | "rojstnidan" | null;

export function letniCas(d = new Date()): LetniCas {
  const m = d.getMonth() + 1, dan = d.getDate(), k = m * 100 + dan;
  if (k >= 321 && k < 621) return "pomlad";
  if (k >= 621 && k < 923) return "poletje";
  if (k >= 923 && k < 1221) return "jesen";
  return "zima";
}

/** Velikonočna nedelja (gregorijanski koledar). */
function velikaNoc(leto: number): Date {
  const a = leto % 19, b = Math.floor(leto / 100), c = leto % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mesec = Math.floor((h + l - 7 * m + 114) / 31), dan = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(leto, mesec - 1, dan);
}

export function praznik(d = new Date()): Praznik {
  const m = d.getMonth() + 1, dan = d.getDate();
  const rd = S.nastavitve.rojstniDan.split(".").map(Number);
  if (rd.length === 2 && rd[0] === dan && rd[1] === m) return "rojstnidan";
  if ((m === 12 && dan === 31) || (m === 1 && dan <= 2)) return "novoleto";
  if ((m === 12 && dan >= 20) || (m === 1 && dan <= 6)) return "bozic";
  const vn = velikaNoc(d.getFullYear()), razlika = (d.getTime() - vn.getTime()) / 864e5;
  if (razlika > -4 && razlika < 3) return "velikanoc";
  return null;
}

export function pozdrav(d = new Date()): string {
  const ime = S.nastavitve.ime.trim(), u = d.getHours();
  const del = u >= 5 && u < 10 ? "Dobro jutro" : u >= 10 && u < 18 ? "Dober dan" : "Dober večer";
  return ime ? `${del}, ${ime}!` : `${del}!`;
}

export function praznicnoVoscilo(p: Praznik): string {
  const ime = S.nastavitve.ime.trim();
  switch (p) {
    case "rojstnidan": return ime ? `Vse najboljše za rojstni dan, ${ime}!` : "Vse najboljše za rojstni dan!";
    case "novoleto": return "Srečno novo leto!";
    case "bozic": return "Vesel božič in lepe praznike!";
    case "velikanoc": return "Vesele velikonočne praznike!";
  }
  return "";
}
