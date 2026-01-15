'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MoveRight } from 'lucide-react';

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
            toast.error('Preencha todos os campos corretamente.');
            return;
        }

        if (product && qty > product.quantity) {
            toast.error(`Estoque insuficiente. Disponível: ${product.quantity}`);
            return;
        }

        try {
            await transferToSeller(selectedProduct, selectedSeller, qty);
            toast.success('Transferência realizada com sucesso!');
            setOpen(false);
            reset();
            router.refresh();
        } catch (error) {
            toast.error('Erro ao realizar transferência.');
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
                <Button className="gap-2">
                    <MoveRight className="h-4 w-4" />
                    Transferir para Vendedor
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transferir Produto</DialogTitle>
                    <DialogDescription>
                        Retira itens do estoque central e atribui a um vendedor.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Produto</Label>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o produto" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name} ({p.quantity} disponíveis)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Vendedor</Label>
                        <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o vendedor" />
                            </SelectTrigger>
                            <SelectContent>
                                {sellers.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="transfer-amount">Quantidade</Label>
                        <Input
                            id="transfer-amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleTransfer}>Confirmar Transferência</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
