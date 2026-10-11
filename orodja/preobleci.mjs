// Preobleče lica ploščic v izbran material z lokalnim ComfyUI.
// Uporaba: node orodja/preobleci.mjs <ime-sloga> <id,id,...|vse> ["navodilo"]
import { mkdir, readdir } from "node:fs/promises";
import { nalozi, izvedi, tokPreobleka } from "./comfy.mjs";
import { SLOGI_AI } from "./slogi-ai.mjs";

const [ime, kaj = "p5,z3,vV,dR,r1,b1"] = process.argv.slice(2);
const slog = SLOGI_AI[ime];
if (!slog) { console.log("Neznan slog. Na voljo: " + Object.keys(SLOGI_AI).join(", ")); process.exit(1); }
const vir = `orodja/lica/${slog.vir}`, cilj = `orodja/ai/${ime}`;
await mkdir(cilj, { recursive: true });
const ids = kaj === "vse" ? (await readdir(vir)).filter(f => f.endsWith(".png")).map(f => f.slice(0, -4)) : kaj.split(",");
// natančen opis vsebine vsake ploščice, da model ničesar ne doda in ne spremeni
const STEV = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"], BES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const VET = { V: "東", J: "南", Z: "西", S: "北" };
const ROZE = ["", "plum blossom branch", "orchid", "chrysanthemum", "bamboo"], CASI = ["", "spring blossom branch", "lotus on a pond", "autumn maple leaves", "snowflake"];
function vsebina(id) {
  if (id === "_prazno") return "This tile face is completely blank: no symbols, no characters, no ornaments, no frame, only the plain material surface.";
  const n = Number(id.slice(1));
  switch (id[0]) {
    case "p": return n === 1 ? "This tile shows one single large round medallion. There are no Chinese characters on this tile."
      : `This tile shows exactly ${BES[n]} round circles with concentric rings, arranged as in the original. Every circle stays a plain round circle. There are no Chinese characters on this tile.`;
    case "b": return n === 1 ? "This tile shows a single bird standing on a branch. There are no Chinese characters on this tile."
      : `This tile shows exactly ${BES[n]} bamboo sticks, arranged as in the original, in ${n <= 3 || n === 5 || n === 7 ? "the same groups" : "two rows"}. The sticks are plain and smooth with nothing written or drawn on them. There are no Chinese characters, no extra sticks and no extra dots on this tile.`;
    case "z": return `This tile shows only the Chinese numeral ${STEV[n]} above the Chinese character 萬, nothing else. No extra dots or gems.`;
    case "v": return `This tile shows only the single Chinese character ${VET[id[1]]}, nothing else.`;
    case "d": return id[1] === "R" ? "This tile shows only the single red Chinese character 中, nothing else." : id[1] === "G" ? "This tile shows only the single green Chinese character 發, nothing else." : "This tile shows only an empty rectangular blue frame with small corner diamonds, nothing inside it.";
    case "r": return `This tile shows a ${ROZE[n]} painting, a small number ${n} in the top left corner and a small Chinese character in the top right corner, inside a thin frame.`;
    case "c": return `This tile shows a ${CASI[n]} painting, a small number ${n} in the top left corner and a small Chinese character in the top right corner, inside a thin frame.`;
  }
  return "";
}
const t0 = Date.now();
for (const id of ids) {
  const t = Date.now();
  const slika = await nalozi(`${vir}/${id}.png`);
  const navodilo = (process.argv[4] ?? slog.navodilo) + " " + vsebina(id);
  // izmišljene dodatke v praznih delih kasneje odstrani sestavi.py (s prazno ploščico istega materiala)
  const denoise = Number(process.env.DENOISE ?? slog.denoise ?? 1);
  const pripona = process.env.PRIPONA ?? "";   // za kandidate: shrani kot id-PRIPONA.png
  await izvedi(tokPreobleka(slika, navodilo, Number(process.env.SEME ?? slog.seme), slog.koraki ?? 4, denoise), `${cilj}/${id}${pripona}.png`);
  console.log(`+ ${id} (${((Date.now() - t) / 1000).toFixed(1)} s)`);
}
console.log(`Skupaj ${ids.length} ploščic v ${((Date.now() - t0) / 1000).toFixed(0)} s → ${cilj}`);
process.exit(0);
