'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Pencil, Trash2, MoreHorizontal, AlertTriangle } from 'lucide-react';

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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateSeller, deleteSeller } from '@/app/actions';
import { formatCPF, formatPhone } from '@/lib/utils';
import { Seller } from '@/types';

const sellerSchema = z.object({
    name: z.string().min(1, 'NOME É OBRIGATÓRIO'),
    cpf: z.string().min(11, 'CPF INVÁLIDO'),
    address: z.string().min(1, 'ENDEREÇO É OBRIGATÓRIO'),
    phone: z.string().min(10, 'TELEFONE INVÁLIDO'),
});

type SellerFormValues = z.infer<typeof sellerSchema>;

interface SellerActionsProps {
    seller: Seller;
}

export function SellerActions({ seller }: SellerActionsProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<SellerFormValues>({
        resolver: zodResolver(sellerSchema),
        defaultValues: {
            name: seller.name,
            cpf: seller.cpf,
            address: seller.address,
            phone: seller.phone,
        },
    });

    async function onEditSubmit(data: SellerFormValues) {
        try {
            setIsSubmitting(true);
            await updateSeller(seller.id, data);
            toast.success('VENDEDOR ATUALIZADO COM SUCESSO!');
            setIsEditDialogOpen(false);
            router.refresh();
        } catch (error) {
            toast.error('ERRO AO ATUALIZAR VENDEDOR.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onDeleteConfirm() {
        try {
            setIsSubmitting(true);
            await deleteSeller(seller.id);
            toast.success('VENDEDOR EXCLUÍDO COM SUCESSO!');
            setIsDeleteDialogOpen(false);
            router.refresh();
        } catch (error) {
            toast.error('ERRO AO EXCLUIR VENDEDOR.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">ABRIR MENU</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>AÇÕES</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        EDITAR
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        EXCLUIR
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* DIÁLOGO DE EDIÇÃO */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>EDITAR VENDEDOR</DialogTitle>
                        <DialogDescription>
                            ATUALIZE OS DADOS CADASTRAIS DO VENDEDOR.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">NOME COMPLETO</Label>
                            <Input id="edit-name" {...form.register('name')} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-cpf">CPF</Label>
                                <Input
                                    id="edit-cpf"
                                    {...form.register('cpf')}
                                    onChange={(e) => {
                                        const formatted = formatCPF(e.target.value);
                                        form.setValue('cpf', formatted);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">CELULAR</Label>
                                <Input
                                    id="edit-phone"
                                    {...form.register('phone')}
                                    onChange={(e) => {
                                        const formatted = formatPhone(e.target.value);
                                        form.setValue('phone', formatted);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-address">ENDEREÇO</Label>
                            <Input id="edit-address" {...form.register('address')} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                CANCELAR
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ALERTA DE EXCLUSÃO */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            TEM CERTEZA?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            ESTA AÇÃO IRÁ EXCLUIR O VENDEDOR <strong>{seller.name}</strong> E TODO O SEU HISTÓRICO DE CONSIGNAÇÃO E MOVIMENTAÇÕES. ESTA AÇÃO NÃO PODE SER DESFEITA.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>CANCELAR</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'EXCLUINDO...' : 'SIM, EXCLUIR VENDEDOR'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
