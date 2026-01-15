'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateProductDialog } from '@/components/create-product-dialog';
import { StockAdjustmentDialog } from '@/components/stock-adjustment-dialog';
import { DeleteProductDialog } from '@/components/delete-product-dialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Search, PackageX } from 'lucide-react';

interface ProductListProps {
    initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
    const [search, setSearch] = useState('');

    const filteredProducts = initialProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.color && p.color.toLowerCase().includes(search.toLowerCase())) ||
        (p.size && p.size.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6 uppercase">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="BUSCAR NOME, COR OU TAMANHO..."
                        className="pl-10 font-bold h-11 bg-card/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <CreateProductDialog />
            </div>

            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-black tracking-widest">TODOS OS PRODUTOS</CardTitle>
                        <Badge variant="outline" className="text-[10px] opacity-50">{filteredProducts.length} ITENS ENCONTRADOS</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            <TableRow className="border-none">
                                <TableHead className="text-[10px] font-black h-12 px-6">NOME</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-center w-[80px]">TAM.</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-center w-[80px]">COR</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-center w-[120px]">PREÇO</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-center w-[100px]">ESTOQUE</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-center w-[120px]">STATUS</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-right pr-6 w-[120px]">AÇÕES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product: Product) => (
                                <TableRow key={product.id} className="hover:bg-primary/[0.02] transition-colors border-b border-primary/5 last:border-0">
                                    <TableCell className="font-black text-xs px-6 py-4">{product.name}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="text-[10px] font-bold">{product.size || '-'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="text-[10px] font-black bg-muted/50">{product.color || '-'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center text-xs font-bold">{formatCurrency(product.price)}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`text-xs font-black ${product.quantity < 5 ? "text-red-500" : ""}`}>
                                            {product.quantity}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {product.quantity < 5 ? (
                                            <Badge variant="destructive" className="text-[8px] font-black">BAIXO</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-[8px] font-black">EM DIA</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            <StockAdjustmentDialog product={product} />
                                            <DeleteProductDialog productId={product.id} productName={product.name} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3 opacity-20">
                                            <PackageX className="h-12 w-12" />
                                            <p className="text-xs font-black tracking-widest italic">NENHUM PRODUTO ENCONTRADO</p>
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
