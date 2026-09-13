import { markdownResponse } from "@/utils/markdownResponse";
import type { APIRoute } from "astro";
import { readFileSync } from "fs";
import { join } from "path";

export const GET: APIRoute = async () => {
  try {
    const filePath = join(process.cwd(), "src/pages/about.mdx");
    const rawContent = readFileSync(filePath, "utf-8");

    return markdownResponse(rawContent);
  } catch {
    return new Response("Not found", { status: 404 });
  }
};
