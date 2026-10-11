// Preizkus vklopa in izklopa glasbe na domačem zaslonu in v meniju Premor.
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1366, height: 768 } });
const napake = []; p.on("pageerror", e => napake.push(String(e)));
const mp3 = []; p.on("request", r => r.url().endsWith(".mp3") && mp3.push(r.url().split("/").pop()));
await p.goto(url); await p.waitForTimeout(1000);
if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(500); }
console.log("domov gumb:", await p.locator("#d-glasba").innerText());
await p.click("#d-glasba"); await p.waitForTimeout(1500);
console.log("po kliku:", await p.locator("#d-glasba").innerText(), "| naložena glasba:", mp3.join(", ") || "nič");
await p.click("#d-proste"); await p.click(".oblika >> nth=0"); await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(1200);
await p.click("#g-meni"); await p.waitForTimeout(600);
await p.screenshot({ path: "orodja/posnetki/meni-glasba.png" });
console.log("meni:", (await p.locator(".pogovor .gumb").allInnerTexts()).join(" | "));
await p.click(".pogovor .gumb:has-text('Izklopi glasbo')"); await p.waitForTimeout(400);
console.log("po izklopu:", (await p.locator(".pogovor .gumb").allInnerTexts()).slice(1, 3).join(" | "));
console.log("napake:", napake.length ? napake : "brez");
await b.close();
