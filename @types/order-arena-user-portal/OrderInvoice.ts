import { ID } from './ID';
import { InvoiceType } from './InvoiceType';

export type OrderInvoice = {
  id: ID;
  invoiceType: InvoiceType;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phone2?: string;
  address1: string;
  address2?: string;
  postcode?: string;
  city: string;
  state?: string;
  country?: string;
  company?: string;
  orgNo?: string;
  referenceNo?: string;
};
