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

import { toast } from 'sonner';

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
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error('BLOQUEADOR DE POPUPS ATIVO. PERMITA PARA IMPRIMIR.');
            return;
        }

        const printArea = document.querySelector('.print-area');
        if (!printArea) return;

        const content = printArea.innerHTML;
        const sellerName = seller.name;

        printWindow.document.write(`
            <html>
                <head>
                    <title>RECIBO - ${sellerName}</title>
                    <style>
                        body { 
                            font-family: system-ui, -apple-system, sans-serif; 
                            margin: 0; 
                            padding: 0; 
                            background: white;
                            color: black;
                            text-transform: uppercase;
                        }
                        * { box-sizing: border-box; }
                        .print-area { width: 100%; padding: 1.5cm; }
                        
                        /* Layout Utilities */
                        .flex { display: flex; }
                        .flex-row { flex-direction: row; }
                        .justify-between { justify-content: space-between; }
                        .items-center { align-items: center; }
                        .grid { display: grid; gap: 0.5rem; }
                        .grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
                        .grid-cols-2 { grid-template-columns: 1fr 1fr; }
                        
                        /* Spacing */
                        .space-y-4 > * + * { margin-top: 1rem; }
                        .space-y-2 > * + * { margin-top: 0.5rem; }
                        .space-y-1\\.5 > * + * { margin-top: 0.375rem; }
                        .space-y-0\\.5 > * + * { margin-top: 0.125rem; }
                        .p-2 { padding: 0.5rem; }
                        .p-4 { padding: 1rem; }
                        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
                        .px-4 { padding-left: 1rem; padding-right: 1rem; }
                        .pb-1 { padding-bottom: 0.25rem; }
                        .pb-4 { padding-bottom: 1rem; }
                        .pt-6 { padding-top: 1.5rem; }
                        .pt-1 { padding-top: 0.25rem; }
                        
                        /* Borders & Decor */
                        .border { border: 1px solid #e4e4e7; }
                        .border-2 { border: 2px solid #e4e4e7; }
                        .border-b-2 { border-bottom: 2px solid #e4e4e7; }
                        .border-t { border-top: 1px solid #000; }
                        .border-black { border-color: #000; }
                        .border-primary\\/10 { border-color: rgba(0,0,0,0.1); }
                        .rounded-lg { border-radius: 0.5rem; }
                        .rounded-2xl { border-radius: 1rem; }
                        
                        /* Colors */
                        .bg-muted\\/20 { background: #f4f4f5; }
                        .bg-primary\\/5 { background: #f8fafc; }
                        .bg-muted\\/30 { background: #fafafa; }
                        .bg-primary\\/10 { background: #f1f5f9; }
                        .bg-muted\\/40 { background: #f1f1f2; }
                        .text-primary { color: #000; }
                        .text-blue-600 { color: #2563eb; }
                        .text-orange-600 { color: #ea580c; }
                        .text-green-600 { color: #16a34a; }
                        .text-red-500 { color: #ef4444; }
                        .text-red-700 { color: #b91c1c; }
                        
                        /* Typography */
                        .text-xl { font-size: 1.25rem; }
                        .text-sm { font-size: 0.875rem; }
                        .text-xs { font-size: 0.75rem; }
                        .text-\\[10px\\] { font-size: 10px; }
                        .text-\\[9px\\] { font-size: 9px; }
                        .text-\\[8px\\] { font-size: 8px; }
                        .text-\\[7px\\] { font-size: 7px; }
                        .font-black { font-weight: 900; }
                        .font-bold { font-weight: 700; }
                        .font-mono { font-family: monospace; }
                        .tracking-tighter { letter-spacing: -0.05em; }
                        .opacity-60 { opacity: 0.6; }
                        .opacity-50 { opacity: 0.5; }
                        
                        /* Table */
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 0.25rem 0.5rem; text-align: left; }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        
                        /* Print Specifics */
                        .no-print { display: none !important; }
                        .hidden { display: none; }
                        .print\\:grid { display: grid !important; }
                        @page { margin: 0; }
                    </style>
                </head>
                <body>
                    <div class="print-area">${content}</div>
                    <script>
                        window.onload = () => {
                            window.print();
                            // Optional: window.close(); // Some browsers block this
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
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
                    <div className="print-area space-y-4 p-4 md:p-8 border-2 border-primary/5 rounded-2xl bg-white dark:bg-zinc-950">
                        {/* HEADER RECIBO */}
                        <div className="flex flex-row justify-between items-center border-b-2 border-primary/10 pb-4">
                            <div className="space-y-0.5">
                                <h2 className="text-xl font-black tracking-tighter text-primary">RECIBO DE ACERTO</h2>
                                <p className="text-[8px] opacity-60">SISTEMA DE GESTÃO DE ESTOQUE</p>
                            </div>
                            <div className="text-right space-y-0.5">
                                <p className="text-sm font-black">{seller.name}</p>
                                <p className="text-[9px] opacity-60">{seller.cpf} | {seller.phone}</p>
                                <p className="text-[9px] font-mono">{format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                            </div>
                        </div>

                        {/* STATS GRID */}
                        <div className="grid grid-cols-5 gap-2">
                            <div className="p-2 bg-muted/20 rounded-lg border border-border/50">
                                <span className="text-[7px] opacity-50 block mb-0.5">QTD. ENTREGUE</span>
                                <span className="text-sm font-black">{stats?.qtyDelivered || 0}</span>
                            </div>
                            <div className="p-2 bg-muted/20 rounded-lg border border-border/50">
                                <span className="text-[7px] opacity-50 block mb-0.5">QTD. EM POSSE</span>
                                <span className="text-sm font-black text-blue-600">{stats?.qtyCurrent || 0}</span>
                            </div>
                            <div className="p-2 bg-muted/20 rounded-lg border border-border/50">
                                <span className="text-[7px] opacity-50 block mb-0.5">QTD. DEVOLVIDA</span>
                                <span className="text-sm font-black text-orange-600">{stats?.qtyReturned || 0}</span>
                            </div>
                            <div className="p-2 bg-muted/20 rounded-lg border border-border/50">
                                <span className="text-[7px] opacity-50 block mb-0.5">QTD. VENDIDA</span>
                                <span className="text-sm font-black text-green-600">{stats?.qtySold || 0}</span>
                            </div>
                            <div className="p-2 bg-muted/20 rounded-lg border border-border/50">
                                <span className="text-[7px] opacity-50 block mb-0.5">% PERFORM.</span>
                                <span className="text-sm font-black text-primary">{salesPerformance.toFixed(1)}%</span>
                            </div>
                        </div>

                        {/* FINANCIAL SUMMARY */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="border-none shadow-none bg-primary/5 py-4">
                                <CardHeader className="pb-1 px-4">
                                    <CardTitle className="text-[8px] font-black opacity-50">RESUMO FINANCEIRO</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1.5 px-4">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span>VALOR DO PEDIDO</span>
                                        <span className="font-black">{formatCurrency(stats?.valDelivered || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-green-600 font-black">
                                        <span>VL. TOTAL VENDIDO</span>
                                        <span>{formatCurrency(valSold)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] border-t border-primary/10 pt-1">
                                        <span>COMISSÃO ({commission}%)</span>
                                        <span className="text-red-500">-{formatCurrency(commissionVal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black bg-primary/10 p-1 rounded">
                                        <span>VL. LÍQUIDO</span>
                                        <span>{formatCurrency(amountToPay)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-none bg-muted/30 py-4">
                                <CardHeader className="pb-1 px-4">
                                    <CardTitle className="text-[8px] font-black opacity-50">SITUAÇÃO DE PAGAMENTO</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1.5 px-4">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span>VALOR RECEBIDO</span>
                                        <span className="font-black">{formatCurrency(paidAmount)}</span>
                                    </div>
                                    <div className={`flex justify-between items-center p-1.5 rounded border ${balance > 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                                        <span className="text-[8px] font-black">{balance > 0 ? 'RESTANTE' : 'QUITADO'}</span>
                                        <span className="text-sm font-black">{formatCurrency(Math.abs(balance))}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* HISTORY SECTION - COMPACT */}
                        <div className="space-y-2">
                            <h3 className="text-[9px] font-black flex items-center gap-1.5">
                                <History className="h-3 w-3" />
                                DETALHAMENTO DE MOVIMENTAÇÕES
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(
                                    logs.filter(l => l.type === 'SALE' || l.type === 'RETURN').reduce((acc, log) => {
                                        const dateKey = format(new Date(log.timestamp), 'dd/MM/yyyy');
                                        if (!acc[dateKey]) acc[dateKey] = [];
                                        acc[dateKey].push(log);
                                        return acc;
                                    }, {} as Record<string, MovementLog[]>)
                                ).slice(0, 8).map(([date, dayLogs]) => ( // Limit to 8 days to fit page
                                    <div key={date} className="border border-border/50 rounded-lg overflow-hidden">
                                        <div className="bg-muted/40 px-2 py-0.5 border-b border-border/50 flex justify-between items-center">
                                            <span className="text-[8px] font-black text-primary">DIA {date}</span>
                                        </div>
                                        <Table>
                                            <TableBody>
                                                {dayLogs.map((log) => (
                                                    <TableRow key={log.id} className="text-[8px] border-b last:border-0">
                                                        <TableCell className="text-center py-1 w-10">
                                                            <span className={log.type === 'SALE' ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
                                                                {log.type === 'SALE' ? 'VENDA' : 'DEV.'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-1">
                                                            <span>{log.product.name}</span>
                                                        </TableCell>
                                                        <TableCell className="text-center py-1 font-black w-8">
                                                            {log.quantity}
                                                        </TableCell>
                                                        <TableCell className="text-right pr-2 py-1 w-16">
                                                            {formatCurrency(log.product.price)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SIGNATURES - COMPACT */}
                        <div className="hidden print:grid grid-cols-2 gap-8 pt-6">
                            <div className="border-t border-black text-center pt-1">
                                <p className="text-[9px] font-black">{seller.name}</p>
                                <p className="text-[7px] opacity-60 uppercase">VENDEDOR</p>
                            </div>
                            <div className="border-t border-black text-center pt-1">
                                <p className="text-[9px] font-black">ADMINISTRAÇÃO</p>
                                <p className="text-[7px] opacity-60 uppercase">CARIMBO E ASSINATURA</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 no-print">
                        <Button variant="outline" onClick={() => setOpen(false)} className="uppercase font-black text-xs">
                            FECHAR
                        </Button>
                        <Button onClick={handlePrint} className="gap-2 uppercase font-black text-xs">
                            <Printer className="h-4 w-4" />
                            IMPRIMIR
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
