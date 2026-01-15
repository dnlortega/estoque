import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const colors = ['PRETO', 'BRANCO', 'VERMELHO', 'ROSA', 'AZUL', 'VINHO', 'BEGE', 'ESMERALDA'];
const sizes = ['P', 'M', 'G', 'GG'];
const items = [
    { template: 'SUTIÃ RENDA', price: 45.90 },
    { template: 'SUTIÃ BOJO SOFT', price: 39.90 },
    { template: 'CALCINHA FIO DENTAL LUXO', price: 24.90 },
    { template: 'CALCINHA BIQUÍNI ALGODÃO', price: 15.90 },
    { template: 'CONJUNTO SENSUAL RENDA', price: 89.90 },
    { template: 'CONJUNTO DIA A DIA', price: 59.90 },
    { template: 'BODY TULE TRANSPARENTE', price: 75.00 },
    { template: 'CAMISOLA CETIM SEDUÇÃO', price: 98.00 },
    { template: 'ROBE CETIM ELEGANCE', price: 110.00 },
    { template: 'CINTA LIGA TRABALHADA', price: 35.00 },
    { template: 'CALCINHA SEM COSTURA', price: 19.90 },
    { template: 'SUTIÃ TOMARA QUE CAIA', price: 55.00 },
    { template: 'BODY MODELADOR COMPRESS', price: 129.90 },
    { template: 'BABYDOLL SHORT DOLL', price: 49.90 },
    { template: 'MEIA 7/8 COM RENDA', price: 29.90 }
];

async function main() {
    console.log('GERANDO 50 PRODUTOS DE LINGERIE EM MAIÚSCULO...');

    let createdCount = 0;

    while (createdCount < 50) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

        const name = `${randomItem.template} ${randomColor} ${randomSize}`;

        // Evitar duplicados se rodar o script várias vezes
        const exists = await prisma.product.findFirst({ where: { name } });
        if (exists) continue;

        const quantity = Math.floor(Math.random() * 25) + 5; // 5 a 30 un

        const product = await prisma.product.create({
            data: {
                name: name.toUpperCase(),
                price: randomItem.price + (Math.random() * 10 - 5), // Variação leve no preço
                quantity: quantity
            }
        });

        // Registrar log de entrada inicial
        await prisma.movementLog.create({
            data: {
                type: 'ENTRY',
                quantity: quantity,
                productId: product.id,
            }
        });

        createdCount++;
        if (createdCount % 10 === 0) console.log(`${createdCount} PRODUTOS CRIADOS...`);
    }

    console.log('✅ 50 PRODUTOS DE LINGERIE CADASTRADOS COM SUCESSO!');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
