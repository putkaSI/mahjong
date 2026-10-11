// Preizkus: na telefonu igra ostane ob preklopu/osvežitvi, po popolnem zaprtju pa se začne znova (z novimi namigi).
// Na računalniku se igra ohrani tudi po zaprtju.
import { chromium, devices } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch();

async function zacniIgro(p) {
  if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(300); }
  await p.click("#d-proste"); await p.click(".oblika >> nth=0"); await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(1200);
  await p.click("#g-namig"); await p.waitForTimeout(300);
}
const namigi = p => p.locator("#z-namig").innerText();

for (const [ime, opts] of [["telefon", devices["Pixel 7"]], ["računalnik", { viewport: { width: 1366, height: 768 } }]]) {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  await p.goto(url); await p.waitForTimeout(800);
  await zacniIgro(p);
  console.log(`${ime}: med igro namigov ${await namigi(p)}, postavitev ${await p.locator(".pl[data-i]").count()} ploščic`);
  await p.reload(); await p.waitForTimeout(1200);
  console.log(`${ime}: po osvežitvi (kot hiter preklop) → ${await p.locator("#g-meni").count() ? "igra se nadaljuje" : "domov"}`);
  // popolno zaprtje: shranimo trajno shrambo, odpremo nov zavihek v novi seji
  const shramba = await ctx.storageState();
  await ctx.close();
  const ctx2 = await b.newContext({ ...opts, storageState: shramba });
  const p2 = await ctx2.newPage();
  await p2.goto(url); await p2.waitForTimeout(1200);
  const naIgri = await p2.locator("#g-meni").count();
  console.log(`${ime}: po popolnem zaprtju → ${naIgri ? "igra se nadaljuje" : "domov (igra ponastavljena)"}${!naIgri && await p2.locator("#d-nadaljuj").count() ? " (gumb Nadaljuj je viden!)" : ""}`);
  if (!naIgri) { await zacniIgro(p2); console.log(`${ime}: nova igra, namigov ${await namigi(p2)}`); }
  await ctx2.close();
}
await b.close();
