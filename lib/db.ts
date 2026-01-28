import Dexie, { Table } from 'dexie';

export interface QueuedAction {
    id?: number;
    actionName: string;
    args: any[];
    timestamp: number;
}

export class OfflineDB extends Dexie {
    queuedActions!: Table<QueuedAction>;
    products!: Table<any>;
    sellers!: Table<any>;

    constructor() {
        super('OfflineDB');
        this.version(2).stores({
            queuedActions: '++id, actionName, timestamp',
            products: 'id, name',
            sellers: 'id, name'
        });
    }
}

export const db = new OfflineDB();
