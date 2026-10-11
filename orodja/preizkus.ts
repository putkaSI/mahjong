// Samodejni preizkus: odpre igro, preklika zaslone, odigra igro do konca in naredi posnetke.
// Uporaba: npx tsx orodja/preizkus.ts [url] [širina] [višina]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const W = Number(process.argv[3] ?? 1600), H = Number(process.argv[4] ?? 900);
const DIR = "orodja/posnetki"; mkdirSync(DIR, { recursive: true });
const napake: string[] = [];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("console", m => { if (m.type() === "error") napake.push(m.text()); });
p.on("pageerror", e => napake.push(String(e)));
const slika = async (ime: string) => { await p.waitForTimeout(700); await p.screenshot({ path: `${DIR}/${W}-${ime}.png` }); };

await p.goto(url + "?ime=Ana&rd=3.5"); await p.waitForTimeout(1500);
await slika("1-domov");
await p.click("#d-proste"); await slika("2-oblike");
await p.click("#nakljucna"); await p.waitForTimeout(400);
await p.click(".pogovor .gumb.glavni"); // srednja
await p.waitForTimeout(1200); await slika("3-igra");
// izberi eno prosto ploščico, da se vidi dvig
const prvi = await p.evaluate(() => {
  const els = [...document.querySelectorAll<HTMLElement>(".pl[data-i]")];
  return els.length;
});
console.log("Ploščic na mizi:", prvi);
await p.click("#g-namig"); await p.waitForTimeout(900); await slika("4-namig");
// odigraj s pomočjo notranjega stanja: klikaj proste pare, dokler gre
let poteze = 0;
for (let k = 0; k < 90; k++) {
  const par = await p.evaluate(() => {
    const m = (window as unknown as { __mahjong: { pari(): [number, number][] | null } }).__mahjong;
    const pari = m.pari();
    if (!pari) return null;
    return pari.length ? pari[0] : [];
  });
  if (!par) break;
  if (await p.locator(".pogovor.zmaga").count()) { await slika("6-zmaga"); break; }
  if (!par.length) {
    await p.waitForTimeout(1800);
    if (await p.locator(".pogovor.zmaga").count()) { await slika("6-zmaga"); break; }
    if (await p.locator(".pogovor").count()) { await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(900); continue; }
    await p.click("#g-mesaj"); await p.waitForTimeout(900); continue;
  }
  await p.click(`.pl[data-i="${par[0]}"]`, { force: true });
  await p.click(`.pl[data-i="${par[1]}"]`, { force: true });
  poteze++;
  await p.waitForTimeout(140);
  if (poteze === 20) await slika("5-sredi-igre");
}
console.log("Odigranih parov:", poteze);
await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(800);
// potovanje: prva stopnja in meni med igro
await p.click("#d-pot"); await slika("7-potovanje");
await p.click("[data-igraj]"); await p.waitForTimeout(300); await p.click(".pogovor .gumb.glavni");
await p.waitForTimeout(1500); await slika("7b-potovanje-igra");
await p.click("#g-meni"); await slika("7c-meni");
await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(800);
await slika("7d-domov-nadaljuj");
await p.click("#d-nast"); await slika("8-nastavitve");
await p.click("#nazaj"); await p.waitForTimeout(500);
await p.click("#d-pomoc"); await slika("9-pomoc");
await b.close();
console.log(napake.length ? "NAPAKE:\n" + napake.join("\n") : "Brez napak v konzoli.");
