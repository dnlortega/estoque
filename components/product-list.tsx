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
import { Search, PackageX, Package, Palette, Ruler } from 'lucide-react';

import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface ProductListProps {
    initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
    const [search, setSearch] = useState('');

    // Usa useLiveQuery para reagir a mudanças locais (offline)
    const localProducts = useLiveQuery(() => db.products.toArray());
    const products = (localProducts && localProducts.length > 0) ? localProducts : initialProducts;

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.reference && p.reference.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6 uppercase">
            {/* SEARCH AND ADD - MOBILE OPTIMIZED */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-16 z-20 bg-background/80 backdrop-blur-md py-2 -mx-4 px-4 md:mx-0 md:px-0">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="BUSCAR PRODUTO, REFERÊNCIA..."
                        className="pl-10 font-bold h-12 md:h-11 bg-card/50 shadow-sm border-primary/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <CreateProductDialog />
                </div>
            </div>

            {/* PRODUCT CARDS - MOBILE ONLY */}
            <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="font-black text-sm tracking-tight leading-tight max-w-[70%]">{product.name}</h3>
                                <div className="flex gap-2">
                                    <StockAdjustmentDialog product={product} />
                                    <DeleteProductDialog productId={product.id} productName={product.name} />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                                <Badge variant="outline" className="gap-1 px-1.5 h-6">
                                    REF: {product.reference || '-'}
                                </Badge>
                                <Badge variant={product.quantity < 5 ? "destructive" : "secondary"} className="h-6 gap-1 border-none">
                                    <Package className="h-3 w-3 opacity-50" /> {product.quantity} QTD
                                </Badge>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-primary/5">
                                <span className="text-[10px] opacity-50 font-black">PREÇO DE VENDA</span>
                                <span className="text-sm font-black text-primary">{formatCurrency(product.price)}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* TABLE - DESKTOP ONLY */}
            <Card className="hidden md:block border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden mb-10">
                <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-black tracking-widest">CATÁLOGO COMPLETO</CardTitle>
                        <Badge variant="outline" className="text-[10px] opacity-50 font-bold">{filteredProducts.length} ITENS</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            <TableRow className="border-none">
                                <TableHead className="text-[10px] font-black h-12 px-6">PRODUTO</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-center w-[150px]">REFERÊNCIA</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-center w-[120px]">PREÇO</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-center w-[100px]">QTD</TableHead>
                                <TableHead className="text-[10px] font-black h-12 text-right pr-6 w-[120px]">AÇÕES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product: Product) => (
                                <TableRow key={product.id} className="hover:bg-primary/[0.02] transition-colors border-b border-primary/5 last:border-0 group">
                                    <TableCell className="font-black text-xs px-6 py-5 group-hover:text-primary transition-colors">{product.name}</TableCell>
                                    <TableCell className="text-center py-5">
                                        <Badge variant="outline" className="text-[10px] font-bold h-6">{product.reference || '-'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center py-5 text-xs font-black">{formatCurrency(product.price)}</TableCell>
                                    <TableCell className="text-center py-5 font-black text-sm">
                                        <span className={product.quantity < 5 ? "text-red-500" : ""}>{product.quantity}</span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-5">
                                        <div className="flex justify-end gap-2">
                                            <StockAdjustmentDialog product={product} />
                                            <DeleteProductDialog productId={product.id} productName={product.name} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 opacity-20 py-10">
                    <PackageX className="h-16 w-16 mb-4" />
                    <p className="text-xs font-black tracking-widest italic">NENHUM PRODUTO ENCONTRADO</p>
                </div>
            )}
        </div>
    );
}
