export const InvoiceType = ['person', 'company'] as const;
export type InvoiceType = (typeof InvoiceType)[number];
