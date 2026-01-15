import { getSellers } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateSellerDialog } from '@/components/create-seller-dialog';
import { Users, MapPin, Phone, CreditCard } from 'lucide-react';
import { Seller } from '@/types';
import { SellerActions } from '@/components/seller-actions';
import { WhatsAppShare } from '@/components/whatsapp-share';

export default async function SellersPage() {
    const sellers: Seller[] = await getSellers() as any;

    return (
        <div className="space-y-6 uppercase">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">GESTÃO DE VENDEDORES</h1>
                <CreateSellerDialog />
            </div>

            <Card className="border-none shadow-lg">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="text-sm font-black flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        VENDEDORES CADASTRADOS
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="text-[10px] font-black h-10 px-6">NOME</TableHead>
                                <TableHead className="text-[10px] font-black h-10">CPF</TableHead>
                                <TableHead className="text-[10px] font-black h-10">TELEFONE | WHATSAPP</TableHead>
                                <TableHead className="text-[10px] font-black h-10">ENDEREÇO</TableHead>
                                <TableHead className="text-[10px] font-black h-10 text-center">CONSIGNAÇÕES</TableHead>
                                <TableHead className="text-[10px] font-black h-10 text-right pr-6">AÇÕES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sellers.map((seller: Seller) => (
                                <TableRow key={seller.id} className="hover:bg-muted/20 transition-colors">
                                    <TableCell className="font-black text-xs px-6 py-4">{seller.name}</TableCell>
                                    <TableCell className="text-[10px] font-mono py-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-3.5 w-3.5 opacity-50" />
                                            {seller.cpf}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 text-[10px] font-mono">
                                                <Phone className="h-3.5 w-3.5 opacity-50" />
                                                {seller.phone}
                                            </div>
                                            <WhatsAppShare seller={seller} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2 max-w-[200px] truncate text-[10px]">
                                            <MapPin className="h-3.5 w-3.5 opacity-50" />
                                            {seller.address}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className="text-xs font-bold bg-primary/5 px-2 py-1 rounded">
                                            {seller.consignments.length} ITEM(S)
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-4">
                                        <SellerActions seller={seller} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {sellers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground italic text-xs uppercase opacity-30">
                                        NENHUM VENDEDOR CADASTRADO NO MOMENTO.
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
