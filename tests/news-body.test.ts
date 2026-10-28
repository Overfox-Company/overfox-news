import assert from "node:assert/strict";
import { test } from "node:test";
import { readNewsBody } from "../src/app/api/news/errors";

test("news body reader parses valid JSON", async () => {
  const request = new Request("https://news.overfox.net/api/news", { method: "POST", body: JSON.stringify({ title: "Noticia" }) });
  assert.deepEqual(await readNewsBody(request), { title: "Noticia" });
});

test("news body reader rejects oversized uploads even without a length header", async () => {
  const request = new Request("https://news.overfox.net/api/news", { method: "POST", body: "a".repeat(131073) });
  await assert.rejects(readNewsBody(request), (error: unknown) => error instanceof Error && "status" in error && error.status === 413);
});

test("news body reader counts encoded bytes instead of characters", async () => {
  const request = new Request("https://news.overfox.net/api/news", { method: "POST", body: "ñ".repeat(65537) });
  await assert.rejects(readNewsBody(request), (error: unknown) => error instanceof Error && "status" in error && error.status === 413);
});
