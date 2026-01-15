import { getLogs } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownRight, RefreshCcw, ShoppingBag } from 'lucide-react';
import { MovementLog } from '@/types';

const typeConfig = {
    ENTRY: { label: 'Entrada', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: ArrowUpRight },
    TRANSFER: { label: 'Transferência', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: ArrowDownRight },
    RETURN: { label: 'Devolução', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: RefreshCcw },
    SALE: { label: 'Venda (Baixa)', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: ShoppingBag },
};

export default async function HistoryPage() {
    const logs: MovementLog[] = await getLogs() as any;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Histórico de Movimentações</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Logs Recentes</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Operação</TableHead>
                                <TableHead>Produto</TableHead>
                                <TableHead>Quantidade</TableHead>
                                <TableHead>Envolvido</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log: MovementLog) => {
                                const config = typeConfig[log.type as keyof typeof typeConfig];
                                const Icon = config.icon;
                                return (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-sm">
                                            {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`gap-1 font-medium ${config.color}`} variant="outline">
                                                <Icon className="h-3 w-3" />
                                                {config.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{log.product.name}</TableCell>
                                        <TableCell>
                                            {log.type === 'TRANSFER' || log.type === 'SALE' ? (
                                                <span className="text-red-500">-{log.quantity}</span>
                                            ) : (
                                                <span className="text-green-600">+{log.quantity}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {log.seller ? (
                                                <span className="text-sm font-medium">{log.seller.name}</span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Estoque Central</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Nenhuma movimentação registrada.
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
