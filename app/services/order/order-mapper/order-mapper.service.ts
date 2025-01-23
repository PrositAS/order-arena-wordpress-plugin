import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { utc } from 'moment';
import { AddressType } from 'src/@types/order-arena-user-portal/Address';
import { ArticleType } from 'src/@types/order-arena-user-portal/ArticleType';
import { Company } from 'src/@types/order-arena-user-portal/Company';
import { CompanyAddress } from 'src/@types/order-arena-user-portal/CompanyAddress';
import { Customer } from 'src/@types/order-arena-user-portal/Customer';
import { CustomerAddress } from 'src/@types/order-arena-user-portal/CustomerAddress';
import { AddressForm } from 'src/@types/order-arena-user-portal/forms/AddressForm';
import { DeliveryFormPostData } from 'src/@types/order-arena-user-portal/forms/DeliveryForm';
import { InvoiceForm } from 'src/@types/order-arena-user-portal/forms/InvoiceForm';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { InvoiceType } from 'src/@types/order-arena-user-portal/InvoiceType';
import { OrderNote, OrderSchedule, Order as PastOrder } from 'src/@types/order-arena-user-portal/Order';
import { AdditionalInfo } from 'src/@types/order-arena-user-portal/order-form/AdditionalInfo';
import { Address } from 'src/@types/order-arena-user-portal/order-form/Address';
import { CompanyInvoice } from 'src/@types/order-arena-user-portal/order-form/CompanyInvoice';
import { DeliveryAddress } from 'src/@types/order-arena-user-portal/order-form/DeliveryAddress';
import { DeliveryTime } from 'src/@types/order-arena-user-portal/order-form/DeliveryTime';
import {
  initAddress,
  initDeliveryAddress,
  initInvoice,
  initInvoiceData,
} from 'src/@types/order-arena-user-portal/order-form/InitValues';
import { Invoice } from 'src/@types/order-arena-user-portal/order-form/Invoice';
import { Order, OrderData } from 'src/@types/order-arena-user-portal/order-form/Order';
import { PersonalInvoice } from 'src/@types/order-arena-user-portal/order-form/PersonalInvoice';
import { OrderArticle } from 'src/@types/order-arena-user-portal/OrderArticle';
import { OrderInvoice } from 'src/@types/order-arena-user-portal/OrderInvoice';
import { OrderRequest } from 'src/@types/order-arena-user-portal/OrderRequest';
import { OrderFormPostData, PostOrderArticle } from 'src/@types/order-arena-user-portal/params/PostOrder';
import { PersonalData } from 'src/@types/order-arena-user-portal/PersonalData';
import { User } from 'src/@types/order-arena-user-portal/User';
import { isNullOrUndefined } from 'src/app/@core/utils';

@Injectable()
export class OrderMapperService {
  prepareOrderForRequest(
    order: Partial<Order>,
    minDaysBefore: number,
    minTimespanForDelivery: number,
    articles: PostOrderArticle[]
  ): OrderFormPostData {
    const customer: Customer = order.user && order.user.customer ? order.user.customer : null;
    const isEquipmentDelivery: boolean =
      articles && !!this.filterPostOrderArticlesByType(articles, 'equipment').length;

    const data: OrderFormPostData = {
      userId: customer.id || null,
      acceptTerms: order.termsAndConditions,
      articles: articles || [],
      invoice: this.mapInvoice(order.invoice),
      delivery: this.mapDelivery(order, minTimespanForDelivery, isEquipmentDelivery),
      minDaysBefore: minDaysBefore,
      note: this.mapOrderNote(order, isEquipmentDelivery),
    };

    return data;
  }

  mapPastOrderToOrder(
    pastOrder: PastOrder | OrderRequest,
    user: User = null,
    pastOrderData: OrderData = null,
    orderArticles: PostOrderArticle[] = []
  ): Order {
    if (pastOrder) {
      const orderData: OrderData = pastOrderData || this.mapPastOrderToOrderData(pastOrder);
      const deliveryTime: DeliveryTime = this.mapOrderScheduleToDeliveryTime(pastOrder.orderSchedule);
      const additionalInfo: AdditionalInfo = this.mapOrderNoteAndNumberOfPersonsToAdditionalInfo(
        pastOrder.orderNote,
        pastOrder.orderPeople?.numberOfPersons
      );

      const order: Order = {
        user,
        isOrderArticlesValid: orderArticles && !!orderArticles.length,
        isPickup: pastOrder.orderSchedule.pickup || false,
        pastOrderData: orderData,
        invoice: { ...initInvoice },
        deliveryAddress: { ...initDeliveryAddress },
        deliveryTime,
        additionalInfo,
        termsAndConditions: false,
      };

      return order;
    }

    return null;
  }

