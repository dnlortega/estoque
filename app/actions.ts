'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { name: 'asc' },
    });
}

export async function createProduct(data: { name: string; price: number; quantity: number }) {
    const product = await prisma.product.create({
        data,
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

export async function createSeller(data: { name: string; cpf: string; address: string; phone: string }) {
    const seller = await prisma.seller.create({
        data,
    });
    revalidatePath('/vendedores');
    return seller;
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
    // 1. Subtrair da consignação
    await prisma.consignment.update({
        where: {
            sellerId_productId: {
                sellerId,
                productId,
            },
        },
        data: { quantity: { decrement: quantity } },
    });

    // 2. Adicionar ao estoque central
    await prisma.product.update({
        where: { id: productId },
        data: { quantity: { increment: quantity } },
    });

    // 3. Registrar log
    await prisma.movementLog.create({
        data: {
            type: 'RETURN',
            quantity,
            productId,
            sellerId,
        },
    });

    revalidatePath('/');
    revalidatePath('/consignacao');
}

export async function sellFromSeller(productId: string, sellerId: string, quantity: number) {
    // 1. Subtrair da consignação
    await prisma.consignment.update({
        where: {
            sellerId_productId: {
                sellerId,
                productId,
            },
        },
        data: { quantity: { decrement: quantity } },
    });

    // 2. Registrar log de venda
    await prisma.movementLog.create({
        data: {
            type: 'SALE',
            quantity,
            productId,
            sellerId,
        },
    });

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
