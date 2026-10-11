// Izmeri, koliko dela opravi igra v mirovanju (telefon, 6 s brez dotika): čas izvajanja, risanje, slike na sekundo.
import { chromium, devices } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices["iPhone 13 Mini"] ?? devices["iPhone 13"], hasTouch: true });
const p = await ctx.newPage();
await p.goto(url); await p.waitForTimeout(1500);
if (await p.locator("#g-meni").count() === 0) {
  await p.click("#d-proste"); await p.click(".oblika >> nth=0"); await p.click(".pogovor .gumb.glavni");
}
await p.waitForTimeout(2500);
const cdp = await ctx.newCDPSession(p);
await cdp.send("Performance.enable");
const m = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(x => [x.name, x.value]));
const okvirji = () => p.evaluate(() => new Promise(r => { let n = 0; const t0 = performance.now(); const f = () => { n++; performance.now() - t0 < 3000 ? requestAnimationFrame(f) : r(n / 3); }; requestAnimationFrame(f); }));
const a = await m();
await p.waitForTimeout(6000);
const z = await m();
const s = 6;
console.log(`Skript: ${((z.ScriptDuration - a.ScriptDuration) / s * 1000).toFixed(1)} ms/s | Postavitev: ${((z.LayoutDuration - a.LayoutDuration) / s * 1000).toFixed(1)} ms/s | Slog: ${((z.RecalcStyleDuration - a.RecalcStyleDuration) / s * 1000).toFixed(1)} ms/s | Opravila skupaj: ${((z.TaskDuration - a.TaskDuration) / s * 1000).toFixed(1)} ms/s`);
await b.close();
