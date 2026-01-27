import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    default: "ESTOQUE+ | SISTEMA DE GESTÃO PROFISSIONAL",
    template: "%s | ESTOQUE+"
  },
  description: "Gerenciamento inteligente de estoque central e produtos em consignação. Modo offline e rastreamento GPS integrado.",
  keywords: ["estoque", "gestão", "consignação", "vendas", "logística", "controle de estoque"],
  authors: [{ name: "ESTOQUE+" }],
  creator: "ESTOQUE+",
  publisher: "ESTOQUE+",
  manifest: "/manifest.json",
  icons: {
    apple: "/logo.png",
    icon: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Estoque+",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

import { OfflineSyncProvider } from "@/components/offline-sync-provider";
import { PWAHandler } from "@/components/pwa-handler";

import Link from "next/link";
import { Info } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-sans antialiased selection:bg-primary/10 text-[15px]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PWAHandler />
          <OfflineSyncProvider>
            <div className="flex h-screen w-full bg-background text-foreground transition-colors duration-300 overflow-hidden">
              <div className="flex flex-col flex-1 min-w-0 pb-20 h-full">
                <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-8 border-b transition-colors bg-card/50 backdrop-blur-sm sticky top-0 z-10 font-bold tracking-tight text-sm">
                  <div className="flex items-center gap-4">
                    <Link href="/" className="text-lg font-black text-primary hover:opacity-80 transition-opacity tracking-tighter">ESTOQUE+</Link>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                    <span className="hidden sm:block opacity-50 italic">SISTEMA INTEGRADO</span>
                    <div className="flex items-center gap-2 border-l pl-4">
                      <Link href="/sobre" title="SOBRE O SISTEMA" className="hover:text-primary transition-colors">
                        <Info className="h-5 w-5" />
                      </Link>
                      <ThemeToggle />
                    </div>
                  </div>
                </header>
                <main className="flex-1 overflow-auto p-4 md:p-8">
                  {children}
                </main>
              </div>

              <BottomNav />
            </div>
            <Toaster position="top-right" />
          </OfflineSyncProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