  mapPastOrderToOrderData(pastOrder: PastOrder | OrderRequest): OrderData {
    if (pastOrder) {
      const orderInvoice: OrderInvoice = pastOrder.invoice || null;
      const invoiceType: InvoiceType = pastOrder ? pastOrder.invoice.invoiceType : null;
      const invoice: Invoice = this.mapOrderInvoiceToInvoice(orderInvoice);
      const invoiceAddress: Address =
        invoice && invoice[invoiceType === 'person' ? 'personalInvoice' : 'companyInvoice']
          ? invoice[invoiceType === 'person' ? 'personalInvoice' : 'companyInvoice'].address
          : { ...initAddress };

      const customerAddress: CustomerAddress = pastOrder.orderAddress || null;
      const address: Address = this.mapSourceToAddress(customerAddress);

      const useInvoiceAddress: boolean =
        !isNullOrUndefined(invoiceAddress) && !isNullOrUndefined(address)
          ? JSON.stringify(invoiceAddress) === JSON.stringify(address)
          : false;
      const deliveryAddress: DeliveryAddress = {
        useInvoiceAddress: useInvoiceAddress,
        address: useInvoiceAddress ? { ...initAddress } : address,
      };

      const orderData: OrderData = {
        id: pastOrder.id || 'new',
        invoice,
        deliveryAddress,
      };
      return orderData;
    }

    return null;
  }

  createOrderData(
    invoice: Partial<Invoice>,
    deliveryAddress: Partial<DeliveryAddress>,
    id: ID = 'new'
  ): OrderData {
    return {
      id,
      invoice: { ...JSON.parse(JSON.stringify(initInvoice)), ...invoice },
      deliveryAddress: { ...JSON.parse(JSON.stringify(initDeliveryAddress)), ...deliveryAddress },
    } as OrderData;
  }

  mapOrderScheduleToDeliveryTime(orderSchedule: OrderSchedule): DeliveryTime {
    if (orderSchedule) {
      const deliveryTime: DeliveryTime = {
        date: utc().startOf('day'),
        deliveryStart: this.mapStringToTime(orderSchedule.deliveryStart),
        deliveryEnd: this.mapStringToTime(orderSchedule.deliveryEnd),
        eatingTime:
          typeof orderSchedule.serveAt === 'string'
            ? this.mapStringToTime(orderSchedule.serveAt)
            : typeof orderSchedule.serveAt === 'object'
            ? this.mapDateToTime(orderSchedule.serveAt)
            : null,
      };

      return deliveryTime;
    }

    return null;
  }

  mapOrderNoteAndNumberOfPersonsToAdditionalInfo(
    orderNote: OrderNote,
    numberOfPersons: number
  ): AdditionalInfo {
    if (orderNote) {
      const additionalInfo: AdditionalInfo = {
        doDeliveryInfo: !!orderNote.delivery,
        deliveryInfo: orderNote.delivery || null,
        guests: numberOfPersons || null,
        notes: orderNote.orderNote || null,
      };

      return additionalInfo;
    }

    return null;
  }

  mapUserToOrderData(user: User): Partial<OrderData> {
    const customer: Customer = user?.customer;

    if (!customer) {
      return null;
    }

    const customerData: PersonalData = this.mapSourceToPersonalData(customer);
    const company: Company = !!customer.companies?.length ? customer.companies[0] : null;
    const hasCompanyAddresses: boolean = !!company?.addresses?.length;
    const address: Address = this.mapSourceToAddress(
      (
        (hasCompanyAddresses
          ? company.addresses
          : !!customer?.customerAddresses?.length
          ? customer.customerAddresses
          : []) as Array<CustomerAddress | CompanyAddress>
      ).find((address: CustomerAddress | CompanyAddress) => address.addressType === 'invoice')
    );

    const orderData: Partial<OrderData> = {
      invoice: {
        ...initInvoice,

        forCompany: company ? true : false,
        ...(company && {
          companyInvoice: {
            ...customerData,
            company: company.name,
            companyNumber: company.orgNo,
            ...(hasCompanyAddresses && address && { address }),
          },
        }),
        ...(!company && {
          personalInvoice: {
            ...customerData,
            ...(!hasCompanyAddresses && address && { address }),
          },
        }),
      },
      deliveryAddress: {
        ...initDeliveryAddress,
        useInvoiceAddress: !!address,
      },
    };

    return orderData;
  }

