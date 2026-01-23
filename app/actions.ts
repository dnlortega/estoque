'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { name: 'asc' },
    });
}

export async function createProduct(data: { name: string; price: number; quantity: number; reference?: string }) {
    const product = await prisma.product.create({
        data: {
            ...data,
            name: data.name.toUpperCase(),
            reference: data.reference?.toUpperCase(),
        },
    });

    await prisma.movementLog.create({
        data: {
            type: 'ENTRY',
            quantity: data.quantity,
            productId: product.id,
        },
    });

    revalidatePath('/');
    return product;
}

export async function adjustStock(productId: string, delta: number) {
    const product = await prisma.product.update({
        where: { id: productId },
        data: { quantity: { increment: delta } },
    });

    await prisma.movementLog.create({
        data: {
            type: 'ENTRY',
            quantity: delta,
            productId: productId,
        },
    });

    revalidatePath('/');
    return product;
}

export async function getProductWithMovements(productId: string) {
    return await prisma.product.findUnique({
        where: { id: productId },
        include: {
            movements: {
                orderBy: { timestamp: 'desc' },
                include: { seller: true }
            },
            consignments: {
                include: { seller: true }
            }
        }
    });
}

export async function deleteProductAndMovements(productId: string) {
    // Deletar em ordem para respeitar chaves estrangeiras
    await prisma.movementLog.deleteMany({ where: { productId } });
    await prisma.consignment.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });

    revalidatePath('/produtos');
    revalidatePath('/historico');
    revalidatePath('/consignacao');
    revalidatePath('/');
}

export async function getSellers() {
    return await prisma.seller.findMany({
        orderBy: { name: 'asc' },
        include: {
            consignments: {
                include: {
                    product: true,
                },
            },
        },
    });
}

export async function createSeller(data: { name: string; cpf?: string; rg?: string; address: string; phone: string }) {
    const seller = await prisma.seller.create({
        data: {
            ...data,
            name: data.name.toUpperCase(),
            address: data.address.toUpperCase(),
        },
    });
    revalidatePath('/vendedores');
    return seller;
}

export async function updateSeller(id: string, data: { name: string; cpf?: string; rg?: string; address: string; phone: string }) {
    const seller = await prisma.seller.update({
        where: { id },
        data: {
            ...data,
            name: data.name.toUpperCase(),
            address: data.address.toUpperCase(),
        },
    });
    revalidatePath('/vendedores');
    revalidatePath('/consignacao');
    return seller;
}

export async function deleteSeller(id: string) {
    // Cascading deletion of logs and consignments for this seller
    await prisma.movementLog.deleteMany({ where: { sellerId: id } });
    await prisma.consignment.deleteMany({ where: { sellerId: id } });
    await prisma.seller.delete({ where: { id } });

    revalidatePath('/vendedores');
    revalidatePath('/consignacao');
    revalidatePath('/historico');
}

export async function transferToSeller(productId: string, sellerId: string, quantity: number) {
    // 1. Subtrair do estoque central
    await prisma.product.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
    });

    // 2. Adicionar ou atualizar consignação
    await prisma.consignment.upsert({
        where: {
            sellerId_productId: {
                sellerId,
                productId,
            },
        },
        update: { quantity: { increment: quantity } },
        create: {
            sellerId,
            productId,
            quantity,
        },
    });

    // 3. Registrar log
    await prisma.movementLog.create({
        data: {
            type: 'TRANSFER',
            quantity,
            productId,
            sellerId,
        },
    });

    revalidatePath('/');
    revalidatePath('/consignacao');
}

export async function returnFromSeller(productId: string, sellerId: string, quantity: number) {
    // 1. Verificar se o vendedor tem a quantidade necessária
    const consignment = await prisma.consignment.findUnique({
        where: { sellerId_productId: { sellerId, productId } }
    });

    if (!consignment || consignment.quantity < quantity) {
        throw new Error('SALDO INSUFICIENTE EM CONSIGNAÇÃO.');
    }

    // 2. Subtrair da consignação
    const updated = await prisma.consignment.update({
        where: {
            sellerId_productId: {
                sellerId,
                productId,
            },
        },
        data: { quantity: { decrement: quantity } },
    });

    // 3. Adicionar ao estoque central
    await prisma.product.update({
        where: { id: productId },
        data: { quantity: { increment: quantity } },
    });

    // 4. Registrar log
    await prisma.movementLog.create({
        data: {
            type: 'RETURN',
            quantity,
            productId,
            sellerId,
        },
    });

    // 5. Limpar se chegar a 0
    if (updated.quantity <= 0) {
        await prisma.consignment.delete({
            where: { sellerId_productId: { sellerId, productId } }
        });
    }

    revalidatePath('/');
    revalidatePath('/consignacao');
}

