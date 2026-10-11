// Preizkus izbire »Zvoki narave« v nastavitvah.
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
const napake = []; p.on("pageerror", e => napake.push(String(e)));
const mp3 = []; p.on("response", r => r.url().endsWith(".mp3") && mp3.push(`${r.status()} ${r.url().split("/").pop()}`));
await p.goto(url); await p.waitForTimeout(1000);
if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(500); }
await p.click("#d-nast"); await p.waitForTimeout(500);
console.log("izbire:", (await p.locator(".izbire .izbira span").allInnerTexts()).join(" | "));
await p.click(".izbira:has-text('Zvoki narave')"); await p.waitForTimeout(1500);
const stanje = await p.evaluate(() => JSON.parse(localStorage.getItem("mahjong-v1")).nastavitve.glasba);
await p.locator("section:has(h2:has-text('Zvok'))").screenshot({ path: "orodja/posnetki/nastavitve-zvok.png" });
console.log("shranjena izbira:", stanje, "| naloženo:", mp3.join(", ") || "nič", "| napake:", napake.length ? napake : "brez");
await b.close();
