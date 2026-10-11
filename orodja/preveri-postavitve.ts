// Preveri vse postavitve: 144 ploščic, brez prekrivanj, in ali se dajo rešljivo razdeliti.
import { vsePostavitve } from "../src/igra/oblike";
import { sosedi, razdeli, vsiPari, prostiPari, type Tezavnost } from "../src/igra/pravila";

const vse = vsePostavitve();
console.log("Postavitev:", vse.length);
let napake = 0;
for (const p of vse) {
  const pos = p.polozaji;
  const kljuci = new Set(pos.map(q => `${q.x},${q.y},${q.z}`));
  const prekrivanja = pos.some((a, i) => pos.some((b, j) => j > i && a.z === b.z && Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2));
  const s = sosedi(pos);
  const na = pos.map(() => true);
  const rez: string[] = [];
  for (const tez of ["lahka", "srednja", "zahtevna"] as Tezavnost[]) {
    const t0 = performance.now();
    const v = razdeli(pos, s, na, vsiPari(), tez, 42);
    const ms = Math.round(performance.now() - t0);
    rez.push(v ? `${tez[0]}:${ms}ms/${prostiPari(s, na, v).length}` : `${tez[0]}:NE`);
    if (!v) napake++;
  }
  const W = Math.max(...pos.map(q => q.x)) / 2 + 1, H = Math.max(...pos.map(q => q.y)) / 2 + 1, Z = Math.max(...pos.map(q => q.z)) + 1;
  const ok = pos.length === 144 && kljuci.size === 144 && !prekrivanja;
  if (!ok) napake++;
  console.log(`${ok ? " " : "!"} ${p.id.padEnd(16)} ${pos.length} ${W}x${H}x${Z}  ${rez.join("  ")}`);
}
console.log("Napak:", napake);
