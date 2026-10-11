// Slogi ploščic. Vsak ima svojo paleto, nekateri pa tudi svoje risbe pik, palic, znakov, vetrov, zmajev in rož.
import { A, mesaj, odtenek, svetlost, temnejsa, svetlejsa, znak, napis, type Tema, type Odtenek } from "./osnova";
import { TEME_NOVE, ZNACKE } from "./teme-nove";

export type SlogPloscic = "klasicen" | "razlocen" | "zad" | "dragulji" | "porcelan" | "lak" | "tus" | "sodoben"
  | "vrt" | "morje" | "deco" | "starinski" | "emajl" | "poslikan" | "intarzija" | "zadrez";

/** Slogi, katerih lica je naslikala umetna inteligenca (slike v public/ploscice/<slog>/<id>.webp). */
export const SLIKOVNI: Partial<Record<SlogPloscic, { ime: string; opis: string }>> = {
  starinski: { ime: "Starinski", opis: "Starinske ploščice iz bakelita z vgraviranimi, ročno pobarvanimi znaki" },
  emajl: { ime: "Emajl", opis: "Kitajski emajl: zlate žičke, zapolnjene z barvnim steklenim emajlom" },
  poslikan: { ime: "Poslikan porcelan", opis: "Ročno poslikan modro-beli porcelan z leskom glazure" },
  intarzija: { ime: "Intarzija", opis: "Temen palisander z vložki iz bisernice" },
  zadrez: { ime: "Rezljan žad", opis: "Polirana ploščica iz zelenega žada z zlatimi vložki" },
};
export const jeSlikovni = (s: string) => s in SLIKOVNI;
const poOdtenku = (m: Partial<Record<Odtenek, string>>, sicer: (c: string) => string = c => c) => (c: string) => m[odtenek(c)] ?? sicer(c);
const f = (v: number) => v.toFixed(1);
const krog = (cx: number, cy: number, r: number, fill: string, extra = "") => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"${extra}/>`;

