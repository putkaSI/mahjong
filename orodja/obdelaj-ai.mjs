// Pomanjša AI lica ploščic (800x1024 PNG) v WebP 240x308 za igro: public/ploscice/<slog>/<id>.webp
// Uporaba: node orodja/obdelaj-ai.mjs [slog ...]
import { readdir, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const MAPE = { starinski: "starinski", emajl: "cloisonne", poslikan: "porcelan", intarzija: "intarzija", zadrez: "zad" };
const izbor = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MAPE);
for (const slog of izbor) {
  const vir = `orodja/ai/${MAPE[slog]}/koncno`, cilj = `public/ploscice/${slog}`;
  if (!existsSync(vir)) { console.log(`! ${slog}: ni slik`); continue; }
  await mkdir(cilj, { recursive: true });
  const datoteke = (await readdir(vir)).filter(f => f.endsWith(".png"));
  for (const f of datoteke) execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", `${vir}/${f}`, "-vf", "scale=240:308:flags=lanczos", "-c:v", "libwebp", "-quality", "86", `${cilj}/${f.replace(".png", ".webp")}`]);
  console.log(`+ ${slog}: ${datoteke.length} ploščic`);
}
