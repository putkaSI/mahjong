// Posnetki: trije slogi ploščic (izbrana ploščica + namig), izbira sloga v nastavitvah, telefon z ozko postavitvijo.
import { chromium, devices, type Page } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch();
const napake: string[] = [];

async function nastavi(p: Page, slog: string) {
  await p.evaluate(s => {
    const d = JSON.parse(localStorage.getItem("mahjong-v1") || "{}");
    d.nastavitve = { ...(d.nastavitve || {}), slogPloscic: s, ime: "Ana" }; d.igra = null;
    localStorage.setItem("mahjong-v1", JSON.stringify(d));
  }, slog);
  await p.reload(); await p.waitForTimeout(900);
}
async function igraj(p: Page, ime: string, oblika = 0) {
  await p.click("#d-proste"); await p.waitForTimeout(400);
  await p.click(`.oblika >> nth=${oblika}`); await p.waitForTimeout(300);
  await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(1400);
  const par = await p.evaluate(() => (window as unknown as { __mahjong: { pari(): [number, number][] } }).__mahjong.pari());
  await p.click("#g-namig"); await p.waitForTimeout(150);
  // izberi prosto ploščico, ki ni v namigu
  const hint = await p.evaluate(() => [...document.querySelectorAll(".pl.namig")].map(e => Number((e as HTMLElement).dataset.i)));
  const izbira = par.flat().find(i => !hint.includes(i)) ?? par[0][0];
  await p.click(`.pl[data-i="${izbira}"]`, { force: true }); await p.waitForTimeout(500);
  await p.screenshot({ path: `orodja/posnetki/${ime}.png` });
}

// računalnik: vsi trije slogi
const pc = await b.newPage({ viewport: { width: 1366, height: 768 } });
pc.on("pageerror", e => napake.push(String(e)));
await pc.goto(url); await pc.waitForTimeout(800);
const slogi = (process.argv[3] ?? "klasicen,razlocen,zad,dragulji,porcelan,lak,tus,sodoben").split(",");
for (const s of slogi) { await nastavi(pc, s); await igraj(pc, `slog-${s}`); }
await nastavi(pc, "klasicen");
await pc.click("#d-nast"); await pc.waitForTimeout(600);
await pc.locator("section:has(h2:has-text('Ploščice'))").screenshot({ path: "orodja/posnetki/slogi-nastavitve.png" });

// telefon
const ctx = await b.newContext(devices["Galaxy S9+"] ?? devices["Pixel 7"]);
const tel = await ctx.newPage();
tel.on("pageerror", e => napake.push(String(e)));
await tel.goto(url); await tel.waitForTimeout(800);
await nastavi(tel, "razlocen");
await igraj(tel, "telefon-razlocen", 0);
const vel = await tel.evaluate(() => { const e = document.querySelector(".pl[data-i]")!; return Math.round(e.getBoundingClientRect().width); });
console.log("širina ploščice na telefonu:", vel, "px; zaslon:", await tel.evaluate(() => `${innerWidth}x${innerHeight}`));
await b.close();
console.log(napake.length ? "NAPAKE:\n" + napake.join("\n") : "Brez napak.");