  filterOrderArticlesByType(articles: OrderArticle[], type: ArticleType): OrderArticle[] {
    if (!articles?.length) {
      return [];
    }

    switch (type) {
      case 'venue':
        return articles.filter((a) => !isNullOrUndefined(a.article.venue));
      case 'food':
        return articles.filter((a) => !isNullOrUndefined(a.article.food));
      case 'equipment':
        return articles.filter((a) => !isNullOrUndefined(a.article.equipment));
    }

    //     mapped.articles.forEach((oa) => {
    //       oa._basic = oa.childArticles
    //         .filter((child) => !child.isExtra)
    //         .map((child) => child.name)
    //         .join(', ');
    //       oa._extra = oa.childArticles.filter((child) => child.isExtra);
    //     });
  }

  filterPostOrderArticlesByType(articles: PostOrderArticle[], type: ArticleType): PostOrderArticle[] {
    if (!articles?.length) {
      return [];
    }

    switch (type) {
      case 'venue':
        return articles.filter((a) => a.isVenue);
      case 'food':
        return articles.filter((a) => a.isFood);
      case 'equipment':
        return articles.filter((a) => a.isEquipment);
    }

    //     mapped.articles.forEach((oa) => {
    //       oa._basic = oa.childArticles
    //         .filter((child) => !child.isExtra)
    //         .map((child) => child.name)
    //         .join(', ');
    //       oa._extra = oa.childArticles.filter((child) => child.isExtra);
    //     });
  }

  mapSourceToAddress(
    source: CustomerAddress | CompanyAddress | OrderInvoice,
    isOrderInvoice: boolean = false
  ): Address {
    if (!source) {
      return null;
    }

    const address: Address = {
      id: !isOrderInvoice ? source.id : null,
      street: source.address1 ?? null,
      apartment: source.address2 ?? null,
      postal: source.postcode ?? null,
      city: source.city ?? null,
    };

    return address;
  }

  concatAddressStreetAndApartment(address: Address): string {
    if (!address) {
      return null;
    }

    if (!address.apartment) {
      return address.street;
    }

    return `${address.street} ${address.apartment}`;
  }

  isSameAddress(a1: Address, a2: Address): boolean {
    if (!a1 || !a2) {
      return false;
    }

    return (
      this.concatAddressStreetAndApartment(a1) === this.concatAddressStreetAndApartment(a2) &&
      a1.postal === a2.postal &&
      a1.city === a2.city
    );
  }

  isSameOrderData(o1: OrderData, o2: OrderData): boolean {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    const forCompanyMatches: boolean = o1.invoice.forCompany === o2.invoice.forCompany;

    const o1InvoiceAddress: Address =
      o1.invoice[o1.invoice.forCompany ? 'companyInvoice' : 'personalInvoice'].address;
    const o2InvoiceAddress: Address =
      o2.invoice[o2.invoice.forCompany ? 'companyInvoice' : 'personalInvoice'].address;
    const invoiceAddressMatches: boolean =
      o1InvoiceAddress.id === o2InvoiceAddress.id && this.isSameAddress(o1InvoiceAddress, o2InvoiceAddress);

    const o1PersonalData: PersonalData = this.getInvoicePersonalData(o1.invoice);
    const o2PersonalData: PersonalData = this.getInvoicePersonalData(o2.invoice);
    const personalDataMatches: boolean =
      o1PersonalData.name === o2PersonalData.name &&
      o1PersonalData.surname === o2PersonalData.surname &&
      o1PersonalData.email === o2PersonalData.email &&
      o1PersonalData.phone === o2PersonalData.phone;

    const forCompany: boolean = forCompanyMatches && o1.invoice.forCompany && o2.invoice.forCompany;
    const companyDataMatches: boolean =
      (forCompany &&
        o1.invoice.companyInvoice.company === o2.invoice.companyInvoice.company &&
        o1.invoice.companyInvoice.companyNumber === o2.invoice.companyInvoice.companyNumber) ||
      true;

    const useInvoiceAddressMatches: boolean =
      o1.deliveryAddress.useInvoiceAddress === o2.deliveryAddress.useInvoiceAddress;
    const useInvoiceAddress: boolean =
      useInvoiceAddressMatches &&
      o1.deliveryAddress.useInvoiceAddress &&
      o2.deliveryAddress.useInvoiceAddress;
    const deliveryAddressMatches: boolean = useInvoiceAddress
      ? invoiceAddressMatches
      : o1.deliveryAddress.address.id === o2.deliveryAddress.address.id;

    return (
      forCompanyMatches &&
      invoiceAddressMatches &&
      personalDataMatches &&
      companyDataMatches &&
      deliveryAddressMatches
    );
  }

