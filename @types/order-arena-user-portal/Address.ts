import { ID } from './ID';
import { Venue } from './Venue';

export type AddressType = 'invoice' | 'contact';

export interface Address {
  active?: boolean;
  address1: string;
  address2?: string;
  addressType: AddressType;
  city: string;
  companyId?: ID;
  companyName?: string;
  country?: string;
  customerId?: ID;
  deletable?: boolean;
  email?: string;
  firstName?: string;
  id: ID;
  kind: string;
  lastName?: string;
  name?: string;
  phone?: string;
  phone2?: string;
  postcode?: string;
  referenceNo?: string;
  saasId?: ID;
  state?: string;
  venue?: Venue;
}
