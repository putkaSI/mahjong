// Ustvari manjkajoča ozadja iz slike.json z lokalnim ComfyUI (FLUX.2 Klein) namesto Hugging Face.
// Uporaba: node orodja/ozadja-lokalno.mjs [id ...]   (brez id: vsa, ki še manjkajo)
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { izvedi, tokOzadje } from "./comfy.mjs";

const cfg = JSON.parse(await readFile(new URL("./slike.json", import.meta.url), "utf8"));
const izbor = process.argv.slice(2);
await mkdir("orodja/surovo", { recursive: true }); await mkdir("public/ozadja", { recursive: true });
for (const s of cfg.slike) {
  if (izbor.length && !izbor.includes(s.id)) continue;
  const webp = `public/ozadja/${s.id}.webp`, png = `orodja/surovo/${s.id}.png`;
  if (!izbor.length && existsSync(webp)) continue;
  const t = Date.now();
  await izvedi(tokOzadje(`${cfg.slog}. ${s.p}`, s.seed, 1536, 864), png);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", png, "-c:v", "libwebp", "-quality", "82", webp]);
  console.log(`+ ${s.id} (${((Date.now() - t) / 1000).toFixed(1)} s)`);
}
process.exit(0);