  mapDateToTime(date: Date): Time {
    if (date) {
      const hours: number = date.getUTCHours();
      const minutes: number = date.getUTCMinutes();

      return { hours, minutes };
    }

    return null;
  }

  mapStringToTime(time: string): Time {
    if (time && time.length === 5) {
      const hours: number = parseInt(time.split(':')[0], 10);
      const minutes: number = parseInt(time.split(':')[1], 10);

      return { hours, minutes };
    }

    return null;
  }

  mapTimeToString(time: Time): string {
    if (time) {
      const hours: number = time.hours;
      const minutes: number = time.minutes;

      return `${hours}:${(minutes >= 0 && minutes < 10 ? `0${minutes}` : `${minutes}`).slice(0, 2)}`;
    }

    return null;
  }

  private mapOrderInvoiceToInvoice(orderInvoice: OrderInvoice): Invoice {
    if (!orderInvoice) {
      return null;
    }

    const isPersonalInvoice: boolean = orderInvoice.invoiceType && orderInvoice.invoiceType === 'person';
    const personalData: PersonalData = this.mapSourceToPersonalData(orderInvoice);
    const address: Address = this.mapSourceToAddress(orderInvoice, true);

    const invoice: Invoice = {
      forCompany: !isPersonalInvoice,
      personalInvoice: isPersonalInvoice
        ? {
            ...personalData,
            address: address,
          }
        : { ...initInvoiceData },
      companyInvoice: !isPersonalInvoice
        ? {
            ...personalData,
            company: orderInvoice.company || null,
            companyNumber: orderInvoice.orgNo || null,
            address: address,
          }
        : { ...initInvoiceData, company: null, companyNumber: null },
    };

    return invoice;
  }

  private mapSourceToPersonalData(source: Customer | OrderInvoice): PersonalData {
    if (!source) {
      return null;
    }

    return {
      name: source.firstName ?? null,
      surname: source.lastName ?? null,
      email: source.email ?? null,
      phone: source.phone ?? null,
    };
  }

  private getInvoiceAddress(invoice: Partial<Invoice>): Address {
    if (!invoice) {
      return null;
    }

    const forCompany: boolean = invoice.forCompany;
    const info: PersonalInvoice | CompanyInvoice = forCompany
      ? invoice.companyInvoice
      : invoice.personalInvoice;
    const address: Address = info.address || null;

    return address;
  }

  private mapAddressToAddressForm(address: Address, addressType: AddressType = 'contact'): AddressForm {
    if (!address) {
      return null;
    }

    const addressData: AddressForm = {
      id: address.id ?? null,
      address: this.concatAddressStreetAndApartment(address),
      postal: address.postal ?? null,
      city: address.city ?? null,
      addressType: addressType,
    };

    return addressData;
  }

  private mapInvoiceToAddressForm(invoice: Partial<Invoice>, addressType: AddressType): AddressForm {
    if (!invoice) {
      return null;
    }

    return this.mapAddressToAddressForm(this.getInvoiceAddress(invoice), addressType);
  }

  getInvoicePersonalData(invoice: Partial<Invoice>): PersonalData {
    if (!invoice) {
      return null;
    }

    const forCompany: boolean = invoice.forCompany;
    const info: PersonalInvoice | CompanyInvoice = forCompany
      ? invoice.companyInvoice
      : invoice.personalInvoice;

    const personalData: PersonalData = {
      name: info.name || null,
      surname: info.surname || null,
      email: info.email || null,
      phone: info.phone || null,
    };

    return personalData;
  }

