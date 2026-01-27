'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PlusCircle, MinusCircle, Settings2, X } from 'lucide-react';

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
import { Product } from '@/types';

export function StockAdjustmentDialog({ product }: { product: Product }) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('0');
    const router = useRouter();

    async function handleAdjust(type: 'ADD' | 'REMOVE') {
        const value = parseInt(amount);
        if (isNaN(value) || value <= 0) {
            toast.error('Insira uma quantidade válida.');
            return;
        }

        const delta = type === 'ADD' ? value : -value;

        try {
            const res = await queueAction('adjustStock', [product.id, delta]);
            if (res.success) {
                toast.success(`Estoque atualizado: ${type === 'ADD' ? 'Entrada' : 'Saída'} de ${value} unidade(s).`);
                router.refresh();
            }
            setOpen(false);
            setAmount('0');
        } catch (error) {
            toast.error('Erro ao atualizar estoque.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="AJUSTAR SALDO">
                    <Settings2 className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajustar Estoque: {product.name}</DialogTitle>
                    <DialogDescription>
                        Saldo atual: <strong>{product.quantity}</strong> unidades.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Quantidade para Ajuste</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            size="icon"
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleAdjust('ADD')}
                            title="ENTRADA"
                        >
                            <PlusCircle className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="w-full"
                            onClick={() => handleAdjust('REMOVE')}
                            title="SAÍDA"
                        >
                            <MinusCircle className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)} title="FECHAR">
                        <X className="h-5 w-5" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
