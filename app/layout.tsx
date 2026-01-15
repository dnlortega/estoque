import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "ESTOQUE+ | SISTEMA DE GESTÃO DE ESTOQUE E CONSIGNAÇÃO",
  description: "GERENCIE SEU ESTOQUE E CONSIGNAÇÕES DE FORMA PROFISSIONAL",
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
  formatDetection: {
    telephone: false,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased selection:bg-primary/10`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen w-full bg-background text-foreground transition-colors duration-300 overflow-hidden">
            <div className="flex flex-col flex-1 min-w-0 pb-20 h-full">
              <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-8 border-b transition-colors bg-card/50 backdrop-blur-sm sticky top-0 z-10 uppercase font-black tracking-widest text-[10px]">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-primary">ESTOQUE+</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-black">
                  <span className="hidden sm:block opacity-50">GERENCIAMENTO PROFISSIONAL</span>
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-1 overflow-auto p-4 md:p-8">
                {children}
              </main>
            </div>

            <BottomNav />
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
