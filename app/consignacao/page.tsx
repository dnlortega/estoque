import { getSellers, getProducts } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransferDialog } from '@/components/transfer-dialog';
import { ConsignmentActions } from '@/components/consignment-actions';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Product, Seller } from '@/types';
import { User, Package, HandCoins, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default async function ConsignmentPage() {
    const sellers: Seller[] = await getSellers() as any;
    const products: Product[] = await getProducts() as any;

    return (
        <FadeIn className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">GESTÃO DE CONSIGNAÇÃO</h1>
                <TransferDialog products={products} sellers={sellers} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>VENDEDORES COM MERCADORIA</CardTitle>
                    <CardDescription>CLIQUE NO NOME DO VENDEDOR PARA VER O DETALHAMENTO DOS ITENS.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {/* MOBILE VIEW (CARDS) */}
                    <StaggerContainer className="grid grid-cols-1 gap-4 md:hidden p-4">
                        {sellers.map((seller: Seller) => {
                            const totalQty = Math.max(0, seller.consignments.reduce((acc: number, c) => acc + c.quantity, 0));
                            const totalVal = Math.max(0, seller.consignments.reduce((acc: number, c) => acc + (c.quantity * c.product.price), 0));

                            return (
                                <StaggerItem key={seller.id}>
                                    <Dialog>
                                        <div className="bg-muted/40 rounded-lg p-4 space-y-3 border border-border/50">
                                            <div className="flex items-start justify-between">
                                                <DialogTrigger asChild>
                                                    <button className="flex flex-col items-start gap-1 text-left active:opacity-70">
                                                        <span className="font-black text-sm uppercase flex items-center gap-2">
                                                            <User className="h-3.5 w-3.5" />
                                                            {seller.name}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground font-mono">
                                                            {seller.cpf}
                                                        </span>
                                                    </button>
                                                </DialogTrigger>
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-green-600 dark:text-green-400">
                                                        {formatCurrency(totalVal)}
                                                    </div>
                                                    <span className="text-[9px] uppercase font-bold text-muted-foreground">TOTAL</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={totalQty > 0 ? "default" : "secondary"} className="text-[10px] h-6 px-2 font-bold">
                                                        {totalQty} ITENS
                                                    </Badge>
                                                </div>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline" className="h-7 text-[10px] uppercase font-bold px-3">
                                                        VER DETALHES <ChevronRight className="h-3 w-3 ml-1" />
                                                    </Button>
                                                </DialogTrigger>
                                            </div>
                                        </div>
                                        <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden shadow-2xl border-primary/10 scrollbar-hide">
                                            <DialogHeader className="bg-primary/5 p-4 border-b border-primary/10">
                                                <DialogTitle className="font-bold text-sm uppercase flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    ITENS COM {seller.name}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="max-h-[85vh] overflow-y-auto scrollbar-hide px-2">
                                                <Table>
                                                    <TableHeader className="bg-muted/30">
                                                        <TableRow>
                                                            <TableHead className="text-[10px] uppercase h-12 pl-4">PRODUTO</TableHead>
                                                            <TableHead className="text-[10px] uppercase h-12 text-center w-[60px]">QTD.</TableHead>
                                                            <TableHead className="text-[10px] uppercase h-12 text-right pr-6 w-[100px]">AÇÕES</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {seller.consignments.length === 0 ? (
                                                            <TableRow>
                                                                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground text-xs italic uppercase">
                                                                    NENHUM ITEM EM CONSIGNAÇÃO
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            seller.consignments.map((c: any) => (
                                                                <TableRow key={c.id} className="hover:bg-muted/20">
                                                                    <TableCell className="py-3 pl-4">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-xs font-bold uppercase">{c.product.name}</span>
                                                                            <span className="text-[10px] text-muted-foreground flex items-center gap-2">
                                                                                {c.product.size && <Badge variant="outline" className="h-4 px-1 text-[9px]">{c.product.size}</Badge>}
                                                                                {c.product.color && <span>{c.product.color}</span>}
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-center font-black py-3 text-sm">
                                                                        {c.quantity}
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-6 py-3">
                                                                        <ConsignmentActions
                                                                            productId={c.productId}
                                                                            sellerId={c.sellerId}
                                                                            productName={c.product.name}
                                                                            currentQuantity={c.quantity}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </StaggerItem>
                            );
                        })}
                        {sellers.length === 0 && (
                            <StaggerItem>
                                <div className="text-center py-8 text-muted-foreground text-xs uppercase opacity-50">
                                    Nenhum vendedor com mercadoria
                                </div>
                            </StaggerItem>
                        )}
                    </StaggerContainer>

                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="pl-6">VENDEDOR</TableHead>
                                    <TableHead>CPF | CELULAR</TableHead>
                                    <TableHead className="text-center">ITENS TOTAIS</TableHead>
                                    <TableHead className="text-right pr-6">VALOR EM POSSE</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sellers.map((seller: Seller) => {
                                    const totalQty = Math.max(0, seller.consignments.reduce((acc: number, c) => acc + c.quantity, 0));
                                    const totalVal = Math.max(0, seller.consignments.reduce((acc: number, c) => acc + (c.quantity * c.product.price), 0));

                                    return (
                                        <TableRow key={seller.id} className="group hover:bg-muted/30">
                                            <TableCell className="pl-6 py-4">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent flex flex-col items-start gap-1 group-hover:text-primary transition-colors">
                                                            <span className="text-base font-bold flex items-center gap-2 uppercase">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                                {seller.name}
                                                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                                            </span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden shadow-2xl border-primary/10 scrollbar-hide">
                                                        <DialogHeader className="bg-primary/5 p-4 border-b border-primary/10">
                                                            <DialogTitle className="font-bold text-sm uppercase flex items-center gap-2">
                                                                <Package className="h-4 w-4" />
                                                                ITENS COM {seller.name}
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className="max-h-[85vh] overflow-y-auto scrollbar-hide px-2">
                                                            <Table>
                                                                <TableHeader className="bg-muted/30">
                                                                    <TableRow>
                                                                        <TableHead className="text-[10px] uppercase h-12 pl-4">PRODUTO</TableHead>
                                                                        <TableHead className="text-[10px] uppercase h-12 text-center w-[80px]">TAM.</TableHead>
                                                                        <TableHead className="text-[10px] uppercase h-12 text-center w-[80px]">COR</TableHead>
                                                                        <TableHead className="text-[10px] uppercase h-12 text-center w-[80px]">QNTD.</TableHead>
                                                                        <TableHead className="text-[10px] uppercase h-12 text-right pr-6 w-[120px]">AÇÕES</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {seller.consignments.length === 0 ? (
                                                                        <TableRow>
                                                                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-xs italic uppercase">
                                                                                NENHUM ITEM EM CONSIGNÇÃO
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ) : (
                                                                        seller.consignments.map((c: any) => (
                                                                            <TableRow key={c.id} className="hover:bg-muted/20">
                                                                                <TableCell className="text-xs font-bold py-4 pl-4 uppercase">
                                                                                    {c.product.name}
                                                                                </TableCell>
                                                                                <TableCell className="text-center py-4">
                                                                                    <Badge variant="outline" className="text-[10px] px-1.5 h-5">{c.product.size || '-'}</Badge>
                                                                                </TableCell>
                                                                                <TableCell className="text-center py-4">
                                                                                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5 uppercase font-bold">{c.product.color || '-'}</Badge>
                                                                                </TableCell>
                                                                                <TableCell className="text-center font-black py-4">
                                                                                    {c.quantity}
                                                                                </TableCell>
                                                                                <TableCell className="text-right pr-6 py-4">
                                                                                    <ConsignmentActions
                                                                                        productId={c.productId}
                                                                                        sellerId={c.sellerId}
                                                                                        productName={c.product.name}
                                                                                        currentQuantity={c.quantity}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs font-mono uppercase">
                                                {seller.cpf} | {seller.phone}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={totalQty > 0 ? "default" : "outline"} className={totalQty > 0 ? "bg-primary/90" : ""}>
                                                    {totalQty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6 font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(totalVal)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {sellers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs uppercase">
                                                <HandCoins className="h-12 w-12 opacity-20" />
                                                <p>NENHUM VENDEDOR ENCONTRADO</p>
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
