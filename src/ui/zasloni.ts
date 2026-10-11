// Zasloni: domov (pozdrav), potovanje po svetu in seznam prostih postavitev.
import { S } from "../shramba";
import { pozdrav, praznik, praznicnoVoscilo } from "../koledar";
import { KRAJI } from "../kraji";
import { vsePostavitve, postavitev } from "../igra/oblike";
import type { Postavitev } from "../igra/postavitve";
import { nastaviOzadje, samodejnoOzadje } from "../ozadje";
import { IKONE, pogovor } from "./pogovor";
import { preklopiGlasbo } from "../zvok";
import { nav, zaslon } from "./nav";
import { zacniNovo, naslednjaStopnja, nakljucnaPostavitev, razglednica } from "./igralni";

const mini = (id: string) => `<span class="pl mini"><svg class="pl-lice" viewBox="0 0 100 128" aria-hidden="true"><use href="#t-${id}"/></svg></span>`;
const glava = (naslov: string, podnaslov = "") => `<header class="glava"><button class="gumb nazaj" id="nazaj">${IKONE.domov}<span>Domov</span></button>
  <div><h1>${naslov}</h1>${podnaslov ? `<p>${podnaslov}</p>` : ""}</div></header>`;

export function domov(): void {
  nastaviOzadje(samodejnoOzadje());
  const vos = praznicnoVoscilo(praznik());
  const ig = S.igra, p = ig ? postavitev(ig.postavitevId) : null;
  const nasl = naslednjaStopnja(), kNasl = nasl ? KRAJI.find(k => k.id === nasl.krajId) : null;
  const resenih = Object.keys(S.napredek.resitve).length, vseh = vsePostavitve().length;
  const z = zaslon("zaslon-domov", `<div class="domov-kartica">
      <div class="logotip" aria-hidden="true">${mini("dR")}${mini("p1")}${mini("b1")}${mini("dG")}</div>
      <h1>${pozdrav()}</h1>${vos ? `<p class="voscilo">${vos}</p>` : ""}
      <div class="domov-gumbi">
        ${ig && p ? `<button class="velik-gumb glavni" id="d-nadaljuj">${IKONE.igraj}<span>Nadaljuj igro<small>${p.ime} · ostane še ${ig.na.filter(Boolean).length} ploščic</small></span></button>` : ""}
        <button class="velik-gumb${ig ? "" : " glavni"}" id="d-pot">${IKONE.zemljevid}<span>Potovanje po svetu<small>${kNasl ? `Naslednji cilj: ${kNasl.ime}, ${nasl!.stopnja! + 1}. stopnja` : "Vse si prepotovala!"}</small></span></button>
        <button class="velik-gumb" id="d-proste">${IKONE.ploscice}<span>Proste postavitve<small>${vseh} oblik, rešenih ${resenih}</small></span></button>
      </div>
      <div class="domov-mali"><button class="gumb" id="d-glasba"></button><button class="gumb" id="d-nast">${IKONE.nastavitve}<span>Nastavitve</span></button><button class="gumb" id="d-pomoc">${IKONE.pomoc}<span>Pomoč</span></button></div>
    </div>`);
  const gGlasba = z.querySelector<HTMLButtonElement>("#d-glasba")!;
  const oznaciGlasbo = () => {
    const brez = S.nastavitve.glasba === "brez";
    gGlasba.innerHTML = `${brez ? IKONE.glasba : IKONE.brezGlasbe}<span>${brez ? "Vklopi glasbo" : "Izklopi glasbo"}</span>`;
  };
  oznaciGlasbo();
  gGlasba.addEventListener("click", () => { preklopiGlasbo(); oznaciGlasbo(); });
  z.querySelector("#d-nadaljuj")?.addEventListener("click", () => nav.nadaljuj());
  z.querySelector("#d-pot")!.addEventListener("click", () => nav.potovanje());
  z.querySelector("#d-proste")!.addEventListener("click", () => nav.postavitve());
  z.querySelector("#d-nast")!.addEventListener("click", () => nav.nastavitve(domov));
  z.querySelector("#d-pomoc")!.addEventListener("click", () => nav.pomoc(domov));
}

export function potovanje(): void {
  nastaviOzadje(samodejnoOzadje());
  const nasl = naslednjaStopnja();
  const trenutni = nasl ? KRAJI.findIndex(k => k.id === nasl.krajId) : KRAJI.length;
  const kartice = KRAJI.map((k, i) => {
    const n = S.napredek.potovanje[k.id] ?? 0;
    if (i > trenutni) return `<div class="kraj zaklenjen"><div class="razglednica prazna">${IKONE.kljucavnica}</div><h3>?</h3><p>Še neodkrit kraj</p></div>`;
    const stanje = n >= 4 ? `${IKONE.kljukica} Prepotovano` : `${n} od 4 delčkov`;
    const gumb = i === trenutni ? `<button class="gumb glavni" data-igraj="${k.id}">${IKONE.igraj}<span>Igraj ${n + 1}. stopnjo</span></button>` : "";
    return `<div class="kraj${i === trenutni ? " trenutni" : ""}" data-kraj="${k.id}">${razglednica(k.id, n)}<h3>${k.ime}</h3><p>${stanje}</p>${gumb}</div>`;
  }).join("");
  const z = zaslon("zaslon-seznam", glava("Potovanje po svetu", "Vsaka rešena stopnja odkrije delček slike. Ko je slika cela, potuješ naprej.") + `<div class="kraji">${kartice}</div>`);
  z.querySelector("#nazaj")!.addEventListener("click", () => nav.domov());
  z.querySelectorAll<HTMLElement>("[data-igraj]").forEach(b => b.addEventListener("click", e => {
    e.stopPropagation(); const n = naslednjaStopnja(); if (n) zacniNovo(n);
  }));
  z.querySelectorAll<HTMLElement>(".kraj[data-kraj]").forEach(el => el.addEventListener("click", () => izbiraStopnje(el.dataset.kraj!)));
}

