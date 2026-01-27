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
    deleteLog
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
        toast.info('VOCÊ ESTÁ OFFLINE. AÇÃO SALVA PARA SINCRONIZAÇÃO POSTERIOR.');
        return { offline: true };
    }

    try {
        const action = ACTIONS_MAP[actionName];
        if (!action) throw new Error(`Ação ${actionName} não encontrada.`);

        const result = await action(...updatedArgs);
        return { success: true, result };
    } catch (error) {
        // Se falhar por rede mesmo estando "online", salva no cache
        if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Network'))) {
            await db.queuedActions.add({
                actionName,
                args: updatedArgs,
                timestamp: Date.now()
            });
            toast.info('ERRO DE CONEXÃO. AÇÃO SALVA PARA SINCRONIZAÇÃO POSTERIOR.');
            return { offline: true };
        }
        throw error;
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
}
