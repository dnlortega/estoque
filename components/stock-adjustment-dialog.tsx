'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PlusCircle, MinusCircle } from 'lucide-react';

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
import { adjustStock } from '@/app/actions';
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
            await adjustStock(product.id, delta);
            toast.success(`Estoque atualizado: ${type === 'ADD' ? 'Entrada' : 'Saída'} de ${value} unidade(s).`);
            setOpen(false);
            setAmount('0');
            router.refresh();
        } catch (error) {
            toast.error('Erro ao atualizar estoque.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Ajustar Saldo</Button>
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
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => handleAdjust('ADD')}
                        >
                            <PlusCircle className="h-4 w-4" />
                            Entrada
                        </Button>
                        <Button
                            variant="destructive"
                            className="gap-2"
                            onClick={() => handleAdjust('REMOVE')}
                        >
                            <MinusCircle className="h-4 w-4" />
                            Saída
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
