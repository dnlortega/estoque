import { getSellers } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateSellerDialog } from '@/components/create-seller-dialog';
import { Users, MapPin, Phone, CreditCard, Package, Wallet } from 'lucide-react';
import { Seller } from '@/types';
import { SellerActions } from '@/components/seller-actions';
import { WhatsAppShare } from '@/components/whatsapp-share';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default async function SellersPage() {
    const sellers: Seller[] = await getSellers() as any;

    return (
        <FadeIn className="space-y-6 uppercase">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">GESTÃO DE VENDEDORES</h1>
                    <p className="text-muted-foreground text-sm font-medium">CADASTRO E RESUMO DE ATIVIDADE DOS VENDEDORES.</p>
                </div>
                <CreateSellerDialog />
            </div>

            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-black flex items-center gap-2 tracking-widest">
                            <Users className="h-4 w-4" />
                            BASE DE CONTATOS E ESTOQUE
                        </CardTitle>
                        <Badge variant="secondary" className="font-bold text-[9px] tracking-tighter">
                            {sellers.length} CADASTRADOS
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* MOBILE VIEW (CARDS) */}
                    <StaggerContainer className="grid grid-cols-1 gap-4 md:hidden p-4">
                        {sellers.map((seller: Seller) => {
                            const totalQty = (seller.consignments || []).reduce((acc, c) => acc + (c.quantity || 0), 0);
                            const totalValue = (seller.consignments || []).reduce((acc, c) => acc + ((c.quantity || 0) * (c.product?.price || 0)), 0);

                            return (
                                <StaggerItem key={seller.id}>
                                    <div className="bg-muted/40 rounded-lg p-4 space-y-4 border border-border/50">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <span className="font-black text-sm tracking-tight">{seller.name}</span>
                                                <div className="flex items-center gap-1.5 text-[10px] font-mono opacity-50">
                                                    <CreditCard className="h-3 w-3" />
                                                    {seller.cpf ? seller.cpf : (seller.rg ? `RG: ${seller.rg}` : '-')}
                                                </div>
                                            </div>
                                            <SellerActions seller={seller} />
                                        </div>

                                        <div className="space-y-2 text-[11px]">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 font-bold">
                                                    <Phone className="h-3.5 w-3.5 opacity-40 text-primary" />
                                                    {seller.phone}
                                                </div>
                                                <WhatsAppShare seller={seller} />
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-60 italic">
                                                <MapPin className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{seller.address}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                                            <div className="flex flex-col items-center p-2 bg-background/50 rounded">
                                                <span className="text-[9px] font-black opacity-40 mb-1">ITENS EM POSSE</span>
                                                <span className="text-sm font-black flex items-center gap-1">
                                                    <Package className="h-3 w-3" /> {totalQty}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center p-2 bg-background/50 rounded">
                                                <span className="text-[9px] font-black opacity-40 mb-1">VALOR TOTAL</span>
                                                <span className="text-sm font-black text-green-600 dark:text-green-400">
                                                    {formatCurrency(totalValue)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                        {sellers.length === 0 && (
                            <StaggerItem>
                                <div className="text-center py-8 text-muted-foreground text-xs uppercase opacity-50">
                                    Nenhum vendedor cadastrado
                                </div>
                            </StaggerItem>
                        )}
                    </StaggerContainer>

                    {/* DESKTOP VIEW (TABLE) */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow className="border-none">
                                    <TableHead className="text-[10px] font-black h-12 px-6">IDENTIDADE</TableHead>
                                    <TableHead className="text-[10px] font-black h-12">CONTATO E ENDEREÇO</TableHead>
                                    <TableHead className="text-[10px] font-black h-12 text-center">RESUMO DE ESTOQUE</TableHead>
                                    <TableHead className="text-[10px] font-black h-12 text-right pr-6">AÇÕES</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sellers.map((seller: Seller) => {
                                    const totalQty = (seller.consignments || []).reduce((acc, c) => acc + (c.quantity || 0), 0);
                                    const totalValue = (seller.consignments || []).reduce((acc, c) => acc + ((c.quantity || 0) * (c.product?.price || 0)), 0);

                                    return (
                                        <TableRow key={seller.id} className="hover:bg-primary/[0.02] transition-colors border-b border-primary/5 last:border-0 group">
                                            {/* COLUNA IDENTIDADE */}
                                            <TableCell className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">
                                                        {seller.name}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-[9px] font-mono opacity-50">
                                                        <CreditCard className="h-3 w-3" />
                                                        {seller.cpf ? seller.cpf : (seller.rg ? `RG: ${seller.rg}` : '-')}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* COLUNA CONTATO */}
                                            <TableCell className="py-5">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                                            <Phone className="h-3.5 w-3.5 opacity-40 text-primary" />
                                                            {seller.phone}
                                                        </div>
                                                        <WhatsAppShare seller={seller} />
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[9px] opacity-60 max-w-[250px] truncate lowercase italic first-letter:uppercase">
                                                        <MapPin className="h-3 w-3" />
                                                        {seller.address}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* COLUNA RESUMO ESTOQUE */}
                                            <TableCell className="text-center py-5">
                                                <div className="inline-flex items-center p-1.5 rounded-lg bg-muted/30 border border-muted/50 gap-4">
                                                    <div className="flex flex-col items-center px-3 border-r border-muted/50">
                                                        <span className="text-[9px] font-black opacity-40 flex items-center gap-1 mb-0.5">
                                                            <Package className="h-3 w-3" /> ITENS
                                                        </span>
                                                        <span className="text-xs font-black">{totalQty}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center px-3">
                                                        <span className="text-[9px] font-black opacity-40 flex items-center gap-1 mb-0.5">
                                                            <Wallet className="h-3 w-3" /> VALOR
                                                        </span>
                                                        <span className="text-xs font-black text-green-600 dark:text-green-400">
                                                            {formatCurrency(totalValue)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* COLUNA AÇÕES */}
                                            <TableCell className="text-right pr-6 py-5">
                                                <SellerActions seller={seller} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {sellers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3 opacity-20">
                                                <Users className="h-16 w-16" />
                                                <p className="text-xs font-black tracking-widest italic">NENHUM VENDEDOR CADASTRADO</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </FadeIn>
    );
}
