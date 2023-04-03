import {OrderItem} from "./OrderItem";

export interface Order {
    id: number;
    number: string;
    date: Date;
    providerId: number;
    providerName: string;
    orderItems: OrderItem[];
}
