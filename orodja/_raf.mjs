import { webkit, devices } from "playwright";
const b = await webkit.launch();
const p = await (await b.newContext(devices["iPhone 13"])).newPage();
await p.goto("http://127.0.0.1:5173/"); await p.waitForTimeout(1500);
const r = await p.evaluate(() => new Promise(res => { const v = []; let n = 0; const meri = () => { const t0 = performance.now(); requestAnimationFrame(() => requestAnimationFrame(() => { v.push(performance.now() - t0); if (++n < 8) setTimeout(meri, 100); else res(v); })); }; meri(); }));
console.log("Dve sliki brez dotika (ms):", r.map(x => x.toFixed(0)).join(", "));
await b.close();