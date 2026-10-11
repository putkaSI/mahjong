// Igralni zaslon: zgornja lesena vrstica, miza, namigi, mešanje, meni in zmaga.
import { Igra, type Nacin } from "../igra/stanje";
import type { Tezavnost } from "../igra/pravila";
import { postavitev, vsePostavitve } from "../igra/oblike";
import { KRAJI, kraj } from "../kraji";
import { S, shrani } from "../shramba";
import { nastaviOzadje, samodejnoOzadje, cvetniDez } from "../ozadje";
import { zvokPar, zvokZmaga, preklopiGlasbo } from "../zvok";
import { Plosca } from "./plosca";
import { pogovor, obvestilo, IKONE, jeOdprtPogovor, zapriVse } from "./pogovor";
import { nav, zaslon, fmtCas } from "./nav";

export type Zacetek = { nacin: Nacin; postavitevId: string; krajId?: string; stopnja?: number };
const BASE = import.meta.env.BASE_URL;

let igra: Igra | null = null, plosca: Plosca | null = null, tajmer = 0;
const TEZ: { t: Tezavnost; ime: string; opis: string }[] = [
  { t: "lahka", ime: "Lahka", opis: "veliko prostih parov" },
  { t: "srednja", ime: "Srednja", opis: "kot običajno" },
  { t: "zahtevna", ime: "Zahtevna", opis: "treba je premisliti" },
];

/** Vsakič vpraša za težavnost (zadnja izbira je poudarjena). */
export function izberiTezavnost(naprej: (t: Tezavnost) => void, preklic?: () => void): void {
  pogovor({
    naslov: "Kako zahtevno igro želiš?", razred: "tezavnost", zapriObKliku: true,
    gumbi: [...TEZ.map(x => ({ tekst: `${x.ime}<small>${x.opis}</small>`, glavni: x.t === S.napredek.tezavnost, akcija: () => naprej(x.t) })),
      { tekst: "Prekliči", akcija: preklic }],
  });
}

/** Nova igra; če je začeta druga, najprej vpraša. */
export function zacniNovo(z: Zacetek): void {
  const zacni = () => izberiTezavnost(t => zacni2(z, t));
  if (S.igra) {
    const ime = postavitev(S.igra.postavitevId)?.ime ?? "";
    pogovor({
      naslov: "Začneš novo igro?", besedilo: `Začeto igro (${ime}, ostane še ${S.igra.na.filter(Boolean).length} ploščic) bo nova igra zamenjala.`,
      gumbi: [{ tekst: "Da, nova igra", glavni: true, akcija: zacni }, { tekst: "Ne" }],
    });
  } else zacni();
}

function zacni2(z: Zacetek, tez: Tezavnost, seme?: number): void {
  const p = postavitev(z.postavitevId)!;
  const sir = Math.max(...p.polozaji.map(q => q.x)), vis = Math.max(...p.polozaji.map(q => q.y)) * 1.3;
  const transponirano = innerHeight > innerWidth * 1.15 && sir > vis;
  const g = Igra.nova({ ...z, tez, transponirano, seme });
  S.igra = g.st; S.napredek.tezavnost = tez; S.napredek.krog++; shrani();
  prikazi(g);
}

export function nadaljuj(): void { if (S.igra) prikazi(Igra.izShrambe(S.igra)); else nav.domov(); }

function oznakaKraja(g: Igra): string {
  const k = g.st.krajId ? kraj(g.st.krajId) : null;
  return k ? `${k.ime} · ${g.st.stopnja! + 1}. stopnja od 4` : postavitev(g.st.postavitevId)?.ime ?? "";
}

function prikazi(g: Igra): void {
  ustavi();
  igra = g;
  const id = g.st.krajId && S.nastavitve.ozadje === "samodejno" ? `kraj-${g.st.krajId}` : samodejnoOzadje();
  nastaviOzadje(id);
  const z = zaslon("zaslon-igra", `
    <header class="vrh">
      <div class="stat"><span>Ploščice</span><b id="st-pl"></b></div>
      <div class="vrh-gumbi">
        <button class="vgumb" id="g-namig">${IKONE.namig}<span>Namig</span><i class="znacka" id="z-namig"></i></button>
        <button class="vgumb" id="g-mesaj">${IKONE.mesaj}<span>Premešaj</span><i class="znacka" id="z-mesaj"></i></button>
        <button class="vgumb" id="g-meni">${IKONE.meni}<span>Meni</span></button>
      </div>
      <div class="stat"><span>Točke</span><b id="st-tocke"></b></div>
      <div class="stat stat-cas"><span>Čas</span><b id="st-cas"></b></div>
    </header>
    <div class="plosca-okvir" id="plosca-okvir"></div>
    <div class="oznaka-kraja">${oznakaKraja(g)}</div>`);
  plosca = new Plosca(z.querySelector("#plosca-okvir")!, g, klik);
  z.querySelector("#g-namig")!.addEventListener("click", namig);
  z.querySelector("#g-mesaj")!.addEventListener("click", () => premesaj(false));
  z.querySelector("#g-meni")!.addEventListener("click", meni);
  osvezi();
  tajmer = window.setInterval(() => {
    if (!igra || document.hidden || jeOdprtPogovor()) return;
    igra.st.cas++; osvezi();
    if (igra.st.cas % 5 === 0) shrani();
  }, 1000);
  if (g.ostane > 0 && g.pari().length === 0) setTimeout(ponudiMesanje, 600);
}

