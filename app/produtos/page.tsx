import { getProducts } from '@/app/actions';
import { Product } from '@/types';
import { ProductList } from '@/components/product-list';

export default async function ProductsPage() {
    const products: Product[] = await getProducts() as any;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight uppercase">Catálogo de Produtos</h1>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider opacity-60">GESTÃO COMPLETA E BUSCA INTELIGENTE DE ITENS.</p>
            </div>

            <ProductList initialProducts={products} />
        </div>
    );
}
