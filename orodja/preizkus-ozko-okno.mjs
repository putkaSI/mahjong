// Preizkus: ozko in pokončno okno na računalniku (brez dotika) mora ostati pri širokih postavitvah.
import { chromium, devices } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch();
for (const [ime, opts] of [["računalnik, ozko okno 480x900", { viewport: { width: 480, height: 900 } }], ["telefon Pixel 7", devices["Pixel 7"]]]) {
  const p = await (await b.newContext(opts)).newPage();
  await p.goto(url); await p.waitForTimeout(800);
  if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(300); }
  await p.click("#d-proste"); await p.waitForTimeout(400);
  const imena = await p.locator(".oblika-ime").allInnerTexts();
  console.log(`${ime}: ${imena.length} oblik, prve: ${imena.slice(0, 4).join(", ")}`);
}
await b.close();
