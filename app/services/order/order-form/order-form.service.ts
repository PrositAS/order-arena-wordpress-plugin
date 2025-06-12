import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Moment, utc } from 'moment';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  switchMap,
  take,
  tap,
  zip,
} from 'rxjs';
import { CalendarClosedDate } from 'src/@types/order-arena-user-portal/CalendarClosedDate';
import {
  AdditionalInfo,
  AdditionalInfoForm,
} from 'src/@types/order-arena-user-portal/order-form/AdditionalInfo';
import {
  DeliveryAddress,
  DeliveryAddressForm,
} from 'src/@types/order-arena-user-portal/order-form/DeliveryAddress';
import { DeliveryTime, DeliveryTimeForm } from 'src/@types/order-arena-user-portal/order-form/DeliveryTime';
import {
  initDeliveryAddress,
  initInvoice,
  initOrderData,
  noEventControlOptions,
} from 'src/@types/order-arena-user-portal/order-form/InitValues';
import { Invoice, InvoiceForm } from 'src/@types/order-arena-user-portal/order-form/Invoice';
import { Order, OrderData, OrderForm } from 'src/@types/order-arena-user-portal/order-form/Order';
import { OrderRequest } from 'src/@types/order-arena-user-portal/OrderRequest';
import { OrderFormPostData } from 'src/@types/order-arena-user-portal/params/PostOrder';
import { User } from 'src/@types/order-arena-user-portal/User';
import { AuthService } from 'src/app/@core/auth.service';
import { isSameObject } from 'src/app/@core/utils';
import { BasketService } from '../../basket/basket.service';
import { OrderArticlesService } from '../../order-articles/order-articles.service';
import { SaasClosedService } from '../../saas-closed/saas-closed.service';
import { SaasSettingsService } from '../../saas-settings/saas-settings.service';
import { OrderMapperService } from '../order-mapper/order-mapper.service';
import { OrderService } from '../order/order.service';
import { OrdersService } from '../orders/orders.service';
import { OrderTimeService } from './order-time.service';

