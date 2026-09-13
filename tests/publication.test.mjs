import assert from "node:assert/strict";
import test from "node:test";
import { isListed, isPublished } from "../src/utils/postVisibility.ts";
import { getPostAliases } from "../src/utils/postAliases.ts";
import { SITE } from "../src/config.ts";

const now = Date.parse("2026-09-12T12:00:00Z");
const published = { pubDatetime: new Date(now - 60_000) };

test("drafts stay private in production and development", () => {
  for (const preview of [false, true]) {
    assert.equal(isPublished({ ...published, draft: true }, { now, preview }), false);
    assert.equal(isListed({ ...published, draft: true }, { now, preview }), false);
  }
});

test("scheduled publication uses the configured margin and an explicit clock", () => {
  const future = { pubDatetime: new Date(now + SITE.scheduledPostMargin + 1) };
  assert.equal(isPublished(future, { now }), false);
  assert.equal(isPublished(future, { now: now + 1 }), false);
  assert.equal(isPublished(future, { now: now + 2 }), true);
  assert.equal(isPublished(future, { now, preview: true }), true);
});

test("unlisted posts remain accessible without appearing in listings", () => {
  assert.equal(isPublished({ ...published, unlisted: true }, { now }), true);
  assert.equal(isListed({ ...published, unlisted: true }, { now }), false);
  assert.equal(isListed(published, { now }), true);
});

const post = (id, year = 2025) => ({
  id,
  filePath: `src/content/blog/${id}.md`,
  data: { pubDatetime: new Date(`${year}-06-01T12:00:00Z`) },
});

test("legacy paths point to the established canonical URLs", () => {
  assert.deepEqual(getPostAliases([post("2020/example", 2020), post("root-post")]), [
    { slug: "example", destination: "/posts/2020/example" },
    { slug: "2025/root-post", destination: "/posts/root-post" },
  ]);
});

test("ambiguous slugs and actual canonical paths are never redirected", () => {
  assert.deepEqual(getPostAliases([post("2020/example"), post("2021/example")]), []);
  assert.deepEqual(getPostAliases([post("example"), post("2020/example")]), [
    { slug: "2025/example", destination: "/posts/example" },
  ]);
});

test("private canonical paths and private duplicate slugs stay reserved", () => {
  const draft = post("example");
  draft.data.draft = true;
  assert.deepEqual(getPostAliases([post("2020/example"), draft]), []);
  const future = post("2027/example", 2027);
  assert.deepEqual(getPostAliases([post("2020/example"), future], { now }), []);
});
