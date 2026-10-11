// Nastavitve in pomoč.
import { S, shrani, type Glasba } from "../shramba";
import { VRSTE } from "../art/ploscice";
import { KRAJI } from "../kraji";
import { IMENA_OZADIJ, nastaviOzadje, samodejnoOzadje } from "../ozadje";
import { posodobiGlasbo, zvokPar, IZBIRE_GLASBE } from "../zvok";
import { IKONE } from "./pogovor";
import { zaslon } from "./nav";

const BASE = import.meta.env.BASE_URL;
const CASI: [string, string][] = [["pomlad", "pomlad"], ["poletje", "poletje"], ["jesen", "jesen"], ["zima", "zima"]];
const glava = (naslov: string) => `<header class="glava"><button class="gumb nazaj" id="nazaj">${IKONE.nazaj}<span>Nazaj</span></button><div><h1>${naslov}</h1></div></header>`;
const stikalo = (id: string, oznaka: string, opis: string, vkl: boolean) =>
  `<label class="nastavitev stikalo" for="${id}"><span><b>${oznaka}</b><small>${opis}</small></span><input type="checkbox" id="${id}"${vkl ? " checked" : ""}><i aria-hidden="true"></i></label>`;

export function nastavitve(nazaj: () => void): void {
  const n = S.nastavitve;
  const ozadja: [string, string][] = [["samodejno", "Samodejno po letnem času"]];
  for (const t of Object.keys(IMENA_OZADIJ)) for (const [c, ime] of CASI) ozadja.push([`${t}-${c}`, `${IMENA_OZADIJ[t]}, ${ime}`]);
  for (const k of KRAJI) if ((S.napredek.potovanje[k.id] ?? 0) >= 4) ozadja.push([`kraj-${k.id}`, k.ime]);
  const z = zaslon("zaslon-seznam zaslon-nastavitve", glava("Nastavitve") + `<div class="nastavitve">
    <section><h2>O tebi</h2>
      <label class="nastavitev" for="n-ime"><span><b>Ime</b><small>Za pozdrav in pohvalo ob koncu igre</small></span><input class="vnos" id="n-ime" value="${n.ime.replace(/"/g, "&quot;")}" maxlength="30" autocomplete="off"></label>
      <label class="nastavitev" for="n-rd"><span><b>Rojstni dan</b><small>Na ta dan te čaka praznično ozadje (npr. 3.5 za 3. maj)</small></span><input class="vnos kratek" id="n-rd" value="${n.rojstniDan}" placeholder="dan.mesec" inputmode="decimal"></label>
    </section>
    <section><h2>Zvok</h2>
      ${stikalo("n-zvok", "Zvonček", "Nežen zvonček ob najdenem paru in ob zmagi", n.zvok)}
      <div class="nastavitev"><span><b>Glasba v ozadju</b></span><div class="izbire" role="radiogroup">
        ${(IZBIRE_GLASBE as [Glasba, string][]).map(([v, t]) => `<label class="izbira"><input type="radio" name="glasba" value="${v}"${n.glasba === v ? " checked" : ""}><span>${t}</span></label>`).join("")}
      </div></div>
      <label class="nastavitev" for="n-glasnost"><span><b>Glasnost</b></span><input type="range" id="n-glasnost" min="0.1" max="1" step="0.05" value="${n.glasnost}"></label>
    </section>
    <section><h2>Videz</h2>
      ${stikalo("n-pomoc", "Pomožne oznake na ploščicah", "Majhna številka ali črka v kotu ploščice (V, J, Z, S za vetrove)", n.pomoc)}
      ${stikalo("n-mehko", "Mehkejše ozadje", "Ozadje je temnejše in manj bleščeče", n.mehko)}
      ${stikalo("n-gibanje", "Gibanje v ozadju", "Nežno padajoči listi, cvetni listi ali sneg", n.gibanje)}
      <div class="nastavitev navpicno"><span><b>Ozadje</b><small>Odklenjeni kraji s potovanja se pojavijo tukaj</small></span>
        <div class="ozadja">${ozadja.map(([id, ime]) => `<label class="ozadje-izbira"><input type="radio" name="ozadje" value="${id}"${n.ozadje === id ? " checked" : ""}>
          <span class="ozadje-sl"${id === "samodejno" ? "" : ` style="background-image:url('${BASE}ozadja/${id}.webp')"`}>${id === "samodejno" ? "A" : ""}</span><span>${ime}</span></label>`).join("")}</div></div>
    </section></div>`);
  const posodobi = () => { shrani(); nastaviOzadje(samodejnoOzadje()); };
  z.querySelector("#nazaj")!.addEventListener("click", nazaj);
  z.querySelector<HTMLInputElement>("#n-ime")!.addEventListener("input", e => { n.ime = (e.target as HTMLInputElement).value; shrani(); });
  z.querySelector<HTMLInputElement>("#n-rd")!.addEventListener("change", e => {
    const v = (e.target as HTMLInputElement).value.trim().replace(/\s/g, "").replace(/\.$/, "");
    if (v === "" || /^\d{1,2}\.\d{1,2}$/.test(v)) { n.rojstniDan = v; shrani(); }
  });
  z.querySelector<HTMLInputElement>("#n-zvok")!.addEventListener("change", e => { n.zvok = (e.target as HTMLInputElement).checked; shrani(); zvokPar(); });
  z.querySelectorAll<HTMLInputElement>("input[name=glasba]").forEach(r => r.addEventListener("change", () => {
    n.glasba = r.value as Glasba; if (n.glasba !== "brez") n.zadnjaGlasba = n.glasba; shrani(); posodobiGlasbo();
  }));
  z.querySelector<HTMLInputElement>("#n-glasnost")!.addEventListener("change", e => { n.glasnost = Number((e.target as HTMLInputElement).value); shrani(); posodobiGlasbo(); zvokPar(); });
  z.querySelector<HTMLInputElement>("#n-pomoc")!.addEventListener("change", e => { n.pomoc = (e.target as HTMLInputElement).checked; shrani(); });
  z.querySelector<HTMLInputElement>("#n-mehko")!.addEventListener("change", e => { n.mehko = (e.target as HTMLInputElement).checked; posodobi(); document.body.dataset.mehko = String(n.mehko); });
  z.querySelector<HTMLInputElement>("#n-gibanje")!.addEventListener("change", e => { n.gibanje = (e.target as HTMLInputElement).checked; shrani(); });
  z.querySelectorAll<HTMLInputElement>("input[name=ozadje]").forEach(r => r.addEventListener("change", () => { n.ozadje = r.value; posodobi(); }));
}