// samo za samodejne preizkuse med razvojem
if (import.meta.env.DEV) (window as unknown as { __mahjong: unknown }).__mahjong = { pari: () => igra?.pari() ?? null };

export function ustavi(): void { clearInterval(tajmer); tajmer = 0; igra = null; plosca = null; }
addEventListener("resize", () => plosca?.prilagodi());

function osvezi(): void {
  if (!igra) return;
  const st = igra.st, $ = (id: string) => document.getElementById(id);
  if (!$("st-pl")) return;
  $("st-pl")!.textContent = String(igra.ostane);
  $("st-tocke")!.textContent = String(st.tocke);
  $("st-cas")!.textContent = fmtCas(st.cas);
  $("z-namig")!.textContent = String(S.napredek.namigi);
  $("z-mesaj")!.textContent = String(st.mesanja);
}

function klik(i: number): void {
  if (!igra || !plosca) return;
  const iz = igra.izberi(i);
  if (!iz) return;
  if (iz.tip === "zaprta") plosca.zatresi(i);
  else if (iz.tip === "odznacena") plosca.izberi(i, false);
  else if (iz.tip === "izbrana") { if (iz.prej >= 0) plosca.izberi(iz.prej, false); plosca.izberi(i, true); }
  else {
    plosca.odstrani(iz.a, iz.b); zvokPar();
    if (iz.konec) zmaga();
    else if (iz.brezPotez) setTimeout(ponudiMesanje, 1300);
  }
  osvezi(); shrani();
}

function namig(): void {
  if (!igra || !plosca) return;
  if (S.napredek.namigi <= 0) { obvestilo("Namigov ni več. Za vsako rešeno igro dobiš novega."); return; }
  const p = igra.namig();
  if (!p) { ponudiMesanje(); return; }
  S.napredek.namigi--; plosca.namig(p[0], p[1]); osvezi(); shrani();
}

function premesaj(izPogovora: boolean): void {
  if (!igra || !plosca) return;
  if (igra.st.mesanja <= 0) { if (!izPogovora) obvestilo("V tej igri ni več mešanj."); return; }
  if (igra.premesaj()) { plosca.osveziVrste(); osvezi(); shrani(); }
  if (igra.pari().length === 0) setTimeout(ponudiMesanje, 900);
}

function ponudiMesanje(): void {
  if (!igra || igra.ostane === 0 || igra.pari().length > 0) return;
  const m = igra.st.mesanja;
  pogovor({
    naslov: "Ni več prostih parov",
    besedilo: m > 0 ? `Želiš premešati ploščice? Mešanj imaš še ${m}.` : "Mešanj v tej igri ni več. Lahko začneš isto postavitev znova.",
    gumbi: [
      ...(m > 0 ? [{ tekst: "Premešaj", glavni: true, ikona: "mesaj", akcija: () => premesaj(true) }] : []),
      { tekst: "Začni znova", glavni: m === 0, ikona: "znova", akcija: znova },
      { tekst: "Domov", ikona: "domov", akcija: () => { ustavi(); nav.domov(); } },
    ],
  });
}

/** Ista postavitev in iste ploščice od začetka. */
function znova(): void {
  if (!igra) return;
  const st = igra.st;
  zacni2({ nacin: st.nacin, postavitevId: st.postavitevId, krajId: st.krajId, stopnja: st.stopnja }, st.tez, st.seme);
}

function meni(): void {
  if (!igra) return;
  shrani();
  pogovor({
    naslov: "Premor", besedilo: "Igra je shranjena. Kadar koli lahko nadaljuješ, kjer si ostala.", zapriObKliku: true, razred: "meni",
    gumbi: [
      { tekst: "Nadaljuj igro", glavni: true, ikona: "igraj" },
      { tekst: S.nastavitve.glasba === "brez" ? "Vklopi glasbo" : "Izklopi glasbo", ikona: S.nastavitve.glasba === "brez" ? "glasba" : "brezGlasbe", akcija: () => { preklopiGlasbo(); meni(); } },
      { tekst: S.nastavitve.zvok ? "Izklopi zvonček" : "Vklopi zvonček", ikona: "zvonec", akcija: () => { S.nastavitve.zvok = !S.nastavitve.zvok; shrani(); zvokPar(); meni(); } },
      { tekst: "Začni znova", ikona: "znova", akcija: () => pogovor({ naslov: "Začnem znova?", besedilo: "Ista postavitev z istimi ploščicami, od začetka.", gumbi: [{ tekst: "Da, znova", glavni: true, akcija: znova }, { tekst: "Ne" }] }) },
      { tekst: "Nova igra", ikona: "ploscice", akcija: () => pogovor({ naslov: "Začneš novo igro?", besedilo: "Ta igra se bo končala.", gumbi: [{ tekst: "Da, nova igra", glavni: true, akcija: novaIgra }, { tekst: "Ne" }] }) },
      { tekst: "Nastavitve", ikona: "nastavitve", akcija: () => { const g = igra; ustavi(); nav.nastavitve(() => g && prikazi(g)); } },
      { tekst: "Pomoč", ikona: "pomoc", akcija: () => { const g = igra; ustavi(); nav.pomoc(() => g && prikazi(g)); } },
      { tekst: "Domov", ikona: "domov", akcija: () => { ustavi(); nav.domov(); } },
    ],
  });
}

