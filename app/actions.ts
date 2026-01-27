'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- QUERIES ---

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { name: 'asc' },
    });
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

    const qtyDelivered = delivered.reduce((acc, l) => acc + (l.quantity || 0), 0);
    const qtyReturned = returned.reduce((acc, l) => acc + (l.quantity || 0), 0);
    const qtySold = sold.reduce((acc, l) => acc + (l.quantity || 0), 0);

    const valDelivered = delivered.reduce((acc, l) => acc + ((l.quantity || 0) * (l.product?.price || 0)), 0);
    const valSold = sold.reduce((acc, l) => acc + ((l.quantity || 0) * (l.product?.price || 0)), 0);

    const currentConsignments = await prisma.consignment.findMany({
        where: { sellerId },
    });
    const qtyCurrent = currentConsignments.reduce((acc, c) => acc + c.quantity, 0);

    return {
        qtyDelivered,
        qtyReturned,
        qtySold,
        qtyCurrent,
        valDelivered,
        valSold,
    };
}

export async function getDashboardStats() {
    const [productsStats, salesLogs, consignmentStats] = await Promise.all([
        // Estatísticas de Produtos e Estoque Central
        prisma.product.aggregate({
            _sum: {
                quantity: true,
            },
            _count: {
                id: true,
            }
        }),
        // Logs de Venda para valor total
        prisma.movementLog.findMany({
            where: { type: 'SALE' },
            select: {
                quantity: true,
                product: {
                    select: { price: true }
                }
            }
        }),
        // Consignações para valor e quantidade total
        prisma.consignment.findMany({
            select: {
                quantity: true,
                product: {
                    select: { price: true }
                }
            }
        })
    ]);

    // Valor total do estoque central (precisamos fazer via JS ou Query Raw porque price * quantity não é agregado nativo no aggregate)
    // Para otimizar, pegamos apenas o necessário
    const products = await prisma.product.findMany({
        select: { quantity: true, price: true }
    });

    const centralStockValue = products.reduce((acc, p) => acc + (p.quantity * p.price), 0);
    const totalSalesValue = salesLogs.reduce((acc, log) => acc + (log.quantity * (log.product?.price || 0)), 0);
    const totalInConsignment = consignmentStats.reduce((acc, c) => acc + c.quantity, 0);
    const totalInConsignmentValue = consignmentStats.reduce((acc, c) => acc + (c.quantity * (c.product?.price || 0)), 0);

    return {
        totalSalesValue,
        totalInConsignment,
        totalInConsignmentValue,
        centralStock: productsStats._sum.quantity || 0,
        centralStockValue,
        totalProducts: productsStats._count.id,
    };
}

// --- MUTATIONS ---

export async function createProduct(data: { name: string; price: number; quantity: number; reference?: string }, gps?: { lat: number; lng: number }) {
    const product = await prisma.$transaction(async (tx) => {
        const p = await tx.product.create({
            data: {
                ...data,
                name: data.name.toUpperCase(),
                reference: data.reference?.toUpperCase(),
            },
        });

        await tx.movementLog.create({
            data: {
                type: 'ENTRY',
                quantity: data.quantity,
                productId: p.id,
                latitude: gps?.lat,
                longitude: gps?.lng,
            },
        });

        return p;
    });

    revalidatePath('/');
    return product;
}

export async function adjustStock(productId: string, delta: number, gps?: { lat: number; lng: number }) {
    const product = await prisma.$transaction(async (tx) => {
        const p = await tx.product.update({
            where: { id: productId },
            data: { quantity: { increment: delta } },
        });

        await tx.movementLog.create({
            data: {
                type: 'ENTRY',
                quantity: delta,
                productId: productId,
                latitude: gps?.lat,
                longitude: gps?.lng,
            },
        });

        return p;
    });

    revalidatePath('/');
    return product;
}

export async function deleteProductAndMovements(productId: string) {
    await prisma.$transaction([
        prisma.movementLog.deleteMany({ where: { productId } }),
        prisma.consignment.deleteMany({ where: { productId } }),
        prisma.product.delete({ where: { id: productId } }),
    ]);

    revalidatePath('/produtos');
    revalidatePath('/historico');
    revalidatePath('/consignacao');
    revalidatePath('/');
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
    await prisma.$transaction([
        prisma.movementLog.deleteMany({ where: { sellerId: id } }),
        prisma.consignment.deleteMany({ where: { sellerId: id } }),
        prisma.seller.delete({ where: { id } }),
    ]);

    revalidatePath('/vendedores');
    revalidatePath('/consignacao');
    revalidatePath('/historico');
}

export async function transferToSeller(productId: string, sellerId: string, quantity: number, gps?: { lat: number; lng: number }) {
    await prisma.$transaction(async (tx) => {
        // 1. Subtrair do estoque central
        await tx.product.update({
            where: { id: productId },
            data: { quantity: { decrement: quantity } },
        });

        // 2. Adicionar ou atualizar consignação
        await tx.consignment.upsert({
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
        await tx.movementLog.create({
            data: {
                type: 'TRANSFER',
                quantity,
                productId,
                sellerId,
                latitude: gps?.lat,
                longitude: gps?.lng,
            },
        });
    });

    revalidatePath('/');
    revalidatePath('/consignacao');
}

export async function returnFromSeller(productId: string, sellerId: string, quantity: number, gps?: { lat: number; lng: number }) {
    await prisma.$transaction(async (tx) => {
        const consignment = await tx.consignment.findUnique({
            where: { sellerId_productId: { sellerId, productId } }
        });

        if (!consignment || consignment.quantity < quantity) {
            throw new Error('SALDO INSUFICIENTE EM CONSIGNAÇÃO.');
        }

        const updated = await tx.consignment.update({
            where: {
                sellerId_productId: {
                    sellerId,
                    productId,
                },
            },
            data: { quantity: { decrement: quantity } },
        });

        await tx.product.update({
            where: { id: productId },
            data: { quantity: { increment: quantity } },
        });

        await tx.movementLog.create({
            data: {
                type: 'RETURN',
                quantity,
                productId,
                sellerId,
                latitude: gps?.lat,
                longitude: gps?.lng,
            },
        });

        if (updated.quantity <= 0) {
            await tx.consignment.delete({
                where: { sellerId_productId: { sellerId, productId } }
            });
        }
    });

    revalidatePath('/');
    revalidatePath('/consignacao');
}

export async function sellFromSeller(productId: string, sellerId: string, quantity: number, gps?: { lat: number; lng: number }) {
    await prisma.$transaction(async (tx) => {
        const consignment = await tx.consignment.findUnique({
            where: { sellerId_productId: { sellerId, productId } }
        });

        if (!consignment || consignment.quantity < quantity) {
            throw new Error('SALDO INSUFICIENTE EM CONSIGNAÇÃO.');
        }

        const updated = await tx.consignment.update({
            where: {
                sellerId_productId: {
                    sellerId,
                    productId,
                },
            },
            data: { quantity: { decrement: quantity } },
        });

        await tx.movementLog.create({
            data: {
                type: 'SALE',
                quantity,
                productId,
                sellerId,
                latitude: gps?.lat,
                longitude: gps?.lng,
            },
        });

        if (updated.quantity <= 0) {
            await tx.consignment.delete({
                where: { sellerId_productId: { sellerId, productId } }
            });
        }
    });

    revalidatePath('/consignacao');
    revalidatePath('/historico');
}

export async function deleteLog(id: string) {
    await prisma.movementLog.delete({
        where: { id },
    });
    revalidatePath('/historico');
    revalidatePath('/');
    revalidatePath('/consignacao');
}
