// Ozadje: poslikava po letnem času, prazniku ali kraju, rahla megla in nežno padajoči listi.
import { S } from "./shramba";
import { letniCas, praznik, type LetniCas } from "./koledar";

const BASE = import.meta.env.BASE_URL;
const TEME = ["gore", "bambus", "oblaki"];
export const IMENA_OZADIJ: Record<string, string> = { gore: "Gore v megli", bambus: "Bambusov gozd", oblaki: "Nebo z oblaki" };

export function samodejnoOzadje(): string {
  const p = praznik();
  if (p === "bozic" || p === "novoleto") return "praznik-bozic";
  if (p === "velikanoc") return "praznik-velikanoc";
  if (p === "rojstnidan") return "praznik-rojstnidan";
  if (S.nastavitve.ozadje !== "samodejno") return S.nastavitve.ozadje;
  return `${TEME[S.napredek.krog % TEME.length]}-${letniCas()}`;
}

let trenutno = "";
const REZERVA = ["gore-poletje", "gore-pomlad"];
/** Zamenja sliko ozadja z mehkim prehodom. Če slike ni, vzame rezervno, sicer ostane topel preliv. */
export function nastaviOzadje(id: string, poskus = 0): void {
  if (id === trenutno && poskus === 0) return;
  trenutno = id;
  const plast = document.getElementById("ozadje-slika")!;
  const img = new Image();
  img.onerror = () => { if (poskus < REZERVA.length && trenutno === id) nastaviOzadje(REZERVA[poskus], poskus + 1); };
  img.onload = () => {
    const nova = document.createElement("div");
    nova.className = "ozadje-plast";
    nova.style.backgroundImage = `url("${img.src}")`;
    plast.appendChild(nova);
    requestAnimationFrame(() => nova.classList.add("vidna"));
    setTimeout(() => { while (plast.children.length > 1) plast.firstElementChild!.remove(); }, 1600);
  };
  img.src = `${BASE}ozadja/${id}.webp`;
  document.body.dataset.mehko = String(S.nastavitve.mehko);
}

/* ---------------- delci: listi, cvetni listi, sneg ---------------- */
type Delec = { x: number; y: number; vx: number; vy: number; r: number; a: number; va: number; faza: number; barva: string };
type Vrsta = "cvet" | "list" | "sneg" | "poletje";
const BARVE: Record<Vrsta, string[]> = {
  cvet: ["#f1b9c6", "#e9a0b4", "#f6d0d8"], list: ["#c8662e", "#d8902e", "#b84a2a", "#c9a03a"],
  sneg: ["#ffffff", "#f3f6fa"], poletje: ["#9cbf6a", "#b9cf7a", "#7fa95a"],
};
function vrstaZaCas(c: LetniCas): Vrsta {
  const p = praznik();
  if (p === "bozic" || p === "novoleto") return "sneg";
  if (p === "rojstnidan" || p === "velikanoc") return "cvet";
  return c === "pomlad" ? "cvet" : c === "jesen" ? "list" : c === "zima" ? "sneg" : "poletje";
}

function narisi(ctx: CanvasRenderingContext2D, d: Delec, vrsta: Vrsta): void {
  ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.a); ctx.fillStyle = d.barva;
  if (vrsta === "sneg") { ctx.globalAlpha = .85; ctx.beginPath(); ctx.arc(0, 0, d.r * .45, 0, Math.PI * 2); ctx.fill(); }
  else if (vrsta === "cvet") { ctx.globalAlpha = .9; ctx.beginPath(); ctx.ellipse(0, 0, d.r, d.r * .62, 0, 0, Math.PI * 2); ctx.fill(); }
  else { ctx.globalAlpha = .88; ctx.beginPath(); ctx.moveTo(0, -d.r); ctx.quadraticCurveTo(d.r * .9, 0, 0, d.r); ctx.quadraticCurveTo(-d.r * .9, 0, 0, -d.r); ctx.fill(); }
  ctx.restore();
}

function novDelec(w: number, h: number, vrsta: Vrsta, zgoraj: boolean, hitro = false): Delec {
  const barve = BARVE[vrsta];
  return {
    x: Math.random() * w, y: zgoraj ? -20 - Math.random() * h * .3 : Math.random() * h,
    vx: (Math.random() - .3) * .25, vy: (hitro ? .9 : .28) + Math.random() * (hitro ? .9 : .3),
    r: (vrsta === "sneg" ? 5 : 6) + Math.random() * 5, a: Math.random() * 6.28, va: (Math.random() - .5) * .02,
    faza: Math.random() * 6.28, barva: barve[Math.floor(Math.random() * barve.length)],
  };
}

let tihiDelci: Delec[] = [], slavje: Delec[] = [], slavjeDo = 0, zanka = 0;
const mirno = () => !S.nastavitve.gibanje || matchMedia("(prefers-reduced-motion: reduce)").matches;

export function zazeniDelce(): void {
  const c = document.getElementById("delci") as HTMLCanvasElement;
  const ctx = c.getContext("2d")!;
  const velikost = () => { const dpr = Math.min(2, devicePixelRatio || 1); c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  velikost(); addEventListener("resize", velikost);
  let zadnji = performance.now();
  const korak = (t: number) => {
    const dt = Math.min(50, t - zadnji) / 16.7; zadnji = t;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const vrsta = vrstaZaCas(letniCas());
    const cilj = mirno() ? 0 : 12;
    while (tihiDelci.length < cilj) tihiDelci.push(novDelec(innerWidth, innerHeight, vrsta, tihiDelci.length > 0));
    if (tihiDelci.length > cilj) tihiDelci.length = cilj;
    for (const d of tihiDelci) {
      d.faza += .01 * dt; d.x += (d.vx + Math.sin(d.faza) * .25) * dt; d.y += d.vy * dt; d.a += d.va * dt;
      if (d.y > innerHeight + 20) Object.assign(d, novDelec(innerWidth, innerHeight, vrsta, true));
      narisi(ctx, d, vrsta);
    }
    if (slavje.length) {
      const zdaj = performance.now();
      for (const d of slavje) { d.faza += .02 * dt; d.x += (d.vx + Math.sin(d.faza) * .6) * dt; d.y += d.vy * dt; d.a += d.va * 2 * dt; narisi(ctx, d, "cvet"); }
      slavje = slavje.filter(d => d.y < innerHeight + 30 || zdaj < slavjeDo);
      if (zdaj < slavjeDo && slavje.length < 90) slavje.push(novDelec(innerWidth, innerHeight, "cvet", true, true));
      if (zdaj > slavjeDo) slavje = slavje.filter(d => d.y < innerHeight + 30);
    }
    zanka = requestAnimationFrame(korak);
  };
  cancelAnimationFrame(zanka); zanka = requestAnimationFrame(korak);
}

/** Ob zmagi: padajoči cvetni listi nekaj sekund. */
let nadT = 0;
export function cvetniDez(sekunde = 7): void {
  slavjeDo = performance.now() + sekunde * 1000;
  // cvetni listi naj padajo tudi čez okno s pohvalo
  const c = document.getElementById("delci")!;
  c.style.zIndex = "55"; clearTimeout(nadT);
  nadT = window.setTimeout(() => { c.style.zIndex = ""; }, (sekunde + 4) * 1000);
  for (let i = 0; i < 40; i++) slavje.push(novDelec(innerWidth, innerHeight, "cvet", true, true));
}
