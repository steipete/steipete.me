import assert from "node:assert/strict";
import test from "node:test";
import { loadOgFonts } from "../src/utils/loadOgFonts.ts";

test("social images render in Node ESM with the bundled fonts", async () => {
  const { default: satori } = await import("satori");
  const svg = await satori(
    {
      type: "div",
      props: {
        style: { display: "flex", fontSize: 48 },
        children: "Synthetic social preview",
      },
    },
    { width: 1200, height: 630, embedFont: true, fonts: await loadOgFonts() },
  );

  assert.match(svg, /^<svg\b/);
  assert.match(svg, /width="1200"/);
  assert.match(svg, /height="630"/);
  assert.match(svg, /<path\b/);
});
