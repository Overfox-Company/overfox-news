"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import type { NewsArticle } from "@/lib/types";
import { readSaved } from "./article-actions";
import { ArticleCard } from "./article-card";
export function SavedFeed() {
  const [articles, setArticles] = useState<NewsArticle[] | null>(null);
  useEffect(() => { const update = () => setArticles(readSaved()); update(); window.addEventListener("overfox:saved", update); window.addEventListener("storage", update); return () => { window.removeEventListener("overfox:saved", update); window.removeEventListener("storage", update); }; }, []);
  if (!articles) return <div className="saved-loading" role="status">Abriendo tus guardados…</div>;
  if (!articles.length) return <div className="empty-state"><span className="empty-icon"><Icon name="bookmark" size={32} /></span><h2>Las buenas ideas merecen volver.</h2><p>Toca el marcador en una noticia y guárdala aquí para leerla después. Tus guardados se conservan en este navegador.</p><Link href="/" className="primary-link">Explorar el radar<Icon name="arrowRight" size={18} /></Link></div>;
  return <><div className="section-heading"><h2>Tu colección<span className="heading-dot">.</span></h2><span>{articles.length} {articles.length === 1 ? "noticia guardada" : "noticias guardadas"}</span></div><div className="articles-grid">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</div><p className="saved-note">Guardados en este navegador. La noticia completa muestra siempre la versión publicada.</p></>;
}
