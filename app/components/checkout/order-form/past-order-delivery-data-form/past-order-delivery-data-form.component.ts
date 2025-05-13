import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  startWith,
  take,
  tap,
  withLatestFrom,
  zip,
} from 'rxjs';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { Address } from 'src/@types/order-arena-user-portal/order-form/Address';
import { DeliveryAddress } from 'src/@types/order-arena-user-portal/order-form/DeliveryAddress';
import { Invoice } from 'src/@types/order-arena-user-portal/order-form/Invoice';
import { OrderData, OrderForm } from 'src/@types/order-arena-user-portal/order-form/Order';
import { BroadcasterService, EVENTS } from 'src/app/@core/broadcaster.service';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { OrderDataModule } from 'src/app/pipes/order/order-data/order-data.module';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { OrderFormServiceModule } from 'src/app/services/order/order-form/order-form-service.module';
import { OrderFormService } from 'src/app/services/order/order-form/order-form.service';
import { OrderMapperService } from 'src/app/services/order/order-mapper/order-mapper.service';
import { OrdersServiceModule } from 'src/app/services/order/orders/orders-service.module';
import { OrdersService } from 'src/app/services/order/orders/orders.service';
import { EmptyPlaceholderComponent } from 'src/app/shared-components/empty-placeholder/empty-placeholder.component';

