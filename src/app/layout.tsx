import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
const dmSans = localFont({
  src: "../../public/fonts/dm-sans/DMSans-Variable.ttf",
  weight: "100 1000", style: "normal", variable: "--font-dm-sans", display: "swap",
});
const jetbrainsMono = localFont({
  src: "../../public/fonts/jetbrains-mono/JetBrainsMono-Variable.ttf",
  weight: "100 800", style: "normal", variable: "--font-jetbrains-mono", display: "swap", preload: false,
});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://news.overfox.net"),
  title: {default:"Overfox News — Tu radar tecnológico", template:"%s · Overfox News"},
  description:"Las noticias de tecnología que importan, en un solo lugar. El radar de inteligencia artificial, desarrollo y producto del equipo Overfox.",
  applicationName:"Overfox News", icons:{icon:"/icon.svg"},
};
export const viewport: Viewport = {width:"device-width",initialScale:1,themeColor:"#000000",colorScheme:"dark"};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es" className={`${dmSans.variable} ${jetbrainsMono.variable}`}><body>{children}</body></html>;
}
