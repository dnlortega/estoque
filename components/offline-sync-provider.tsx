'use client';

import { useEffect, useState } from 'react';
import { syncOfflineActions, queueAction } from '@/lib/offline-actions';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Wifi, WifiOff, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const queuedCount = useLiveQuery(() => db.queuedActions.count()) || 0;

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            syncOfflineActions();
            toast.success('CONEXÃO RESTABELECIDA. SINCRONIZANDO...');
        };
        const handleOffline = () => {
            setIsOnline(false);
            toast.error('VOCÊ ESTÁ OFFLINE. AS ALTERAÇÕES SERÃO SALVAS LOCALMENTE.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Tentar sincronizar ao carregar se estiver online
        if (navigator.onLine) {
            syncOfflineActions();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <>
            {children}

            {/* Indicador de Status Offline/Sincronização */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
                {/* Só mostra o aviso vermelho se REALMENTE estiver offline */}
                {!isOnline && (
                    <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse border-2 border-white/20">
                        <WifiOff size={18} />
                        <span className="text-sm font-bold tracking-tighter">VOCÊ ESTÁ SEM INTERNET</span>
                    </div>
                )}

                {/* Mostra o botão de sincronização se houver itens no cache, independente de estar online ou não */}
                {queuedCount > 0 && (
                    <Button
                        variant="secondary"
                        className="shadow-xl border-2 border-primary animate-bounce font-black text-xs h-11 px-6 rounded-full"
                        onClick={() => syncOfflineActions()}
                    >
                        <RefreshCcw size={18} className="mr-2 animate-spin-slow" />
                        {queuedCount} {queuedCount === 1 ? 'AÇÃO PENDENTE' : 'AÇÕES PENDENTES'}
                    </Button>
                )}
            </div>
        </>
    );
}
