'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

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
import { createSeller } from '@/app/actions';
import { formatCPF, formatPhone } from '@/lib/utils';

const sellerSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    cpf: z.string().min(11, 'CPF inválido'),
    address: z.string().min(1, 'Endereço é obrigatório'),
    phone: z.string().min(10, 'Telefone inválido'),
});

type SellerFormValues = z.infer<typeof sellerSchema>;

export function CreateSellerDialog() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const form = useForm<SellerFormValues>({
        resolver: zodResolver(sellerSchema),
        defaultValues: {
            name: '',
            cpf: '',
            address: '',
            phone: '',
        },
    });

    async function onSubmit(data: SellerFormValues) {
        try {
            await createSeller(data);
            toast.success('Vendedor cadastrado com sucesso!');
            setOpen(false);
            form.reset();
            router.refresh();
        } catch (error) {
            toast.error('Erro ao cadastrar vendedor. Verifique se o CPF já existe.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Novo Vendedor
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastrar Novo Vendedor</DialogTitle>
                    <DialogDescription>
                        Insira os dados pessoais do vendedor para gestão de consignação.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">NOME COMPLETO</Label>
                        <Input id="name" {...form.register('name')} placeholder="EX: JOÃO SILVA" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                {...form.register('cpf')}
                                placeholder="000.000.000-00"
                                onChange={(e) => {
                                    const formatted = formatCPF(e.target.value);
                                    form.setValue('cpf', formatted);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">CELULAR</Label>
                            <Input
                                id="phone"
                                {...form.register('phone')}
                                placeholder="(00) 00000-0000"
                                onChange={(e) => {
                                    const formatted = formatPhone(e.target.value);
                                    form.setValue('phone', formatted);
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">ENDEREÇO</Label>
                        <Input id="address" {...form.register('address')} placeholder="RUA, NÚMERO, BAIRRO, CIDADE" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            CANCELAR
                        </Button>
                        <Button type="submit">CADASTRAR</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
