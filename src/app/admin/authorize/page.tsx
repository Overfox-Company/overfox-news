import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { validateAuthorizationRequest, OAuthError } from "@/lib/oauth";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import "@/components/admin/admin.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Autorizar agente · Overfox News", robots: { index: false, follow: false } };
export default async function AuthorizePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const values = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (typeof value === "string") params.set(key, value);
  const session = await getAdminSession();
  if (!session) redirect(`/admin/login?next=${encodeURIComponent(`/admin/authorize?${params}`)}`);
  let auth;
  try { auth = await validateAuthorizationRequest(params); }
  catch (error) {
    return <main className="login-shell"><section className="login-panel"><Brand/><h1>No se pudo conectar</h1><p className="admin-error">{error instanceof OAuthError ? error.message : "La solicitud no está disponible. Vuelve a iniciar la conexión desde tu agente."}</p><Link href="/admin">Volver al panel</Link></section></main>;
  }
  const canWrite = auth.scope.split(" ").includes("news:write");
  const hidden = { client_id: auth.clientId, redirect_uri: auth.redirectUri, response_type: "code", code_challenge: auth.challenge, code_challenge_method: "S256", resource: auth.resource, scope: auth.scope, state: auth.state };
  return <main className="login-shell"><section className="login-panel">
    <Brand/>
    <p className="admin-eyebrow" style={{marginTop: 32}}>CONEXIÓN MCP</p>
    <h1>Tu equipo.<br/><span>Un agente más.</span></h1>
    <p className="admin-muted"><strong style={{color: "var(--foreground)"}}>{auth.client.clientName}</strong> solicita acceso a Overfox News.</p>
    <ul style={{display: "grid", gap: 12, paddingLeft: 20, margin: "24px 0", lineHeight: 1.6}}>
      <li>Buscar y consultar las noticias publicadas.</li>
      {canWrite && <li>Publicar y editar noticias, con empresa, categoría, etiquetas, imagen y fuente.</li>}
    </ul>
    <p className="admin-muted">Podrás revocar esta conexión cuando quieras desde el panel. El nombre del cliente lo proporciona el agente que inició la solicitud.</p>
    <p className="admin-muted" style={{fontSize: 13, overflowWrap: "anywhere"}}>Retorno a: {new URL(auth.redirectUri).host}</p>
    <form action="/oauth/authorize" method="post">
      {Object.entries(hidden).map(([name, value]) => <input key={name} type="hidden" name={name} value={value}/>)}
      <Button type="submit" name="decision" value="allow" className="w-full">Autorizar {canWrite ? "publicación" : "lectura"}</Button>
      <Button type="submit" name="decision" value="deny" variant="outline" className="w-full" style={{marginTop: 12}}>Cancelar</Button>
    </form>
    <p className="login-note">Sesión de {session.email}</p>
  </section></main>;
}
