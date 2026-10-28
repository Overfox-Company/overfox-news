import { test } from "node:test";
import assert from "node:assert/strict";
import { assertSameOrigin, hashPassword, verifyPassword, timingSafeStringEqual } from "../src/lib/auth";
import { isAllowedRedirectUri, normalizeScope, pkceChallenge } from "../src/lib/oauth";

test("administrator hashes do not store a plaintext password and verify correctly", async () => {
  const value = await hashPassword("an-example-strong-passphrase");
  assert.ok(value.startsWith("scrypt:"));
  assert.equal(await verifyPassword("an-example-strong-passphrase", value), true);
  assert.equal(await verifyPassword("wrong-password", value), false);
  assert.equal(await verifyPassword("anything", "scrypt:invalid:hash"), false);
  assert.notEqual(await hashPassword("an-example-strong-passphrase"), value);
});
test("redirect allowlist excludes insecure remote, credentials and fragments", () => {
  assert.equal(isAllowedRedirectUri("http://127.0.0.1:8123/callback"), true);
  assert.equal(isAllowedRedirectUri("http://localhost:8123/callback"), true);
  assert.equal(isAllowedRedirectUri("https://client.example/oauth/callback"), true);
  for (const uri of ["http://example.com/callback", "javascript:alert(1)", "https://u:p@example.com/callback", "https://example.com/#token", "http://localhost.evil.test/callback"]) assert.equal(isAllowedRedirectUri(uri), false, uri);
});
test("PKCE matches the RFC 7636 test vector", () => {
  assert.equal(pkceChallenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"), "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
});
test("scope normalization refuses privilege escalation and deduplicates", () => {
  assert.equal(normalizeScope("news:write news:read news:write"), "news:read news:write");
  assert.throws(() => normalizeScope("admin:all"));
});
test("cookie mutations require the canonical browser origin", () => {
  const previous = process.env.APP_URL;
  process.env.APP_URL = "https://news.example.test";
  try {
    assert.doesNotThrow(() => assertSameOrigin(new Request("https://news.example.test/api/news", { headers: { origin: "https://news.example.test" } })));
    assert.throws(() => assertSameOrigin(new Request("https://news.example.test/api/news")));
    assert.throws(() => assertSameOrigin(new Request("https://news.example.test/api/news", { headers: { origin: "https://evil.test" } })));
  } finally { if (previous === undefined) delete process.env.APP_URL; else process.env.APP_URL = previous; }
  assert.equal(timingSafeStringEqual("one", "two"), false);
  assert.equal(timingSafeStringEqual("one", "one"), true);
});
