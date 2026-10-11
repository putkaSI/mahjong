// Pregledna slika AI ploščic: vrstica na slog, izbrane ploščice. Uporaba: node orodja/pregled-ai.mjs [id,id,..] [izhod.png]
import { chromium } from "playwright";
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { SLOGI_AI } from "./slogi-ai.mjs";

const ids = (process.argv[2] ?? "p5,z3,b1").split(",");
const izhod = process.argv[3] ?? "orodja/posnetki/ai-pregled.png";
let vrstice = "";
for (const [kljuc, s] of Object.entries(SLOGI_AI)) {
  const dir = `orodja/ai/${kljuc}`;
  if (!existsSync(dir)) continue;
  const datoteke = ids[0] === "vse" ? (await readdir(dir)).filter(f => f.endsWith(".png")).map(f => f.slice(0, -4)) : ids;
  const slike = await Promise.all(datoteke.filter(id => existsSync(`${dir}/${id}.png`)).map(async id => `<img src="data:image/png;base64,${(await readFile(`${dir}/${id}.png`)).toString("base64")}">`));
  if (slike.length) vrstice += `<div class="v"><b>${s.ime}</b>${slike.join("")}</div>`;
}
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 400 } });
await p.setContent(`<html><body style="margin:0;padding:10px;background:#e8dcc4;font:700 18px Georgia">
  <style>.v{display:flex;align-items:center;gap:8px;margin:6px 0}.v b{width:150px}.v img{width:${ids[0] === "vse" ? 58 : 180}px;border-radius:6px;box-shadow:2px 3px 6px rgba(0,0,0,.3)}</style>${vrstice}</body></html>`);
await p.screenshot({ path: izhod, fullPage: true });
await b.close();
console.log("Shranjeno", izhod);
