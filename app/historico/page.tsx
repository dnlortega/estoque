import { getLogs } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownRight, RefreshCcw, ShoppingBag, History, Calendar, User, Package } from 'lucide-react';
import { MovementLog } from '@/types';
import { DeleteLogButton } from '@/components/delete-log-button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

const typeConfig = {
    ENTRY: { label: 'ENTRADA', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: ArrowUpRight },
    TRANSFER: { label: 'TRANSFERÊNCIA', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: ArrowDownRight },
    RETURN: { label: 'DEVOLUÇÃO', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: RefreshCcw },
    SALE: { label: 'VENDA (BAIXA)', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: ShoppingBag },
};

export default async function HistoryPage() {
    const logs: MovementLog[] = await getLogs() as any;

    return (
        <FadeIn className="space-y-6 uppercase">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">HISTÓRICO DE MOVIMENTAÇÕES</h1>
                <p className="text-muted-foreground text-sm font-medium">RASTREABILIDADE TOTAL DE ENTRADAS, SAÍDAS E VENDAS.</p>
            </div>

            <Card className="border-none shadow-lg">
                <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-black flex items-center gap-2">
                            <History className="h-4 w-4" />
                            LOGS RECENTES
                        </CardTitle>
                        <Badge variant="outline">{logs.length} REGISTROS</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* MOBILE VIEW (CARDS) */}
                    <StaggerContainer className="grid grid-cols-1 gap-4 md:hidden p-4">
                        {logs.map((log: MovementLog) => {
                            const config = typeConfig[log.type as keyof typeof typeConfig] || typeConfig.ENTRY;
                            const Icon = config.icon;

                            return (
                                <StaggerItem key={log.id}>
                                    <div className="bg-muted/40 rounded-lg p-4 space-y-3 border border-border/50 relative overflow-hidden">

                                        {/* Header do Card */}
                                        <div className="flex items-start justify-between">
                                            <Badge className={`gap-1.5 font-bold text-[9px] px-2 py-0.5 border-none shadow-sm ${config.color}`}>
                                                <Icon className="h-3 w-3" />
                                                {config.label}
                                            </Badge>
                                            <span className="text-[10px] font-mono opacity-60 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(log.timestamp), "dd/MM | HH:mm", { locale: ptBR })}
                                            </span>
                                        </div>

                                        {/* Conteúdo Principal */}
                                        <div className="flex items-center justify-between py-2">
                                            <div className="space-y-1">
                                                <p className="font-black text-sm flex items-center gap-2">
                                                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {log.product.name}
                                                </p>
                                                <div className="text-[10px] opacity-70 pl-5">
                                                    REF: {log.product.reference || '-'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {log.type === 'TRANSFER' || log.type === 'SALE' ? (
                                                    <span className="text-red-500 font-black text-lg">-{log.quantity}</span>
                                                ) : (
                                                    <span className="text-green-600 font-black text-lg">+{log.quantity}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Rodapé do Card */}
                                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                            <div className="flex items-center gap-1.5 text-[10px]">
                                                <User className="h-3 w-3 opacity-50" />
                                                {log.seller ? (
                                                    <span className="font-bold">{log.seller.name}</span>
                                                ) : (
                                                    <span className="font-bold opacity-60">ESTOQUE CENTRAL</span>
                                                )}
                                            </div>
                                            <DeleteLogButton logId={log.id} />
                                        </div>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                        {logs.length === 0 && (
                            <StaggerItem>
                                <div className="text-center py-8 text-muted-foreground text-xs uppercase opacity-50">
                                    Nenhuma movimentação registrada
                                </div>
                            </StaggerItem>
                        )}
                    </StaggerContainer>

                    {/* DESKTOP VIEW (TABLE) */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black h-10 px-6">DATA/HORA</TableHead>
                                    <TableHead className="text-[10px] font-black h-10 text-center">OPERAÇÃO</TableHead>
                                    <TableHead className="text-[10px] font-black h-10">PRODUTO</TableHead>
                                    <TableHead className="text-[10px] font-black h-10 text-center">QUANTIDADE</TableHead>
                                    <TableHead className="text-[10px] font-black h-10">ENVOLVIDO</TableHead>
                                    <TableHead className="text-[10px] font-black h-10 text-right pr-6">AÇÕES</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log: MovementLog) => {
                                    const config = typeConfig[log.type as keyof typeof typeConfig] || typeConfig.ENTRY;
                                    const Icon = config.icon;
                                    return (
                                        <TableRow key={log.id} className="hover:bg-muted/20 transition-colors group">
                                            <TableCell className="text-[10px] font-mono px-6 py-4 opacity-70">
                                                {format(new Date(log.timestamp), "dd/MM/yyyy | HH:mm", { locale: ptBR })}
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                <Badge className={`gap-1.5 font-bold text-[9px] px-2 py-0.5 border-none shadow-sm ${config.color}`}>
                                                    <Icon className="h-3 w-3" />
                                                    {config.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-black text-xs py-4">
                                                <div className="flex flex-col">
                                                    <span>{log.product.name}</span>
                                                    <span className="text-[9px] opacity-50 font-medium">REF: {log.product.reference || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center py-4">
                                                {log.type === 'TRANSFER' || log.type === 'SALE' ? (
                                                    <span className="text-red-500 font-bold text-sm">-{log.quantity}</span>
                                                ) : (
                                                    <span className="text-green-600 font-bold text-sm">+{log.quantity}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {log.seller ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold">{log.seller.name}</span>
                                                        <span className="text-[9px] opacity-50 font-mono">VENDEDOR(A)</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold">ESTOQUE CENTRAL</span>
                                                        <span className="text-[9px] opacity-50 font-mono">ADMINISTRAÇÃO</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-4">
                                                <DeleteLogButton logId={log.id} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {logs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center text-muted-foreground italic text-xs uppercase opacity-30">
                                            NENHUMA MOVIMENTAÇÃO REGISTRADA NO SISTEMA.
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
