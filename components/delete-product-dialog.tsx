'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2, AlertCircle, Calendar, Hash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getProductWithMovements } from '@/app/actions';
import { queueAction } from '@/lib/offline-actions';

interface DeleteProductDialogProps {
    productId: string;
    productName: string;
}

export function DeleteProductDialog({ productId, productName }: DeleteProductDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [productDetails, setProductDetails] = useState<any>(null);
    const router = useRouter();

    // Carregar detalhes ao abrir o diálogo ou quando o ID mudar
    const loadDetails = async () => {
        try {
            setIsLoadingDetails(true);
            const details = await getProductWithMovements(productId);
            setProductDetails(details);
        } catch (error) {
            console.error("Erro ao carregar detalhes:", error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    async function onDelete() {
        try {
            setIsDeleting(true);
            const res = await queueAction('deleteProductAndMovements', [productId]);
            if (res.success) {
                toast.success('Produto e todo seu histórico excluídos com sucesso!');
                router.refresh();
            }
        } catch (error) {
            toast.error('Erro ao excluir produto.');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    }

    const hasMovements = productDetails?.movements?.length > 0;
    const hasConsignments = productDetails?.consignments?.length > 0;

    return (
        <AlertDialog onOpenChange={(open) => open && loadDetails()}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Excluir {productName}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                        <div>
                            Esta ação excluirá permanentemente o produto e <strong>TODO o histórico vinculado</strong> (movimentações e consignações).
                        </div>

                        {(hasMovements || hasConsignments) && (
                            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                    Registros vinculados que serão perdidos:
                                </h4>

                                <ScrollArea className="h-[250px] pr-4">
                                    <div className="space-y-4">
                                        {hasConsignments && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                                                    <User className="h-3 w-3" /> Consignações Ativas
                                                </p>
                                                {productDetails.consignments.map((c: any) => (
                                                    <div key={c.id} className="flex items-center justify-between text-sm bg-background p-2 rounded border">
                                                        <span>{c.seller.name}</span>
                                                        <Badge variant="secondary">{c.quantity} un.</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {hasMovements && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                                                    <History className="h-3 w-3" /> Histórico de Movimentações
                                                </p>
                                                {productDetails.movements.map((m: any) => (
                                                    <div key={m.id} className="flex items-center justify-between text-xs bg-background p-2 rounded border">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-medium">
                                                                {m.type === 'ENTRY' && 'Entrada'}
                                                                {m.type === 'TRANSFER' && `Transf. para ${m.seller.name}`}
                                                                {m.type === 'RETURN' && `Devol. de ${m.seller.name}`}
                                                                {m.type === 'SALE' && `Venda de ${m.seller.name}`}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                {format(new Date(m.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                            </span>
                                                        </div>
                                                        <Badge variant="outline">{m.quantity} un.</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}

                        {!isLoadingDetails && !hasMovements && !hasConsignments && (
                            <p className="text-green-600 font-medium italic">Nenhum registro vinculado encontrado. Este produto pode ser removido de forma limpa.</p>
                        )}

                        {isLoadingDetails && <div className="animate-pulse h-20 bg-muted rounded-md" />}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isDeleting || isLoadingDetails}
                    >
                        {isDeleting ? 'Excluindo tudo...' : 'Confirmar Exclusão Total'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Pequeno mock de ícone caso History falhe no import
function History(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
        </svg>
    );
}
