import { ArticleImage, VatRate } from '../Article';
import { DeliveryForm, DeliveryFormPostData } from '../forms/DeliveryForm';
import { InvoiceForm } from '../forms/InvoiceForm';
import { ID } from '../ID';
import { OrderDeliveryAction, OrderPickupAction } from '../Order';

export interface PostChildArticle {
  articleId: ID;
  quantity: number;
  baseQuantity: number;
  price: number;
  priceMva?: number;
  name?: string;
  description?: string;
  position: number;
  isFood?: boolean;
  isEquipment?: boolean;
  isVenue?: boolean;
  quantityName?: string;
  isExtra?: boolean;
  image?: ArticleImage;
  vatRate: VatRate;
}

export interface PostOrderArticle extends PostChildArticle {
  minPersons?: number;
  childArticles: PostChildArticle[];
}

export interface PostOrderPrice {
  totalPrice: number;
  finalPrice?: number;
  discount?: number;
}

export interface OrderForm {
  userId?: ID;
  articles: PostOrderArticle[];
  invoice: InvoiceForm;
  delivery: DeliveryForm;
  note?: string;
  minDaysBefore?: number;
}

export interface OrderFormPostData {
  userId?: ID;
  articles: PostOrderArticle[];
  invoice: InvoiceForm;
  delivery: DeliveryFormPostData;
  minDaysBefore?: number;
  note?: string;
  acceptTerms?: boolean;
}

export interface PostOrder {
  id?: ID | null;
  status?: string;
  orderPeople: {
    chefs?: number;
    waiters?: number;
    numberOfPersons: number;
  };
  orderEquipmentInput: {
    deliveryAction: OrderDeliveryAction;
    daysBefore?: number;
    deliveryStart?: string;
    deliveryEnd?: string;
    deliveryAddressId?: ID;
    pickupAction: OrderPickupAction;
    pickupDaysAfter?: number;
    pickupAddressId?: ID;
    pickupStart?: string;
    pickupEnd?: string;
  };
  orderSchedule: {
    kitchenReadyAt?: string;
    deliverMinutesBefore?: number;
    serveAt: string;
    drivingMinutesTime?: number;
    deliveryStart: string;
    deliveryEnd: string;
  };
  orderNote: {
    delivery: string;
    external: string;
    internal: string;
  };
  orderPrice?: PostOrderPrice;
  orderArticles: PostOrderArticle[];
  customerId?: ID;
  orderAddressId?: ID;
}