export async function sellFromSeller(productId: string, sellerId: string, quantity: number) {
    // 1. Verificar se o vendedor tem a quantidade necessária
    const consignment = await prisma.consignment.findUnique({
        where: { sellerId_productId: { sellerId, productId } }
    });

    if (!consignment || consignment.quantity < quantity) {
        throw new Error('SALDO INSUFICIENTE EM CONSIGNAÇÃO.');
    }

    // 2. Subtrair da consignação
    const updated = await prisma.consignment.update({
        where: {
            sellerId_productId: {
                sellerId,
                productId,
            },
        },
        data: { quantity: { decrement: quantity } },
    });

    // 3. Registrar log de venda
    await prisma.movementLog.create({
        data: {
            type: 'SALE',
            quantity,
            productId,
            sellerId,
        },
    });

    // 4. Deletar a consignação se a quantidade chegar a 0
    if (updated.quantity <= 0) {
        await prisma.consignment.delete({
            where: { sellerId_productId: { sellerId, productId } }
        });
    }

    revalidatePath('/consignacao');
    revalidatePath('/historico');
}

export async function getLogs() {
    return await prisma.movementLog.findMany({
        orderBy: { timestamp: 'desc' },
        include: {
            product: true,
            seller: true,
        },
        take: 100,
    });
}

export async function getDashboardStats() {
    const products = await prisma.product.findMany();
    const sales = await prisma.movementLog.findMany({
        where: { type: 'SALE' },
        include: { product: true },
    });

    const totalSalesValue = Math.max(0, sales.reduce((acc: number, sale: any) => acc + (sale.quantity * sale.product.price), 0));

    const consignments = await prisma.consignment.findMany({
        include: { product: true }
    });
    const totalInConsignment = Math.max(0, consignments.reduce((acc: number, c: any) => acc + c.quantity, 0));
    const totalInConsignmentValue = Math.max(0, consignments.reduce((acc: number, c: any) => acc + (c.quantity * c.product.price), 0));

    const centralStockValue = Math.max(0, products.reduce((acc: number, p: any) => acc + (p.quantity * p.price), 0));

    return {
        totalSalesValue,
        totalInConsignment,
        totalInConsignmentValue,
        centralStock: Math.max(0, products.reduce((acc: number, p: any) => acc + p.quantity, 0)),
        centralStockValue,
        totalProducts: products.length,
    };
}

export async function deleteLog(id: string) {
    await prisma.movementLog.delete({
        where: { id },
    });
    revalidatePath('/historico');
    revalidatePath('/');
    revalidatePath('/consignacao');
}

export async function getSellerLogs(sellerId: string) {
    return await prisma.movementLog.findMany({
        where: { sellerId },
        orderBy: { timestamp: 'desc' },
        include: {
            product: true,
        },
    });
}

export async function getSellerReceiptData(sellerId: string) {
    const logs = await prisma.movementLog.findMany({
        where: { sellerId },
        include: { product: true },
    });

    const delivered = logs.filter(l => l.type === 'TRANSFER');
    const returned = logs.filter(l => l.type === 'RETURN');
    const sold = logs.filter(l => l.type === 'SALE');

    const qtyDelivered = delivered.reduce((acc, l) => acc + l.quantity, 0);
    const qtyReturned = returned.reduce((acc, l) => acc + l.quantity, 0);
    const qtySold = sold.reduce((acc, l) => acc + l.quantity, 0);

    const valDelivered = delivered.reduce((acc, l) => acc + (l.quantity * l.product.price), 0);
    const valSold = sold.reduce((acc, l) => acc + (l.quantity * l.product.price), 0);

    const currentConsignments = await prisma.consignment.findMany({
        where: { sellerId },
    });
    const qtyCurrent = currentConsignments.reduce((acc, c) => acc + c.quantity, 0);

    return {
        qtyDelivered,
        qtyReturned,
        qtySold,
        qtyCurrent,   // QTD ITENS (em posse)
        valDelivered, // VALOR PEDIDO
        valSold,      // VL TOTAL VENDA
    };
}
