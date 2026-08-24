import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Style Loom | Style That Speaks, Quality That Lasts",
  description: "Style Loom — Style That Speaks, Quality That Lasts. Shop premium printed T-shirts (unisex), women Kurtas, and tailored Blouses in Sri Lanka. Custom clothing, fast islandwide delivery, and WhatsApp order support.",
  keywords: ["Style Loom", "Clothing Sri Lanka", "Printed T Shirts Colombo", "Women Kurtas", "Tailored Blouses"],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Style Loom | Style That Speaks, Quality That Lasts",
    description: "Shop premium printed T-shirts (unisex), women Kurtas, and tailored Blouses in Sri Lanka.",
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
        <ToastProvider>
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
