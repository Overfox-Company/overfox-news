import Link from "next/link";
import { getNewsFeed, getCategories } from "@/lib/news";
import { Icon } from "@/components/icon";
import { ArticleCard } from "@/components/news/article-card";
import { NewsRow } from "@/components/news/news-row";
import { SiteHeader, SiteFooter, BottomNav } from "@/components/news/site-shell";
import { SearchFilters } from "@/components/news/search-filters";

export const dynamic = "force-dynamic";
type Params = { q?: string; category?: string; date?: string; page?: string };
export default async function Home({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.slice(0, 200) : "";
  const category = typeof params.category === "string" ? params.category.slice(0, 80) : "";
  const date = typeof params.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.date) && Number.isFinite(Date.parse(params.date)) && new Date(params.date).toISOString().slice(0, 10) === params.date ? params.date : "";
  const page = Math.max(1, Math.min(Number.parseInt(params.page || "1", 10) || 1, 10000));
  const now = new Date();
  let result: Awaited<ReturnType<typeof getNewsFeed>> | null = null;
  let availableCategories: string[] = [];
  try { [result, availableCategories] = await Promise.all([getNewsFeed({ q: query, category, date, page, limit: 12 }, now), getCategories()]); } catch { /* An explicit unavailable state is shown below. */ }
  const groups = result?.groups || [];
  const categories = Array.from(new Set(["Inteligencia artificial", "Desarrollo", "Productos", "Negocios", "Ciencia", ...availableCategories]));
  const filtered = Boolean(query || category || date);
  const editionDate = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "America/Caracas" }).format(now);
  const nextPage = (value: number) => { const next = new URLSearchParams(); if (query) next.set("q", query); if (category) next.set("category", category); if (date) next.set("date", date); next.set("page", String(value)); return `/?${next.toString()}#otras-noticias-heading`; };
  return <><SiteHeader /><main className="main-container">
    <section className="editorial-intro"><div className="edition-line"><span className="eyebrow"><span className="status-dot" />EL RADAR TECNOLÓGICO DE OVERFOX</span><time>{editionDate}</time></div><div className="intro-content"><h1>El futuro se mueve.<br /><span>No le pierdas el hilo.</span></h1><div className="intro-aside"><span className="intro-asterisk" aria-hidden="true">✳</span><p>Las noticias que importan.<br />El contexto que necesitas.<br /><span>Tu próxima gran idea empieza aquí.</span></p></div></div></section>
    <SearchFilters key={`${query}:${category}:${date}`} query={query} category={category} date={date} categories={categories} />
    <section className="news-section" id="noticias" aria-label="Noticias"><div className="section-heading"><h2>{filtered ? "En tu radar" : "El radar"}<span className="heading-dot">.</span></h2><span>{result ? `${result.total} ${result.total === 1 ? "noticia" : "noticias"}` : "Conectando con el radar"}<span className="section-divider">/</span>{filtered ? "Resultados" : "Ideas que marcan el ritmo"}</span></div>
      {!result ? <div className="empty-state"><span className="empty-icon"><Icon name="link" size={32} /></span><h2>El radar está reconectando</h2><p>No pudimos cargar las noticias. Intenta de nuevo en unos momentos.</p><Link href="/" className="primary-link">Volver a intentar <Icon name="arrowRight" size={18} /></Link></div> : !result.total ? <div className="empty-state"><span className="empty-icon"><Icon name={filtered ? "search" : "sun"} size={32} /></span><h2>{filtered ? "Por aquí todavía no hay señales" : "Todo empieza con una buena noticia"}</h2><p>{filtered ? "Prueba con otra palabra, categoría o fecha para encontrar lo que buscas." : "El radar está listo. Las noticias publicadas por el equipo aparecerán aquí."}</p><Link href={filtered ? "/" : "/admin"} className="primary-link">{filtered ? "Ver todas las noticias" : "Ir a administración"}<Icon name="arrowRight" size={18} /></Link></div> : <>
        {groups.map((group) => <NewsRow key={group.id} id={group.id} title={group.title} count={group.articles.length}>{group.articles.map((article) => <ArticleCard key={article.id} article={article} />)}</NewsRow>)}
        {result.pages > 1 && <nav className="pagination" aria-label="Páginas de otras noticias">{result.page > 1 ? <Link href={nextPage(result.page - 1)}><Icon name="arrowLeft" size={17} />Anterior</Link> : <span />}<span>Página {result.page} de {result.pages}</span>{result.page < result.pages ? <Link href={nextPage(result.page + 1)}>Siguiente<Icon name="arrowRight" size={17} /></Link> : <span />}</nav>}
      </>}
    </section><SiteFooter />
  </main><BottomNav /></>;
}
