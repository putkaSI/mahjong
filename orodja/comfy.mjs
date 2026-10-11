// Odjemalec za lokalni ComfyUI (http://127.0.0.1:8189): preobleka ploščic s Qwen-Image-Edit in ozadja s FLUX.2 Klein.
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

export const STREZNIK = process.env.COMFY ?? "http://127.0.0.1:8189";

export async function nalozi(pot) {
  const fd = new FormData();
  fd.append("image", new Blob([await readFile(pot)], { type: "image/png" }), basename(pot));
  fd.append("overwrite", "true");
  const r = await fetch(`${STREZNIK}/upload/image`, { method: "POST", body: fd });
  if (!r.ok) throw new Error("nalaganje: " + r.status);
  return (await r.json()).name;
}

/** Pošlje delovni tok, počaka na rezultat in shrani prvo izhodno sliko. */
export async function izvedi(tok, cilj) {
  const r = await fetch(`${STREZNIK}/prompt`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: tok }) });
  const j = await r.json();
  if (!j.prompt_id) throw new Error("ComfyUI zavrnil: " + JSON.stringify(j).slice(0, 600));
  for (let i = 0; i < 1200; i++) {
    await new Promise(res => setTimeout(res, 500));
    const h = await (await fetch(`${STREZNIK}/history/${j.prompt_id}`)).json();
    const e = h[j.prompt_id];
    if (!e) continue;
    if (e.status?.status_str === "error") throw new Error("napaka: " + JSON.stringify(e.status.messages).slice(0, 600));
    for (const out of Object.values(e.outputs ?? {})) for (const img of out.images ?? []) {
      const u = `${STREZNIK}/view?filename=${encodeURIComponent(img.filename)}&subfolder=${encodeURIComponent(img.subfolder)}&type=${img.type}`;
      await writeFile(cilj, Buffer.from(await (await fetch(u)).arrayBuffer()));
      return cilj;
    }
  }
  throw new Error("časovna omejitev");
}

/** FLUX.2 Klein 9B: slika iz besedila (ozadja). */
export function tokOzadje(opis, seme, w = 1536, h = 864, koraki = 4) {
  return {
    "1": { class_type: "UNETLoader", inputs: { unet_name: "flux-2-klein-9b.safetensors", weight_dtype: "default" } },
    "2": { class_type: "CLIPLoader", inputs: { clip_name: "qwen_3_8b_fp8mixed.safetensors", type: "flux2" } },
    "3": { class_type: "VAELoader", inputs: { vae_name: "diffusion_pytorch_model.safetensors" } },
    "4": { class_type: "CLIPTextEncode", inputs: { clip: ["2", 0], text: opis } },
    "5": { class_type: "EmptyFlux2LatentImage", inputs: { width: w, height: h, batch_size: 1 } },
    "6": { class_type: "Flux2Scheduler", inputs: { steps: koraki, width: w, height: h } },
    "7": { class_type: "KSamplerSelect", inputs: { sampler_name: "euler" } },
    "8": { class_type: "RandomNoise", inputs: { noise_seed: seme } },
    "9": { class_type: "BasicGuider", inputs: { model: ["1", 0], conditioning: ["4", 0] } },
    "10": { class_type: "SamplerCustomAdvanced", inputs: { noise: ["8", 0], guider: ["9", 0], sampler: ["7", 0], sigmas: ["6", 0], latent_image: ["5", 0] } },
    "11": { class_type: "VAEDecode", inputs: { samples: ["10", 0], vae: ["3", 0] } },
    "12": { class_type: "SaveImage", inputs: { images: ["11", 0], filename_prefix: "ozadje" } },
  };
}

/** Qwen-Image-Edit 2511 (GGUF Q6) + Lightning 4 koraki: preobleka slike po navodilu. */
export function tokPreobleka(slika, navodilo, seme, koraki = 4, denoise = 1.0) {
  return {
    "1": { class_type: "UnetLoaderGGUF", inputs: { unet_name: "qwen-image-edit-2511-Q6_K.gguf" } },
    "2": { class_type: "LoraLoaderModelOnly", inputs: { model: ["1", 0], lora_name: "Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors", strength_model: 1.0 } },
    "3": { class_type: "ModelSamplingAuraFlow", inputs: { model: ["2", 0], shift: 3.1 } },
    "4": { class_type: "CFGNorm", inputs: { model: ["3", 0], strength: 1.0 } },
    "5": { class_type: "CLIPLoader", inputs: { clip_name: "qwen_2.5_vl_7b_fp8_scaled.safetensors", type: "qwen_image" } },
    "6": { class_type: "VAELoader", inputs: { vae_name: "qwen_image_vae.safetensors" } },
    "7": { class_type: "LoadImage", inputs: { image: slika } },
    "8": { class_type: "TextEncodeQwenImageEditPlus", inputs: { clip: ["5", 0], vae: ["6", 0], image1: ["7", 0], prompt: navodilo } },
    "9": { class_type: "TextEncodeQwenImageEditPlus", inputs: { clip: ["5", 0], vae: ["6", 0], image1: ["7", 0], prompt: "" } },
    "10": { class_type: "VAEEncode", inputs: { pixels: ["7", 0], vae: ["6", 0] } },
    "11": { class_type: "KSampler", inputs: { model: ["4", 0], positive: ["8", 0], negative: ["9", 0], latent_image: ["10", 0], seed: seme, steps: koraki, cfg: 1.0, sampler_name: "euler", scheduler: "simple", denoise } },
    "12": { class_type: "VAEDecode", inputs: { samples: ["11", 0], vae: ["6", 0] } },
    "13": { class_type: "SaveImage", inputs: { images: ["12", 0], filename_prefix: "mahjong" } },
  };
}
