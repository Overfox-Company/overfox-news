import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
const outfit = localFont({src: [
  {path: "../../public/fonts/outfit/Outfit-Regular.ttf", weight:"400", style:"normal"},
  {path: "../../public/fonts/outfit/Outfit-Medium.ttf", weight:"500", style:"normal"},
  {path: "../../public/fonts/outfit/Outfit-SemiBold.ttf", weight:"600", style:"normal"},
  {path: "../../public/fonts/outfit/Outfit-Bold.ttf", weight:"700", style:"normal"}
], variable:"--font-outfit", display:"swap"});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://news.overfox.net"),
  title: {default:"Overfox News — Tu radar tecnológico", template:"%s · Overfox News"},
  description:"Las noticias de tecnología que importan, en un solo lugar. El radar de inteligencia artificial, desarrollo y producto del equipo Overfox.",
  applicationName:"Overfox News", icons:{icon:"/icon.svg"},
};
export const viewport: Viewport = {width:"device-width",initialScale:1,themeColor:"#111210"};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es" className={outfit.variable}><body>{children}</body></html>;
}
