// Ustvari sliko prek Hugging Face Space (FLUX) in jo shrani.
// Uporaba: node orodja/slika.mjs <izhod.png> <širina> <višina> <seed> "<prompt>"
import { Client } from "@gradio/client";
import { writeFile } from "node:fs/promises";

const [out, w, h, seed, prompt] = process.argv.slice(2);
const space = process.env.SPACE || "mcp-tools/FLUX.1-Krea-dev";
const opts = process.env.HF_TOKEN ? { token: process.env.HF_TOKEN } : {};

const client = await Client.connect(space, opts);
const res = await client.predict("/infer", {
  prompt, seed: Number(seed), randomize_seed: false,
  width: Number(w), height: Number(h),
  guidance_scale: 4.5, num_inference_steps: 28,
});
const img = Array.isArray(res.data) ? res.data[0] : res.data;
const url = typeof img === "string" ? img : img?.url;
if (!url) { console.error("Ni slike v odgovoru:", JSON.stringify(res.data).slice(0, 400)); process.exit(1); }
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
await writeFile(out, buf);
console.log(`Shranjeno ${out} (${Math.round(buf.length / 1024)} KB)`);
process.exit(0);
