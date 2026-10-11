// Pogovorna okna, kratka obvestila in ikone.

export type Gumb = { tekst: string; glavni?: boolean; akcija?: () => void; ikona?: string };

/** Odpre okno; vrne funkcijo, ki ga zapre. Klik na gumb zapre okno in izvede akcijo. */
export function pogovor(o: { naslov: string; besedilo?: string; html?: string; gumbi: Gumb[]; zapriObKliku?: boolean; razred?: string }): () => void {
  zapriVse();
  const ozadje = document.createElement("div");
  ozadje.className = "pogovor-ozadje";
  ozadje.innerHTML = `<div class="pogovor ${o.razred ?? ""}" role="dialog" aria-modal="true" aria-labelledby="pog-naslov">
    <h2 id="pog-naslov">${o.naslov}</h2>
    ${o.besedilo ? `<p>${o.besedilo}</p>` : ""}${o.html ?? ""}
    <div class="pogovor-gumbi"></div></div>`;
  const vrsta = ozadje.querySelector(".pogovor-gumbi")!;
  const zapri = () => ozadje.remove();
  for (const g of o.gumbi) {
    const b = document.createElement("button");
    b.className = "gumb" + (g.glavni ? " glavni" : "");
    b.innerHTML = (g.ikona ? IKONE[g.ikona] ?? "" : "") + `<span>${g.tekst}</span>`;
    b.onclick = () => { zapri(); g.akcija?.(); };
    vrsta.appendChild(b);
  }
  if (o.zapriObKliku) ozadje.addEventListener("click", e => { if (e.target === ozadje) zapri(); });
  document.body.appendChild(ozadje);
  (vrsta.querySelector(".glavni") as HTMLElement | null ?? vrsta.querySelector("button") as HTMLElement | null)?.focus();
  return zapri;
}
export function zapriVse(): void { document.querySelectorAll(".pogovor-ozadje").forEach(e => e.remove()); }
export const jeOdprtPogovor = () => !!document.querySelector(".pogovor-ozadje");

let tt = 0;
export function obvestilo(tekst: string): void {
  let t = document.getElementById("obvestilo");
  if (!t) { t = document.createElement("div"); t.id = "obvestilo"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.textContent = tekst; t.classList.add("vidno");
  clearTimeout(tt); tt = window.setTimeout(() => t!.classList.remove("vidno"), 3200);
}

const S = (d: string) => `<svg class="ikona" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
export const IKONE: Record<string, string> = {
  namig: S(`<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>`),
  mesaj: S(`<path d="M3 7h3c4 0 6 10 10 10h5"/><path d="M3 17h3c1.6 0 2.8-1.6 3.9-3.6M14.1 9.6C15.2 8 16.4 7 18 7h3"/><path d="M18 4l3 3-3 3M18 14l3 3-3 3"/>`),
  meni: S(`<path d="M4 7h16M4 12h16M4 17h16"/>`),
  domov: S(`<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>`),
  nastavitve: S(`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>`),
  pomoc: S(`<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>`),
  znova: S(`<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>`),
  naprej: S(`<path d="M5 12h14M13 6l6 6-6 6"/>`),
  nazaj: S(`<path d="M19 12H5M11 6l-6 6 6 6"/>`),
  igraj: S(`<path d="M7 4l13 8-13 8z"/>`),
  zemljevid: S(`<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>`),
  ploscice: S(`<rect x="4" y="3" width="7" height="9" rx="1.5"/><rect x="13" y="3" width="7" height="9" rx="1.5"/><rect x="8.5" y="12" width="7" height="9" rx="1.5"/>`),
  kljucavnica: S(`<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`),
  kljukica: S(`<path d="M5 12.5l4.5 4.5L19 7.5"/>`),
};
