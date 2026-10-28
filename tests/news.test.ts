import assert from "node:assert/strict";
import { test } from "node:test";
import { dateRange, newsInputSchema, newsUpdateSchema } from "../src/lib/news-schema";
import { buildNewsFilter } from "../src/lib/news";

const article = {
  title: "Una noticia sobre tecnología", description: "Un resumen suficientemente largo para describir la noticia.",
  content: "El contexto de esta noticia explica los hechos y cita la fuente original para el equipo.",
  imageUrl: "https://images.example.com/news.jpg", company: "Overfox", category: "Desarrollo", tags: ["IA", "ia", "TypeScript"],
  sourceUrl: "https://example.com/news#details", sourceName: "Fuente oficial", publishedAt: "2026-10-28T12:00:00-04:00",
};

test("article URLs reject executable, data and credential-bearing schemes", () => {
  for (const imageUrl of ["javascript:alert(1)", "data:image/svg+xml,test", "ftp://example.com/img.jpg", "https://admin:password@example.com/img.jpg"]) {
    assert.equal(newsInputSchema.safeParse({ ...article, imageUrl }).success, false);
  }
});

test("article normalization deduplicates chips and normalizes date/source", () => {
  const parsed = newsInputSchema.parse(article);
  assert.deepEqual(parsed.tags, ["ia", "typescript"]);
  assert.equal(parsed.sourceUrl, "https://example.com/news");
  assert.equal(parsed.publishedAt, "2026-10-28T16:00:00.000Z");
});

test("partial edits do not silently clear featured status", () => {
  assert.deepEqual(newsUpdateSchema.parse({ title: "Un título actualizado" }), { title: "Un título actualizado" });
});

test("calendar uses an entire Caracas day, including early UTC next day", () => {
  const range = dateRange("2026-10-28");
  assert.equal(range.$gte.toISOString(), "2026-10-28T04:00:00.000Z");
  assert.equal(range.$lt.toISOString(), "2026-10-29T04:00:00.000Z");
});

test("calendar rejects rolled-over and malformed dates", () => {
  for (const value of ["2026-02-30", "2026-13-01", "2026-1-1", "not-a-date"]) assert.throws(() => dateRange(value));
});

test("search treats regex metacharacters as literal text", () => {
  const filter = buildNewsFilter({ q: "C++ (.*)" });
  const regex = filter.$or?.[0]?.title as RegExp;
  assert.equal(regex.test("C++ (.*) launch"), true);
  assert.equal(regex.test("Caaaa other text"), false);
});

test("search combines category and calendar constraints and bounds input", () => {
  const filter = buildNewsFilter({ category: "Desarrollo", date: "2026-10-28", q: "TypeScript" });
  assert.equal(filter.category, "Desarrollo");
  assert.ok(filter.publishedAt);
  assert.equal(filter.$or?.length, 6);
  assert.throws(() => buildNewsFilter({ q: "a".repeat(201) }));
});
