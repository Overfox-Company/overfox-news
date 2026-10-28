import { SavedFeed } from "@/components/news/saved-feed";
import { SiteHeader, SiteFooter, BottomNav } from "@/components/news/site-shell";
export const metadata = { title: "Tus guardados", description: "Tu colección personal de noticias de tecnología en Overfox News." };
export default function SavedPage() { return <><SiteHeader active="saved" /><main className="main-container"><section className="saved-intro"><span className="eyebrow">TU BIBLIOTECA PERSONAL</span><h1>Para leer.<br /><span>Para volver.</span></h1><p>Ideas interesantes, a tu ritmo.</p></section><SavedFeed /><SiteFooter /></main><BottomNav active="saved" /></>; }
