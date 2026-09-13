import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { markdownTarget } from "../../src/proxy.ts";

const config = JSON.parse(await readFile(new URL("../../vercel.json", import.meta.url), "utf8"));

test("following a Markdown-domain redirect still reaches the same built document", async () => {
  const redirect = config.redirects.find((rule) => rule.source === "/:path*.md");
  assert.ok(redirect, "the Markdown-file domain redirect remains configured");
  for (const path of [
    "index.md",
    "about.md",
    "archives.md",
    "posts.md",
    "posts/2026/openclaw.md",
    "posts/fixing-uisearchdisplaycontroller-on-ios-7.md",
  ]) {
    const destination = new URL(redirect.destination.replace(":path*", path.slice(0, -3)));
    assert.equal(destination.hostname, "steipete.md");
    const target = markdownTarget(new Request(destination)) ?? destination;
    const actual = await readFile(`dist${target.pathname}`, "utf8");
    const expected = await readFile(`dist/${path}`, "utf8");
    assert.equal(actual, expected, path);
  }
});
