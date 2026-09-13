import type { CollectionEntry } from "astro:content";
import { Resvg } from "@resvg/resvg-js";
import postOgImage from "./og-templates/post";

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  const svg = await postOgImage(post);
  return svgBufferToPngBuffer(svg);
}
