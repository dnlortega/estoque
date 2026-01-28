'use client';

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, WifiOff, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        console.error(error);
        setIsOffline(!navigator.onLine);

        // Auto-retry se for erro de carregamento e estivermos offline
        if (!navigator.onLine) {
            const timer = setTimeout(() => reset(), 1000);
            return () => clearTimeout(timer);
        }
    }, [error, reset])

    return (
        <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center p-6 uppercase">
            <div className="rounded-full bg-destructive/10 p-8 animate-pulse">
                {isOffline ? (
                    <WifiOff className="h-12 w-12 text-destructive" />
                ) : (
                    <AlertTriangle className="h-12 w-12 text-destructive" />
                )}
            </div>

            <div className="space-y-3 max-w-md">
                <h2 className="text-3xl font-black tracking-tighter">
                    {isOffline ? 'SISTEMA OFFLINE' : 'ERRO DE CARREGAMENTO'}
                </h2>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    {isOffline
                        ? 'OCORREU UM PROBLEMA AO CARREGAR OS DADOS REAIS. TENTANDO REATIVAR O MODO DE SEGURANÇA OFFLINE...'
                        : 'NÃO FOI POSSÍVEL PROCESSAR ESTA PÁGINA NO MOMENTO.'}
                </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <Button onClick={() => reset()} className="font-black py-6 gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    TENTAR RECONECTAR
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'} className="font-black py-6">
                    VOLTAR AO INÍCIO
                </Button>
            </div>
        </div>
    )
}
