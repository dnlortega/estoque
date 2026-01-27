'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PWAHandler() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Pre-fetch de rotas principais para garantir que estejam no cache do SW
        const routes = ['/', '/produtos', '/vendedores', '/consignacao', '/historico', '/sobre'];
        routes.forEach(route => {
            fetch(route).catch(() => { });
        });

        // Lógica de Instalação
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
            // Mostrar o banner após alguns segundos se não estiver instalado
            setTimeout(() => setShowBanner(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Verificar se já está instalado
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowBanner(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;

        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === 'accepted') {
            setInstallPrompt(null);
            setShowBanner(false);
            toast.success('INSTALANDO ESTOQUE+...');
        }
    };

    if (!showBanner) return null;

    return (
        <div className="fixed top-20 left-4 right-4 z-[100] md:left-auto md:right-8 md:w-80">
            <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-4 duration-500 uppercase">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Download className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-sm tracking-tighter">INSTALAR APP</h3>
                            <p className="text-[10px] opacity-80 font-bold">ACESSO RÁPIDO E OFFLINE</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="hover:bg-white/10 p-1 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <p className="text-[11px] mb-4 font-medium leading-relaxed opacity-90">
                    ADICIONE O ESTOQUE+ À SUA TELA INICIAL PARA UMA EXPERIÊNCIA DE APLICATIVO COMPLETA.
                </p>
                <Button
                    onClick={handleInstall}
                    className="w-full bg-white text-primary hover:bg-white/90 font-black text-xs py-5 rounded-xl transition-all active:scale-95"
                >
                    INSTALAR AGORA
                </Button>
            </div>
        </div>
    );
}
