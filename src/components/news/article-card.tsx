import Link from "next/link";
import { categoryStyle } from "@/lib/category-colors";
import { Icon } from "@/components/icon";
import { SaveButton } from "./article-actions";
import { ArticleImage } from "./article-image";
import type { NewsArticle } from "@/lib/types";

export function formatDate(date: string, full = false) { return new Intl.DateTimeFormat("es", { day: "numeric", month: full ? "long" : "short", ...(full ? { year: "numeric" as const } : {}), timeZone: "America/Caracas" }).format(new Date(date)); }
export function readingTime(article: NewsArticle) { return Math.max(1, Math.ceil(article.content.trim().split(/\s+/).length / 200)); }
export function ArticleCard({ article, variant = "standard", index }: { article: NewsArticle; variant?: "standard" | "featured" | "compact"; index?: number }) {
  const featured = variant === "featured";
  return <article className={`article-card article-card-${variant}`}>
    <div className="card-image-wrap"><Link href={`/noticias/${article.slug}`} className="card-image-link" aria-label={`Leer: ${article.title}`}><ArticleImage src={article.imageUrl} alt={article.title} priority={featured} /></Link>
      {featured && <span className="featured-badge"><span />EN EL FOCO</span>}
      {variant !== "compact" && <SaveButton article={article} />}
      <span className="image-company">{article.company}</span>
    </div>
    <div className="card-content"><div className="card-meta"><Link href={`/?category=${encodeURIComponent(article.category)}`} className="category-label" style={categoryStyle(article.category)}>{article.category}</Link><span className="meta-dot">·</span><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>{variant === "compact" && index && <span className="compact-index">0{index}</span>}</div>
      <h2><Link href={`/noticias/${article.slug}`}>{article.title}</Link></h2>
      {variant !== "compact" && <p className="card-description">{article.description}</p>}
      {variant !== "compact" && <div className="card-bottom"><div className="card-tags">{article.tags.slice(0, 2).map((tag) => <Link href={`/?q=${encodeURIComponent(tag)}`} className="tag-chip" key={tag}>{tag}</Link>)}</div><Link href={`/noticias/${article.slug}`} className="card-read" aria-label={`Leer: ${article.title}`}><Icon name="arrowUpRight" size={21} /></Link></div>}
      {variant === "compact" && <p className="compact-source">{article.company}<span> · {readingTime(article)} min de lectura</span></p>}
    </div>
  </article>;
}
