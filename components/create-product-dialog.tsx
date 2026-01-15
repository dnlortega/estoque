'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

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
import { createProduct } from '@/app/actions';

const productSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    price: z.string().refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Preço deve ser maior que zero'),
    quantity: z.string().refine((v) => !isNaN(parseInt(v)) && parseInt(v) >= 0, 'Quantidade não pode ser negativa'),
});

type ProductFormValues = {
    name: string;
    price: string;
    quantity: string;
};

export function CreateProductDialog() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: '0' as any,
            quantity: '0' as any,
        },
    });

    async function onSubmit(data: ProductFormValues) {
        try {
            await createProduct({
                name: data.name,
                price: parseFloat(data.price),
                quantity: parseInt(data.quantity),
            });
            toast.success('Produto criado com sucesso!');
            setOpen(false);
            form.reset();
            router.refresh();
        } catch (error) {
            toast.error('Erro ao criar produto.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Produto
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastrar Novo Produto</DialogTitle>
                    <DialogDescription>
                        Insira os detalhes do novo produto para o estoque central.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Produto</Label>
                        <Input id="name" {...form.register('name')} placeholder="Ex: Camiseta Branca" />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Preço de Venda (R$)</Label>
                            <Input id="price" type="number" step="0.01" {...form.register('price')} />
                            {form.formState.errors.price && (
                                <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantidade Inicial</Label>
                            <Input id="quantity" type="number" {...form.register('quantity')} />
                            {form.formState.errors.quantity && (
                                <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Salvar Produto</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
