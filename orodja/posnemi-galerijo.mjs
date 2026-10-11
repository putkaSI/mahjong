// Posname galerijo slogov ploščic (vsak slog posebej) za pregled.
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/galerija.html";
const slogi = (process.argv[3] ?? "klasicen,razlocen,zad,dragulji,porcelan,lak,tus,sodoben").split(",");
const b = await chromium.launch();
const zoom = process.argv[4] ?? "1";
const p = await b.newPage({ viewport: { width: Math.round(1520 * Number(zoom)), height: 900 }, deviceScaleFactor: 1 });
const napake = []; p.on("pageerror", e => napake.push(String(e)));
for (const s of slogi) {
  await p.goto(`${url}?slogi=${s}&zoom=${zoom}`); await p.waitForTimeout(900);
  await p.locator("section").first().screenshot({ path: `orodja/posnetki/galerija-${s}.png` });
}
await b.close();
console.log(napake.length ? napake : "brez napak");