/* =================== DRAGULJI =================== */
/** Brušen dragulj: osmerokotnik s fasetami, svetla ploskev na vrhu in iskrica. */
function dragulj(cx: number, cy: number, r: number, c: string): string {
  const t = A.T, n = 8, tocka = (i: number, rr: number) => {
    const a = (i * 360 / n + 22.5) * Math.PI / 180; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  };
  let s = krog(cx, cy, r * 1.07, "none", ` stroke="${t.zlata}" stroke-width="${f(r * .14)}"`);
  for (let i = 0; i < n; i++) {
    const [x1, y1] = tocka(i, r), [x2, y2] = tocka(i + 1, r), [x3, y3] = tocka(i + 1, r * .56), [x4, y4] = tocka(i, r * .56);
    const a = ((i + .5) * 360 / n + 22.5) * Math.PI / 180, svet = Math.cos(a - (-135 * Math.PI / 180)); // svetloba z zgoraj levo
    const barva = svet > 0 ? mesaj(c, "#ffffff", svet * .45) : mesaj(c, "#000000", -svet * .38);
    s += `<polygon points="${f(x1)},${f(y1)} ${f(x2)},${f(y2)} ${f(x3)},${f(y3)} ${f(x4)},${f(y4)}" fill="${barva}"/>`;
  }
  const miza = Array.from({ length: n }, (_, i) => tocka(i, r * .56).map(f).join(",")).join(" ");
  s += `<polygon points="${miza}" fill="${mesaj(c, "#ffffff", .22)}"/>`;
  const sx = cx - r * .32, sy = cy - r * .34, k = r * .26;
  s += `<path d="M${f(sx)} ${f(sy - k)} L${f(sx + k * .22)} ${f(sy - k * .22)} L${f(sx + k)} ${f(sy)} L${f(sx + k * .22)} ${f(sy + k * .22)} L${f(sx)} ${f(sy + k)} L${f(sx - k * .22)} ${f(sy + k * .22)} L${f(sx - k)} ${f(sy)} L${f(sx - k * .22)} ${f(sy - k * .22)} Z" fill="#ffffff" fill-opacity=".9"/>`;
  return s;
}
const DRAGULJI: Tema = {
  id: "dragulji", ime: "Dragulji", opis: "Brušeni rubini, safirji in smaragdi na temnem žametu z zlatom",
  iv: "#221c36", rdeca: "#e5284d", zelena: "#14b874", modra: "#3d80ff", crnilo: "#f0cf75", zlata: "#e8c35e", vej: "#d9b45a",
  okvirRoza: "#f07ca0", okvirCas: "#5fd3c8", debelo: 0, razlocno: false, zlato: true,
  barva: poOdtenku({ rdeca: "#ff4466", oranzna: "#ffab40", rumena: "#ffd84d", zelena: "#25d68d", modra: "#5b95ff", vijolicna: "#b77bff", temna: "#e8c35e", svetla: "#fff3d1" }),
  kovanec: dragulj,
  pika1: () => dragulj(50, 64, 34, "#3d80ff") + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return dragulj(50 + Math.cos(a) * 41, 64 + Math.sin(a) * 41, 5.5, i % 2 ? "#e5284d" : "#14b874"); }).join(""),
  palica: (cx, cy, len, c, rot) => {
    const t = A.T, w = 9, x = cx - w / 2, y = cy - len / 2;
    return `<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${x}" y="${y}" width="${w}" height="${len}" rx="2.5" fill="${t.zlata}"/>`
      + `<rect x="${x}" y="${y}" width="${w / 2.4}" height="${len}" rx="2" fill="${svetlejsa(t.zlata, .35)}"/>`
      + `<rect x="${x - 1}" y="${y}" width="${w + 2}" height="3.5" rx="1.5" fill="${temnejsa(t.zlata, .3)}"/><rect x="${x - 1}" y="${y + len - 3.5}" width="${w + 2}" height="3.5" rx="1.5" fill="${temnejsa(t.zlata, .3)}"/>`
      + `</g>` + dragulj(cx, cy, 6.2, c);
  },
  zmaj: k => {
    const t = A.T;
    // dragulj v zlati obrobi: najprej debel zlat obris, nato barvni znak
    if (k === "R") return znak("中", 50, 64, 92, t.zlata, 44) + znak("中", 50, 64, 92, "#ff4466", 0);
    if (k === "G") return znak("發", 50, 64, 92, t.zlata, 40) + znak("發", 50, 64, 92, "#25d68d", 0);
    return `<rect x="17" y="17" width="66" height="94" rx="6" fill="none" stroke="${t.zlata}" stroke-width="4"/>` + [[17, 17], [83, 17], [17, 111], [83, 111]].map(([x, y], i) => dragulj(x, y, 7, i % 2 ? "#e5284d" : "#3d80ff")).join("") + dragulj(50, 64, 10, "#f2f2ff");
  },
  okras: () => `<rect x="3" y="3" width="94" height="122" rx="6" fill="none" stroke="#e8c35e" stroke-opacity=".45" stroke-width="1.2"/>`,
};

