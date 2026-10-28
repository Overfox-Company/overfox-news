import Link from "next/link";
import { Brand } from "@/components/brand";
import { Icon } from "@/components/icon";

export function SiteHeader({ active = "home" }: { active?: "home" | "saved" | "article" }) {
  return <header className="site-header"><div className="site-header-inner">
    <Brand />
    <nav className="desktop-nav" aria-label="Navegación principal">
      <Link className={active === "home" ? "nav-current" : ""} href="/">El radar</Link>
      <Link className={active === "saved" ? "nav-current" : ""} href="/guardados">Guardados</Link>
    </nav>
    <div className="header-end"><span className="team-label"><span className="status-dot" />Un paso adelante, juntos.</span><Link href="/admin" className="icon-button header-admin" aria-label="Administración"><Icon name="settings" size={19} /></Link></div>
  </div></header>;
}

export function BottomNav({ active = "home" }: { active?: "home" | "saved" | "article" }) {
  return <nav className="bottom-nav" aria-label="Navegación móvil">
    <Link href="/" className={active === "home" ? "bottom-active" : ""}><Icon name="home" size={21} /><span>Radar</span></Link>
    <Link href="/#buscar"><Icon name="search" size={21} /><span>Explorar</span></Link>
    <Link href="/guardados" className={active === "saved" ? "bottom-active" : ""}><Icon name="bookmark" size={21} /><span>Guardados</span></Link>
    <Link href="/admin"><Icon name="settings" size={21} /><span>Admin</span></Link>
  </nav>;
}

export function SiteFooter() {
  return <footer className="site-footer"><Brand compact /><p>La tecnología avanza. Nosotros te contamos.</p><span>Hecho para el equipo Overfox <span className="footer-star">✳</span></span></footer>;
}
