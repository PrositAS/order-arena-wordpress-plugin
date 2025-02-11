import { OrderDeliveryAction, OrderPickupAction } from '../Order';
import { DeliveryType } from '../DeliveryType';
import { AddressForm } from './AddressForm';

export interface DeliveryForm {
  dateTime: Date;
  address: AddressForm;
  pickup: boolean;
  message?: string;
  numberOfPersons: number;
  deliveryStart: string;
  deliveryEnd: string;
  minTimespanForDelivery: number;
  equipmentDelivery: {
    daysPrior: number;
    timeFrom: string;
    timeTo: string;
    deliveryType: DeliveryType;
    address?: AddressForm;
  };
  equipmentReturn: {
    daysAfter: number;
    timeFrom: string;
    timeTo: string;
    returnType: DeliveryType;
    address?: AddressForm;
  };
}

export interface DeliveryFormPostData {
  dateTime: string;
  address: AddressForm;
  pickup: boolean;
  message?: string;
  numberOfPersons: number;
  deliveryStart: string;
  deliveryEnd: string;
  minTimespanForDelivery: number;
  equipmentDelivery: {
    daysPrior: number;
    timeFrom: string;
    timeTo: string;
    deliveryType: OrderDeliveryAction;
    address?: AddressForm;
  };
  equipmentReturn: {
    daysAfter: number;
    timeFrom: string;
    timeTo: string;
    returnType: OrderPickupAction;
    address?: AddressForm;
  };
}
