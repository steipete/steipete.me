import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { glob, readFile } from "node:fs/promises";
import test from "node:test";
import { parseFrontmatter } from "@astrojs/markdown-remark";
import { isPublished } from "../../src/utils/postVisibility.ts";

// Check actual source flags against every public artifact, independently of route code.
test("production artifacts never expose draft or scheduled source posts", async () => {
  for await (const path of glob("src/content/blog/**/*.md")) {
    const { frontmatter } = parseFrontmatter(await readFile(path, "utf8"));
    const data = { ...frontmatter, pubDatetime: new Date(frontmatter.pubDatetime) };
    if (isPublished(data)) continue;
    const slug = path.replace("src/content/blog/", "").replace(/\.md$/, "").toLowerCase();
    for (const suffix of ["/index.html", ".md", "/index.png"]) {
      assert.equal(existsSync(`dist/posts/${slug}${suffix}`), false, `${slug}${suffix}`);
    }
    for (const index of [
      "dist/posts/index.html",
      "dist/posts.md",
      "dist/rss.xml",
      "dist/sitemap-0.xml",
    ]) {
      assert.equal((await readFile(index, "utf8")).includes(`/posts/${slug}`), false, index);
    }
  }
});

test("legacy post URLs retain redirect documents", async () => {
  const html = await readFile(
    "dist/posts/fixing-uisearchdisplaycontroller-on-ios-7/index.html",
    "utf8",
  );
  assert.match(html, /\/posts\/2013\/fixing-uisearchdisplaycontroller-on-ios-7/);
  assert.match(html, /http-equiv="refresh"/i);
});

test("the sitemap includes the canonical article and excludes its noindex redirect", async () => {
  const sitemap = await readFile("dist/sitemap-0.xml", "utf8");
  assert.ok(
    sitemap.includes("https://steipete.me/posts/2013/fixing-uisearchdisplaycontroller-on-ios-7<"),
  );
  assert.equal(
    sitemap.includes("https://steipete.me/posts/fixing-uisearchdisplaycontroller-on-ios-7<"),
    false,
  );
});
