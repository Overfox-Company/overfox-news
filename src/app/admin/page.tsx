import {redirect} from 'next/navigation';
import {getAdminSession} from '@/lib/auth';
import {getNews} from '@/lib/news';
import {AdminDashboard} from '@/components/admin/dashboard';
export const dynamic='force-dynamic';
export const metadata={title:'Panel editorial',robots:{index:false,follow:false}};
export default async function AdminPage(){const session=await getAdminSession();if(!session)redirect('/admin/login');const data=await getNews({limit:100});return <AdminDashboard articles={data.articles} email={session.email}/>}
