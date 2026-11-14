import assert from "node:assert/strict";
import { glob, readFile } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";

test("legacy page two links back to the all-years page one", async () => {
  const { document } = new JSDOM(await readFile("dist/page/2/index.html", "utf8")).window;
  const previous = [...document.querySelectorAll("a")].find((link) =>
    link.textContent.includes("Previous"),
  );
  assert.equal(previous?.getAttribute("href"), "/page/1");
  const firstPage = [...document.querySelectorAll("a")].find(
    (link) => link.textContent.trim() === "1",
  );
  assert.equal(firstPage?.getAttribute("href"), "/page/1");
});

test("Markdown and legacy listings keep a near-midnight post on its Los Angeles day", async () => {
  const slug = "2014/hacking-with-aspects";
  const markdown = await readFile("dist/posts.md", "utf8");
  const line = markdown.split("\n").find((value) => value.includes(`/posts/${slug}.md`));
  assert.match(line, /^- May 5:/);
  let found = false;
  for await (const path of glob("dist/page/*/index.html")) {
    const { document } = new JSDOM(await readFile(path, "utf8")).window;
    const link = document.querySelector(`article h2 a[href="/posts/${slug}/"]`);
    if (!link) continue;
    assert.equal(link.closest("article").querySelector("time").textContent.trim(), "5 May, 2014");
    found = true;
    break;
  }
  assert.ok(found, "post must occur in the legacy all-years list");
});
