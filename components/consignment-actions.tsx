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
            toast.error('QUANTIDADE INVÁLIDA.');
            return;
        }

        try {
            if (mode === 'RETURN') {
                await returnFromSeller(productId, sellerId, qty);
                toast.success(`${qty} UNIDADE(S) DE ${productName} RETORNADAS AO ESTOQUE.`);
            } else if (mode === 'SALE') {
                await sellFromSeller(productId, sellerId, qty);
                toast.success(`VENDA DE ${qty} UNIDADE(S) DE ${productName} REGISTRADA!`);
            }
            setOpen(false);
            setMode(null);
            setAmount('1');
            router.refresh();
        } catch (error) {
            toast.error('ERRO AO PROCESSAR AÇÃO.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex gap-2">
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-[10px] uppercase font-bold"
                        onClick={() => setMode('RETURN')}
                    >
                        <Undo2 className="h-3 w-3" />
                        RETORNAR
                    </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-1 text-[10px] uppercase font-bold bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                        onClick={() => setMode('SALE')}
                    >
                        <Banknote className="h-3 w-3" />
                        VENDA
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="uppercase">
                        {mode === 'RETURN' ? 'RETORNAR PRODUTO' : 'REGISTRAR VENDA'}
                    </DialogTitle>
                    <DialogDescription className="uppercase">
                        {productName} - QUANTIDADE EM POSSE: <strong>{currentQuantity}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="action-amount">QUANTIDADE</Label>
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
                        CANCELAR
                    </Button>
                    <Button
                        onClick={handleAction}
                        className={mode === 'SALE' ? 'bg-green-600 hover:bg-green-700 uppercase' : 'uppercase'}
                    >
                        {mode === 'RETURN' ? 'CONFIRMAR RETORNO' : 'CONFIRMAR VENDA'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
