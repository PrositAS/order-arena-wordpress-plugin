import { CompanyAddress } from './CompanyAddress';
import { ID } from './ID';
import { Syncable } from './Syncable';

export interface Company extends Syncable {
  id?: ID;
  name?: string;
  orgNo?: string;
  invoiceAddressId?: ID;
  addresses: CompanyAddress[];
}
