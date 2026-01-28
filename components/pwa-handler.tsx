'use client';

import { useEffect, useState } from 'react';
import { Download, X, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAHandler() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const routes = ['/', '/produtos', '/vendedores', '/consignacao', '/historico', '/sobre'];
        let loaded = 0;

        const prefetch = async () => {
            setIsDownloading(true);
            for (const route of routes) {
                try {
                    await fetch(route);
                    loaded++;
                    setDownloadProgress((loaded / routes.length) * 100);
                } catch (e) {
                    console.error('Erro ao baixar rota:', route);
                }
            }
            setTimeout(() => {
                setIsDownloading(false);
                setIsComplete(true);
                // Esconder o banner de sucesso após 5 segundos
                setTimeout(() => setIsComplete(false), 5000);
            }, 800);
        };

        prefetch();

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
            setTimeout(() => setShowBanner(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

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

    return (
        <AnimatePresence>
            {/* Banner de Download/Sincronização */}
            {isDownloading && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] w-[90vw] max-w-md"
                >
                    <div className="bg-black/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                        <div className="relative">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">
                                {Math.round(downloadProgress)}%
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white text-xs font-black tracking-tighter uppercase">OTIMIZANDO SISTEMA</h4>
                            <p className="text-[10px] text-white/60 font-medium uppercase italic">Preparando acesso offline rápido...</p>
                            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                                <motion.div
                                    className="bg-primary h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${downloadProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Banner de Conclusão */}
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-[110]"
                >
                    <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-xs font-black uppercase tracking-tight">SISTEMA PRONTO PARA USO OFFLINE</span>
                    </div>
                </motion.div>
            )}

            {/* Banner de Instalação */}
            {showBanner && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="fixed top-20 right-4 z-[100] w-[calc(100vw-32px)] md:w-80"
                >
                    <div className="bg-primary text-primary-foreground p-5 rounded-3xl shadow-2xl border border-white/20 uppercase overflow-hidden relative">
                        {/* Decoração de Fundo */}
                        <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                            <ShieldCheck size={120} />
                        </div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                                    <Download className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm tracking-tighter">INSTALAR APP</h3>
                                    <p className="text-[10px] opacity-70 font-bold">ESTOQUE+ NO SEU CELULAR</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowBanner(false)}
                                className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-[11px] mb-5 font-semibold leading-relaxed opacity-90 relative z-10">
                            BAIXE O APLICATIVO PARA TER ACESSO INSTANTÂNEO, ESTABILIDADE TOTAL E ECONOMIA DE DADOS.
                        </p>

                        <Button
                            onClick={handleInstall}
                            className="w-full bg-white text-primary hover:bg-white/90 font-black text-xs py-6 rounded-2xl transition-all active:scale-95 shadow-lg relative z-10"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            INSTALAR AGORA
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
