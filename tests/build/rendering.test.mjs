import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { SITE } from "../../src/config.ts";

const schemas = (html) =>
  [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(
    (match) => JSON.parse(match[1]),
  );

test("only article pages publish one BlogPosting with an ISO duration", async () => {
  for (const path of ["index.html", "about/index.html", "search/index.html", "posts/index.html"]) {
    const data = schemas(await readFile(`dist/${path}`, "utf8"));
    assert.equal(data.filter((item) => item["@type"] === "BlogPosting").length, 0, path);
  }
  const data = schemas(await readFile("dist/posts/2020/interposekit/index.html", "utf8"));
  const articles = data.filter((item) => item["@type"] === "BlogPosting");
  assert.equal(articles.length, 1);
  assert.match(articles[0].timeRequired, /^PT\d+M$/);
  assert.ok(Number.isFinite(Date.parse(articles[0].datePublished)));
});

test("published HTML has usable embeds before any browser script executes", async () => {
  const twitter = await readFile("dist/posts/2020/interposekit/index.html", "utf8");
  const youtube = await readFile(
    "dist/posts/2025/live-coding-session-building-arena/index.html",
    "utf8",
  );
  assert.match(twitter, /https:\/\/twitter.com\/i\/web\/status\/1266799174563041282/);
  assert.match(youtube, /src="https:\/\/www.youtube.com\/embed\/68BS5GCRcBo"/);
  assert.doesNotMatch(twitter, /\{% twitter/);
  assert.doesNotMatch(youtube, /\{% youtube/);
});

test("the Markdown home contact comes from current site configuration", async () => {
  const home = await readFile("dist/index.md", "utf8");
  assert.ok(home.includes(SITE.email));
  assert.equal(home.includes("steipete@gmail.com"), false);
});
