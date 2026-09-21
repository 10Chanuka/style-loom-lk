import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteLoader } from "@/components/layout/SiteLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Style Loom | Style That Speaks, Quality That Lasts",
  description: "Style Loom — Style That Speaks, Quality That Lasts. Shop premium printed T-shirts (unisex), Long Kurtas, and Short Kurtas in Sri Lanka. Fast islandwide delivery and WhatsApp order support.",
  keywords: ["Style Loom", "Clothing Sri Lanka", "Printed T Shirts Colombo", "Long Kurtas", "Short Kurtas"],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Style Loom | Style That Speaks, Quality That Lasts",
    description: "Shop premium printed T-shirts (unisex), Long Kurtas, and Short Kurtas in Sri Lanka.",
    url: "https://styleloom.lk",
    siteName: "Style Loom",
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>

  {/* Google Tag Manager (noscript) */}
  <noscript>
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-P6XPWDBJ"
      height="0"
      width="0"
      style={{
        display: "none",
        visibility: "hidden",
      }}
    />
  </noscript>


  {/* Google Tag Manager */}
  <Script
    id="google-tag-manager"
    strategy="afterInteractive"
  >
    {`
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),
        dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-P6XPWDBJ');
    `}
  </Script>


  <ToastProvider>
    <SiteLoader />

    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>

  </ToastProvider>

</body>
    </html>
  );
}
