import { chromium } from "playwright";
import { readFile, readdir } from "node:fs/promises";
const f = (await readdir("public/ozadja")).filter(x => x.endsWith(".webp")).sort();
const html = (await Promise.all(f.map(async x => `<figure><img src="data:image/webp;base64,${(await readFile("public/ozadja/" + x)).toString("base64")}"><figcaption>${x.replace(".webp", "")}</figcaption></figure>`))).join("");
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.setContent(`<body style="margin:0;padding:6px;background:#ddd;font:12px sans-serif"><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px">${html}</div><style>figure{margin:0}img{width:100%;display:block}</style></body>`);
await p.screenshot({ path: "orodja/posnetki/ozadja-vsa.png", fullPage: true }); await b.close();