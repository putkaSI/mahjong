// Chromium (iPhone): čas od dotika do spremenjenega razreda in do izrisa; delo glavne niti na dotik.
import { chromium, devices } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices["iPhone 13"] });
const p = await ctx.newPage();
await p.goto(url); await p.waitForTimeout(1200);
if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(300); }
await p.click("#d-proste"); await p.click(".oblika >> nth=0"); await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(2500);
await p.evaluate(() => {
  const w = window; w.__m = []; let t0 = 0;
  addEventListener("pointerdown", () => { t0 = performance.now(); }, { capture: true });
  new MutationObserver(recs => {
    if (!t0 || !recs.some(r => r.target.classList?.contains("izbrana") || r.target.classList?.contains("odhaja"))) return;
    const tk = performance.now() - t0; const t = t0; t0 = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => w.__m.push({ koda: tk, slika: performance.now() - t })));
  }).observe(document.querySelector(".plosca"), { attributes: true, subtree: true, attributeFilter: ["class"] });
});
const ids = await p.evaluate(() => [...document.querySelectorAll(".pl[data-i]")].slice(0, 40).map(e => e.dataset.i));
for (const id of ids.slice(0, 14)) { await p.tap(`.pl[data-i="${id}"]`, { force: true }); await p.waitForTimeout(400); }
const m = await p.evaluate(() => window.__m);
const med = k => { const v = m.map(x => x[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]?.toFixed(1); };
console.log(`dotikov z odzivom: ${m.length} | dotik→sprememba ${med("koda")} ms | dotik→izris ${med("slika")} ms`);
await b.close();
