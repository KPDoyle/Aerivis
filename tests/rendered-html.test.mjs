import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Aerivis partner prototype", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Aerivis \| Environmental Exposure Intelligence<\/title>/i);
  assert.match(html, /Evidence that moves/);
  assert.match(html, /Interactive case workspace/);
  assert.match(html, /Competitor website review/);
  assert.match(html, /Demo data only/);
  assert.match(html, /Housing operations/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("removes the starter preview and ships product metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /AerivisPrototype/);
  assert.match(layout, /Environmental exposure intelligence, end to end/);
  assert.match(layout, /\/og\.png/);
  assert.match(layout, /\/favicon\.ico/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("public/favicon.ico", templateRoot));
  await assert.rejects(access(new URL("app/_sites-preview", templateRoot)));
});
