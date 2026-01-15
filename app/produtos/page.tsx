import { getProducts } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateProductDialog } from '@/components/create-product-dialog';
import { StockAdjustmentDialog } from '@/components/stock-adjustment-dialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

export default async function ProductsPage() {
    const products: Product[] = await getProducts() as any;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Catálogo de Produtos</h1>
                <CreateProductDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todos os Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Preço de Venda</TableHead>
                                <TableHead>Estoque Central</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{formatCurrency(product.price)}</TableCell>
                                    <TableCell>
                                        <span className={product.quantity < 5 ? "text-red-500 font-bold" : ""}>
                                            {product.quantity}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {product.quantity < 5 ? (
                                            <Badge variant="destructive">Baixo Estoque</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Em dia</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <StockAdjustmentDialog product={product} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Nenhum produto cadastrado.
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
