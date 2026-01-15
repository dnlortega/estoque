'use client';

import { MessageSquareShare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Seller } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface WhatsAppShareProps {
    seller: Seller;
}

export function WhatsAppShare({ seller }: WhatsAppShareProps) {
    const handleShare = () => {
        // Limpar o número de telefone (remover caracteres não numéricos)
        const cleanPhone = seller.phone.replace(/\D/g, '');

        // Adicionar o código do país se não estiver presente (assumindo Brasil 55)
        const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

        // Construir a mensagem
        let message = `*RESUMO DE ESTOQUE - ${seller.name}* \n\n`;

        if (seller.consignments.length === 0) {
            message += "VOCÊ NÃO POSSUI PRODUTOS EM CONSIGNAÇÃO NO MOMENTO.";
        } else {
            let totalVal = 0;
            let totalQty = 0;

            seller.consignments.forEach((c) => {
                const subtotal = c.quantity * c.product.price;
                message += `• ${c.product.name} (TAM: ${c.product.size || '-'}) \n`;
                message += `  QNTD: ${c.quantity} | UN: ${formatCurrency(c.product.price)} \n\n`;
                totalVal += subtotal;
                totalQty += c.quantity;
            });

            message += `----------------------------\n`;
            message += `*TOTAL DE ITENS:* ${totalQty} \n`;
            message += `*VALOR EM POSSE:* ${formatCurrency(totalVal)}`;
        }

        // Codificar a mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedMessage}`;

        // Abrir link
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30 font-bold uppercase text-[10px] transition-all"
            title="ENVIAR ESTOQUE VIA WHATSAPP"
        >
            <MessageSquareShare className="h-3.5 w-3.5" />
            WHATSAPP
        </Button>
    );
}
