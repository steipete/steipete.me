import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { getPostDate } from "../src/utils/postDate.ts";
import { serializeSitemapItem } from "../src/utils/sitemap.ts";

test("archive year and month boundaries are independent of the build machine timezone", () => {
  const code = `
    import { postsByYear, postsByMonth } from './src/utils/groupPosts.ts';
    const posts = ['2025-12-31T23:30:00Z', '2026-01-01T00:30:00Z', '2026-02-01T00:30:00Z']
      .map((date, id) => ({ id, data: { pubDatetime: new Date(date) } }));
    posts.push({ id: 3, data: { pubDatetime: new Date('2026-01-01T00:30:00Z'), timezone: 'Asia/Tokyo' } });
    console.log(JSON.stringify(postsByYear(posts).map(([year, group]) =>
      [year, postsByMonth(group).map(([month, items]) => [month, items.map(post => post.id)])])));
  `;
  for (const TZ of ["UTC", "America/Los_Angeles", "Pacific/Kiritimati"]) {
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", code], {
      cwd: new URL("../", import.meta.url),
      env: { ...process.env, TZ },
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(
      JSON.parse(result.stdout),
      [
        [2026, [[1, [2, 3]]]],
        [2025, [[12, [0, 1]]]],
      ],
      TZ,
    );
  }
});

test("publication calendar fields follow the configured display timezone", () => {
  const date = "2025-01-01T00:30:00Z";
  assert.equal(getPostDate(date).format("YYYY-MM-DD"), "2024-12-31");
  assert.equal(getPostDate(date, "").year(), 2024);
  assert.equal(getPostDate(date, "Asia/Tokyo").format("YYYY-MM-DD"), "2025-01-01");
});

test("sitemap recency follows the current UTC year without a yearly config edit", () => {
  const item = { url: "https://steipete.me/posts/2026/openclaw/" };
  for (const [year, priority, changefreq] of [
    [2026, 0.8, "weekly"],
    [2027, 0.8, "weekly"],
    [2028, 0.6, "monthly"],
    [2031, 0.6, "monthly"],
    [2032, 0.4, "yearly"],
  ]) {
    const actual = serializeSitemapItem(item, new Date(`${year}-01-01T00:00:00Z`));
    assert.equal(actual.url, "https://steipete.me/posts/2026/openclaw");
    assert.equal(actual.priority, priority);
    assert.equal(actual.changefreq, changefreq);
  }
  assert.equal(item.url.endsWith("/"), true);
});

test("sitemap page categories use URL paths and preserve the root slash", () => {
  const now = new Date("2026-09-13T12:00:00Z");
  const serialize = (path) => serializeSitemapItem({ url: `https://steipete.me${path}` }, now);
  assert.deepEqual(serialize("/"), {
    url: "https://steipete.me/",
    priority: 1,
    changefreq: "daily",
    lastmod: now.toISOString(),
  });
  assert.equal(serialize("/about/").priority, 0.9);
  assert.equal(serialize("/tags/posts/2026").priority, 0.1);
  assert.equal(serialize("/posts/20260/example").priority, 0.5);
  assert.equal(serialize("/page/2").priority, 0.4);
});
