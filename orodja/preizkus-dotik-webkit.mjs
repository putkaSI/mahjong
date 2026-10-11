import { webkit, devices } from "playwright";
const b = await webkit.launch(); const p = await (await b.newContext(devices["iPhone 13"])).newPage();
const napake = []; p.on("pageerror", e => napake.push(String(e)));
await p.goto("http://127.0.0.1:5173/"); await p.waitForTimeout(1200);
if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(300); }
await p.click("#d-proste"); await p.click(".oblika >> nth=0"); await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(2000);
const par = await p.evaluate(() => window.__mahjong.pari()[0]);
await p.tap(`.pl[data-i="${par[0]}"]`, { force: true }); await p.waitForTimeout(300);
const izbrana = await p.locator(".pl.izbrana").count();
await p.tap(`.pl[data-i="${par[1]}"]`, { force: true }); await p.waitForTimeout(1500);
const ostane = await p.locator(".pl[data-i]:not(.odhaja)").count();
console.log(`WebKit: po prvem dotiku izbranih ${izbrana}, po paru ostane ${ostane} ploščic | napake: ${napake.length ? napake : "brez"}`);
await b.close();