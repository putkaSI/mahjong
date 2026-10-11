// Posname razdelek »Ploščice« v nastavitvah (izbira slogov).
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1100, height: 1000 } });
await p.goto(url); await p.waitForTimeout(800);
if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(300); }
await p.click("#d-nast"); await p.waitForTimeout(800);
await p.locator("section:has(h2:has-text('Ploščice'))").screenshot({ path: "orodja/posnetki/slogi-vsi.png" });
await b.close();
console.log("ok");
