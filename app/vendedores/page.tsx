import { getSellers } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateSellerDialog } from '@/components/create-seller-dialog';
import { Users, MapPin, Phone, CreditCard, Package, Wallet } from 'lucide-react';
import { Seller } from '@/types';
import { SellerActions } from '@/components/seller-actions';
import { WhatsAppShare } from '@/components/whatsapp-share';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

import { SellerList } from '@/components/seller-list';

export default async function SellersPage() {
    const sellers: Seller[] = await getSellers() as any;

    return (
        <FadeIn className="space-y-6 uppercase">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">GESTÃO DE VENDEDORES</h1>
                    <p className="text-muted-foreground text-sm font-medium">CADASTRO E RESUMO DE ATIVIDADE DOS VENDEDORES.</p>
                </div>
                <CreateSellerDialog />
            </div>

            <SellerList initialSellers={sellers} />
        </FadeIn>
    );
}
