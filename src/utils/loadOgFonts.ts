import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import type { Font } from "satori";

const require = createRequire(import.meta.url);

let fonts: Promise<Font[]> | undefined;

export function loadOgFonts(): Promise<Font[]> {
  return (fonts ??= Promise.all(
    ([400, 700] as const).map(async (weight) => ({
      name: "IBM Plex Mono",
      data: await readFile(
        require.resolve(
          `@ibm/plex-mono/fonts/complete/woff/IBMPlexMono-${weight === 400 ? "Regular" : "Bold"}.woff`,
        ),
      ),
      weight,
      style: "normal" as const,
    })),
  ));
}
