// Izmeri odzivnost dotika v Safarijevem pogonu (WebKit, iPhone): čas od dotika do izrisane slike z dvignjeno ploščico.
import { webkit, devices } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await webkit.launch();
const ctx = await b.newContext(devices["iPhone 13 Mini"] ?? devices["iPhone 13"]);
const p = await ctx.newPage();
await p.goto(url); await p.waitForTimeout(1200);
if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(300); }
await p.click("#d-proste"); await p.click(".oblika >> nth=0"); await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(2500);
// merilnik: od pointerdown/touchstart do druge slike po spremembi (vključno z izrisom)
await p.evaluate(() => {
  const w = window; w.__casi = [];
  const zacni = e => { const t0 = performance.now(); requestAnimationFrame(() => requestAnimationFrame(() => w.__casi.push(performance.now() - t0))); };
  addEventListener("touchstart", zacni, { capture: true, passive: true });
});
const ids = await p.evaluate(() => [...document.querySelectorAll(".pl[data-i]")].slice(0, 40).map(e => e.dataset.i));
for (const id of ids.slice(0, 12)) { await p.tap(`.pl[data-i="${id}"]`, { force: true }); await p.waitForTimeout(450); }
const casi = await p.evaluate(() => window.__casi);
casi.sort((a, b) => a - b);
console.log(`Dotikov: ${casi.length} | mediana ${casi[Math.floor(casi.length / 2)].toFixed(0)} ms | najslabši ${casi[casi.length - 1].toFixed(0)} ms`);
await b.close();
