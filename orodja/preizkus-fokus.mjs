// Preizkus: ko igra ni spredaj (druga aplikacija/zavihek), mora biti tiho; ko se vrne, se glasba nadaljuje sama.
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1200, height: 800 } });
const p = await ctx.newPage();
await p.goto(url); await p.waitForTimeout(800);
if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(400); }
const stanje = () => p.evaluate(() => window.__zvok());
if ((await p.locator("#d-glasba").innerText()).includes("Vklopi")) await p.click("#d-glasba");
await p.waitForTimeout(1500);
console.log("1. glasba vklopljena, igra spredaj:", await stanje());
// brskalnik brez okna zavihkov ne skrije, zato izgubo fokusa in skritje simuliramo
await p.evaluate(() => { document.hasFocus = () => false; window.dispatchEvent(new Event("blur")); });
await p.waitForTimeout(500);
console.log("2. igra izgubi fokus (seznam aplikacij):", await stanje());
await p.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => true }); document.dispatchEvent(new Event("visibilitychange")); });
await p.waitForTimeout(500);
console.log("3. igra skrita (druga aplikacija):      ", await stanje());
await p.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => false }); document.hasFocus = () => true; document.dispatchEvent(new Event("visibilitychange")); window.dispatchEvent(new Event("focus")); });
await p.waitForTimeout(1200);
console.log("4. vrnitev v igro (brez dotika):        ", await stanje());
await b.close();