export function pomoc(nazaj: () => void): void {
  const sk = (naslov: string, opis: string, ids: string[]) => `<section><h2>${naslov}</h2><p>${opis}</p><div class="galerija">${ids.map(id => {
    const v = VRSTE.find(x => x.id === id)!;
    return `<figure><span class="pl mini"><svg class="pl-lice" viewBox="0 0 100 128" aria-hidden="true"><use href="#t-${id}"/></svg></span><figcaption>${v.ime.replace(/^.*?: /, "")}</figcaption></figure>`;
  }).join("")}</div></section>`;
  const r = (p: string) => Array.from({ length: 9 }, (_, i) => `${p}${i + 1}`);
  const z = zaslon("zaslon-seznam zaslon-pomoc", glava("Pomoč") + `<div class="pomoc">
    <section><h2>Kako se igra</h2>
      <p>Poišči dve enaki ploščici in klikni najprej eno, nato drugo. Par odleti z mize. Igra je rešena, ko pospraviš vse ploščice.</p>
      <p>Vzameš lahko samo <b>prosto</b> ploščico: na njej ne sme ležati nobena druga, prosta pa mora biti vsaj na levi ali na desni strani.</p>
      <p><b>Namig</b> pokaže en prost par in vzame 15 točk. Za vsako rešeno igro dobiš nov namig.
      <b>Premešaj</b> premeša ploščice, ki so še na mizi, in vzame 25 točk. Za vsak par dobiš 10 točk, za rešeno igro še 100, in 50 več, če nisi mešala.</p>
      <p>Igra se sproti shranjuje. Ko jo znova odpreš, nadaljuješ tam, kjer si ostala.</p></section>
    ${sk("Pike", "Šteješ kroge.", r("p"))}
    ${sk("Bambus", "Šteješ palčke. Ena sama je ptič.", r("b"))}
    ${sk("Znaki", "Zgoraj je kitajska številka, spodaj rdeči znak 萬.", r("z"))}
    ${sk("Vetrovi", "Vzhod, jug, zahod in sever.", ["vV", "vJ", "vZ", "vS"])}
    ${sk("Zmaji", "Rdeči, zeleni in beli.", ["dR", "dG", "dB"])}
    ${sk("Rože", "Rdeč okvir. <b>Katera koli roža se ujema s katero koli rožo.</b>", ["r1", "r2", "r3", "r4"])}
    ${sk("Letni časi", "Modrozelen okvir. <b>Kateri koli letni čas se ujema s katerim koli letnim časom.</b>", ["c1", "c2", "c3", "c4"])}
  </div>`);
  z.querySelector("#nazaj")!.addEventListener("click", nazaj);
}
