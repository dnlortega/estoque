import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "ESTOQUE+ | SISTEMA DE GESTÃO DE ESTOQUE E CONSIGNAÇÃO",
  description: "GERENCIE SEU ESTOQUE E CONSIGNAÇÕES DE FORMA PROFISSIONAL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300">
              <AppSidebar />
              <div className="flex flex-col flex-1 min-w-0">
                <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-8 border-b transition-colors bg-card/50 backdrop-blur-sm sticky top-0 z-10 uppercase font-black tracking-widest text-[10px]">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="h-9 w-9" />
                    <div className="h-4 w-[1px] bg-border hidden md:block" />
                    <span className="font-black text-xs hidden md:block tracking-[0.5em] scale-x-150 origin-left ml-2">ESTOQUE+</span>
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
            </div>
            <Toaster position="top-right" />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
