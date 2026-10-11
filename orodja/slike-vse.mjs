// Ustvari vsa ozadja iz slike.json (preskoči že narejena) in jih pretvori v WebP.
// Uporaba: node orodja/slike-vse.mjs [id ...]
import { Client } from "@gradio/client";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const cfg = JSON.parse(await readFile(new URL("./slike.json", import.meta.url), "utf8"));
const only = process.argv.slice(2);
const SURO = "orodja/surovo", OUT = "public/ozadja";
await mkdir(SURO, { recursive: true }); await mkdir(OUT, { recursive: true });
const exists = p => access(p).then(() => true, () => false);
const ffmpeg = process.env.FFMPEG || "ffmpeg";

let client = null;
for (const s of cfg.slike) {
  if (only.length && !only.includes(s.id)) continue;
  const webp = `${OUT}/${s.id}.webp`, png = `${SURO}/${s.id}.png`;
  if (await exists(webp)) { console.log(`= ${s.id} že obstaja`); continue; }
  try {
    if (!(await exists(png))) {
      client ??= await Client.connect(process.env.SPACE || "mcp-tools/FLUX.1-Krea-dev", process.env.HF_TOKEN ? { token: process.env.HF_TOKEN } : {});
      const res = await client.predict("/infer", {
        prompt: `${cfg.slog}. ${s.p}`, seed: s.seed, randomize_seed: false,
        width: cfg.velikost[0], height: cfg.velikost[1], guidance_scale: 4.5, num_inference_steps: 28,
      });
      const img = Array.isArray(res.data) ? res.data[0] : res.data;
      const url = typeof img === "string" ? img : img?.url;
      if (!url) throw new Error("ni slike v odgovoru");
      await writeFile(png, Buffer.from(await (await fetch(url)).arrayBuffer()));
    }
    execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", png, "-c:v", "libwebp", "-quality", "82", webp]);
    console.log(`+ ${s.id}`);
  } catch (e) {
    console.log(`! ${s.id}: ${String(e?.message || e).slice(0, 200)}`);
    if (/quota|exceeded|ZeroGPU/i.test(String(e?.message || e))) { console.log("Kvota porabljena, ustavljam."); break; }
  }
}
process.exit(0);
