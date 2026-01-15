import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

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
  title: "Estoque+ | Sistema de Gestão de Estoque e Consignação",
  description: "Gerencie seu estoque e consignações de forma profissional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto p-4 md:p-8">
              <div className="flex items-center gap-2 mb-6 md:hidden">
                <SidebarTrigger />
                <span className="font-bold text-lg">Estoque+</span>
              </div>
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </SidebarProvider>
      </body>
    </html>
  );
}
