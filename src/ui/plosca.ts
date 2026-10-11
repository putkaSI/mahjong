// Izris mize: ploščice kot elementi z rahlim 3D robom, prilagajanje velikosti zaslonu in animacije.
import type { Igra } from "../igra/stanje";
import { VRSTE, imaOznake, liceHTML } from "../art/ploscice";
import { S } from "../shramba";

const W = 60, H = 78, DX = -5, DY = -6;   // velikost ploščice in zamik višje plasti (gor-levo)
const POMOC: Record<string, string> = Object.fromEntries(VRSTE.map(v => [v.id, v.pomoc]));
const IME: Record<string, string> = Object.fromEntries(VRSTE.map(v => [v.id, v.ime]));
const mirno = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export class Plosca {
  private el: HTMLElement;
  private pl: (HTMLElement | null)[] = [];
  private sirina = 0; private visina = 0; private minX = 0; private minY = 0;

  constructor(private okvir: HTMLElement, private igra: Igra, private naKlik: (i: number) => void) {
    this.el = document.createElement("div");
    this.el.className = "plosca";
    okvir.replaceChildren(this.el);
    this.zgradi();
    this.prilagodi();
  }

  private zgradi(): void {
    const { pos } = this.igra, st = this.igra.st;
    const xs = pos.map(p => p.x / 2 * W + p.z * DX), ys = pos.map(p => p.y / 2 * H + p.z * DY);
    this.minX = Math.min(...xs); this.minY = Math.min(...ys);
    this.sirina = Math.max(...xs) - this.minX + W + 10; this.visina = Math.max(...ys) - this.minY + H + 12;
    this.el.style.width = `${this.sirina}px`; this.el.style.height = `${this.visina}px`;
    const frag = document.createDocumentFragment();
    this.pl = pos.map((p, i) => {
      if (!st.na[i]) return null;
      const d = document.createElement("div");
      d.className = "pl"; d.dataset.i = String(i);
      d.style.left = `${xs[i] - this.minX}px`; d.style.top = `${ys[i] - this.minY}px`;
      d.style.zIndex = String(p.z * 1000 + p.x * 20 + p.y);
      d.innerHTML = this.vsebina(st.vrste[i]);
      d.setAttribute("aria-label", IME[st.vrste[i]]);
      frag.appendChild(d);
      return d;
    });
    this.el.appendChild(frag);
    if (st.izbrana >= 0) this.pl[st.izbrana]?.classList.add("izbrana");
    // dolg pritisk na telefonu naj ne odpre menija za kopiranje
    this.okvir.oncontextmenu = e => e.preventDefault();
    this.el.onclick = e => {
      const t = (e.target as HTMLElement).closest(".pl") as HTMLElement | null;
      if (t && !t.classList.contains("odhaja")) this.naKlik(Number(t.dataset.i));
    };
  }

  private vsebina(vrsta: string): string {
    const p = S.nastavitve.pomoc && POMOC[vrsta] && !imaOznake(S.nastavitve.slogPloscic) ? `<span class="pl-pomoc">${POMOC[vrsta]}</span>` : "";
    return liceHTML(vrsta, S.nastavitve.slogPloscic) + p;
  }

  /** Miza naj zapolni prostor, a ploščice naj ne bodo prevelike. */
  prilagodi(): void {
    const r = this.okvir.getBoundingClientRect(), rob = r.width < 600 ? 6 : 24;
    const k = Math.min((r.width - rob) / this.sirina, (r.height - rob) / this.visina, 1.9);
    const x = (r.width - this.sirina * k) / 2, y = (r.height - this.visina * k) / 2;
    this.el.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
  }

  izberi(i: number, da: boolean): void { this.pl[i]?.classList.toggle("izbrana", da); }

  zatresi(i: number): void {
    const d = this.pl[i]; if (!d || mirno()) return;
    d.animate([{ translate: "0 0" }, { translate: "-2px 0" }, { translate: "2px 0" }, { translate: "0 0" }], { duration: 260 });
  }

  /** Par odleti z zaslona: najprej se dvigne, nato počasi odplava navzgor in ven. */
  odstrani(a: number, b: number): void {
    for (const [i, smer] of [[a, -1], [b, 1]] as const) {
      const d = this.pl[i]; if (!d) continue;
      this.pl[i] = null;
      d.classList.remove("izbrana", "namig"); d.classList.add("odhaja");
      d.style.zIndex = "99999";
      if (mirno()) { d.remove(); continue; }
      const dx = smer * (220 + Math.random() * 120), dy = -(420 + Math.random() * 160);
      const anim = d.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: "translate(0,-10px) rotate(0deg)", opacity: 1, offset: .18 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${smer * 28}deg)`, opacity: 0 },
      ], { duration: 1150, easing: "cubic-bezier(.45,.05,.7,.4)", fill: "forwards" });
      anim.onfinish = () => d.remove();
    }
  }

  namig(a: number, b: number): void {
    for (const i of [a, b]) {
      const d = this.pl[i]; if (!d) continue;
      d.classList.remove("namig"); void d.offsetWidth; d.classList.add("namig");
      setTimeout(() => d.classList.remove("namig"), 6000);
    }
  }

  /** Po mešanju zamenja risbe z mehkim prehodom. */
  osveziVrste(): void {
    const st = this.igra.st;
    this.pl.forEach((d, i) => {
      if (!d) return;
      d.classList.remove("izbrana", "namig");
      const zamenjaj = () => { d.innerHTML = this.vsebina(st.vrste[i]); d.setAttribute("aria-label", IME[st.vrste[i]]); };
      if (mirno()) { zamenjaj(); return; }
      d.animate([{ opacity: 1 }, { opacity: .15 }], { duration: 260, fill: "forwards" }).onfinish = () => {
        zamenjaj(); d.animate([{ opacity: .15 }, { opacity: 1 }], { duration: 360, fill: "forwards" });
      };
    });
  }

  osveziPomoc(): void { this.pl.forEach((d, i) => { if (d) d.innerHTML = this.vsebina(this.igra.st.vrste[i]); }); }
}
