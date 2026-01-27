'use client';

import { WifiOff, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OfflinePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 uppercase">
            <div className="bg-destructive/10 p-6 rounded-full mb-6">
                <WifiOff className="h-12 w-12 text-destructive animate-pulse" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">VOCÊ ESTÁ OFFLINE</h1>
            <p className="text-muted-foreground text-sm font-medium mb-8 max-w-xs">
                ESTA PÁGINA AINDA NÃO FOI CARREGADA NO SEU DISPOSITIVO E VOCÊ NÃO TEM CONEXÃO COM A INTERNET NO MOMENTO.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <Button asChild variant="default" className="font-black py-6">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        VOLTAR AO INÍCIO
                    </Link>
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="font-black py-6">
                    TENTAR RECONECTAR
                </Button>
            </div>
        </div>
    );
}