  private mapInvoice(invoice: Partial<Invoice>): InvoiceForm {
    if (!invoice) {
      return { invoiceType: 'person' } as InvoiceForm;
    }

    const forCompany: boolean = invoice.forCompany;
    const { email: personalEmail, ...personalData }: PersonalData = this.getInvoicePersonalData(invoice);
    const { id: addressId, ...addressData } = this.mapInvoiceToAddressForm(invoice, 'contact');

    const invoiceData: InvoiceForm = {
      invoiceType: forCompany ? 'company' : 'person',
      ...personalData,
      ...addressData,
      ...(forCompany && {
        company: invoice.companyInvoice.company ?? null,
        orgNo: invoice.companyInvoice.companyNumber ?? null,
      }),
      reference: null,
    };

    return invoiceData;
  }

  private mapDeliveryAddressToAddressForm(
    order: Partial<Order>,
    addressType: AddressType = 'contact'
  ): AddressForm {
    if (!order.deliveryAddress) {
      return null;
    }

    const address: Address = order.deliveryAddress.useInvoiceAddress
      ? this.getInvoiceAddress(order.invoice)
      : order.deliveryAddress.address;

    return this.mapAddressToAddressForm(address, addressType);
  }

  private mapDelivery(
    order: Partial<Order>,
    minTimespanForDelivery: number,
    isEquipmentDelivery: boolean = false
  ): DeliveryFormPostData {
    const deliveryCoreData: Pick<
      DeliveryFormPostData,
      | 'dateTime'
      | 'deliveryStart'
      | 'deliveryEnd'
      | 'minTimespanForDelivery'
      | 'pickup'
      | 'address'
      | 'message'
      | 'numberOfPersons'
    > = {
      dateTime: null,
      deliveryStart: null,
      deliveryEnd: null,
      minTimespanForDelivery: minTimespanForDelivery,
      pickup: false,
      address: null,
      message: null,
      numberOfPersons: null,
    };

    const dateTime: string = order.deliveryTime?.date?.clone().format('YYYY-MM-DD') ?? null;
    const deliveryStart: string = order.deliveryTime?.deliveryStart
      ? this.mapTimeToString(order.deliveryTime.deliveryStart)
      : null;
    const deliveryEnd: string = order.deliveryTime?.deliveryEnd
      ? this.mapTimeToString(order.deliveryTime.deliveryEnd)
      : null;

    deliveryCoreData.dateTime = dateTime;
    deliveryCoreData.deliveryStart = deliveryStart;
    deliveryCoreData.deliveryEnd = deliveryEnd;

    deliveryCoreData.pickup = order.isPickup;
    deliveryCoreData.address = this.mapDeliveryAddressToAddressForm(order);
    deliveryCoreData.message = order.additionalInfo?.doDeliveryInfo
      ? order.additionalInfo.deliveryInfo
      : null;
    deliveryCoreData.numberOfPersons = order.additionalInfo ? order.additionalInfo.guests : null;

    const deliveryEquipmentData: Pick<DeliveryFormPostData, 'equipmentDelivery' | 'equipmentReturn'> =
      // NOTE: check timespan for equipment delivery ('shouldn't be less than 30 minutes'), confirm with client
      order.deliveryTime && isEquipmentDelivery
        ? {
            equipmentDelivery: {
              deliveryType: order.isPickup ? 'pick_up_by_customer' : 'to_be_delivered',
              daysPrior: 0,
              timeFrom: deliveryStart,
              timeTo: deliveryEnd,
              ...(!order.isPickup && { address: deliveryCoreData.address }),
            },
            equipmentReturn: {
              returnType: order.isPickup ? 'delivered_by_customer' : 'to_be_pick_up',
              daysAfter: 0,
              timeFrom: deliveryStart,
              timeTo: deliveryEnd,
              ...(!order.isPickup && { address: deliveryCoreData.address }),
            },
          }
        : null;

    const deliveryData: DeliveryFormPostData = {
      ...deliveryCoreData,
      ...(deliveryEquipmentData && { ...deliveryEquipmentData }),
    };

    return deliveryData;
  }

  private mapOrderNote(order: Partial<Order>, isEquipmentDelivery: boolean): string {
    const notes: string[] = [];

    if (order.additionalInfo?.notes) {
      notes.push(order.additionalInfo.notes);
    }

    if (isEquipmentDelivery) {
      // NOTE: check for translation?
      notes.push('Kontakt kunde om utstyrslevering!');
    }

    return notes.join('\n');
  }
}
