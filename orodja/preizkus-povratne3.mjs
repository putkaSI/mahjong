// Preizkus povratnih informacij 3: velikost ploščic na računalniku, izbrana ploščica vedno na vrhu, namigi na igro.
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://127.0.0.1:5173/";
const slog = process.argv[3] ?? "deco";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } });
const p = await ctx.newPage();
const napake = []; p.on("pageerror", e => napake.push(String(e)));
await p.goto(url); await p.waitForTimeout(500);
await p.evaluate(s => { const d = JSON.parse(localStorage.getItem("mahjong-v1") || "{}"); d.nastavitve = { ...(d.nastavitve || {}), slogPloscic: s }; d.igra = null; localStorage.setItem("mahjong-v1", JSON.stringify(d)); }, slog);
await p.reload(); await p.waitForTimeout(800);

async function zacni(n = 0) {
  if (await p.locator("#g-meni").count()) { await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Domov')"); await p.waitForTimeout(300); }
  await p.click("#d-proste"); await p.click(`.oblika >> nth=${n}`);
  if (await p.locator(".pogovor .gumb:has-text('Da, nova igra')").count()) await p.click(".pogovor .gumb:has-text('Da, nova igra')");
  await p.click(".pogovor .gumb.glavni"); await p.waitForTimeout(1200);
}
const namigi = () => p.locator("#z-namig").innerText();

await zacni();
const sirina = await p.locator(".pl[data-i]").first().evaluate(e => e.getBoundingClientRect().width);
const ploscaOkvir = await p.locator("#plosca-okvir").boundingBox(), plosca = await p.locator(".plosca").boundingBox();
console.log(`velikost: ploščica ${sirina.toFixed(0)} px, miza ${plosca.width.toFixed(0)}x${plosca.height.toFixed(0)} v okvirju ${ploscaOkvir.width.toFixed(0)}x${ploscaOkvir.height.toFixed(0)}`);
await p.screenshot({ path: `orodja/posnetki/p3-igra-${slog}.png` });

// izbrana ploščica: v vsaki točki njenega pravokotnika mora biti zgoraj prav ona
console.log(`namigi na začetku: ${await namigi()}`);
await p.click("#g-namig"); await p.waitForTimeout(400);
console.log(`po enem namigu: ${await namigi()}`);
const rez = await p.evaluate(() => {
  const vse = [...document.querySelectorAll(".pl[data-i]")];
  // poišči prosto ploščico, ki jo prekriva soseda (višji z-index), in jo izberi
  const pari = window.__mahjong.pari();
  const proste = [...new Set(pari.flat())];
  let najslabsa = null, prekrita = 0;
  for (const i of proste) {
    const el = vse.find(e => Number(e.dataset.i) === i), r = el.getBoundingClientRect();
    let n = 0;
    for (let x = r.left + 2; x < r.right - 1; x += 4) for (let y = r.top + 2; y < r.bottom - 1; y += 4) { const t = document.elementFromPoint(x, y)?.closest(".pl"); if (t && t !== el) n++; }
    if (n > prekrita) { prekrita = n; najslabsa = i; }
  }
  return { najslabsa, prekrita };
});
console.log(`najbolj prekrita prosta ploščica: #${rez.najslabsa} (${rez.prekrita} točk prekritih)`);
if (rez.najslabsa != null) {
  await p.locator(`.pl[data-i="${rez.najslabsa}"]`).dispatchEvent("pointerdown", { pointerType: "mouse", isPrimary: true, button: 0 });
  await p.waitForTimeout(400);
  const po = await p.evaluate(i => {
    const el = document.querySelector(`.pl[data-i="${i}"]`), r = el.getBoundingClientRect();
    let n = 0, vse = 0;
    for (let x = r.left + 2; x < r.right - 1; x += 4) for (let y = r.top + 2; y < r.bottom - 1; y += 4) { vse++; const t = document.elementFromPoint(x, y)?.closest(".pl"); if (t && t !== el) n++; }
    return { izbrana: el.classList.contains("izbrana"), z: getComputedStyle(el).zIndex, n, vse };
  }, rez.najslabsa);
  console.log(`po izbiri: izbrana=${po.izbrana}, z-index=${po.z}, prekritih ${po.n}/${po.vse} točk`);
  const okvir = await p.locator(`.pl[data-i="${rez.najslabsa}"]`).boundingBox();
  await p.screenshot({ path: `orodja/posnetki/p3-izbrana.png`, clip: { x: okvir.x - 80, y: okvir.y - 80, width: okvir.width + 160, height: okvir.height + 160 } });
}

// ponovni začetek iste igre
await p.click("#g-meni"); await p.click(".pogovor .gumb:has-text('Začni znova')"); await p.click(".pogovor .gumb:has-text('Da, znova')");
await p.waitForTimeout(500); if (await p.locator(".pogovor .gumb.glavni").count()) { await p.click(".pogovor .gumb.glavni"); } await p.waitForTimeout(1000);
console.log(`po »Začni znova«: ${await namigi()}`);
await p.click("#g-namig"); await p.waitForTimeout(300); await p.click("#g-namig"); await p.waitForTimeout(300);
console.log(`po dveh namigih: ${await namigi()}`);
// izhod in nova igra
await zacni(1);
console.log(`nova igra po izhodu: ${await namigi()}`);
// stara shranjena igra brez namigov na igro
await p.evaluate(() => { const d = JSON.parse(localStorage.getItem("mahjong-v1")); delete d.igra.namigi; d.napredek.namigi = 0; localStorage.setItem("mahjong-v1", JSON.stringify(d)); });
await p.reload(); await p.waitForTimeout(1200);
console.log(`stara igra (brez namigov na igro), nadaljevana: ${await namigi()}`);
await b.close();
console.log(napake.length ? napake : "brez napak");
