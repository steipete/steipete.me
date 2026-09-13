import assert from "node:assert/strict";
import test from "node:test";
import { hasNoIndex } from "../src/utils/sitemap.ts";

test("sitemaps respect noindex independently of meta attribute order", () => {
  assert.equal(hasNoIndex('<meta name="robots" content="noindex">'), true);
  assert.equal(hasNoIndex("<meta content='nofollow, noindex' name='robots'>"), true);
  assert.equal(hasNoIndex('<meta name="robots" content="index,follow">'), false);
  assert.equal(hasNoIndex('<meta name="description" content="noindex">'), false);
  assert.equal(hasNoIndex('<meta data-name="robots" content="noindex">'), false);
  assert.equal(hasNoIndex('<meta name = "robots" content = "noindex">'), true);
});
