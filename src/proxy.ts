export default async function proxy(request: Request) {
  let stage = "sdk";
  try {
    const { next, rewrite } = await import("@vercel/functions");
    stage = "routing";
    const { markdownTarget } = await import("./utils/markdownRouting.ts");
    stage = "request";
    const target = markdownTarget(request);
    stage = "response";
    return target ? rewrite(target) : next();
  } catch (error) {
    if (process.env.VERCEL_ENV !== "preview") throw error;
    const code = error instanceof Error && "code" in error ? String(error.code) : "unknown";
    const knownCodes = [
      "ERR_MODULE_NOT_FOUND",
      "ERR_REQUIRE_ESM",
      "ERR_UNKNOWN_FILE_EXTENSION",
      "MODULE_NOT_FOUND",
      "ERR_UNSUPPORTED_DIR_IMPORT",
    ];
    return new Response("Preview middleware diagnostic", {
      status: 500,
      headers: {
        "x-preview-stage": stage,
        "x-preview-error":
          error instanceof TypeError ? "type" : error instanceof SyntaxError ? "syntax" : "other",
        "x-preview-code": knownCodes.includes(code) ? code : "unknown",
      },
    });
  }
}
