import { FormControl, FormGroup } from '@angular/forms';
import { ID } from '../ID';
import { User } from '../User';
import { AdditionalInfo, AdditionalInfoForm } from './AdditionalInfo';
import { DeliveryAddress, DeliveryAddressForm } from './DeliveryAddress';
import { DeliveryTime, DeliveryTimeForm } from './DeliveryTime';
import { Invoice, InvoiceForm } from './Invoice';

export type Order = {
  user: User;
  isOrderArticlesValid: boolean;
  isPickup: boolean;
  pastOrderData: OrderData;
  invoice: Invoice;
  deliveryAddress: DeliveryAddress;
  deliveryTime: DeliveryTime;
  additionalInfo: AdditionalInfo;
  termsAndConditions: boolean;
};

export type OrderForm = {
  user: FormControl<User>;
  isOrderArticlesValid: FormControl<boolean>;
  isPickup: FormControl<boolean>;
  pastOrderData: FormControl<OrderData>;
  invoice: FormGroup<InvoiceForm>;
  deliveryAddress: FormGroup<DeliveryAddressForm>;
  deliveryTime: FormGroup<DeliveryTimeForm>;
  additionalInfo: FormGroup<AdditionalInfoForm>;
  termsAndConditions: FormControl<boolean>;
};

export type OrderData = { id: ID } & Pick<Order, 'invoice' | 'deliveryAddress'>;
