import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const run = promisify(execFile);

test("Dependabot lockfile updates work and range updates retain the release cooldown", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "dependency-updates-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const name = "release-age-fixture";
  const tarballs = new Map();
  const packageDirectory = join(directory, "package");
  await mkdir(packageDirectory);
  for (const version of ["1.0.0", "1.0.1"]) {
    await writeFile(join(packageDirectory, "package.json"), JSON.stringify({ name, version }));
    const archive = join(directory, `${name}-${version}.tgz`);
    await run("tar", ["-czf", archive, "-C", directory, "package"]);
    tarballs.set(`/${name}-${version}.tgz`, await readFile(archive));
  }
  const server = createServer((request, response) => {
    if (tarballs.has(request.url)) {
      response.setHeader("content-type", "application/octet-stream");
      response.end(tarballs.get(request.url));
      return;
    }
    if (request.url !== `/${name}`) {
      response.writeHead(404).end();
      return;
    }
    const versions = Object.fromEntries(
      ["1.0.0", "1.0.1"].map((version) => [
        version,
        {
          name,
          version,
          dist: {
            tarball: `${registry}/${name}-${version}.tgz`,
            integrity: `sha512-${createHash("sha512")
              .update(tarballs.get(`/${name}-${version}.tgz`))
              .digest("base64")}`,
          },
        },
      ]),
    );
    response.setHeader("content-type", "application/json");
    response.end(
      JSON.stringify({
        name,
        "dist-tags": { latest: "1.0.1" },
        versions,
        time: {
          "1.0.0": "2020-01-01T00:00:00.000Z",
          "1.0.1": new Date().toISOString(),
        },
      }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const registry = `http://127.0.0.1:${server.address().port}`;
  const { packageManager } = JSON.parse(await readFile("package.json", "utf8"));
  const manifest = JSON.stringify({
    name: "dependency-update-test",
    private: true,
    packageManager,
    dependencies: { [name]: "^1.0.0" },
  });
  await writeFile(join(directory, "package.json"), manifest);
  await writeFile(join(directory, "pnpm-workspace.yaml"), await readFile("pnpm-workspace.yaml"));

  for (const selector of ["1.0.0", "^1.0.0"]) {
    await run(
      "pnpm",
      [
        "update",
        `${name}@${selector}`,
        "--lockfile-only",
        "--no-save",
        "-r",
        `--registry=${registry}`,
        `--state-dir=${join(directory, "state")}`,
        `--store-dir=${join(directory, "store")}`,
      ],
      { cwd: directory, timeout: 30_000, env: { ...process.env, CI: "true" } },
    );
    const lockfile = await readFile(join(directory, "pnpm-lock.yaml"), "utf8");
    assert.match(lockfile, /release-age-fixture@1\.0\.0/);
    assert.doesNotMatch(lockfile, /release-age-fixture@1\.0\.1/);
    assert.equal(await readFile(join(directory, "package.json"), "utf8"), manifest);
  }

  // A bot pinning a fresh release must still fail strict release-age verification.
  await assert.rejects(
    run(
      "pnpm",
      [
        "update",
        `${name}@1.0.1`,
        "--lockfile-only",
        "--no-save",
        "-r",
        `--registry=${registry}`,
        `--state-dir=${join(directory, "state")}`,
        `--store-dir=${join(directory, "store")}`,
      ],
      { cwd: directory, timeout: 30_000, env: { ...process.env, CI: "true" } },
    ),
    (error) => {
      assert.match(`${error.stdout}\n${error.stderr}`, /ERR_PNPM_.*(?:RELEASE_AGE|TOO_NEW)/);
      return true;
    },
  );
});