/* =================== MODRI PORCELAN =================== */
const PORCELAN: Tema = {
  id: "porcelan", ime: "Modri porcelan", opis: "Belo-modra keramika v slogu dinastije Ming",
  iv: "#fbfdff", rdeca: "#2a5bb0", zelena: "#5f88cc", modra: "#12357a", crnilo: "#0f2a5e", zlata: "#7b9bd0", vej: "#1d4486",
  okvirRoza: "#2a5bb0", okvirCas: "#7fa2d8", debelo: 0, razlocno: false, zlato: false,
  barva: c => mesaj("#0f2d66", "#cfdcf2", Math.min(1, svetlost(c) * 1.05)),
  kovanec: (cx, cy, r, c) => {
    let s = krog(cx, cy, r, "#fbfdff", ` stroke="${c}" stroke-width="${f(r * .16)}"`) + krog(cx, cy, r * .56, "none", ` stroke="${c}" stroke-width="${f(r * .07)}"`);
    for (let i = 0; i < 8; i++) s += `<ellipse cx="${f(cx)}" cy="${f(cy - r * .74)}" rx="${f(r * .1)}" ry="${f(r * .17)}" fill="${c}" transform="rotate(${i * 45} ${f(cx)} ${f(cy)})"/>`;
    return s + krog(cx, cy, r * .26, c);
  },
  pika1: () => {
    const c = "#12357a"; let s = krog(50, 64, 40, "#fbfdff", ` stroke="${c}" stroke-width="4"`) + krog(50, 64, 34, "none", ` stroke="${c}" stroke-width="1.2"`);
    for (let i = 0; i < 12; i++) s += `<path d="M50 34 Q56 44 50 52 Q44 44 50 34 Z" fill="${i % 2 ? "#2a5bb0" : c}" transform="rotate(${i * 30} 50 64)"/>`;
    return s + krog(50, 64, 10, c) + krog(50, 64, 4, "#fbfdff");
  },
  okras: () => `<rect x="4" y="4" width="92" height="120" rx="6" fill="none" stroke="#2a5bb0" stroke-width="1.8"/><rect x="7.5" y="7.5" width="85" height="113" rx="4" fill="none" stroke="#2a5bb0" stroke-width=".7"/>`
    + [[11, 11, 0], [89, 11, 90], [89, 117, 180], [11, 117, 270]].map(([x, y, r]) => `<path d="M${x} ${y + 7} q0 -7 7 -7" stroke="#2a5bb0" stroke-width="1.2" fill="none" transform="rotate(${r} ${x} ${y})"/>`).join(""),
};

/* =================== RDEČI LAK =================== */
const LAK: Tema = {
  id: "lak", ime: "Rdeči lak", opis: "Zlati kovanci in zlati znaki na rdečem laku",
  iv: "#9b2117", rdeca: "#fbe3ad", zelena: "#e7b54a", modra: "#f5d27e", crnilo: "#f3cd6b", zlata: "#f0c45a", vej: "#e7b54a",
  okvirRoza: "#fbe3ad", okvirCas: "#e7b54a", debelo: 0, razlocno: false, zlato: false,
  barva: c => { const o = odtenek(c); if (o === "rdeca" || o === "vijolicna") return "#fbe3ad"; return mesaj("#d39a2f", "#fff0c8", svetlost(c)); },
  kovanec: (cx, cy, r, c) => {
    const s = r * .6, rob = temnejsa(c, .28);
    return krog(cx, cy, r, c) + krog(cx, cy, r * .8, "none", ` stroke="${rob}" stroke-width="${f(r * .08)}"`)
      + `<rect x="${f(cx - s / 2)}" y="${f(cy - s / 2)}" width="${f(s)}" height="${f(s)}" fill="#9b2117" stroke="${rob}" stroke-width="${f(r * .07)}"/>`;
  },
  pika1: () => {
    const c = "#f0c45a", rob = temnejsa(c, .3);
    return krog(50, 64, 40, c) + krog(50, 64, 34, "none", ` stroke="${rob}" stroke-width="2.2"`)
      + `<rect x="39" y="53" width="22" height="22" fill="#9b2117" stroke="${rob}" stroke-width="2.2"/>`
      + znak("中", 50, 39, 17, "#9b2117", 0) + znak("發", 50, 89, 17, "#9b2117", 0) + znak("東", 25, 64, 17, "#9b2117", 0) + znak("南", 75, 64, 17, "#9b2117", 0);
  },
  palica: (cx, cy, len, c, rot) => {
    const w = 9, x = cx - w / 2, y = cy - len / 2, d = temnejsa(c, .35);
    return `<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${x}" y="${y}" width="${w}" height="${len}" rx="${w / 2}" fill="${c}"/>`
      + [y + 3, cy, y + len - 3].map(yy => `<rect x="${x - .8}" y="${f(yy - 1.6)}" width="${w + 1.6}" height="3.2" rx="1.3" fill="${d}"/>`).join("")
      + `<line x1="${cx - 1.6}" y1="${y + 6}" x2="${cx - 1.6}" y2="${y + len - 6}" stroke="#fff4d0" stroke-opacity=".6" stroke-width="1.2" stroke-linecap="round"/></g>`;
  },
  okras: () => `<rect x="4.5" y="4.5" width="91" height="119" rx="6" fill="none" stroke="#f0c45a" stroke-opacity=".55" stroke-width="1.3"/>`,
};

