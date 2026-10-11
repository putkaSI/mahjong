// Izriše lica vseh ploščic (brez 3D roba) kot PNG 800x1024 — vhod za AI preobleko v ComfyUI.
// Uporaba: npx tsx orodja/izrisi-lica.ts [slog] [barva-lica]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { VRSTE, risba, type SlogPloscic } from "../src/art/ploscice";

const slog = (process.argv[2] ?? "klasicen") as SlogPloscic;
const lice = process.argv[3] ?? "#f4ecd8";
const dir = `orodja/lica/${slog}`; mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 800, height: 1024 } });
for (const v of VRSTE) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 128" width="800" height="1024"><rect width="100" height="128" fill="${lice}"/>${risba(v.id, slog)}</svg>`;
  await p.setContent(`<html><body style="margin:0;font-family:Georgia,serif">${svg}</body></html>`);
  await p.locator("svg").screenshot({ path: `${dir}/${v.id}.png` });
}
await b.close();
console.log(`Izrisanih ${VRSTE.length} lic v ${dir}`);
