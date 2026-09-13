import { next, rewrite } from "@vercel/functions";

// Deployed middleware must resolve emitted JavaScript, not TypeScript source imports.

export function prefersMarkdown(accept: string) {
  const qualities = new Map<string, number>();
  for (const entry of accept.split(",")) {
    const [type, ...parameters] = entry.trim().toLowerCase().split(";");
    const rawQuality = parameters.find((value) => /^\s*q\s*=/.test(value))?.split("=")[1] ?? "1";
    const quality = Number(rawQuality);
    if (Number.isFinite(quality) && quality >= 0 && quality <= 1) {
      qualities.set(type.trim(), Math.max(qualities.get(type.trim()) ?? 0, quality));
    }
  }
  const markdown = qualities.get("text/markdown") ?? 0;
  const html = qualities.get("text/html") ?? qualities.get("text/*") ?? qualities.get("*/*") ?? 0;
  return markdown > 0 && markdown >= html;
}

export function markdownTarget(request: Request): URL | undefined {
  if (request.method !== "GET" && request.method !== "HEAD") return;
  const url = new URL(request.url);
  const markdownDomain = url.hostname === "steipete.md" || url.hostname === "www.steipete.md";
  if (!markdownDomain && !prefersMarkdown(request.headers.get("accept") ?? "")) return;

  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") {
    url.pathname = "/index.md";
  } else if (["/about", "/archives", "/posts"].includes(path)) {
    url.pathname = `${path}.md`;
  } else if (path.startsWith("/posts/") && !/\.(md|png)$/i.test(path)) {
    url.pathname = `${path}.md`;
  } else {
    return;
  }
  return url;
}

export default function proxy(request: Request) {
  const target = markdownTarget(request);
  return target ? rewrite(target) : next();
}