/* =================== TUŠ (ČOPIČ IN ČRNILO) =================== */
const TUS: Tema = {
  id: "tus", ime: "Tuš", opis: "Poteze s čopičem in črnilom na riževem papirju, z rdečimi poudarki",
  iv: "#f3ecdc", rdeca: "#b3261e", zelena: "#2f2e2b", modra: "#6a665e", crnilo: "#151513", zlata: "#9a8a6a", vej: "#2a2620",
  okvirRoza: "#b3261e", okvirCas: "#4a4842", debelo: 0, razlocno: false, zlato: false,
  barva: c => { const o = odtenek(c); return o === "rdeca" || o === "oranzna" ? "#b3261e" : mesaj("#161614", "#b8b1a2", svetlost(c)); },
  kovanec: (cx, cy, r, c) => {
    // ensō: krog s čopičem, ki se ne sklene povsem
    const rr = r * .78, obseg = 2 * Math.PI * rr, zasuk = ((cx * 7 + cy * 3) % 360);
    return krog(cx, cy, r * .5, c, ` fill-opacity=".14"`)
      + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rr)}" fill="none" stroke="${c}" stroke-width="${f(r * .36)}" stroke-linecap="round" stroke-dasharray="${f(obseg * .86)} ${f(obseg * .14)}" transform="rotate(${zasuk} ${f(cx)} ${f(cy)})"/>`;
  },
  pika1: () => `<circle cx="50" cy="64" r="32" fill="none" stroke="#151513" stroke-width="12" stroke-linecap="round" stroke-dasharray="180 21" transform="rotate(-70 50 64)"/>`
    + krog(50, 64, 12, "#b3261e") + krog(50, 64, 22, "#151513", ` fill-opacity=".1"`),
  palica: (cx, cy, len, c, rot) => {
    const w = 8, y = cy - len / 2;
    const deblo = `<path d="M${cx - w / 2} ${y + 2} Q${cx} ${y - 1} ${cx + w / 2} ${y + 2} L${cx + w * .42} ${y + len - 2} Q${cx} ${y + len + 1} ${cx - w * .42} ${y + len - 2} Z" fill="${c}" fill-opacity=".92"/>`;
    const kolenca = [y + len / 3, y + 2 * len / 3].map(yy => `<path d="M${cx - w * .75} ${f(yy)} Q${cx} ${f(yy - 2.4)} ${cx + w * .75} ${f(yy)}" stroke="${temnejsa(c, .5)}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`).join("");
    return `<g transform="rotate(${rot} ${cx} ${cy})">${deblo}${kolenca}</g>`;
  },
};

/* =================== SODOBEN =================== */
const SOD = { kor: "#ef5b4c", tur: "#1fa38a", ind: "#4058d6", jan: "#f59e3b", vij: "#8e62d9", rum: "#f2b84b", sivo: "#2b2f3a", roz: "#f08aa6" };
const znacka = (n: number, barva: string, kvadrat: boolean) => (kvadrat
  ? `<rect x="6" y="6" width="26" height="26" rx="6" fill="${barva}"/>`
  : `<circle cx="19" cy="19" r="13.5" fill="${barva}"/>`) + napis(String(n), 19, 28, 22, "#ffffff");
