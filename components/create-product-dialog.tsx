'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus, Check, X } from 'lucide-react';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createProduct } from '@/app/actions';

const productSchema = z.object({
    name: z.string().min(1, 'NOME É OBRIGATÓRIO'),
    price: z.string().refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'PREÇO DEVE SER MAIOR QUE ZERO'),
    quantity: z.string().refine((v) => !isNaN(parseInt(v)) && parseInt(v) >= 0, 'QUANTIDADE NÃO PODE SER NEGATIVA'),
    size: z.string().min(1, 'TAMANHO É OBRIGATÓRIO'),
});

type ProductFormValues = {
    name: string;
    price: string;
    quantity: string;
    size: string;
};

export function CreateProductDialog() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: '0',
            quantity: '0',
            size: '',
        },
    });

    async function onSubmit(data: ProductFormValues) {
        try {
            await createProduct({
                name: data.name,
                price: parseFloat(data.price),
                quantity: parseInt(data.quantity),
                size: data.size,
            });
            toast.success('PRODUTO CRIADO COM SUCESSO!');
            setOpen(false);
            form.reset();
            router.refresh();
        } catch (error) {
            toast.error('ERRO AO CRIAR PRODUTO.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" title="NOVO PRODUTO">
                    <Plus className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>CADASTRAR NOVO PRODUTO</DialogTitle>
                    <DialogDescription>
                        INSIRA OS DETALHES DO NOVO PRODUTO PARA O ESTOQUE CENTRAL.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">NOME DO PRODUTO</Label>
                        <Input id="name" {...form.register('name')} placeholder="EX: CONJUNTO RENDA PRETO" />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="size">TAMANHO</Label>
                            <Select
                                onValueChange={(value) => form.setValue('size', value)}
                                value={form.watch('size')}
                            >
                                <SelectTrigger id="size">
                                    <SelectValue placeholder="TAM." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="P">P</SelectItem>
                                    <SelectItem value="M">M</SelectItem>
                                    <SelectItem value="G">G</SelectItem>
                                    <SelectItem value="GG">GG</SelectItem>
                                    <SelectItem value="XG">XG</SelectItem>
                                    <SelectItem value="ÚNICO">ÚNICO</SelectItem>
                                    <SelectItem value="42">42</SelectItem>
                                    <SelectItem value="44">44</SelectItem>
                                    <SelectItem value="46">46</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.size && (
                                <p className="text-xs text-red-500">{form.formState.errors.size.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">PREÇO (R$)</Label>
                            <Input id="price" type="number" step="0.01" {...form.register('price')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">QNTD.</Label>
                            <Input id="quantity" type="number" {...form.register('quantity')} />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={() => setOpen(false)} title="CANCELAR">
                            <X className="h-5 w-5" />
                        </Button>
                        <Button type="submit" size="icon" title="SALVAR PRODUTO">
                            <Check className="h-5 w-5" />
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
