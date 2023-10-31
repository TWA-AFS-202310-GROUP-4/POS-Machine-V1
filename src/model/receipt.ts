import { QuantityInfo } from './quantityInfo'

export interface ReceiptItem{
    name:string;
    quantity:QuantityInfo;
    unitPrice:number;
    subTotal:number;
    discountTotal:number;
}
