
import { prisma } from './lib/prisma';

async function main() {
    console.log('🗑️ LIMPANDO PRODUTOS E MOVIMENTAÇÕES...');

    await prisma.movementLog.deleteMany();
    await prisma.consignment.deleteMany();
    await prisma.product.deleteMany();

    console.log('📦 CADASTRANDO 30 NOVOS PRODUTOS...');

    const categories = [
        { name: 'CONJUNTO RENDA', colors: ['PRETO', 'VERMELHO', 'BRANCO', 'AZUL MARINHO', 'VINHO'], price: 98.00 },
        { name: 'BABYDOLL CETIM', colors: ['ROSA CHÁ', 'PRETO', 'DOURADO', 'PRATA'], price: 75.00 },
        { name: 'CAMISOLA SEDA', colors: ['ESMERALDA', 'RUBI', 'PÉROLA'], price: 110.00 },
        { name: 'CALCINHA ALGODÃO', colors: ['NUDE', 'BEGE', 'PRETO', 'CINZA'], price: 19.90 },
        { name: 'TOP FITNESS DRY', colors: ['NEON', 'GRAFITE', 'AZUL'], price: 42.00 },
        { name: 'ROBE LUXO', colors: ['CHAMPAGNE', 'BORDÔ'], price: 145.00 },
        { name: 'BODY RENDA', colors: ['PRETO', 'VERMELHO'], price: 125.00 },
        { name: 'SHORT DOLL', colors: ['ESTAMPADO', 'LILÁS'], price: 58.00 },
    ];

    const sizes = ['P', 'M', 'G', 'GG'];
    let count = 0;

    for (const cat of categories) {
        for (const color of cat.colors) {
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            const qty = Math.floor(Math.random() * 50) + 10;

            const product = await prisma.product.create({
                data: {
                    name: cat.name.toUpperCase(),
                    price: cat.price,
                    quantity: qty,
                    size: size,
                    color: color.toUpperCase(),
                }
            });

            await prisma.movementLog.create({
                data: {
                    type: 'ENTRY',
                    quantity: qty,
                    productId: product.id,
                }
            });
            count++;
        }
    }

    console.log(`✨ ${count} PRODUTOS CADASTRADOS COM SUCESSO!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
