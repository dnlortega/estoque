'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MoveRight, Check, X } from 'lucide-react';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transferToSeller } from '@/app/actions';
import { Product, Seller } from '@/types';

interface TransferDialogProps {
    products: Product[];
    sellers: Seller[];
}

export function TransferDialog({ products, sellers }: TransferDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedSeller, setSelectedSeller] = useState('');
    const [amount, setAmount] = useState('1');
    const router = useRouter();

    const product = products.find((p) => p.id === selectedProduct);

    async function handleTransfer() {
        const qty = parseInt(amount);
        if (!selectedProduct || !selectedSeller || isNaN(qty) || qty <= 0) {
            toast.error('PREENCHA TODOS OS CAMPOS CORRETAMENTE.');
            return;
        }

        if (product && qty > product.quantity) {
            toast.error(`ESTOQUE INSUFICIENTE. DISPONÍVEL: ${product.quantity}`);
            return;
        }

        try {
            await transferToSeller(selectedProduct, selectedSeller, qty);
            toast.success('TRANSFERÊNCIA REALIZADA COM SUCESSO!');
            setOpen(false);
            reset();
            router.refresh();
        } catch (error) {
            toast.error('ERRO AO REALIZAR TRANSFERÊNCIA.');
        }
    }

    function reset() {
        setSelectedProduct('');
        setSelectedSeller('');
        setAmount('1');
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" title="TRANSFERIR PARA VENDEDOR">
                    <MoveRight className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>TRANSFERIR PRODUTO</DialogTitle>
                    <DialogDescription>
                        RETIRA ITENS DO ESTOQUE CENTRAL E ATRIBUI A UM VENDEDOR.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>PRODUTO</Label>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger>
                                <SelectValue placeholder="SELECIONE O PRODUTO" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id} className="uppercase">
                                        {p.name} {p.size ? `(${p.size})` : ''} - {p.quantity} DISP.
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>VENDEDOR</Label>
                        <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                            <SelectTrigger>
                                <SelectValue placeholder="SELECIONE O VENDEDOR" />
                            </SelectTrigger>
                            <SelectContent>
                                {sellers.map((s) => (
                                    <SelectItem key={s.id} value={s.id} className="uppercase">
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="transfer-amount">QUANTIDADE</Label>
                        <Input
                            id="transfer-amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => setOpen(false)} title="CANCELAR">
                        <X className="h-5 w-5" />
                    </Button>
                    <Button size="icon" onClick={handleTransfer} title="CONFIRMAR TRANSFERÊNCIA">
                        <Check className="h-5 w-5" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
