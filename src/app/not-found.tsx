import Link from "next/link";
import { Icon } from "@/components/icon";
import { SiteHeader, BottomNav } from "@/components/news/site-shell";
export default function NotFound() { return <><SiteHeader /><main className="main-container"><div className="empty-state not-found"><span className="error-number">404<span>.</span></span><h1>Esta noticia salió del radar.</h1><p>Puede que el enlace haya cambiado o que la noticia ya no esté disponible.</p><Link href="/" className="primary-link">Volver al radar<Icon name="arrowRight" size={18} /></Link></div></main><BottomNav /></>; }
