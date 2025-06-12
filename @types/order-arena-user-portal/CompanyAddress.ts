import { CompanyAddressType } from './CompanyAddressType';
import { ID } from './ID';
import { Syncable } from './Syncable';

export interface CompanyAddress extends Syncable {
  id?: ID;
  address1: string;
  address2?: string;
  addressType: CompanyAddressType;
  city: string;
  companyId: ID;
  country?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  postcode?: string;
  state?: string;
}
