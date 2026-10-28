"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import type { NewsArticle } from "@/lib/types";

export const SAVED_KEY = "overfox-news:saved:v1";
export function readSaved(): NewsArticle[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is NewsArticle => item && ["id", "slug", "title", "description", "content", "imageUrl", "company", "category", "sourceUrl", "sourceName", "publishedAt", "createdAt", "updatedAt"].every((key) => typeof item[key] === "string") && Array.isArray(item.tags) && item.tags.every((tag: unknown) => typeof tag === "string") && Number.isFinite(Date.parse(item.publishedAt)));
  } catch { return []; }
}
export function SaveButton({ article, label = false }: { article: NewsArticle; label?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const update = () => setSaved(readSaved().some((item) => item.id === article.id));
    update(); window.addEventListener("overfox:saved", update); window.addEventListener("storage", update);
    return () => { window.removeEventListener("overfox:saved", update); window.removeEventListener("storage", update); };
  }, [article.id]);
  function toggle() {
    try { const list = readSaved(); const exists = list.some((item) => item.id === article.id); localStorage.setItem(SAVED_KEY, JSON.stringify(exists ? list.filter((item) => item.id !== article.id) : [article, ...list].slice(0, 200))); window.dispatchEvent(new Event("overfox:saved")); setError(false); } catch { setError(true); }
  }
  return <button type="button" onClick={toggle} className={`icon-button save-button${saved ? " is-saved" : ""}${label ? " action-with-label" : ""}`} aria-pressed={saved} aria-label={error ? "No se pudo guardar. Intenta de nuevo" : saved ? `Quitar de guardados: ${article.title}` : `Guardar: ${article.title}`} title={error ? "Tu navegador no permite guardar" : saved ? "Quitar de guardados" : "Guardar para después"}><Icon name={saved ? "check" : "bookmark"} size={19} />{label && <span>{error ? "Intenta de nuevo" : saved ? "Guardado" : "Guardar"}</span>}</button>;
}

export function ShareButton({ title }: { title: string }) {
  const [message, setMessage] = useState("");
  async function share() {
    try {
      if (navigator.share) { await navigator.share({ title, url: window.location.href }); }
      else { await navigator.clipboard.writeText(window.location.href); setMessage("Enlace copiado"); }
    } catch (error) { if (!(error instanceof Error && error.name === "AbortError")) setMessage("No se pudo compartir"); }
  }
  return <button className="icon-button action-with-label" type="button" onClick={share} aria-label={message || "Compartir noticia"}><Icon name={message === "Enlace copiado" ? "check" : "share"} size={19} /><span aria-live="polite">{message || "Compartir"}</span></button>;
}
