'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Undo2, Banknote } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { returnFromSeller, sellFromSeller } from '@/app/actions';

interface ConsignmentActionsProps {
    productId: string;
    sellerId: string;
    productName: string;
    currentQuantity: number;
}

export function ConsignmentActions({
    productId,
    sellerId,
    productName,
    currentQuantity,
}: ConsignmentActionsProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'RETURN' | 'SALE' | null>(null);
    const [amount, setAmount] = useState('1');
    const router = useRouter();

    async function handleAction() {
        const qty = parseInt(amount);
        if (isNaN(qty) || qty <= 0 || qty > currentQuantity) {
            toast.error('Quantidade inválida.');
            return;
        }

        try {
            if (mode === 'RETURN') {
                await returnFromSeller(productId, sellerId, qty);
                toast.success(`${qty} unidade(s) de ${productName} retornadas ao estoque.`);
            } else if (mode === 'SALE') {
                await sellFromSeller(productId, sellerId, qty);
                toast.success(`Venda de ${qty} unidade(s) de ${productName} registrada!`);
            }
            setOpen(false);
            setMode(null);
            setAmount('1');
            router.refresh();
        } catch (error) {
            toast.error('Erro ao processar ação.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex gap-2">
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => setMode('RETURN')}
                    >
                        <Undo2 className="h-3.5 w-3.5" />
                        Devolver
                    </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-1 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                        onClick={() => setMode('SALE')}
                    >
                        <Banknote className="h-3.5 w-3.5" />
                        Baixa Venda
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'RETURN' ? 'Devolver Produto' : 'Registrar Venda'}
                    </DialogTitle>
                    <DialogDescription>
                        {productName} - Quantidade em posse do vendedor: <strong>{currentQuantity}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="action-amount">Quantidade</Label>
                        <Input
                            id="action-amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            max={currentQuantity}
                            min="1"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAction}
                        className={mode === 'SALE' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                        {mode === 'RETURN' ? 'Confirmar Retorno' : 'Confirmar Venda'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
