// Ustvari ikono aplikacije (SVG z obrisom znaka 中) in PNG velikosti 192 in 512.
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { GLIFI } from "../src/art/glifi";

const G = GLIFI["中"], [x0, y0, x1, y1] = G.b, k = 190 / G.upm;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="110" fill="#6f4c2c"/>
  <rect x="7" y="7" width="498" height="498" rx="104" fill="none" stroke="#c89b55" stroke-width="14"/>
  <g transform="translate(150 92)">
    <rect x="22" y="26" width="212" height="300" rx="26" fill="#7a4f28"/>
    <rect x="12" y="14" width="212" height="300" rx="26" fill="#e3d0a6"/>
    <rect x="0" y="0" width="212" height="300" rx="26" fill="#f6eedb"/>
    <path d="${G.d}" fill="#ab3428" transform="translate(106 150) scale(${k} ${-k}) translate(${-(x0 + x1) / 2} ${-(y0 + y1) / 2})"/>
  </g>
</svg>`;
writeFileSync("public/ikona.svg", svg);
const b = await chromium.launch();
const p = await b.newPage();
for (const n of [192, 512]) {
  await p.setViewportSize({ width: n, height: n });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${n}" height="${n}" `)}</body></html>`);
  await p.screenshot({ path: `public/ikona-${n}.png`, omitBackground: true });
}
await b.close();
console.log("Ikone narejene.");