export interface OrderDataVerification {
  updateInvoiceAddress: boolean;
  deliveryAddress?: Partial<DeliveryAddress>;
  invoice?: Partial<Invoice>;
}
@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatIconModule,

    // Prosit
    CmTranslateModule,
    OrderDataModule,
    OrderFormServiceModule,
    OrdersServiceModule,

    EmptyPlaceholderComponent,
  ],
  providers: [CustomerService, OrderMapperService],
  selector: 'app-past-order-delivery-data-form',
  templateUrl: './past-order-delivery-data-form.component.html',
  styleUrls: ['./past-order-delivery-data-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PastOrderDeliveryDataFormComponent implements OnInit {
  @Input() form: FormGroup<OrderForm>;
  @Input() limit = 3;

  loading$: Observable<boolean>;
  ordersData$: Observable<OrderData[]>;
  inputOrderData$: Observable<OrderData>;

  addresses$: Observable<Address[]>;

  setOrderId$ = new BehaviorSubject<ID>(null);
  orderId$: Observable<ID> = this.setOrderId$.pipe(
    distinctUntilChanged(),
    filter((v) => v !== null),
    shareReplay(1)
  );

  destroyRef = inject(DestroyRef);

  constructor(
    private ordersService: OrdersService,
    private orderFormService: OrderFormService,
    private customerService: CustomerService,
    private orderMapperService: OrderMapperService,
    private bs: BroadcasterService
  ) {}

  ngOnInit() {
    this.form.controls.pastOrderData.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(this.form.controls.pastOrderData.value),
        tap((pastOrderData: OrderData) => this.setOrderId$.next(pastOrderData?.id ?? 'new'))
      )
      .subscribe();

    this.addresses$ = this.customerService.getMappedAddresses().pipe(take(1), shareReplay(1));

    this.ordersData$ = this.ordersService.getUniqueOrdersData(this.limit).pipe(
      withLatestFrom(this.addresses$),
      map(([ordersData, addresses]) =>
        ordersData.map((orderData) => {
          const invoiceAddress: Address = orderData.invoice.forCompany
            ? orderData.invoice.companyInvoice.address
            : orderData.invoice.personalInvoice.address;
          const address: Address = this.customerService.findAddressByComparison(invoiceAddress, addresses);

          if (address) {
            orderData.invoice = {
              ...orderData.invoice,
              ...(orderData.invoice.forCompany && {
                companyInvoice: {
                  ...orderData.invoice.companyInvoice,
                  address: { ...address },
                },
              }),
              ...(!orderData.invoice.forCompany && {
                personalInvoice: {
                  ...orderData.invoice.personalInvoice,
                  address: { ...address },
                },
              }),
            };
          }

          return orderData;
        })
      ),
      shareReplay(1)
    );

    const storeInvoice$: Observable<Invoice> = this.orderFormService.order$.pipe(
      map((order) => order.invoice),
      shareReplay(1),
      take(1)
    );
    const storeDeliveryAddress$: Observable<DeliveryAddress> = this.orderFormService.order$.pipe(
      map((order) => order.deliveryAddress),
      shareReplay(1),
      take(1)
    );
    const initOrderData$: Observable<OrderData> = zip([storeInvoice$, storeDeliveryAddress$]).pipe(
      map(([invoice, deliveryAddress]) => this.orderMapperService.createOrderData(invoice, deliveryAddress)),
      take(1)
    );

    const invoice$ = this.form.controls.invoice.valueChanges.pipe(distinctUntilChanged());

    const deliveryAddress$ = this.form.controls.deliveryAddress.valueChanges.pipe(distinctUntilChanged());

    const userInputOrderData$: Observable<OrderData> = merge(invoice$, deliveryAddress$).pipe(
      map(() => ({
        invoice: this.form.controls.invoice.value as Partial<Invoice>,
        deliveryAddress: this.form.controls.deliveryAddress.value as Partial<DeliveryAddress>,
      })),
      withLatestFrom(this.addresses$),
      map(([{ invoice, deliveryAddress }, addresses]) => {
        const invoiceAddress: Address = invoice.forCompany
          ? invoice.companyInvoice?.address
          : invoice.personalInvoice?.address;
        const updatedInvoiceAddress: Address = this.customerService.verifyAddress(invoiceAddress, addresses);
        const inputInvoice: Partial<Invoice> = updatedInvoiceAddress
          ? {
              ...invoice,
              ...(invoice.forCompany && {
                companyInvoice: { ...invoice.companyInvoice, address: updatedInvoiceAddress },
              }),
              ...(!invoice.forCompany && {
                personalInvoice: { ...invoice.personalInvoice, address: updatedInvoiceAddress },
              }),
            }
          : invoice;

        const updatedDeliveryAddress: Address = this.customerService.verifyAddress(
          deliveryAddress.address,
          addresses
        );
        const inputDeliveryAddress: Partial<DeliveryAddress> = updatedDeliveryAddress
          ? {
              ...deliveryAddress,
              address: updatedDeliveryAddress,
            }
          : deliveryAddress;

        const inputOrderData: OrderData = this.orderMapperService.createOrderData(
          inputInvoice,
          inputDeliveryAddress
        );

        return inputOrderData;
      }),
      withLatestFrom(this.ordersData$),
      map(
        ([inputOrderData, ordersData]) =>
          ordersData.find((orderData) =>
            this.orderMapperService.isSameOrderData(orderData, inputOrderData)
          ) ?? inputOrderData
      ),
      shareReplay(1)
    );

    this.inputOrderData$ = merge(
      initOrderData$,
      userInputOrderData$.pipe(filter((inputOrderData) => inputOrderData.id === 'new'))
    ).pipe(shareReplay(1));

    userInputOrderData$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        tap((inputOrderData) => {
          this.setOrderId$.next(inputOrderData.id);

          this.orderFormService.updateOrderFormPastOrderData(this.form, inputOrderData);
          this.orderFormService.updateOrderFormWithOrderData(this.form, inputOrderData);

          if (inputOrderData.id === 'new') {
            this.orderFormService.updateStore('invoice', { invoice: inputOrderData.invoice });
            this.orderFormService.updateStore('deliveryAddress', {
              deliveryAddress: inputOrderData.deliveryAddress,
            });
          }
        })
      )
      .subscribe();

    const loadingStart$: Observable<boolean> = merge(
      this.bs.on(EVENTS.LOGIN).pipe(
        distinctUntilChanged(),
        filter((loggedIn) => !!loggedIn)
      ),
      this.bs.on(EVENTS.COMPLETE_ORDER)
    ).pipe(map(() => true));
    const loadingEnd$: Observable<boolean> = this.ordersData$.pipe(map(() => false));
    this.loading$ = merge(loadingStart$, loadingEnd$).pipe(startWith(true), shareReplay(1));
  }

  selected(orderId: ID) {
    if (orderId) {
      this.setOrderId$.next(orderId);

      const orderData$: Observable<OrderData> = this.ordersData$.pipe(
        withLatestFrom(this.inputOrderData$),
        map(([ordersData, inputOrderData]) =>
          orderId === 'new' ? inputOrderData : ordersData.find((orderData) => orderData.id === orderId)
        ),
        filter((orderData) => !!orderData),
        map((orderData) => orderData),
        tap((orderData) => {
          this.orderFormService.updateOrderFormPastOrderData(this.form, orderData);
          this.orderFormService.updateOrderFormWithOrderData(this.form, orderData);
        }),
        take(1)
      );
      orderData$.subscribe();
    }
  }
}
