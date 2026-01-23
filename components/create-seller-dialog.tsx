'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { UserPlus, Check, X } from 'lucide-react';

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
    name: z.string().min(1, 'NOME É OBRIGATÓRIO'),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    address: z.string().min(1, 'ENDEREÇO É OBRIGATÓRIO'),
    phone: z.string().min(10, 'TELEFONE INVÁLIDO'),
}).refine((data) => (data.cpf && data.cpf.length >= 14) || (data.rg && data.rg.length >= 5), {
    message: "CPF OU RG DEVE SER PREENCHIDO",
    path: ["cpf"], // Will highlight CPF field
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
            rg: '',
            address: '',
            phone: '',
        },
    });

    async function onSubmit(data: SellerFormValues) {
        try {
            await createSeller(data);
            toast.success('VENDEDOR CADASTRADO COM SUCESSO!');
            setOpen(false);
            form.reset();
            router.refresh();
        } catch (error) {
            toast.error('ERRO AO CADASTRAR VENDEDOR.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" title="NOVO VENDEDOR">
                    <UserPlus className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="uppercase font-bold">
                <DialogHeader>
                    <DialogTitle>CADASTRAR NOVO VENDEDOR</DialogTitle>
                    <DialogDescription>
                        INSIRA OS DADOS PESSOAIS DO VENDEDOR PARA GESTÃO DE CONSIGNAÇÃO.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">NOME COMPLETO</Label>
                        <Input id="name" {...form.register('name')} placeholder="EX: JOÃO SILVA" />
                        {form.formState.errors.name && <p className="text-[10px] text-red-500">{form.formState.errors.name.message}</p>}
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
                            {form.formState.errors.cpf && <p className="text-[10px] text-red-500">{form.formState.errors.cpf.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rg">RG</Label>
                            <Input
                                id="rg"
                                {...form.register('rg')}
                                placeholder="00.000.000-0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                            {form.formState.errors.phone && <p className="text-[10px] text-red-500">{form.formState.errors.phone.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">ENDEREÇO</Label>
                            <Input id="address" {...form.register('address')} placeholder="RUA, NÚMERO, BAIRRO..." />
                            {form.formState.errors.address && <p className="text-[10px] text-red-500">{form.formState.errors.address.message}</p>}
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={() => setOpen(false)} title="CANCELAR">
                            <X className="h-5 w-5" />
                        </Button>
                        <Button type="submit" size="icon" title="CADASTRAR">
                            <Check className="h-5 w-5" />
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
