import { existsSync, readFileSync } from "node:fs";
import type { AstroIntegration } from "astro";
import sitemap from "@astrojs/sitemap";

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
