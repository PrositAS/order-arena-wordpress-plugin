import { CustomerAddressType } from './CustomerAddressType';
import { ID } from './ID';
import { Syncable } from './Syncable';

export interface CustomerAddress extends Syncable {
  id?: ID;
  name?: string;
  orgNo?: string;
  address1: string;
  city: string;
  addressType: CustomerAddressType;
  address2?: string;
  companyName?: string;
  country?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  postcode?: string;
  state?: string;
}
