import assert from "node:assert/strict";
import test from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkEmbeds } from "../src/utils/remarkEmbeds.mjs";
import { structuredDataJson } from "../src/utils/structuredData.ts";
import { getReadingMetrics } from "../src/utils/readingTime.ts";
import { SITE } from "../src/config.ts";

const renderer = createMarkdownProcessor({ remarkPlugins: [remarkEmbeds], syntaxHighlight: false });
const render = async (source) => (await (await renderer).render(source)).code;

test("shortcodes preserve surrounding prose, emphasis and links", async () => {
  const html = await render(
    "Before **bold** {% youtube https://www.youtube.com/watch?v=2OuQarA0a7I %} after [link](https://example.com).",
  );
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /Before/);
  assert.match(html, / after <a href="https:\/\/example.com">link<\/a>/);
  assert.match(html, /src="https:\/\/www.youtube.com\/embed\/2OuQarA0a7I"/);
  assert.equal((html.match(/<iframe/g) ?? []).length, 1);
});

test("multiple YouTube formats and Twitter legacy tags render at build time", async () => {
  const html = await render(
    '{% youtube https://youtu.be/2OuQarA0a7I %} between {% youtube https://www.youtube.com/embed/2OuQarA0a7I %}\n\n{% twitter https://x.com/steipete/status/1266799174563041282?s=20 %}\n\n<TwitterEmbed id="1277623561604214784" />',
  );
  assert.equal((html.match(/<iframe/g) ?? []).length, 2);
  assert.match(html, /between/);
  assert.match(html, /https:\/\/twitter.com\/i\/web\/status\/1266799174563041282/);
  assert.match(html, /https:\/\/twitter.com\/i\/web\/status\/1277623561604214784/);
  assert.doesNotMatch(html, /\{%|<TwitterEmbed/);
});

test("code examples remain literal and unrelated hosts are never embedded", async () => {
  const html = await render(
    '`{% youtube 2OuQarA0a7I %}`\n\n```\n<TwitterEmbed id="1277623561604214784" />\n```\n\n{% youtube https://youtube.com.evil.example/watch?v=2OuQarA0a7I %}\n\n{% twitter https://evil.example/user/status/123 %}',
  );
  assert.doesNotMatch(html, /<iframe|class="twitter-tweet"/);
  assert.match(html, /\{% youtube 2OuQarA0a7I %\}/);
  assert.match(html, /TwitterEmbed/);
});

test("reading metrics share one word count and rounded duration", () => {
  assert.deepEqual(getReadingMetrics(""), { words: 0, minutes: 0, label: "0 min read" });
  assert.deepEqual(getReadingMetrics("word ".repeat(201)), {
    words: 201,
    minutes: 2,
    label: "2 min read",
  });
});

test("article schema has valid dates, duration, canonical identity and safe JSON encoding", () => {
  const title = "A </script><script>example</script> title";
  const data = {
    title,
    description: "Synthetic",
    author: SITE.author,
    pubDatetime: new Date("2026-01-01T00:00:00Z"),
    modDatetime: null,
    tags: [],
    url: "https://example.test/canonical",
    wordCount: 201,
    readingTimeMinutes: 2,
  };
  const json = structuredDataJson({ type: "BlogPosting", data });
  assert.doesNotMatch(json, /<|undefined/);
  const schema = JSON.parse(json);
  assert.equal(schema.headline, title);
  assert.equal(schema.timeRequired, "PT2M");
  assert.equal(schema.datePublished, "2026-01-01T00:00:00.000Z");
  assert.equal(schema.dateModified, schema.datePublished);
  assert.equal(schema.mainEntityOfPage["@id"], data.url);
  assert.equal(schema.author.url, SITE.profile);
  assert.equal(
    JSON.parse(structuredDataJson({ type: "BlogPosting", data: { ...data, author: "Guest" } }))
      .author.url,
    undefined,
  );
});

test("site and person schemas do not invent article publication dates", () => {
  for (const type of ["Person", "WebSite"]) {
    const schema = JSON.parse(structuredDataJson({ type, data: {} }));
    assert.equal(schema["@type"], type);
    assert.equal(schema.datePublished, undefined);
  }
});
