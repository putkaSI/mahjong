// Razčlenitev zakasnitve dotika v WebKitu: dotik → koda (sprememba razreda) → naslednja slika.
import { webkit, devices } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await webkit.launch();
const p = await (await b.newContext(devices["iPhone 13"])).newPage();
await p.goto(url); await p.waitForTimeout(1200);
if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(300); }
await p.click("#d-proste"); await p.click(".oblika >> nth=0"); await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(2500);
await p.evaluate(() => {
  const w = window; w.__m = [];
  let t0 = 0, tKoda = 0;
  addEventListener("touchstart", () => { t0 = performance.now(); }, { capture: true, passive: true });
  addEventListener("pointerdown", () => { w.__pd = performance.now() - t0; }, { capture: true });
  new MutationObserver(() => {
    if (!t0 || tKoda) return;
    tKoda = performance.now();
    requestAnimationFrame(() => { const tRaf = performance.now(); w.__m.push({ doKode: tKoda - t0, pd: w.__pd, doSlike: tRaf - t0 }); t0 = 0; tKoda = 0; });
  }).observe(document.querySelector(".plosca"), { attributes: true, subtree: true, attributeFilter: ["class"] });
});
const ids = await p.evaluate(() => [...document.querySelectorAll(".pl[data-i]")].slice(0, 30).map(e => e.dataset.i));
for (const id of ids.slice(0, 10)) { await p.tap(`.pl[data-i="${id}"]`, { force: true }); await p.waitForTimeout(500); }
const m = await p.evaluate(() => window.__m);
const med = k => { const v = m.map(x => x[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]?.toFixed(0); };
console.log(`meritev: ${m.length} | dotik→pointerdown ${med("pd")} ms | dotik→sprememba razreda ${med("doKode")} ms | dotik→naslednja slika ${med("doSlike")} ms`);
await b.close();
