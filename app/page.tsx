import { getProducts, getDashboardStats } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, Users, TrendingUp, Wallet, HandCoins } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { CreateProductDialog } from '@/components/create-product-dialog';
import { StockAdjustmentDialog } from '@/components/stock-adjustment-dialog';
import { Product } from '@/types';

export default async function DashboardPage() {
  const products: Product[] = await getProducts() as any;
  const stats = await getDashboardStats();

  const lowStockCount = products.filter((p: Product) => p.quantity < 5).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
          <p className="text-muted-foreground">Visão geral do seu estoque e finanças.</p>
        </div>
        <div className="flex items-center gap-2">
          <CreateProductDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Valor em Caixa */}
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Caixa</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(stats.totalSalesValue)}
            </div>
            <p className="text-xs text-muted-foreground pt-1">Total de vendas realizadas</p>
          </CardContent>
        </Card>

        {/* Itens em Consignação */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Consignação</CardTitle>
            <HandCoins className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInConsignment}</div>
            <p className="text-xs text-muted-foreground pt-1">
              {formatCurrency(stats.totalInConsignmentValue)} em mercadoria
            </p>
          </CardContent>
        </Card>

        {/* Estoque Central */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Central</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.centralStock}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Total de produtos físicos
            </p>
          </CardContent>
        </Card>

        {/* Alertas de Estoque */}
        <Card className={lowStockCount > 0 ? "border-red-200 bg-red-50 dark:bg-red-950/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Estoque</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${lowStockCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStockCount > 0 ? "text-red-500" : ""}`}>{lowStockCount}</div>
            <p className="text-xs text-muted-foreground pt-1">Produtos com estoque baixo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Estoque Central Disponível</CardTitle>
            <Badge variant="outline">{products.length} Categorias</Badge>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Qntd. Central</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product) => (
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
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum produto cadastrado no estoque central.
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
