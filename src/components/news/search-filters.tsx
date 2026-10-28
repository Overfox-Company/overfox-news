"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";

export function SearchFilters({ query, category, date, categories }: { query: string; category: string; date: string; categories: string[] }) {
  const router = useRouter();
  const [search, setSearch] = useState(query);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const dateRef = useRef<HTMLInputElement>(null);
  function navigate(updates: { q?: string; category?: string; date?: string }) {
    const values = { q: search.trim(), category, date, ...updates }; const params = new URLSearchParams(); Object.entries(values).forEach(([key, value]) => { if (value) params.set(key, value); });
    startTransition(() => router.push(`/${params.size ? `?${params.toString()}` : ""}#noticias`, { scroll: false }));
  }
  return <section className={`discovery-tools${pending ? " is-pending" : ""}`} id="buscar" aria-label="Buscar y filtrar noticias">
    <div className="search-row"><form className="news-search" onSubmit={(event) => { event.preventDefault(); navigate({ q: search }); }}><Icon name="search" size={21} /><input id="news-search" name="q" aria-label="Buscar noticias" placeholder="Busca una noticia, empresa o tema..." value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button type="button" className="search-clear" aria-label="Limpiar búsqueda" onClick={() => { setSearch(""); navigate({ q: "" }); }}><Icon name="close" size={17} /></button>}<button type="submit" className="search-submit" aria-label="Buscar"><Icon name="arrowRight" size={19} /></button></form>
      <div className="date-filter"><button type="button" className={`date-button${date ? " has-date" : ""}`} onClick={() => setCalendarOpen(!calendarOpen)} aria-label={date ? `Filtrar por fecha: ${date}` : "Filtrar por fecha"} aria-expanded={calendarOpen} aria-controls="date-panel"><Icon name="calendar" size={20} /><span>{date ? new Intl.DateTimeFormat("es", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`)) : "Por fecha"}</span></button>
        {calendarOpen && <div className="date-panel" id="date-panel"><label htmlFor="filter-date">Elige una fecha</label><input ref={dateRef} id="filter-date" type="date" value={date} onChange={(event) => { navigate({ date: event.target.value }); setCalendarOpen(false); }} /><button type="button" onClick={() => { navigate({ date: "" }); setCalendarOpen(false); }}>Ver todas las fechas</button></div>}
      </div>
    </div>
    <div className="category-row" aria-label="Categorías"><button type="button" className={`category-pill${!category ? " selected" : ""}`} onClick={() => navigate({ category: "" })}><Icon name="grid" size={16} />Todo el radar</button>{categories.map((item) => <button key={item} type="button" className={`category-pill${category === item ? " selected" : ""}`} onClick={() => navigate({ category: item })}>{item}</button>)}</div>
    {(query || category || date) && <div className="active-filters"><span>Filtrando{query ? ` por “${query}”` : " noticias"}{category ? ` · ${category}` : ""}{date ? ` · ${date}` : ""}</span><button onClick={() => { setSearch(""); navigate({ q: "", category: "", date: "" }); }}>Limpiar filtros <Icon name="close" size={13} /></button></div>}
    {pending && <span className="sr-only" role="status">Buscando noticias…</span>}
  </section>;
}
