import assert from "node:assert/strict";
import test from "node:test";
import { legacyPageHref } from "../src/utils/legacyPageHref.ts";

test("legacy pager keeps page 1 on the all-years list", () => {
  assert.equal(legacyPageHref(1), "/page/1");
  assert.equal(legacyPageHref(2), "/page/2");
});
