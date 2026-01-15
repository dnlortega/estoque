
import { prisma } from './lib/prisma';

async function main() {
    console.log('🗑️ Apagando todos os dados...');

    // A ordem é importante devido às chaves estrangeiras
    await prisma.movementLog.deleteMany();
    await prisma.consignment.deleteMany();
    await prisma.product.deleteMany();
    // Não apago os vendedores, apenas os produtos conforme solicitado

    console.log('✅ Todos os produtos e movimentações foram removidos.');

    console.log('📦 Cadastrando novos produtos...');

    const products = [
        { name: 'CAMISOLA SEDA PREMIUM', price: 89.90, quantity: 20, size: 'M', color: 'PRETO' },
        { name: 'CONJUNTO RENDA LUXO', price: 120.00, quantity: 15, size: 'G', color: 'VERMELHO' },
        { name: 'BABYDOLL CETIM', price: 65.00, quantity: 30, size: 'P', color: 'AZUL' },
        { name: 'TOP ESPORTIVO DRYFIT', price: 45.00, quantity: 50, size: 'GG', color: 'CINZA' },
        { name: 'CALCINHA SEM COSTURA', price: 15.00, quantity: 100, size: 'ÚNICO', color: 'BEGE' },
        { name: 'ROBE LONGO FLORAL', price: 150.00, quantity: 10, size: 'P', color: 'BRANCO' },
    ];

    for (const p of products) {
        const product = await prisma.product.create({
            data: {
                name: p.name.toUpperCase(),
                price: p.price,
                quantity: p.quantity,
                size: p.size.toUpperCase(),
                color: p.color.toUpperCase(),
            }
        });

        await prisma.movementLog.create({
            data: {
                type: 'ENTRY',
                quantity: p.quantity,
                productId: product.id,
            }
        });
    }

    console.log('✨ Novos produtos cadastrados com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