function cvetSod(cx: number, cy: number, r: number, c: string, sred: string): string {
  let s = "";
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; s += krog(cx + Math.cos(a) * r * .6, cy + Math.sin(a) * r * .6, r * .5, c); }
  return s + krog(cx, cy, r * .32, sred);
}
const SODOBEN: Tema = {
  id: "sodoben", ime: "Sodoben", opis: "Ploske barvne oblike, velike številke in kompas za vetrove",
  iv: "#ffffff", rdeca: SOD.kor, zelena: SOD.tur, modra: SOD.ind, crnilo: SOD.sivo, zlata: SOD.rum, vej: "#6b7280",
  okvirRoza: SOD.kor, okvirCas: SOD.tur, debelo: 0, razlocno: true, zlato: false,
  besedila: { ...ZNACKE, z: "Velika številka nad rdečim znakom 萬.", d: "Rdeči in zeleni znak ter prazen okvir." },
  barva: poOdtenku({ rdeca: SOD.kor, oranzna: SOD.jan, rumena: SOD.rum, zelena: SOD.tur, modra: SOD.ind, vijolicna: SOD.vij, temna: SOD.sivo, svetla: "#ffffff" }),
  kovanec: (cx, cy, r, c) => krog(cx, cy, r * .9, c),
  pika1: () => krog(50, 64, 36, SOD.kor) + krog(50, 64, 24, "#ffffff") + krog(50, 64, 13, SOD.ind),
  palica: (cx, cy, len, c, rot) => `<rect x="${cx - 5}" y="${cy - len / 2}" width="10" height="${len}" rx="5" fill="${c}" transform="rotate(${rot} ${cx} ${cy})"/>`,
  ptic: () => `<line x1="14" y1="108" x2="88" y2="108" stroke="#9aa1ad" stroke-width="4" stroke-linecap="round"/>`
    + `<path d="M22 62 L44 78 L20 92 Z" fill="${SOD.ind}"/>`
    + `<ellipse cx="54" cy="78" rx="24" ry="19" fill="${SOD.tur}"/>`
    + `<path d="M40 74 Q54 56 70 72 Q56 82 40 74 Z" fill="${SOD.kor}"/>`
    + krog(70, 52, 13, SOD.tur) + `<path d="M81 49 L94 53 L81 58 Z" fill="${SOD.rum}"/>` + krog(73, 49, 3.2, "#ffffff") + krog(73.8, 49, 1.6, SOD.sivo)
    + `<line x1="50" y1="96" x2="48" y2="107" stroke="${SOD.sivo}" stroke-width="3"/><line x1="60" y1="96" x2="60" y2="107" stroke="${SOD.sivo}" stroke-width="3"/>`,
  znakSt: n => napis(String(n), 50, 78, 70, SOD.sivo) + znak("萬", 50, 106, 30, SOD.kor, 10),
  veter: k => {
    const smer: Record<string, number> = { S: 0, V: 90, J: 180, Z: 270 };
    return krog(50, 56, 32, "none", ` stroke="#d5d9e2" stroke-width="3"`)
      + `<path d="M50 28 L60 56 L50 50 L40 56 Z" fill="${SOD.kor}" transform="rotate(${smer[k]} 50 56)"/>`
      + `<path d="M50 84 L60 56 L50 62 L40 56 Z" fill="#c4c9d3" transform="rotate(${smer[k]} 50 56)"/>`
      + napis(k, 50, 118, 26, SOD.ind);
  },
  zmaj: k => {
    if (k === "R") return `<rect x="16" y="26" width="68" height="76" rx="12" fill="${SOD.kor}"/>` + znak("中", 50, 64, 58, "#ffffff", 0);
    if (k === "G") return `<rect x="16" y="26" width="68" height="76" rx="12" fill="${SOD.tur}"/>` + znak("發", 50, 64, 58, "#ffffff", 0);
    return `<rect x="19" y="29" width="62" height="70" rx="10" fill="none" stroke="${SOD.ind}" stroke-width="7"/>`;
  },
  roza: n => {
    const risbe = [
      cvetSod(50, 66, 30, SOD.kor, SOD.rum),
      `<path d="M50 104 L50 76" stroke="${SOD.tur}" stroke-width="4"/>` + [0, 120, 240].map(a => `<ellipse cx="50" cy="52" rx="10" ry="18" fill="${SOD.vij}" transform="rotate(${a} 50 66)"/>`).join("") + krog(50, 66, 7, SOD.rum),
      Array.from({ length: 12 }, (_, i) => `<ellipse cx="50" cy="44" rx="6" ry="16" fill="${SOD.jan}" transform="rotate(${i * 30} 50 64)"/>`).join("") + krog(50, 64, 11, SOD.rum),
      `<rect x="38" y="40" width="10" height="66" rx="5" fill="${SOD.tur}"/><rect x="54" y="52" width="10" height="54" rx="5" fill="${SOD.tur}" opacity=".75"/>`
        + `<ellipse cx="66" cy="44" rx="6" ry="15" fill="${SOD.tur}" transform="rotate(50 66 44)"/><ellipse cx="32" cy="52" rx="6" ry="14" fill="${SOD.tur}" transform="rotate(-50 32 52)"/>`,
    ];
    return znacka(n, SOD.kor, false) + risbe[n - 1];
  },
  letniCas: n => {
    const zarki = Array.from({ length: 8 }, (_, i) => `<rect x="47" y="30" width="6" height="14" rx="3" fill="${SOD.rum}" transform="rotate(${i * 45} 50 66)"/>`).join("");
    const risbe = [
      cvetSod(54, 60, 26, SOD.roz, SOD.rum) + `<path d="M40 104 Q46 86 54 74" stroke="${SOD.tur}" stroke-width="4" fill="none"/><ellipse cx="38" cy="90" rx="6" ry="12" fill="${SOD.tur}" transform="rotate(-40 38 90)"/>`,
      zarki + krog(50, 66, 17, SOD.jan),
      `<path d="M50 30 L58 48 L76 44 L68 60 L82 70 L64 74 L66 92 L50 82 L34 92 L36 74 L18 70 L32 60 L24 44 L42 48 Z" fill="${SOD.jan}"/><line x1="50" y1="80" x2="50" y2="108" stroke="${SOD.jan}" stroke-width="4" stroke-linecap="round"/>`,
      Array.from({ length: 6 }, (_, i) => `<g transform="rotate(${i * 60} 50 66)"><rect x="47" y="34" width="6" height="32" rx="3" fill="${SOD.ind}"/><path d="M42 42 L50 48 L58 42" stroke="${SOD.ind}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`).join(""),
    ];
    return znacka(n, SOD.tur, true) + risbe[n - 1];
  },
};