@Injectable()
export class OrderFormService {
  user$: Observable<User>;
  order$: Observable<Order>;
  pastOrdersData$: Observable<OrderData[]>;
  isPickup$: Observable<boolean>;
  minDeliveryDate$: Observable<Moment>;
  minTimespanForDelivery$: Observable<number>;
  calendarClosedDates$: Observable<CalendarClosedDate[]>;
  maxGuests$: Observable<number>;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private ordersService: OrdersService,
    private basketService: BasketService,
    private settingsService: SaasSettingsService,
    private closedService: SaasClosedService,
    private orderTimeService: OrderTimeService,
    private orderArticlesService: OrderArticlesService,
    private orderMapperService: OrderMapperService
  ) {
    this.user$ = this.authService.user.pipe(
      filter((user) => !!user),
      distinctUntilChanged()
    );
    this.order$ = this.orderService.order$;
    this.pastOrdersData$ = this.ordersService.getUniqueOrdersData(3);
    this.isPickup$ = this.basketService.isPickup;
    this.minDeliveryDate$ = this.settingsService.getMinDeliveryDate();
    this.minTimespanForDelivery$ = this.settingsService.getMinTimespanForDelivery();
    this.calendarClosedDates$ = this.closedService.getCalendarClosedDates();
    this.maxGuests$ = this.calculateMaxGuests();
  }

  initOrderFormWithStoreData(orderForm: FormGroup<OrderForm>): Observable<void> {
    return combineLatest([
      this.user$,
      this.order$,
      this.pastOrdersData$,
      this.minDeliveryDate$,
      this.minTimespanForDelivery$,
      this.calendarClosedDates$,
      this.maxGuests$,
    ]).pipe(
      take(1),
      filter(
        ([
          user,
          order,
          pastOrdersData,
          minDeliveryDate,
          minTimespanForDelivery,
          calendarClosedDates,
          maxGuests,
        ]) =>
          user &&
          order &&
          pastOrdersData &&
          minDeliveryDate &&
          minTimespanForDelivery &&
          !!calendarClosedDates &&
          !!maxGuests
      ),
      tap(
        ([
          user,
          order,
          pastOrdersData,
          minDeliveryDate,
          minTimespanForDelivery,
          calendarClosedDates,
          maxGuests,
        ]) => {
          if (orderForm) {
            if (!order.user || (order.user && user && order.user.id === user.id)) {
              if (!order.user && user) {
                orderForm.controls.user.setValue(user);
                this.updateStore('user', { user: { ...user } });
              }

              if (order) {
                this.updateInvoiceAndDeliveryAddressForms(order, orderForm, user, pastOrdersData);

                this.fillDeliveryTimeForm(
                  orderForm.controls.deliveryTime,
                  order.deliveryTime,
                  minTimespanForDelivery,
                  minDeliveryDate,
                  calendarClosedDates,
                  false,
                  true
                );

                this.fillAdditionalInfoForm(
                  orderForm.controls.additionalInfo,
                  order.additionalInfo,
                  maxGuests,
                  false,
                  true
                );
              }
            }

            orderForm.updateValueAndValidity();
          }
        }
      ),
      map(() => null)
    );
  }

  updateInvoiceAndDeliveryAddressForms(
    order: Order,
    orderForm: FormGroup<OrderForm>,
    user: User,
    pastOrdersData: OrderData[] = []
  ) {
    if (order && orderForm && user) {
      const isPastOrderDataSelected: boolean = order.pastOrderData?.id !== 'new';
      const isDataFilledByUser: boolean =
        (order.invoice && !isSameObject(order.invoice, { ...initInvoice })) ||
        (order.deliveryAddress && !isSameObject(order.deliveryAddress, { ...initDeliveryAddress }));
      const hasPastOrders: boolean = pastOrdersData && !!pastOrdersData.length;

      if (!isPastOrderDataSelected && isDataFilledByUser) {
        this.fillInvoiceForm(orderForm.controls.invoice, order.invoice, false, true);
        this.fillDeliveryAddressForm(orderForm.controls.deliveryAddress, order.deliveryAddress, false, true);
      } else if (isPastOrderDataSelected) {
        orderForm.controls.pastOrderData.setValue(order.pastOrderData, noEventControlOptions);

        this.updateOrderFormWithOrderData(orderForm, order.pastOrderData);
      } else if (!isPastOrderDataSelected && !isDataFilledByUser && hasPastOrders) {
        this.updateStore('pastOrderData', { pastOrderData: pastOrdersData[0] });
        order.pastOrderData = pastOrdersData[0];

        orderForm.controls.pastOrderData.setValue(pastOrdersData[0]);
        this.updateOrderFormWithOrderData(orderForm, pastOrdersData[0]);
      } else {
        const userOrderData: Partial<OrderData> = this.orderMapperService.mapUserToOrderData(user);

        this.updateOrderFormWithOrderData(orderForm, userOrderData);
      }
    }
  }

  updateOrderFormWithOrderData(orderForm: FormGroup<OrderForm>, orderData: Partial<OrderData>) {
    if (orderData) {
      orderForm.controls.invoice.reset({ ...initInvoice, ...orderData.invoice }, noEventControlOptions);
      this.handleInvoiceFormStatus(
        orderForm.controls.invoice,
        orderForm.controls.invoice.controls.forCompany.value
      );
      orderForm.controls.invoice.controls.forCompany.updateValueAndValidity({ onlySelf: true });

      orderForm.controls.deliveryAddress.reset(
        { ...initDeliveryAddress, ...orderData.deliveryAddress },
        noEventControlOptions
      );
      this.handleDeliveryAddressFormStatus(
        orderForm.controls.deliveryAddress,
        orderForm.controls.deliveryAddress.controls.useInvoiceAddress.value
      );
    }
  }

  updateOrderFormPastOrderData(orderForm: FormGroup<OrderForm>, orderData: OrderData) {
    orderForm.controls.pastOrderData.setValue(orderData || { ...initOrderData }, noEventControlOptions);
    this.updateStore('pastOrderData', { pastOrderData: orderData });
  }

  handleInvoiceFormStatus(invoiceForm: FormGroup<InvoiceForm>, forCompany: boolean) {
    if (forCompany) {
      invoiceForm.controls.personalInvoice.disable(noEventControlOptions);
      invoiceForm.controls.companyInvoice.enable(noEventControlOptions);
    } else {
      invoiceForm.controls.personalInvoice.enable(noEventControlOptions);
      invoiceForm.controls.companyInvoice.disable(noEventControlOptions);
    }

    invoiceForm.updateValueAndValidity(noEventControlOptions);
  }

  handleDeliveryAddressFormStatus(
    deliveryAddressForm: FormGroup<DeliveryAddressForm>,
    useInvoiceAddress: boolean
  ) {
    if (useInvoiceAddress) {
      deliveryAddressForm.controls.address.disable(noEventControlOptions);
    } else {
      deliveryAddressForm.controls.address.enable(noEventControlOptions);
    }

    deliveryAddressForm.updateValueAndValidity(noEventControlOptions);
  }

  handleAdditionalInfoFormStatus(additionalInfoForm: FormGroup<AdditionalInfoForm>, doDeliveryInfo: boolean) {
    if (doDeliveryInfo) {
      additionalInfoForm.controls.deliveryInfo.enable(noEventControlOptions);
    } else {
      additionalInfoForm.controls.deliveryInfo.disable(noEventControlOptions);
    }

    additionalInfoForm.updateValueAndValidity(noEventControlOptions);
  }

  validateDeliveryTime(
    deliveryTimeForm: FormGroup<DeliveryTimeForm>,
    deliveryTime: Partial<DeliveryTime>,
    minTimespanForDelivery: number
  ): void {
    if (deliveryTime && this.orderTimeService.isValidTime(deliveryTime.deliveryStart)) {
      const closestDeliveryStart: Time = this.validateDeliveryStart(deliveryTime);
      const closestDeliveryEnd: Time = this.validateDeliveryEnd(
        { ...deliveryTime, deliveryStart: closestDeliveryStart },
        minTimespanForDelivery
      );

      if (closestDeliveryStart || closestDeliveryEnd) {
        const closestDeliveryTime: Partial<DeliveryTime> = {
          ...deliveryTime,
          ...(closestDeliveryStart && { deliveryStart: closestDeliveryStart }),
          ...(closestDeliveryEnd && { deliveryEnd: closestDeliveryEnd }),
        };

        deliveryTimeForm.patchValue(closestDeliveryTime, noEventControlOptions);
      }
    }
  }

  validateDeliveryStart(deliveryTime: Partial<DeliveryTime>): Time {
    const closestDeliveryStart: Time = this.orderTimeService.getClosestDeliveryStartTime(deliveryTime);

    if (deliveryTime.deliveryStart !== closestDeliveryStart) {
      return closestDeliveryStart;
    }

    return null;
  }

  validateDeliveryEnd(deliveryTime: Partial<DeliveryTime>, minTimespanForDelivery): Time {
    const closestDeliveryEnd: Time = this.orderTimeService.getClosestDeliveryEndTime(
      deliveryTime,
      minTimespanForDelivery
    );

    if (deliveryTime.deliveryEnd !== closestDeliveryEnd) {
      return closestDeliveryEnd;
    }

    return null;
  }

  isBasketEmpty(): Observable<boolean> {
    return this.basketService.isEmpty();
  }

  isEquipmentInBasket(): Observable<boolean> {
    return this.basketService.isEquipmentInBasket();
  }

  calculateMinGuests(): Observable<number> {
    return this.basketService.calculateMinGuests();
  }

  calculateMaxGuests(): Observable<number> {
    return this.basketService.maxGuests$.asObservable();
  }

  calculateTotalPrice(): Observable<number> {
    return this.basketService.calculateTotalPrice();
  }

  updateStore(formName: string = null, order: Partial<Order> = null) {
    this.orderService.updateStoreOrder(formName, order);
  }

  completeOrder(order: Partial<Order>): Observable<OrderRequest> {
    return zip([
      this.settingsService.getMinDaysBefore(),
      this.settingsService.getMinTimespanForDelivery(),
      this.orderArticlesService.orderArticles,
    ]).pipe(
      take(1),
      switchMap(([minDaysBefore, minTimespanForDelivery, orderArticles]) => {
        const orderRequestData: OrderFormPostData = this.orderMapperService.prepareOrderForRequest(
          order,
          minDaysBefore,
          minTimespanForDelivery,
          orderArticles
        );

        return this.orderService.completeOrder(orderRequestData);
      })
    );
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  private fillInvoiceForm(
    invoiceForm: FormGroup<InvoiceForm>,
    invoice: Invoice,
    onlySelf = true,
    emitEvent = true
  ) {
    if (invoice) {
      invoiceForm.reset(invoice, { onlySelf, emitEvent });
      this.handleInvoiceFormStatus(invoiceForm, invoiceForm.controls.forCompany.value);
      invoiceForm.controls.forCompany.updateValueAndValidity({ onlySelf: true });
    }
  }

  private fillDeliveryAddressForm(
    deliveryAddressForm: FormGroup<DeliveryAddressForm>,
    deliveryAddress: DeliveryAddress,
    onlySelf = true,
    emitEvent = true
  ): void {
    if (deliveryAddress) {
      deliveryAddressForm.reset(deliveryAddress, { onlySelf, emitEvent });
      this.handleDeliveryAddressFormStatus(
        deliveryAddressForm,
        deliveryAddressForm.controls.useInvoiceAddress.value
      );
    }
  }

  private fillDeliveryTimeForm(
    deliveryTimeForm: FormGroup<DeliveryTimeForm>,
    deliveryTime: DeliveryTime,
    minTimespanForDelivery: number,
    minDeliveryDate: Moment,
    calendarClosedDates: CalendarClosedDate[],
    onlySelf = true,
    emitEvent = true
  ) {
    if (deliveryTime) {
      const validatedDeliveryTime = this.orderTimeService.getValidDeliveryTime(
        deliveryTime,
        minTimespanForDelivery,
        minDeliveryDate,
        calendarClosedDates
      );

      deliveryTimeForm.reset(validatedDeliveryTime || { date: minDeliveryDate || utc() }, {
        onlySelf,
        emitEvent,
      });

      deliveryTimeForm.updateValueAndValidity(noEventControlOptions);
    }
  }

  private fillAdditionalInfoForm(
    additionalInfoForm: FormGroup<AdditionalInfoForm>,
    additionalInfo: AdditionalInfo,
    maxGuests = 1,
    onlySelf = true,
    emitEvent = true
  ) {
    if (additionalInfo) {
      additionalInfoForm.reset({ ...additionalInfo, guests: maxGuests }, { onlySelf, emitEvent });
      this.handleAdditionalInfoFormStatus(
        additionalInfoForm,
        additionalInfoForm.controls.doDeliveryInfo.value
      );
    }
  }
}
