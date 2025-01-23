import { Address } from './Address';
import { CompanyInvoice } from './CompanyInvoice';
import { DeliveryAddress } from './DeliveryAddress';
import { Invoice } from './Invoice';
import { OrderData } from './Order';
import { PersonalInvoice } from './PersonalInvoice';

export const noEventControlOptions = {
  onlySelf: true,
  emitEvent: false,
};

export const initPersonalData: Pick<
  PersonalInvoice | CompanyInvoice,
  'name' | 'surname' | 'email' | 'phone'
> = {
  name: null,
  surname: null,
  email: null,
  phone: null,
};
export const initAddress: Address = {
  id: null,
  street: null,
  apartment: null,
  postal: null,
  city: null,
};
export const initInvoiceData: Pick<
  PersonalInvoice | CompanyInvoice,
  'name' | 'surname' | 'email' | 'phone' | 'address'
> = { ...initPersonalData, address: { ...initAddress } };
export const initInvoice: Invoice = {
  forCompany: false,
  personalInvoice: {
    ...initInvoiceData,
  },
  companyInvoice: {
    ...initInvoiceData,
    company: null,
    companyNumber: null,
  },
};

export const initDeliveryAddress: DeliveryAddress = {
  useInvoiceAddress: false,
  address: { ...initAddress },
};

export const initOrderData: OrderData = {
  id: 'new',
  invoice: { ...initInvoice },
  deliveryAddress: { ...initDeliveryAddress },
};
