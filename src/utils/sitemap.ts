import { existsSync, readFileSync } from "node:fs";
import type { AstroIntegration } from "astro";
import sitemap, { ChangeFreqEnum, type SitemapItem } from "@astrojs/sitemap";

export function serializeSitemapItem(item: SitemapItem, now = new Date()): SitemapItem {
  const path = new URL(item.url).pathname.replace(/\/+$/, "") || "/";
  const result: SitemapItem = {
    ...item,
    url: path === "/" ? item.url : item.url.replace(/\/+$/, ""),
    changefreq: ChangeFreqEnum.MONTHLY,
    priority: 0.5,
  };
  const postYear = /^\/posts\/(\d{4})(?:\/|$)/.exec(path)?.[1];
  if (path === "/") {
    result.priority = 1;
    result.changefreq = ChangeFreqEnum.DAILY;
    result.lastmod = now.toISOString();
  } else if (["/posts", "/about", "/search"].includes(path)) {
    result.priority = 0.9;
    result.changefreq = ChangeFreqEnum.WEEKLY;
  } else if (postYear) {
    const age = now.getUTCFullYear() - Number(postYear);
    result.priority = age <= 1 ? 0.8 : age <= 5 ? 0.6 : 0.4;
    result.changefreq =
      age <= 1 ? ChangeFreqEnum.WEEKLY : age <= 5 ? ChangeFreqEnum.MONTHLY : ChangeFreqEnum.YEARLY;
  } else if (path.startsWith("/tags/")) {
    result.priority = 0.1;
    result.changefreq = ChangeFreqEnum.YEARLY;
  } else if (/\/page\/\d+$/.test(path)) {
    result.priority = 0.4;
    result.changefreq = ChangeFreqEnum.WEEKLY;
  }
  return result;
}

export function hasNoIndex(html: string) {
  return (html.match(/<meta\b[^>]*>/gi) ?? []).some(
    (tag) =>
      /\sname\s*=\s*["']robots["']/i.test(tag) &&
      /\scontent\s*=\s*["'][^"']*\bnoindex\b/i.test(tag),
  );
}

const normalizePath = (path: string) => path.replace(/^\/|\/$/g, "");

// Static redirect documents carry noindex; keep the sitemap consistent with their HTML.
export function indexableSitemap(options: Parameters<typeof sitemap>[0]): AstroIntegration {
  const excludedPaths = new Set<string>();
  const integration = sitemap({
    ...options,
    filter: (url) =>
      !excludedPaths.has(normalizePath(new URL(url).pathname)) && (options?.filter?.(url) ?? true),
  });
  const buildDone = integration.hooks["astro:build:done"]!;
  const configDone = integration.hooks["astro:config:done"]!;
  let base = "";
  return {
    ...integration,
    hooks: {
      ...integration.hooks,
      "astro:config:done": async (context) => {
        base = normalizePath(context.config.base);
        await configDone(context);
      },
      "astro:build:done": async (context) => {
        excludedPaths.clear();
        for (const { pathname } of context.pages) {
          const path = normalizePath(pathname);
          if (/^(404|500)$/.test(path)) continue;
          // Support Astro's directory, file, and preserve output formats.
          const candidates = path ? [`${path}/index.html`, `${path}.html`] : ["index.html"];
          const file = candidates.map((file) => new URL(file, context.dir)).find(existsSync);
          if (!file) throw new Error(`Missing sitemap page output: ${pathname}`);
          if (hasNoIndex(readFileSync(file, "utf8"))) {
            excludedPaths.add([base, path].filter(Boolean).join("/"));
          }
        }
        await buildDone(context);
      },
    },
  };
}
