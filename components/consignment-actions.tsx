'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Undo2, Banknote, Check, X } from 'lucide-react';

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
import { queueAction } from '@/lib/offline-actions';

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
                const res = await queueAction('returnFromSeller', [productId, sellerId, qty]);
                if (res.success) {
                    toast.success(`${qty} UNIDADE(S) DE ${productName} RETORNADAS AO ESTOQUE.`);
                    router.refresh();
                }
            } else if (mode === 'SALE') {
                const res = await queueAction('sellFromSeller', [productId, sellerId, qty]);
                if (res.success) {
                    toast.success(`VENDA DE ${qty} UNIDADE(S) DE ${productName} REGISTRADA!`);
                    router.refresh();
                }
            }
            setOpen(false);
            setMode(null);
            setAmount('1');
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
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setMode('RETURN')}
                        title="RETORNAR"
                    >
                        <Undo2 className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                        onClick={() => setMode('SALE')}
                        title="VENDA"
                    >
                        <Banknote className="h-4 w-4" />
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
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => setOpen(false)} title="CANCELAR">
                        <X className="h-5 w-5" />
                    </Button>
                    <Button
                        onClick={handleAction}
                        size="icon"
                        className={mode === 'SALE' ? 'bg-green-600 hover:bg-green-700' : ''}
                        title="CONFIRMAR"
                    >
                        <Check className="h-5 w-5" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
