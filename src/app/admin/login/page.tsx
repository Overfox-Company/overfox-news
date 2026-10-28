import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/login-form';
export const metadata={title:'Acceso editorial',robots:{index:false,follow:false}};
export default function LoginPage(){return <Suspense><LoginForm/></Suspense>}