/** Ponovitev že odkritih stopenj kraja. */
function izbiraStopnje(krajId: string): void {
  const k = KRAJI.find(x => x.id === krajId)!, n = S.napredek.potovanje[k.id] ?? 0;
  const gumbi = k.stopnje.slice(0, Math.min(4, n + 1)).map((pid, i) => {
    const r = S.napredek.resitve[pid] ?? 0, p = postavitev(pid)!;
    const opis = i < n ? (r > 1 ? `rešeno, ponovljeno ${r - 1}×` : "rešeno") : "naslednja";
    return { tekst: `${i + 1}. stopnja: ${p.ime}<small>${opis}</small>`, glavni: i === n, akcija: () => zacniNovo({ nacin: "potovanje", postavitevId: pid, krajId: k.id, stopnja: i }) };
  });
  pogovor({ naslov: k.ime, razred: "stopnje", zapriObKliku: true, html: razglednica(k.id, n) + `<p class="opis-kraja">${n >= 4 ? k.opis : "Sliko odkrivaš z reševanjem stopenj."}</p>`, gumbi: [...gumbi, { tekst: "Zapri" }] });
}

/** Majhna slika oblike: ploščice od zgoraj, višje plasti temnejše. */
function sličica(p: Postavitev): HTMLCanvasElement {
  const c = document.createElement("canvas"), pos = p.polozaji;
  const W = Math.max(...pos.map(q => q.x)) + 2, H = Math.max(...pos.map(q => q.y)) + 2, k = Math.min(180 / (W * 1.5), 120 / (H * 2));
  const dpr = Math.min(2, devicePixelRatio || 1);
  c.width = Math.ceil((W * 1.5 * k + 4) * dpr); c.height = Math.ceil((H * 2 * k + 4) * dpr);
  c.style.width = `${W * 1.5 * k + 4}px`; c.style.height = `${H * 2 * k + 4}px`;
  const g = c.getContext("2d")!; g.scale(dpr, dpr); g.translate(3, 3);
  const barve = ["#efe2c4", "#e2cfa4", "#d3b983", "#c4a265", "#b08a4c", "#9c7539"];
  for (const q of [...pos].sort((a, b) => a.z - b.z)) {
    g.fillStyle = barve[Math.min(5, q.z)]; g.strokeStyle = "rgba(90,60,30,.45)"; g.lineWidth = .8;
    const x = q.x * 1.5 * k - q.z * .9 * k, y = q.y * 2 * k - q.z * 1.1 * k;
    g.beginPath(); g.roundRect(x + .5, y + .5, 3 * k - 1, 4 * k - 1, 1.2); g.fill(); g.stroke();
  }
  c.setAttribute("aria-hidden", "true");
  return c;
}

const PRAZNICNE: Record<string, string[]> = { bozic: ["jelka-1", "jelka-2"], novoleto: ["zvezda-1", "jelka-3"], velikanoc: ["jajce-1", "jajce-2"], rojstnidan: ["torta-1", "crka-l-1"] };

export function postavitve(): void {
  nastaviOzadje(samodejnoOzadje());
  const vse = vsePostavitve(), pr = praznik();
  const z = zaslon("zaslon-seznam", glava("Proste postavitve", "Izberi obliko. Kljukica pomeni, da si jo že rešila.")
    + `<div class="seznam-orodja"><button class="gumb glavni" id="nakljucna">${IKONE.ploscice}<span>Naključna nova oblika</span></button></div>`
    + (pr ? `<h2 class="seznam-naslov">Praznične oblike</h2><div class="oblike" id="praznicne"></div><h2 class="seznam-naslov">Vse oblike</h2>` : "")
    + `<div class="oblike" id="oblike"></div>`);
  z.querySelector("#nazaj")!.addEventListener("click", () => nav.domov());
  z.querySelector("#nakljucna")!.addEventListener("click", () => zacniNovo({ nacin: "prosto", postavitevId: nakljucnaPostavitev() }));
  const kartica = (p: Postavitev) => {
    const r = S.napredek.resitve[p.id] ?? 0;
    const b = document.createElement("button");
    b.className = "oblika" + (r ? " resena" : "");
    b.innerHTML = `<span class="oblika-slika"></span><span class="oblika-ime">${p.ime}</span><span class="oblika-stanje">${r ? `${IKONE.kljukica}${r > 1 ? ` ponovljeno ${r - 1}×` : " rešeno"}` : ""}</span>`;
    b.querySelector(".oblika-slika")!.appendChild(sličica(p));
    b.addEventListener("click", () => zacniNovo({ nacin: "prosto", postavitevId: p.id }));
    return b;
  };
  if (pr) z.querySelector("#praznicne")!.append(...PRAZNICNE[pr].map(id => kartica(postavitev(id)!)));
  z.querySelector("#oblike")!.append(...vse.map(kartica));
}
