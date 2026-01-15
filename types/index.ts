export type MovementType = 'ENTRY' | 'TRANSFER' | 'RETURN' | 'SALE';

export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
    consignments?: Consignment[];
    movements?: MovementLog[];
}

export interface Seller {
    id: string;
    name: string;
    cpf: string;
    address: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    consignments: Consignment[];
    movements?: MovementLog[];
}

export interface Consignment {
    id: string;
    sellerId: string;
    productId: string;
    quantity: number;
    seller?: Seller;
    product: Product;
}

export interface MovementLog {
    id: string;
    type: MovementType;
    quantity: number;
    productId: string;
    sellerId?: string;
    timestamp: Date;
    product: Product;
    seller?: Seller;
}
