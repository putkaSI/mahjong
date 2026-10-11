// Posnetki na telefonu (pokončno) in na manjšem prenosniku.
import { chromium, devices } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch();
for (const [ime, opts] of [["telefon", devices["Pixel 7"]], ["prenosnik", { viewport: { width: 1366, height: 768 } }]] as const) {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  const napake: string[] = [];
  p.on("pageerror", e => napake.push(String(e)));
  await p.goto(url + "?ime=Ana"); await p.waitForTimeout(1200);
  await p.screenshot({ path: `orodja/posnetki/${ime}-1-domov.png` });
  await p.click("#d-proste"); await p.waitForTimeout(500);
  await p.click(".oblika >> nth=0"); await p.waitForTimeout(300); // želva
  await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(1500);
  await p.click(".pl >> nth=5", { force: true }); await p.waitForTimeout(500);
  await p.screenshot({ path: `orodja/posnetki/${ime}-2-igra.png` });
  console.log(ime, napake.length ? napake : "brez napak");
  await ctx.close();
}
await b.close();