/* =================== OSNOVNI TRIJE =================== */
const KLASICEN: Tema = { id: "klasicen", ime: "Klasičen", opis: "Slonokoščene ploščice z lesenim robom",
  iv: "#f4ecd8", rdeca: "#ab3428", zelena: "#2d7a4c", modra: "#2c5190", crnilo: "#1e2a48", zlata: "#b8892f", vej: "#5b3d24", okvirRoza: "#b2555a", okvirCas: "#3f7f86", debelo: 0, razlocno: false, zlato: false };
const RAZLOCEN: Tema = { ...KLASICEN, id: "razlocen", ime: "Razločen", opis: "Večji, debelejši znaki in številke v kotu, za branje brez očal",
  iv: "#fbf6ea", rdeca: "#b3170c", zelena: "#0b6a37", modra: "#0f3c96", crnilo: "#0a1430", zlata: "#a8741c", debelo: 26, razlocno: true };
const ZAD: Tema = { ...KLASICEN, id: "zad", ime: "Žad", opis: "Tradicionalne ploščice z zelenim hrbtom in zlatimi poudarki",
  iv: "#f2e8cc", rdeca: "#b2311c", zelena: "#1d6648", modra: "#203d78", crnilo: "#141b2e", zlata: "#b98a2c", debelo: 8, zlato: true };

const slikovna = (id: SlogPloscic): Tema => ({ ...KLASICEN, id, ime: SLIKOVNI[id]!.ime, opis: SLIKOVNI[id]!.opis });
export const TEME: Record<SlogPloscic, Tema> = {
  klasicen: KLASICEN, razlocen: RAZLOCEN, zad: ZAD, dragulji: DRAGULJI, porcelan: PORCELAN, lak: LAK, tus: TUS, sodoben: SODOBEN, ...TEME_NOVE,
  starinski: slikovna("starinski"), emajl: slikovna("emajl"), poslikan: slikovna("poslikan"), intarzija: slikovna("intarzija"), zadrez: slikovna("zadrez"),
};