function novaIgra(): void {
  if (!igra) return;
  const nacin = igra.st.nacin;
  S.igra = null; shrani(); ustavi();
  if (nacin === "potovanje") nav.potovanje(); else nav.postavitve();
}

/** Naslednja nerešena stopnja potovanja (ali null, če je vse prepotovano). */
export function naslednjaStopnja(): Zacetek | null {
  for (const k of KRAJI) {
    const n = S.napredek.potovanje[k.id] ?? 0;
    if (n < 4) return { nacin: "potovanje", postavitevId: k.stopnje[n], krajId: k.id, stopnja: n };
  }
  return null;
}

/** Naključna oblika, ki je še ni rešila (če so rešene vse, katera koli). */
const PRAZNICNE = /^(jelka|jajce|torta|crka-l)-/;
export function nakljucnaPostavitev(razen?: string): string {
  // praznične oblike pridejo na vrsto samo za praznike (na seznamu so vedno)
  const vse = vsePostavitve().map(p => p.id).filter(id => id !== razen && !PRAZNICNE.test(id));
  const nove = vse.filter(id => !S.napredek.resitve[id]);
  const izbor = nove.length ? nove : vse;
  return izbor[Math.floor(Math.random() * izbor.length)];
}

export function razglednica(krajId: string, odkriti: number, novKos = -1): string {
  return `<div class="razglednica" style="background-image:url('${BASE}ozadja/kraj-${krajId}.webp')">`
    + [0, 1, 2, 3].map(i => `<span class="kos${i < odkriti ? " odkrit" : ""}${i === novKos ? " nov" : ""}"></span>`).join("") + `</div>`;
}

function zmaga(): void {
  if (!igra) return;
  const st = igra.st; clearInterval(tajmer);
  S.igra = null;
  S.napredek.resitve[st.postavitevId] = (S.napredek.resitve[st.postavitevId] ?? 0) + 1;
  S.napredek.namigi = Math.min(9, S.napredek.namigi + 1);
  let html = "", naslednja: Zacetek | null = null;
  if (st.nacin === "potovanje" && st.krajId) {
    const prej = S.napredek.potovanje[st.krajId] ?? 0;
    if (st.stopnja === prej) S.napredek.potovanje[st.krajId] = prej + 1;
    const n = S.napredek.potovanje[st.krajId], k = kraj(st.krajId)!;
    html = razglednica(k.id, n, st.stopnja === prej ? prej : -1)
      + (n >= 4 ? `<p class="opis-kraja"><b>${k.ime}</b> je cel! ${k.opis}</p>` : `<p class="opis-kraja">Odkrila si ${n}. delček slike: <b>${k.ime}</b>.</p>`);
    naslednja = naslednjaStopnja();
    if (n >= 4 && naslednja && naslednja.stopnja === 0) html += `<p class="opis-kraja">Naslednji cilj: <b>${kraj(naslednja.krajId!)!.ime}</b>.</p>`;
  }
  shrani();
  zvokZmaga(); cvetniDez();
  const ime = S.nastavitve.ime.trim();
  const ponovi = () => izberiTezavnost(t => zacni2({ nacin: st.nacin, postavitevId: st.postavitevId, krajId: st.krajId, stopnja: st.stopnja }, t));
  setTimeout(() => {
    if (!document.querySelector(".zaslon-igra")) return;
    zapriVse();
    pogovor({
      naslov: ime ? `Odlično, ${ime}!` : "Odlično!", razred: "zmaga",
      html: `<p class="rezultat">Točke: <b>${st.tocke}</b> · Čas: <b>${fmtCas(st.cas)}</b></p>${html}`,
      gumbi: st.nacin === "potovanje"
        ? [{ tekst: naslednja ? "Naprej" : "Konec poti", glavni: true, ikona: "naprej", akcija: () => naslednja ? izberiTezavnost(t => zacni2(naslednja!, t), () => nav.potovanje()) : nav.potovanje() },
          { tekst: "Ponovi", ikona: "znova", akcija: ponovi }, { tekst: "Domov", ikona: "domov", akcija: () => { ustavi(); nav.domov(); } }]
        : [{ tekst: "Nova oblika", glavni: true, ikona: "ploscice", akcija: () => izberiTezavnost(t => zacni2({ nacin: "prosto", postavitevId: nakljucnaPostavitev(st.postavitevId) }, t), () => nav.postavitve()) },
          { tekst: "Ponovi", ikona: "znova", akcija: ponovi }, { tekst: "Domov", ikona: "domov", akcija: () => { ustavi(); nav.domov(); } }],
    });
  }, 1500);
}
