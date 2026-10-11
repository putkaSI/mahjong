import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
const slog = process.argv[2], izhod = process.argv[3];
const ids = [..."123456789"].map(n => "p" + n).concat([..."123456789"].map(n => "b" + n), [..."123456789"].map(n => "z" + n), ["vV","vJ","vZ","vS","dR","dG","dB","r1","r2","r3","r4","c1","c2","c3","c4"]);
const slike = await Promise.all(ids.map(async id => `<figure><img src="data:image/png;base64,${(await readFile(`orodja/ai/${slog}/koncno/${id}.png`)).toString("base64")}"><figcaption>${id}</figcaption></figure>`));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1500, height: 600 } });
await p.setContent(`<body style="margin:0;padding:8px;background:#e8dcc4;font:12px sans-serif"><style>div{display:grid;grid-template-columns:repeat(14,1fr);gap:6px}figure{margin:0;text-align:center}img{width:100%;border-radius:4px}</style><div>${slike.join("")}</div></body>`);
await p.screenshot({ path: izhod, fullPage: true }); await b.close();
