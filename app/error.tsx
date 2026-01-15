'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
                <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">ALGO DEU ERRADO</h2>
                <p className="text-sm text-muted-foreground">
                    Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.
                </p>
            </div>
            <Button onClick={() => reset()} variant="outline">
                TENTAR NOVAMENTE
            </Button>
        </div>
    )
}
