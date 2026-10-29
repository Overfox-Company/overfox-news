import type { NewsArticle } from "./types";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Caracas", year: "numeric", month: "2-digit", day: "2-digit",
});

export function groupNewsByDay(articles: NewsArticle[], now = new Date()) {
  const today = dayFormatter.format(now);
  const yesterday = dayFormatter.format(new Date(now.getTime() - 86_400_000));
  const groups = [
    { id: "hoy", title: "Hoy", articles: [] as NewsArticle[] },
    { id: "ayer", title: "Ayer", articles: [] as NewsArticle[] },
    { id: "otras-noticias", title: "Otras noticias", articles: [] as NewsArticle[] },
  ];
  for (const article of articles) {
    const day = dayFormatter.format(new Date(article.publishedAt));
    groups[day === today ? 0 : day === yesterday ? 1 : 2].articles.push(article);
  }
  return groups;
}
