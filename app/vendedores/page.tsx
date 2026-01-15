import { getSellers } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateSellerDialog } from '@/components/create-seller-dialog';
import { Users, MapPin, Phone, CreditCard } from 'lucide-react';

export default async function SellersPage() {
    const sellers = await getSellers();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gestão de Vendedores</h1>
                <CreateSellerDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vendedores Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>CPF</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Endereço</TableHead>
                                <TableHead>Consignações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sellers.map((seller) => (
                                <TableRow key={seller.id}>
                                    <TableCell className="font-medium">{seller.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                                            {seller.cpf}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            {seller.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 max-w-[200px] truncate">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            {seller.address}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {seller.consignments.length} produto(s)
                                    </TableCell>
                                </TableRow>
                            ))}
                            {sellers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Nenhum vendedor cadastrado.
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
