import assert from "node:assert/strict";
import { test } from "node:test";
import { groupNewsByDay } from "../src/lib/news-groups";
import type { NewsArticle } from "../src/lib/types";

const article = (id: string, publishedAt: string) => ({ id, publishedAt }) as NewsArticle;

test("groups by Caracas midnight rather than UTC and preserves article order", () => {
  const articles = [
    article("today", "2026-10-29T04:00:00Z"),
    article("late-yesterday", "2026-10-29T03:59:59Z"),
    article("yesterday", "2026-10-28T04:00:00Z"),
    article("older", "2026-10-28T03:59:59Z"),
  ];
  const groups = groupNewsByDay(articles, new Date("2026-10-29T15:00:00Z"));
  assert.deepEqual(groups.map((group) => group.articles.map((item) => item.id)), [
    ["today"], ["late-yesterday", "yesterday"], ["older"],
  ]);
  assert.equal(groups.flatMap((group) => group.articles).length, articles.length);
});

test("yesterday works across a year boundary while UTC is already the next day", () => {
  const groups = groupNewsByDay([
    article("today", "2026-12-31T23:00:00-04:00"),
    article("yesterday", "2026-12-30T12:00:00-04:00"),
  ], new Date("2027-01-01T02:00:00Z"));
  assert.deepEqual(groups.map((group) => group.articles.map((item) => item.id)), [["today"], ["yesterday"], []]);
});

test("empty groups remain available in the requested order", () => {
  assert.deepEqual(groupNewsByDay([]).map(({ title, articles }) => [title, articles.length]), [
    ["Hoy", 0], ["Ayer", 0], ["Otras noticias", 0],
  ]);
});
