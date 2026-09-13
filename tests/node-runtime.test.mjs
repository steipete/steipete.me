import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

test("request middleware emits runnable JavaScript without source-only imports", (t) => {
  const output = mkdtempSync(join(process.cwd(), "temp-node-runtime-"));
  t.after(() => rmSync(output, { recursive: true, force: true }));
  const program = ts.createProgram(["src/proxy.ts"], {
    outDir: output,
    rootDir: "src",
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ES2022,
    skipLibCheck: true,
    strict: true,
    noEmitOnError: true,
  });
  const errors = ts
    .getPreEmitDiagnostics(program)
    .filter((error) => error.category === ts.DiagnosticCategory.Error);
  assert.deepEqual(
    errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, "\n")),
    [],
  );
  assert.equal(program.emit().emitSkipped, false);
  const result = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      "const {default:proxy}=await import(process.argv[1]); const response=await proxy(new Request('https://example.test/posts/example',{headers:{accept:'text/markdown'}})); process.stdout.write(response.headers.get('x-middleware-rewrite') || '');",
      pathToFileURL(join(output, "proxy.js")).href,
    ],
    { encoding: "utf8" },
  );
  assert.equal(result, "https://example.test/posts/example.md");
});
