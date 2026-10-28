"use client";
import Link from "next/link";
import { Icon } from "@/components/icon";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="main-container"><div className="empty-state not-found"><span className="empty-icon"><Icon name="link" size={32} /></span><h1>Una pausa en la señal.</h1><p>No pudimos cargar esta página. Vuelve a intentarlo en unos momentos.</p><button className="primary-link" type="button" onClick={reset}>Intentar de nuevo<Icon name="arrowRight" size={18} /></button><Link className="back-link" href="/">Volver al radar</Link></div></main>; }
