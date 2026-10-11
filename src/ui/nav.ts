// Premikanje med zasloni (izpolni main.ts, da se moduli ne uvažajo krožno).
export type Nav = {
  domov(): void; potovanje(): void; postavitve(): void;
  nastavitve(nazaj: () => void): void; pomoc(nazaj: () => void): void; nadaljuj(): void;
};
export const nav = {} as Nav;

export function zaslon(razred: string, html: string): HTMLElement {
  const z = document.getElementById("zaslon")!;
  z.className = razred; z.innerHTML = html; z.scrollTop = 0;
  return z;
}

/** Pokončen telefon: uporabljamo ozke postavitve z večjimi ploščicami. */
export const jeTelefon = () => Math.min(innerWidth, innerHeight) < 600 && innerHeight > innerWidth;

export const fmtCas =(s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
};
