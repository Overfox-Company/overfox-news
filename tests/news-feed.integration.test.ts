import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { getDb, closeDb } from "../src/lib/db";
import { getNews, getNewsFeed } from "../src/lib/news";

// Opt in with a local MongoDB server; always use an isolated, disposable database.
test("feed loads all of today and yesterday while paginating only older news", {
  skip: !process.env.NEWS_FEED_TEST_MONGODB_URI,
}, async () => {
  const uri = process.env.NEWS_FEED_TEST_MONGODB_URI!;
  assert.match(uri, /^mongodb:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(?:\/|$)/);
  const previous = { uri: process.env.MONGODB_URI, db: process.env.MONGODB_DB };
  process.env.MONGODB_URI = uri;
  process.env.MONGODB_DB = `overfox_news_test_${randomUUID().replaceAll("-", "")}`;
  try {
    const db = await getDb();
    const now = new Date("2026-10-30T20:00:00Z");
    const documents = [
      { day: "2026-10-30", count: 51 },
      { day: "2026-10-29", count: 38 },
      { day: "2026-10-28", count: 25 },
    ].flatMap(({ day, count }) => Array.from({ length: count }, (_, i) => ({
      slug: `${day}-${i}`, title: `Noticia ${day} número ${i}`, description: "Resumen de la noticia para la prueba.",
      content: "Contenido de la noticia para verificar el archivo y las secciones diarias.",
      imageUrl: "http://localhost/icon.svg", sourceUrl: `https://example.com/${day}/${i}`,
      company: "Overfox", sourceName: "Prueba", category: i === 0 ? "Ciencia" : "Desarrollo", tags: ["prueba"],
      publishedAt: new Date(`${day}T16:00:00Z`), createdAt: now, updatedAt: now, featured: false,
    })));
    await db.collection("news").insertMany(documents);

    const first = await getNewsFeed({}, now);
    assert.deepEqual(first.groups.map((group) => group.articles.length), [51, 38, 12]);
    assert.deepEqual(first.groups.map((group) => group.total), [51, 38, 25]);
    assert.equal(first.total, 114);
    assert.equal(first.pages, 3);
    const second = await getNewsFeed({ page: 2 }, now);
    const last = await getNewsFeed({ page: 9999 }, now);
    assert.deepEqual(second.groups.map((group) => group.articles.length), [51, 38, 12]);
    assert.deepEqual(last.groups.map((group) => group.articles.length), [51, 38, 1]);
    assert.equal(last.page, 3);
    const archiveIds = [first, second, last].flatMap((feed) => feed.groups[2].articles.map((article) => article.id));
    assert.equal(new Set(archiveIds).size, 25);

    const category = await getNewsFeed({ category: "Ciencia" }, now);
    assert.deepEqual(category.groups.map((group) => group.articles.length), [1, 1, 1]);
    const date = await getNewsFeed({ date: "2026-10-29" }, now);
    assert.deepEqual(date.groups.map((group) => group.articles.length), [0, 38, 0]);
    const search = await getNewsFeed({ q: "2026-10-28" }, now);
    assert.deepEqual(search.groups.map((group) => group.articles.length), [0, 0, 12]);
    assert.equal(search.total, 25);
    assert.equal((await getNewsFeed({ q: "sin coincidencias" }, now)).total, 0);
    assert.equal((await getNews()).articles.length, 12);
  } finally {
    try { await (await getDb()).dropDatabase(); } finally {
      await closeDb();
      if (previous.uri === undefined) delete process.env.MONGODB_URI;
      else process.env.MONGODB_URI = previous.uri;
      if (previous.db === undefined) delete process.env.MONGODB_DB;
      else process.env.MONGODB_DB = previous.db;
    }
  }
});
