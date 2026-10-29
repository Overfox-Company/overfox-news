import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticle, getNews } from "@/lib/news";
import { categoryStyle } from "@/lib/category-colors";
import { Icon } from "@/components/icon";
import { ArticleCard, formatDate, readingTime } from "@/components/news/article-card";
import { ArticleImage } from "@/components/news/article-image";
import { SaveButton, ShareButton } from "@/components/news/article-actions";
import { SiteHeader, SiteFooter, BottomNav } from "@/components/news/site-shell";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) return { title: "Noticia no encontrada" };
  return { title: article.title, description: article.description, openGraph: { title: article.title, description: article.description, type: "article", images: [{ url: article.imageUrl }], publishedTime: article.publishedAt } };
}
export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  const related = (await getNews({ category: article.category, limit: 4 })).articles.filter((item) => item.id !== article.id).slice(0, 3);
  const paragraphs = article.content.split(/\n\s*\n/).filter(Boolean);
  return <><SiteHeader active="article" /><main className="main-container detail-container"><div className="detail-toolbar"><Link href="/" className="back-link"><Icon name="arrowLeft" size={18} />Volver al radar</Link><div className="detail-actions"><SaveButton article={article} label /><ShareButton title={article.title} /></div></div>
    <article className="article-detail"><div className="detail-heading"><div className="detail-kicker"><Link href={`/?category=${encodeURIComponent(article.category)}`} className="category-pill selected" style={categoryStyle(article.category)}>{article.category}</Link><span>{article.company}</span><span className="meta-dot">·</span><span>{readingTime(article)} min de lectura</span></div><h1>{article.title}</h1><p className="detail-description">{article.description}</p><div className="article-byline"><div className="byline-avatar" aria-hidden="true">o.</div><div><strong>Radar Overfox</strong><span><time dateTime={article.publishedAt}>{formatDate(article.publishedAt, true)}</time><span className="byline-dot">·</span>Fuente: {article.sourceName}</span></div></div></div>
      <div className="detail-image"><ArticleImage src={article.imageUrl} alt={article.title} priority /><span className="image-company">{article.company}</span></div>
      <div className="reading-layout"><aside className="reading-sidebar"><span className="eyebrow">EN ESTA NOTICIA</span><div className="reading-tags">{article.tags.map((tag) => <Link key={tag} href={`/?q=${encodeURIComponent(tag)}`} className="tag-chip">{tag}</Link>)}</div><div className="reading-source"><span>Desde la fuente</span><a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">{article.sourceName}<Icon name="arrowUpRight" size={16} /></a></div></aside><div className="article-body">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="source-box"><div><span className="eyebrow">EL CONTEXTO COMPLETO</span><h2>Ve directo a la fuente.</h2><p>Consulta la publicación original de {article.sourceName}.</p></div><a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="primary-link">Leer fuente original<Icon name="arrowUpRight" size={18} /></a></div><div className="article-end"><span className="end-mark">✳</span><span>Una idea más en tu radar.</span><SaveButton article={article} label /></div></div></div>
    </article>{related.length > 0 && <section className="related-section"><div className="section-heading"><h2>Conecta los puntos<span className="heading-dot">.</span></h2><span>Más sobre {article.category}</span></div><div className="articles-grid">{related.map((item) => <ArticleCard article={item} key={item.id} />)}</div></section>}<SiteFooter /></main><BottomNav active="article" /></>;
}
