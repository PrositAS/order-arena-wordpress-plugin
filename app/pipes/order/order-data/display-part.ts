import { Address } from 'src/@types/order-arena-user-portal/order-form/Address';
import { CompanyInvoice } from 'src/@types/order-arena-user-portal/order-form/CompanyInvoice';
import { PersonalInvoice } from 'src/@types/order-arena-user-portal/order-form/PersonalInvoice';

export const customerDisplayParts = ['company', 'name', 'surname', 'email', 'phone'] as const;
export type CustomerDisplayPart = (typeof customerDisplayParts)[number];

export function displayCustomerData(
  invoice: PersonalInvoice | CompanyInvoice,
  displayParts: CustomerDisplayPart[] = [...customerDisplayParts]
): string {
  return invoice
    ? displayParts
        .reduce((parts: string[], part) => {
          if (invoice[part]) {
            parts.push(invoice[part]);
          }
          return parts;
        }, [])
        .join(' ')
    : '';
}

export const addressDisplayParts = ['street', 'apartment', 'postal', 'city'] as const;
export type AddressDisplayPart = (typeof addressDisplayParts)[number];

export function displayAddressData(
  address: Address,
  displayParts: AddressDisplayPart[] = [...addressDisplayParts]
): string {
  return address
    ? displayParts
        .reduce((parts: string[], part) => {
          if (address[part]) {
            parts.push(address[part]);
          }
          return parts;
        }, [])
        .join(' ')
    : '';
}
