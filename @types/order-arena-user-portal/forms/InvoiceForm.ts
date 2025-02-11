export interface InvoiceForm {
  invoiceType: 'person' | 'company';
  name?: string;
  surname?: string;
  address?: string;
  postal?: string;
  city?: string;
  phone: string;
  company?: string;
  orgNo?: string;
  reference?: string;
  addressType?: string;
}
