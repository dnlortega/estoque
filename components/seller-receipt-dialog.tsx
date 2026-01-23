'use client';

import { useState, useEffect } from 'react';
import { FileText, Printer, Calculator, History, ShoppingBag, RefreshCcw, Package, DollarSign, Percent, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getSellerLogs, getSellerReceiptData } from '@/app/actions';
import { Seller, MovementLog } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SellerReceiptDialogProps {
    seller: Seller;
    trigger?: React.ReactNode;
}

export function SellerReceiptDialog({ seller, trigger }: SellerReceiptDialogProps) {
    const [open, setOpen] = useState(false);
    const [commission, setCommission] = useState(35);
    const [paidAmount, setPaidAmount] = useState(0);
    const [logs, setLogs] = useState<MovementLog[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            loadData();
        }
    }, [open]);

    async function loadData() {
        setLoading(true);
        try {
            const [logsData, statsData] = await Promise.all([
                getSellerLogs(seller.id),
                getSellerReceiptData(seller.id)
            ]);
            setLogs(logsData as any);
            setStats(statsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const valSold = stats?.valSold || 0;
    const commissionVal = valSold * (commission / 100);
    const amountToPay = valSold - commissionVal;
    const balance = amountToPay - paidAmount;
    const salesPerformance = stats?.qtyDelivered > 0
        ? (stats.qtySold / (stats.qtyDelivered - stats.qtyReturned)) * 100
        : 0;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <FileText className="h-4 w-4" />
                        RECIBO / ACERTO
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto scrollbar-hide">
                <style jsx global>{`
                    @media print {
                        @page {
                            margin: 10mm;
                            size: auto;
                        }
                        body {
                            background: white !important;
                            color: black !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        .no-print {
                            display: none !important;
                        }
                        /* Reset containers for print */
                        body * {
                            visibility: hidden;
                        }
                        /* Force print area to be the main content */
                        .print-area, .print-area * {
                            visibility: visible !important;
                        }
                        .print-area {
                            position: relative !important;
                            visibility: visible !important;
                            display: block !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            border: none !important;
                            background: white !important;
                            color: black !important;
                            box-shadow: none !important;
                        }
                        /* Deep parent fix for Radix Dialog/Portals */
                        div[data-slot="dialog-overlay"] {
                            display: none !important;
                        }
                        div[data-slot="dialog-content"],
                        div[data-slot="dialog-portal"],
                        div[role="dialog"] {
                            position: static !important;
                            display: block !important;
                            visibility: visible !important;
                            overflow: visible !important;
                            max-height: none !important;
                            max-width: none !important;
                            width: 100% !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            border: none !important;
                            box-shadow: none !important;
                            background: transparent !important;
                            transform: none !important;
                        }

                        /* Prevent clipping on parents */
                        div, section, main, article {
                            overflow: visible !important;
                        }

                        /* Table and Card print polish */
                        .print-area table {
                            width: 100% !important;
                            border-collapse: collapse !important;
                        }
                        .print-area .bg-primary\/5, 
                        .print-area .bg-muted\/30,
                        .print-area .bg-muted\/20 {
                            background-color: #f9fafb !important; /* Very light gray for print */
                            print-color-adjust: exact;
                        }
                        
                        /* Table page break fixes */
                        table { page-break-inside: auto; }
                        tr { page-break-inside: avoid; page-break-after: auto; }
                        thead { display: table-header-group; }
                        tfoot { display: table-footer-group; }
                    }
                `}</style>

                <DialogHeader className="no-print">
                    <DialogTitle className="flex items-center gap-2 uppercase font-black">
                        <Calculator className="h-5 w-5 text-primary" />
                        RECIBO E ACERTO DE CONTAS
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4 uppercase font-bold">
                    {/* CONFIGURATIONS - NO PRINT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print bg-muted/30 p-4 rounded-lg border border-primary/10">
                        <div className="space-y-2">
                            <Label className="text-[10px]">PORCENTAGEM DE COMISSÃO (%)</Label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                                <Input
                                    type="number"
                                    value={commission}
                                    onChange={(e) => setCommission(Number(e.target.value))}
                                    className="pl-10 font-black h-11"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px]">VALOR PAGO PELO CLIENTE (R$)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                                <Input
                                    type="number"
                                    value={paidAmount}
                                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                                    className="pl-10 font-black h-11"
                                />
                            </div>
                        </div>
                    </div>

                    {/* PRINT AREA */}
                    <div className="print-area space-y-8 p-4 md:p-8 border-2 border-primary/5 rounded-2xl bg-white dark:bg-zinc-950">
                        {/* HEADER RECIBO */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b-2 border-primary/10 pb-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black tracking-tighter text-primary">RECIBO DE ACERTO</h2>
                                <p className="text-xs opacity-60">SISTEMA DE GESTÃO DE ESTOQUE</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-sm font-black">{seller.name}</p>
                                <p className="text-[10px] opacity-60">{seller.cpf} | {seller.phone}</p>
                                <p className="text-[10px] font-mono">{format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                            </div>
                        </div>

                        {/* STATS GRID */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                                <span className="text-[8px] opacity-50 block mb-1">QTD. ENTREGUE</span>
                                <span className="text-lg font-black">{stats?.qtyDelivered || 0}</span>
                            </div>
                            <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                                <span className="text-[8px] opacity-50 block mb-1">QTD. EM POSSE</span>
                                <span className="text-lg font-black text-blue-600">{stats?.qtyCurrent || 0}</span>
                            </div>
                            <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                                <span className="text-[8px] opacity-50 block mb-1">QTD. DEVOLVIDA</span>
                                <span className="text-lg font-black text-orange-600">{stats?.qtyReturned || 0}</span>
                            </div>
                            <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                                <span className="text-[8px] opacity-50 block mb-1">QTD. VENDIDA</span>
                                <span className="text-lg font-black text-green-600">{stats?.qtySold || 0}</span>
                            </div>
                            <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                                <span className="text-[8px] opacity-50 block mb-1">% PERFORMANCE</span>
                                <span className="text-lg font-black text-primary">{salesPerformance.toFixed(1)}%</span>
                            </div>
                        </div>

                        {/* FINANCIAL SUMMARY */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-none bg-primary/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-black opacity-50">RESUMO FINANCEIRO</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span>VALOR DO PEDIDO (TOTAL)</span>
                                        <span className="font-black">{formatCurrency(stats?.valDelivered || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-green-600 font-black">
                                        <span>VL. TOTAL VENDIDO</span>
                                        <span>{formatCurrency(valSold)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs border-t border-primary/10 pt-2">
                                        <span>COMISSÃO ({commission}%)</span>
                                        <span className="text-red-500">-{formatCurrency(commissionVal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-black bg-primary/10 p-2 rounded">
                                        <span>VL. LÍQUIDO (A PAGAR)</span>
                                        <span>{formatCurrency(amountToPay)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-none bg-muted/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-black opacity-50">SITUAÇÃO DE PAGAMENTO</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span>TOTAL DEVIDO</span>
                                        <span className="font-black">{formatCurrency(amountToPay)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-blue-600">
                                        <span>VALOR RECEBIDO</span>
                                        <span className="font-black">{formatCurrency(paidAmount)}</span>
                                    </div>
                                    <div className={`flex justify-between items-center p-2 rounded border-2 ${balance > 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                                        <span className="text-[10px] font-black">{balance > 0 ? 'RESTANTE A PAGAR' : 'SALDO QUITADO'}</span>
                                        <span className="text-lg font-black">{formatCurrency(Math.abs(balance))}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* HISTORY SECTION */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black flex items-center gap-2">
                                <History className="h-4 w-4" />
                                DETALHAMENTO DE MOVIMENTAÇÕES (HISTÓRICO DIÁRIO)
                            </h3>
                            <div className="space-y-6">
                                {Object.entries(
                                    logs.filter(l => l.type === 'SALE' || l.type === 'RETURN').reduce((acc, log) => {
                                        const dateKey = format(new Date(log.timestamp), 'dd/MM/yyyy');
                                        if (!acc[dateKey]) acc[dateKey] = [];
                                        acc[dateKey].push(log);
                                        return acc;
                                    }, {} as Record<string, MovementLog[]>)
                                ).map(([date, dayLogs]) => (
                                    <div key={date} className="space-y-2">
                                        <div className="bg-muted/40 px-4 py-1.5 rounded-t-lg border-x border-t border-border/50">
                                            <span className="text-[10px] font-black text-primary flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                DIA {date}
                                            </span>
                                        </div>
                                        <div className="border border-border/50 rounded-b-xl overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-muted/20">
                                                    <TableRow>
                                                        <TableHead className="text-[9px] h-8 text-center w-[80px]">TIPO</TableHead>
                                                        <TableHead className="text-[9px] h-8">PRODUTO</TableHead>
                                                        <TableHead className="text-[9px] h-8 text-center">QTD</TableHead>
                                                        <TableHead className="text-[9px] h-8 text-right pr-4">VALOR UNIT.</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {dayLogs.map((log) => (
                                                        <TableRow key={log.id} className="text-[10px]">
                                                            <TableCell className="text-center py-2">
                                                                <Badge variant={log.type === 'SALE' ? 'default' : 'outline'} className="text-[8px] h-4 px-1">
                                                                    {log.type === 'SALE' ? 'VENDA' : 'DEVOL.'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="py-2">
                                                                <div className="flex flex-col">
                                                                    <span>{log.product.name}</span>
                                                                    <span className="text-[8px] opacity-50 font-medium">REF: {log.product.reference || '-'}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-center py-2 font-black">
                                                                {log.type === 'SALE' ? (
                                                                    <span className="text-green-600">+{log.quantity}</span>
                                                                ) : (
                                                                    <span className="text-orange-600">-{log.quantity}</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right pr-4 py-2">
                                                                {formatCurrency(log.product.price)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SIGNATURES - FOR PRINT */}
                        <div className="hidden print:grid grid-cols-2 gap-12 pt-16">
                            <div className="border-t border-black text-center pt-2">
                                <p className="text-[10px] font-black">{seller.name}</p>
                                <p className="text-[8px] opacity-60 uppercase">ASSINATURA DO VENDEDOR</p>
                            </div>
                            <div className="border-t border-black text-center pt-2">
                                <p className="text-[10px] font-black">ADMINISTRAÇÃO</p>
                                <p className="text-[8px] opacity-60 uppercase">CARIMBO E ASSINATURA</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 no-print">
                        <Button variant="outline" onClick={() => setOpen(false)} className="uppercase font-black text-xs">
                            FECHAR
                        </Button>
                        <Button onClick={handlePrint} className="gap-2 uppercase font-black text-xs">
                            <Printer className="h-4 w-4" />
                            IMPRIMIR RECIBO
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
