import Dexie, { Table } from 'dexie';

export interface QueuedAction {
    id?: number;
    actionName: string;
    args: any[];
    timestamp: number;
}

export class OfflineDB extends Dexie {
    queuedActions!: Table<QueuedAction>;

    constructor() {
        super('OfflineDB');
        this.version(1).stores({
            queuedActions: '++id, actionName, timestamp'
        });
    }
}

export const db = new OfflineDB();
