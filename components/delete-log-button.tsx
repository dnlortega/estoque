'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteLog } from '@/app/actions';

interface DeleteLogButtonProps {
    logId: string;
}

export function DeleteLogButton({ logId }: DeleteLogButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        try {
            await deleteLog(logId);
            toast.success('MOVIMENTAÇÃO EXCLUÍDA COM SUCESSO!');
        } catch (error) {
            toast.error('ERRO AO EXCLUIR MOVIMENTAÇÃO.');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="uppercase font-bold">
                <AlertDialogHeader>
                    <AlertDialogTitle>EXCLUIR MOVIMENTAÇÃO?</AlertDialogTitle>
                    <AlertDialogDescription>
                        ESTA AÇÃO NÃO PODE SER DESFEITA. O REGISTRO SERÁ REMOVIDO PERMANENTEMENTE DO HISTÓRICO.
                        NOTA: ISSO NÃO REVERTE O ESTOQUE AUTOMATICAMENTE.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>CANCELAR</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {isDeleting ? 'EXCLUINDO...' : 'CONFIRMAR EXCLUSÃO'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
