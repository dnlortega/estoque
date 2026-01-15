import { getProducts, getSellers } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransferDialog } from '@/components/transfer-dialog';
import { ConsignmentActions } from '@/components/consignment-actions';
import { Badge } from '@/components/ui/badge';
import { HandCoins } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Product, Seller } from '@/types';

export default async function ConsignmentPage() {
    const products: Product[] = await getProducts() as any;
    const sellers: Seller[] = await getSellers() as any;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gestão de Consignação</h1>
                <TransferDialog products={products} sellers={sellers} />
            </div>

            {sellers.map((seller: Seller) => (
                <Card key={seller.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl">{seller.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{seller.cpf} | {seller.phone}</p>
                            </div>
                            <Badge variant="outline" className="bg-background">
                                {seller.consignments.reduce((acc: number, c) => acc + c.quantity, 0)} itens totais
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produto</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead>Valor Total (Venda)</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {seller.consignments.map((consignment: any) => (
                                    <TableRow key={consignment.id}>
                                        <TableCell className="font-medium">{consignment.product.name}</TableCell>
                                        <TableCell>{consignment.quantity}</TableCell>
                                        <TableCell>
                                            {formatCurrency(consignment.product.price * consignment.quantity)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ConsignmentActions
                                                productId={consignment.productId}
                                                sellerId={seller.id}
                                                productName={consignment.product.name}
                                                currentQuantity={consignment.quantity}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {seller.consignments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            Nenhum produto em consignação com este vendedor.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}

            {sellers.length === 0 && (
                <Card>
                    <CardContent className="h-40 flex items-center justify-center text-muted-foreground">
                        Nenhum vendedor cadastrado. Vá em "Vendedores" para começar.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
