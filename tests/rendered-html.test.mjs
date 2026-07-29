import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
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

test("ships a dedicated Vercel Next.js build target", async () => {
  const [vercelJson, nextConfig, packageJson, vercelTsconfig] = await Promise.all([
    readFile(new URL("vercel.json", templateRoot), "utf8"),
    readFile(new URL("next.config.ts", templateRoot), "utf8"),
    readFile(new URL("package.json", templateRoot), "utf8"),
    readFile(new URL("tsconfig.vercel.json", templateRoot), "utf8"),
  ]);

  const vercel = JSON.parse(vercelJson);
  const packageConfig = JSON.parse(packageJson);

  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "npm run build:vercel");
  assert.equal(
    packageConfig.scripts["build:vercel"],
    "AERIVIS_DEPLOY_TARGET=vercel next build --webpack",
  );
  assert.match(nextConfig, /tsconfig\.vercel\.json/);
  assert.doesNotMatch(vercelTsconfig, /cloudflare:workers/);
});

test("ships the interactive Aerivis brand lab", async () => {
  const [brandPage, brandStudio, sharedMark] = await Promise.all([
    readFile(new URL("../app/brand/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/brand/BrandStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AerivisMark.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(brandPage, /Aerivis Brand Lab/);
  assert.match(brandStudio, /Interactive Aerivis logo demo/);
  assert.match(brandStudio, /Purposeful motion only/);
  assert.match(brandStudio, /Less symbol/);
  assert.match(sharedMark, /brand-symbol/);

  const response = await render("/brand");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Aerivis Brand Lab/);
  assert.match(html, /Air becomes/);
  assert.match(html, /Brand stress test/);
});
