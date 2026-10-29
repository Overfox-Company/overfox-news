"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icon";
import GradualBlur from "@/components/ui/gradual-blur/GradualBlur";

export function NewsRow({ id, title, count, children }: {
  id: string; title: string; count: number; children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ progress: 0, fraction: 1, overflow: false, start: true, end: true });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const limit = track.scrollWidth - track.clientWidth;
      const offset = Math.max(0, Math.min(track.scrollLeft, limit));
      setScroll({
        progress: limit > 1 ? offset / limit : 0,
        fraction: track.clientWidth / Math.max(track.scrollWidth, 1),
        overflow: limit > 1, start: offset <= 1, end: offset >= limit - 1,
      });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    for (const child of track.children) observer.observe(child);
    return () => { track.removeEventListener("scroll", update); observer.disconnect(); };
  }, [count]);

  function move(direction: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(track).columnGap) : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <section className="news-day" aria-labelledby={`${id}-heading`}>
    <div className="section-heading news-day-heading">
      <div className="news-day-title"><h2 id={`${id}-heading`}>{title}</h2><span className="news-day-count">{count}</span></div>
      {scroll.overflow && <div className="news-row-controls">
        <button className="icon-button" type="button" aria-label={`Noticias anteriores: ${title}`} aria-controls={`${id}-track`} disabled={scroll.start} onClick={() => move(-1)}><Icon name="arrowLeft" size={19} /></button>
        <button className="icon-button" type="button" aria-label={`Más noticias: ${title}`} aria-controls={`${id}-track`} disabled={scroll.end} onClick={() => move(1)}><Icon name="arrowRight" size={19} /></button>
      </div>}
    </div>
    {count ? <>
      <div className="news-row-viewport">
        <div ref={trackRef} id={`${id}-track`} className="news-row-track" role="region" aria-label={`Noticias de ${title.toLowerCase()}`} tabIndex={0}>{children}</div>
        <GradualBlur position="left" width="48px" strength={0.7} layers={5} tint="var(--background)" autoHide container={trackRef} zIndex={2} />
        <GradualBlur position="right" width="48px" strength={0.7} layers={5} tint="var(--background)" autoHide container={trackRef} zIndex={2} />
      </div>
      {scroll.overflow && <div className="news-row-footer"><span>Desliza para explorar</span><div className="news-row-progress" role="progressbar" aria-label={`Desplazamiento de ${title.toLowerCase()}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(scroll.progress * 100)}><span style={{ width: `${scroll.fraction * 100}%`, left: `${scroll.progress * (1 - scroll.fraction) * 100}%` }} /></div></div>}
    </> : <p className="news-day-empty">{id === "hoy" ? "Todavía no hay noticias de hoy." : id === "ayer" ? "No hay noticias de ayer." : "No hay otras noticias para mostrar."}</p>}
  </section>;
}
