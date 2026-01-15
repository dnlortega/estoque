import { getSellers, getProducts } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransferDialog } from '@/components/transfer-dialog';
import { ConsignmentActions } from '@/components/consignment-actions';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Product, Seller } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User, Package, HandCoins, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function ConsignmentPage() {
    const sellers: Seller[] = await getSellers() as any;
    const products: Product[] = await getProducts() as any;

    return (
        <div className="space-y-6">
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
                                const totalQty = seller.consignments.reduce((acc: number, c) => acc + c.quantity, 0);
                                const totalVal = seller.consignments.reduce((acc: number, c) => acc + (c.quantity * c.product.price), 0);

                                return (
                                    <TableRow key={seller.id} className="group hover:bg-muted/30">
                                        <TableCell className="pl-6 py-4">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" className="h-auto p-0 hover:bg-transparent flex flex-col items-start gap-1 group-hover:text-primary transition-colors">
                                                        <span className="text-base font-bold flex items-center gap-2 uppercase">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            {seller.name}
                                                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                                        </span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[450px] p-0 shadow-2xl border-primary/10" align="start">
                                                    <div className="bg-primary/5 p-4 border-b border-primary/10">
                                                        <h4 className="font-bold text-sm uppercase flex items-center gap-2">
                                                            <Package className="h-4 w-4" />
                                                            ITENS COM {seller.name}
                                                        </h4>
                                                    </div>
                                                    <div className="max-h-[400px] overflow-y-auto">
                                                        <Table>
                                                            <TableHeader className="bg-muted/30">
                                                                <TableRow>
                                                                    <TableHead className="text-[10px] uppercase h-8">PRODUTO</TableHead>
                                                                    <TableHead className="text-[10px] uppercase h-8 text-center">TAM.</TableHead>
                                                                    <TableHead className="text-[10px] uppercase h-8 text-center">QNTD.</TableHead>
                                                                    <TableHead className="text-[10px] uppercase h-8 text-right pr-4">AÇÕES</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {seller.consignments.length === 0 ? (
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-xs italic">
                                                                            NENHUM ITEM EM CONSIGNÇÃO
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ) : (
                                                                    seller.consignments.map((c: any) => (
                                                                        <TableRow key={c.id} className="hover:bg-muted/20">
                                                                            <TableCell className="text-xs font-medium py-3 border-l-2 border-transparent hover:border-primary">
                                                                                {c.product.name}
                                                                            </TableCell>
                                                                            <TableCell className="text-center py-3">
                                                                                <Badge variant="outline" className="text-[10px] px-1 h-5">{c.product.size || '-'}</Badge>
                                                                            </TableCell>
                                                                            <TableCell className="text-center font-bold py-3">
                                                                                {c.quantity}
                                                                            </TableCell>
                                                                            <TableCell className="text-right pr-4 py-3">
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
                                                </PopoverContent>
                                            </Popover>
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
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <HandCoins className="h-12 w-12 opacity-20" />
                                            <p>NENHUM VENDEDOR ENCONTRADO</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
