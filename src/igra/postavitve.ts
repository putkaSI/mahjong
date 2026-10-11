// Postavitve: položaji 144 ploščic v mreži polovičnih ploščic (x, y) in plasteh (z).
// Ploščica na (x, y) zaseda celice x..x+1 in y..y+1.

export type Polozaj = { x: number; y: number; z: number };
export type Postavitev = { id: string; ime: string; polozaji: Polozaj[] };
export type SlogVisin = "piramida" | "planota" | "stolpi";

/** Psevdonaključni generator s semenom (mulberry32). */
export function rng(seme: number): () => number {
  let a = seme >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Razdalja vsake celice maske do roba oblike (1 = na robu). */
function razdaljaDoRoba(m: boolean[][]): number[][] {
  const H = m.length, W = m[0].length;
  const d = m.map(r => r.map(v => (v ? Infinity : 0)));
  const q: [number, number][] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!m[y][x]) continue;
    const rob = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !m[y + dy]?.[x + dx]);
    if (rob) { d[y][x] = 1; q.push([x, y]); }
  }
  for (let i = 0; i < q.length; i++) {
    const [x, y] = q[i];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (!m[ny]?.[nx]) continue;
      if (d[y][x] + 1 < d[ny][nx]) { d[ny][nx] = d[y][x] + 1; q.push([nx, ny]); }
    }
  }
  return d;
}

const NAJVISJE = 6;

/** Iz maske ('#' = ploščica) naredi postavitev z natanko `cilj` ploščicami, simetrično, kjer se da. */
export function izMaske(id: string, ime: string, maska: string[], slog: SlogVisin, seme: number, cilj = 144): Postavitev | null {
  const H = maska.length, W = Math.max(...maska.map(r => r.length));
  const m = maska.map(r => Array.from({ length: W }, (_, x) => r[x] === "#"));
  const osnova = m.flat().filter(Boolean).length;
  if (osnova < 30 || osnova > cilj) return null;
  const d = razdaljaDoRoba(m);
  const R = rng(seme);
  const h: number[][] = m.map((r, y) => r.map((v, x) => {
    if (!v) return 0;
    const dd = d[y][x];
    if (slog === "piramida") return Math.min(5, dd);
    if (slog === "planota") return dd >= 2 ? Math.min(3, 1 + Math.ceil((dd - 1) / 2)) : 1;
    return (x + y) % 2 === 0 ? Math.min(5, dd + 1) : 1;
  }));
  // predstavniki: za simetričen par samo leva celica
  type C = { x: number; y: number; p: number };
  const celice: C[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!m[y][x]) continue;
    const xz = W - 1 - x;
    if (xz !== x && m[y][xz]) { if (x < xz) celice.push({ x, y, p: xz }); }
    else celice.push({ x, y, p: -1 });
  }
  let vsota = h.flat().reduce((a, b) => a + b, 0);
  for (let i = 0; i < 4000 && vsota !== cilj; i++) {
    const razlika = cilj - vsota, dir = razlika > 0 ? 1 : -1;
    let best: C | null = null, bestScore = -Infinity;
    for (const c of celice) {
      const delta = c.p >= 0 ? 2 : 1;
      if (delta > Math.abs(razlika)) continue;
      const hz = h[c.y][c.x], dd = d[c.y][c.x];
      if (dir === 1 && hz >= NAJVISJE) continue;
      if (dir === -1 && hz <= 1) continue;
      const score = (dir === 1 ? dd * 2 - hz * 3 : hz * 3 - dd * 2) + R() * 2.5;
      if (score > bestScore) { bestScore = score; best = c; }
    }
    if (best) {
      h[best.y][best.x] += dir; if (best.p >= 0) h[best.y][best.p] += dir;
      vsota += dir * (best.p >= 0 ? 2 : 1);
    } else {
      // samo še ena ploščica razlike in le pari: popravimo eno stran para
      const c = celice.find(c => dir === 1 ? h[c.y][c.x] < NAJVISJE : h[c.y][c.x] > 1);
      if (!c) break;
      h[c.y][c.x] += dir; vsota += dir;
    }
  }
  if (vsota !== cilj) return null;
  const polozaji: Polozaj[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let z = 0; z < h[y][x]; z++) polozaji.push({ x: x * 2, y: y * 2, z });
  return { id, ime, polozaji };
}

/** Klasična »želva« s štirimi plastmi, vrhom in tremi ploščicami ob strani. */
export function zelva(): Postavitev {
  const P: Polozaj[] = [];
  const vrsta = (z: number, y: number, x0: number, x1: number) => { for (let x = x0; x <= x1; x++) P.push({ x: x * 2, y: y * 2, z }); };
  vrsta(0, 0, 1, 12); vrsta(0, 1, 3, 10); vrsta(0, 2, 2, 11); vrsta(0, 3, 1, 12);
  vrsta(0, 4, 1, 12); vrsta(0, 5, 2, 11); vrsta(0, 6, 3, 10); vrsta(0, 7, 1, 12);
  P.push({ x: 0, y: 7, z: 0 }, { x: 26, y: 7, z: 0 }, { x: 28, y: 7, z: 0 });
  for (let y = 1; y <= 6; y++) vrsta(1, y, 4, 9);
  for (let y = 2; y <= 5; y++) vrsta(2, y, 5, 8);
  for (let y = 3; y <= 4; y++) vrsta(3, y, 6, 7);
  P.push({ x: 13, y: 7, z: 4 });
  return { id: "zelva", ime: "Želva", polozaji: P };
}

/** Prestavi v izhodišče (0,0); po želji zamenja osi (pokončen telefon). */
export function normaliziraj(pos: Polozaj[], transponiraj = false): Polozaj[] {
  const p = pos.map(q => (transponiraj ? { x: q.y, y: q.x, z: q.z } : { ...q }));
  const mx = Math.min(...p.map(q => q.x)), my = Math.min(...p.map(q => q.y));
  return p.map(q => ({ x: q.x - mx, y: q.y - my, z: q.z }));
}
