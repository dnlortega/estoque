import {
    createProduct,
    adjustStock,
    transferToSeller,
    returnFromSeller,
    sellFromSeller,
    createSeller,
    updateSeller,
    deleteSeller,
    deleteProductAndMovements,
    deleteLog,
    getProducts,
    getSellers
} from '@/app/actions';
import { db } from './db';
import { toast } from 'sonner';

const ACTIONS_MAP: Record<string, Function> = {
    createProduct,
    adjustStock,
    transferToSeller,
    returnFromSeller,
    sellFromSeller,
    createSeller,
    updateSeller,
    deleteSeller,
    deleteProductAndMovements,
    deleteLog
};

export async function queueAction(actionName: string, args: any[]) {
    const gps = await getGPSLocation();

    // Adiciona o GPS como último argumento se a ação esperar
    // A maioria das nossas ações agora espera gps?: { lat: number; lng: number }
    const updatedArgs = [...args, gps];

    if (typeof window !== 'undefined' && !navigator.onLine) {
        await db.queuedActions.add({
            actionName,
            args: updatedArgs,
            timestamp: Date.now()
        });

        // --- ATUALIZAÇÃO OTIMISTA LOCAL ---
        await performOptimisticUpdate(actionName, updatedArgs);

        toast.info('VOCÊ ESTÁ OFFLINE. AÇÃO SALVA E APLICADA LOCALMENTE.');
        return { offline: true };
    }

    try {
        const action = ACTIONS_MAP[actionName];
        if (!action) throw new Error(`Ação ${actionName} não encontrada.`);

        const result = await action(...updatedArgs);

        // Sincroniza o banco local com o resultado real se disponível
        await performOptimisticUpdate(actionName, updatedArgs);

        return { success: true, result };
    } catch (error) {
        // Se falhar por rede mesmo estando "online", salva no cache
        if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Network'))) {
            await db.queuedActions.add({
                actionName,
                args: updatedArgs,
                timestamp: Date.now()
            });

            await performOptimisticUpdate(actionName, updatedArgs);

            toast.info('ERRO DE CONEXÃO. AÇÃO SALVA E APLICADA LOCALMENTE.');
            return { offline: true };
        }
        throw error;
    }
}

async function performOptimisticUpdate(actionName: string, args: any[]) {
    try {
        switch (actionName) {
            case 'createProduct': {
                const [data] = args;
                await db.products.put({
                    id: `temp-${Date.now()}`,
                    ...data,
                    name: data.name.toUpperCase(),
                    quantity: Number(data.quantity)
                });
                break;
            }
            case 'adjustStock': {
                const [productId, delta] = args;
                const product = await db.products.get(productId);
                if (product) {
                    await db.products.update(productId, {
                        quantity: product.quantity + delta
                    });
                }
                break;
            }
            case 'deleteProductAndMovements': {
                const [productId] = args;
                await db.products.delete(productId);
                break;
            }
            case 'createSeller': {
                const [data] = args;
                await db.sellers.put({
                    id: `temp-${Date.now()}`,
                    ...data,
                    name: data.name.toUpperCase(),
                    consignments: []
                });
                break;
            }
            case 'updateSeller': {
                const [id, data] = args;
                await db.sellers.update(id, {
                    ...data,
                    name: data.name.toUpperCase()
                });
                break;
            }
            case 'deleteSeller': {
                const [id] = args;
                await db.sellers.delete(id);
                break;
            }
            case 'transferToSeller': {
                const [productId, sellerId, quantity] = args;
                const product = await db.products.get(productId);
                if (product) {
                    await db.products.update(productId, { quantity: product.quantity - quantity });
                }
                const seller = await db.sellers.get(sellerId);
                if (seller) {
                    const consignments = [...(seller.consignments || [])];
                    const idx = consignments.findIndex((c: any) => c.productId === productId);
                    if (idx > -1) {
                        consignments[idx].quantity += quantity;
                    } else {
                        consignments.push({ productId, sellerId, quantity, product });
                    }
                    await db.sellers.update(sellerId, { consignments });
                }
                break;
            }
            case 'returnFromSeller': {
                const [productId, sellerId, quantity] = args;
                const product = await db.products.get(productId);
                if (product) {
                    await db.products.update(productId, { quantity: product.quantity + quantity });
                }
                const seller = await db.sellers.get(sellerId);
                if (seller) {
                    const consignments = (seller.consignments || []).map((c: any) => {
                        if (c.productId === productId) {
                            return { ...c, quantity: c.quantity - quantity };
                        }
                        return c;
                    }).filter((c: any) => c.quantity > 0);
                    await db.sellers.update(sellerId, { consignments });
                }
                break;
            }
            case 'sellFromSeller': {
                const [productId, sellerId, quantity] = args;
                const seller = await db.sellers.get(sellerId);
                if (seller) {
                    const consignments = (seller.consignments || []).map((c: any) => {
                        if (c.productId === productId) {
                            return { ...c, quantity: c.quantity - quantity };
                        }
                        return c;
                    }).filter((c: any) => c.quantity > 0);
                    await db.sellers.update(sellerId, { consignments });
                }
                break;
            }
        }
    } catch (error) {
        console.error('Erro na atualização otimista:', error);
    }
}

async function getGPSLocation(): Promise<{ lat: number; lng: number } | undefined> {
    if (typeof window === 'undefined' || !navigator.geolocation) return undefined;

    try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
        return {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
    } catch (error) {
        console.error('Erro ao obter GPS:', error);
        return undefined;
    }
}

export async function syncOfflineActions() {
    const actions = await db.queuedActions.orderBy('timestamp').toArray();
    if (actions.length === 0) return;

    toast.loading(`SINCRONIZANDO ${actions.length} ALTERAÇÕES...`, { id: 'sync' });

    for (const item of actions) {
        try {
            const action = ACTIONS_MAP[item.actionName];
            if (action) {
                await action(...item.args);
            }
            await db.queuedActions.delete(item.id!);
        } catch (error) {
            console.error(`Falha ao sincronizar ${item.actionName}:`, error);
        }
    }

    toast.success('SINCRONIZAÇÃO CONCLUÍDA!', { id: 'sync' });

    // Atualiza o banco local com os dados reais do servidor após a sincronização
    await refreshDatabase();
}

export async function refreshDatabase() {
    try {
        const [products, sellers] = await Promise.all([
            getProducts(),
            getSellers()
        ]);

        await db.products.clear();
        await db.products.bulkAdd(products);

        await db.sellers.clear();
        await db.sellers.bulkAdd(sellers);
    } catch (error) {
        console.error('Erro ao atualizar banco local:', error);
    }
}
