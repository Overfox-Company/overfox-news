'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter,useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Icon} from '@/components/icon';
import './admin.css';
export function LoginForm(){
 const router=useRouter(),params=useSearchParams();
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function login(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError('');const form=new FormData(e.currentTarget);try{const response=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:form.get('email'),password:form.get('password')})});const data=await response.json();if(!response.ok)throw new Error(data.error||'No se pudo iniciar sesión');const next=params.get('next');router.push(next?.startsWith('/')&&!next.startsWith('//')&&!next.includes('\\')?next:'/admin');router.refresh()}catch(e){setError(e instanceof Error?e.message:'No se pudo conectar')}finally{setBusy(false)}}
 return <main className="login-shell"><Link href="/" className="admin-back"><Icon name="arrowLeft" size={18}/> Volver a las noticias</Link><section className="login-panel"><img src="/icon.svg" alt="" width="54" height="54"/><p className="admin-eyebrow">OVERFOX NEWS / EDITORIAL</p><h1>Lo que viene,<br/><span>empieza aquí.</span></h1><p className="admin-muted">Accede para publicar noticias y conectar a tus agentes.</p><form onSubmit={login}><label>Correo electrónico<Input name="email" type="email" autoComplete="username" placeholder="tu@overfox.net" required/></label><label>Contraseña<Input name="password" type="password" autoComplete="current-password" placeholder="Tu contraseña" required/></label>{error&&<p role="alert" className="admin-error">{error}</p>}<Button disabled={busy} type="submit" className="w-full">{busy?'Entrando…':'Entrar al panel'}<Icon name="arrowRight" size={18}/></Button></form><div className="login-note"><span className="status-dot"/> La lectura de noticias siempre es pública.</div></section><p className="login-footer">Una publicación de Overfox. Siempre un paso adelante.</p></main>
}
