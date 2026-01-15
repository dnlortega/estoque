import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-muted p-6">
                <FileQuestion className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">PÁGINA NÃO ENCONTRADA</h2>
                <p className="text-sm text-muted-foreground">
                    Ocorreu um erro ou a página que você procura não existe.
                </p>
            </div>
            <Link href="/">
                <Button variant="outline">VOLTAR AO INÍCIO</Button>
            </Link>
        </div>
    )
}
