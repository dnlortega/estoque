import { getProducts, getDashboardStats } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, Wallet, HandCoins, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { CreateProductDialog } from '@/components/create-product-dialog';
import { StockAdjustmentDialog } from '@/components/stock-adjustment-dialog';
import { Product } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FadeIn, StaggerContainer, StaggerItem, ScaleHover } from '@/components/animations';

export default async function DashboardPage() {
  const products: Product[] = await getProducts() as any;
  const stats = await getDashboardStats();

  const lowStockProducts = products.filter((p: Product) => p.quantity < 5);
  const lowStockCount = lowStockProducts.length;

  return (
    <FadeIn className="space-y-6 uppercase">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PAINEL DE CONTROLE</h1>
          <p className="text-muted-foreground text-sm">VISÃO GERAL DO SEU ESTOQUE E FINANÇAS.</p>
        </div>
        <div className="flex items-center gap-2">
          <CreateProductDialog />
        </div>
      </div>

      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* VALOR EM CAIXA */}
        <StaggerItem>
          <ScaleHover>
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/10 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase">VALOR EM CAIXA</CardTitle>
                <Wallet className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-green-700 dark:text-green-400">
                  {formatCurrency(stats.totalSalesValue)}
                </div>
                <p className="text-[10px] text-muted-foreground pt-1">TOTAL DE VENDAS REALIZADAS</p>
              </CardContent>
            </Card>
          </ScaleHover>
        </StaggerItem>

        {/* EM CONSIGNAÇÃO */}
        <StaggerItem>
          <ScaleHover>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase">EM CONSIGNAÇÃO</CardTitle>
                <HandCoins className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">{stats.totalInConsignment}</div>
                <p className="text-[10px] text-muted-foreground pt-1">
                  {formatCurrency(stats.totalInConsignmentValue)} EM MERCADORIA
                </p>
              </CardContent>
            </Card>
          </ScaleHover>
        </StaggerItem>

        {/* ESTOQUE CENTRAL */}
        <StaggerItem>
          <ScaleHover>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase">ESTOQUE CENTRAL</CardTitle>
                <Package className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black">{stats.centralStock}</div>
                <p className="text-[10px] text-muted-foreground pt-1">
                  TOTAL DE PRODUTOS FÍSICOS
                </p>
              </CardContent>
            </Card>
          </ScaleHover>
        </StaggerItem>

        {/* ALERTAS DE ESTOQUE COM DIALOG (CENTRALIZADO) */}
        <StaggerItem>
          <Dialog>
            <DialogTrigger asChild>
              <ScaleHover>
                <Card className={`cursor-pointer transition-all h-full ${lowStockCount > 0 ? "border-red-200 bg-red-50 dark:bg-red-950/20" : ""}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase">ALERTAS DE ESTOQUE</CardTitle>
                    <AlertTriangle className={`h-4 w-4 ${lowStockCount > 0 ? "text-red-500 animate-pulse" : "text-muted-foreground"}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-black ${lowStockCount > 0 ? "text-red-500" : ""}`}>
                      {lowStockCount}
                    </div>
                    <p className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1">
                      PRODUTOS BAIXOS <Info className="h-3 w-3" />
                    </p>
                  </CardContent>
                </Card>
              </ScaleHover>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden border-red-100 scrollbar-hide">
              <DialogHeader className="bg-red-500 p-4 text-white">
                <DialogTitle className="font-black text-sm uppercase flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  PRODUTOS COM ESTOQUE BAIXO (ABAIXO DE 5)
                </DialogTitle>
              </DialogHeader>
              <div className="max-h-[85vh] overflow-y-auto pr-2 scrollbar-hide">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-[10px] h-9 uppercase pl-4">PRODUTO</TableHead>
                      <TableHead className="text-[10px] h-9 uppercase text-center">REFERÊNCIA</TableHead>
                      <TableHead className="text-[10px] h-9 uppercase text-right pr-6">QNTD.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockCount === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-[10px] text-muted-foreground uppercase italic">
                          NENHUM ALERTA NO MOMENTO
                        </TableCell>
                      </TableRow>
                    ) : (
                      lowStockProducts.map((p: Product) => (
                        <TableRow key={p.id} className="hover:bg-red-50/30">
                          <TableCell className="text-[11px] font-bold py-3 uppercase leading-tight pl-4">
                            {p.name}
                          </TableCell>
                          <TableCell className="text-center py-3">
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5">{p.reference || '-'}</Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6 py-3 font-black text-red-600 text-sm">
                            {p.quantity}
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
      </StaggerContainer>

      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase">ESTOQUE CENTRAL DISPONÍVEL</CardTitle>
              <Badge variant="outline">{products.length} CATEGORIAS</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* MOBILE VIEW (CARDS) - NO SCROLL */}
            <StaggerContainer className="grid grid-cols-1 gap-4 md:hidden">
              {products.map((product: Product) => (
                <StaggerItem key={product.id}>
                  <div className="bg-muted/40 rounded-lg p-4 space-y-3 border border-border/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="font-black text-sm uppercase leading-tight">{product.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Badge variant="outline" className="h-5 px-1.5">REF: {product.reference || '-'}</Badge>
                        </div>
                      </div>
                      <div>
                        {product.quantity < 5 ? (
                          <Badge variant="destructive" className="text-[9px] font-black uppercase">BAIXO</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 text-[9px] font-black uppercase">OK</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase text-muted-foreground font-bold">PREÇO</span>
                        <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[9px] uppercase text-muted-foreground font-bold">ESTOQUE</span>
                        <span className={`text-sm font-black ${product.quantity < 5 ? "text-red-500" : ""}`}>{product.quantity}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <StockAdjustmentDialog product={product} />
                    </div>
                  </div>
                </StaggerItem>
              ))}
              {products.length === 0 && (
                <StaggerItem>
                  <div className="text-center py-8 text-muted-foreground text-xs uppercase">
                    Nenhum produto em estoque
                  </div>
                </StaggerItem>
              )}
            </StaggerContainer>

            {/* DESKTOP VIEW (TABLE) */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] uppercase">PRODUTO</TableHead>
                    <TableHead className="text-[10px] uppercase">REFERÊNCIA</TableHead>
                    <TableHead className="text-[10px] uppercase">PREÇO</TableHead>
                    <TableHead className="text-[10px] uppercase">QNTD. CENTRAL</TableHead>
                    <TableHead className="text-[10px] uppercase">STATUS</TableHead>
                    <TableHead className="text-right text-[10px] uppercase">AÇÕES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-bold text-xs uppercase">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{product.reference || '-'}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{formatCurrency(product.price)}</TableCell>
                      <TableCell className="text-xs">
                        <span className={product.quantity < 5 ? "text-red-500 font-black" : ""}>
                          {product.quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.quantity < 5 ? (
                          <Badge variant="destructive" className="text-[9px] font-black uppercase">BAIXO ESTOQUE</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 text-[9px] font-black uppercase">EM DIA</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <StockAdjustmentDialog product={product} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground uppercase text-xs">
                        NENHUM PRODUTO CADASTRADO NO ESTOQUE CENTRAL.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </FadeIn>
  );
}
