export interface OrderItem {
    id?: number;
    name: string;
    quantity: number;
    unit: string;
    [key: string]: any;
}
