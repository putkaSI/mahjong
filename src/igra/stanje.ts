// Stanje ene igre: kaj leži na mizi, izbira, točke, čas, namigi in mešanja.
import { postavitev } from "./oblike";
import { normaliziraj, type Polozaj } from "./postavitve";
import { sosedi, prosta, razdeli, vsiPari, pariIzVrst, prostiPari, ujemanje, type Sosedi, type Tezavnost } from "./pravila";

export type Nacin = "prosto" | "potovanje";
export type ShranjenaIgra = {
  nacin: Nacin; postavitevId: string; krajId?: string; stopnja?: number;
  tez: Tezavnost; seme: number; transponirano: boolean;
  vrste: string[]; na: boolean[]; tocke: number; cas: number;
  mesanja: number; namigiUporabljeni: number; izbrana: number;
};

export const MESANJA: Record<Tezavnost, number> = { lahka: 4, srednja: 3, zahtevna: 2 };
export const TOCKE = { par: 10, zmaga: 100, brezMesanja: 50, namig: 15, mesanje: 25 };

export type Izid =
  | { tip: "izbrana"; i: number; prej: number }
  | { tip: "odznacena"; i: number }
  | { tip: "zaprta"; i: number }
  | { tip: "par"; a: number; b: number; konec: boolean; brezPotez: boolean };

export class Igra {
  pos: Polozaj[]; s: Sosedi; st: ShranjenaIgra;

  private constructor(st: ShranjenaIgra) {
    const p = postavitev(st.postavitevId);
    if (!p) throw new Error("Neznana postavitev " + st.postavitevId);
    this.pos = normaliziraj(p.polozaji, st.transponirano);
    this.s = sosedi(this.pos);
    this.st = st;
  }

  static nova(o: { nacin: Nacin; postavitevId: string; krajId?: string; stopnja?: number; tez: Tezavnost; transponirano: boolean; seme?: number }): Igra {
    const seme = o.seme ?? Math.floor(Math.random() * 2 ** 31);
    const g = new Igra({ ...o, seme, vrste: [], na: [], tocke: 0, cas: 0, mesanja: MESANJA[o.tez], namigiUporabljeni: 0, izbrana: -1 });
    const na = g.pos.map(() => true);
    let vrste: string[] | null = null;
    for (let k = 0; !vrste && k < 5; k++) vrste = razdeli(g.pos, g.s, na, vsiPari(), o.tez, seme + k);
    if (!vrste) throw new Error("Postavitve ni bilo mogoče razdeliti");
    g.st.vrste = vrste; g.st.na = na;
    return g;
  }
  static izShrambe(st: ShranjenaIgra): Igra { return new Igra(st); }

  get ostane(): number { return this.st.na.filter(Boolean).length; }
  jeProsta(i: number): boolean { return prosta(i, this.s, this.st.na); }
  pari(): [number, number][] { return prostiPari(this.s, this.st.na, this.st.vrste); }

  /** Klik na ploščico. */
  izberi(i: number): Izid | null {
    const st = this.st;
    if (!st.na[i]) return null;
    if (!this.jeProsta(i)) return { tip: "zaprta", i };
    if (st.izbrana === i) { st.izbrana = -1; return { tip: "odznacena", i }; }
    const prej = st.izbrana;
    if (prej >= 0 && ujemanje(st.vrste[prej]) === ujemanje(st.vrste[i])) {
      st.na[prej] = false; st.na[i] = false; st.izbrana = -1;
      st.tocke += TOCKE.par;
      const konec = this.ostane === 0;
      if (konec) st.tocke += TOCKE.zmaga + (st.mesanja === MESANJA[st.tez] ? TOCKE.brezMesanja : 0);
      return { tip: "par", a: prej, b: i, konec, brezPotez: !konec && this.pari().length === 0 };
    }
    // ne ujemata se: prva se odznači, druga ostane izbrana
    st.izbrana = i;
    return { tip: "izbrana", i, prej };
  }

  /** Namig: en prost par (ali null). */
  namig(): [number, number] | null {
    const p = this.pari();
    if (!p.length) return null;
    this.st.namigiUporabljeni++;
    this.st.tocke = Math.max(0, this.st.tocke - TOCKE.namig);
    return p[Math.floor(Math.random() * p.length)];
  }

  /** Premeša preostale ploščice tako, da je igra spet rešljiva. */
  premesaj(): boolean {
    const st = this.st;
    if (st.mesanja <= 0) return false;
    const ostale = st.vrste.filter((_, i) => st.na[i]);
    const nove = razdeli(this.pos, this.s, st.na, pariIzVrst(ostale), "srednja", Math.floor(Math.random() * 2 ** 31));
    if (!nove) return false;
    st.vrste = st.vrste.map((v, i) => (st.na[i] ? nove[i] : v));
    st.mesanja--; st.izbrana = -1;
    st.tocke = Math.max(0, st.tocke - TOCKE.mesanje);
    return true;
  }
}
