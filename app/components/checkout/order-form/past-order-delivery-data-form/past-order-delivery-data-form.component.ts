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
  combineLatest,
  concat,
  defer,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  skip,
  startWith,
  take,
  tap,
  withLatestFrom,
  zip,
} from 'rxjs';
import { ID } from 'src/@types/order-arena-user-portal/ID';
import { DeliveryAddress } from 'src/@types/order-arena-user-portal/order-form/DeliveryAddress';
import { initDeliveryAddress, initInvoice } from 'src/@types/order-arena-user-portal/order-form/InitValues';
import { Invoice } from 'src/@types/order-arena-user-portal/order-form/Invoice';
import { OrderData, OrderForm } from 'src/@types/order-arena-user-portal/order-form/Order';
import { BroadcasterService, EVENTS } from 'src/app/@core/broadcaster.service';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { OrderDataModule } from 'src/app/pipes/order/order-data/order-data.module';
import { OrderFormServiceModule } from 'src/app/services/order/order-form/order-form-service.module';
import { OrderFormService } from 'src/app/services/order/order-form/order-form.service';
import { OrdersServiceModule } from 'src/app/services/order/orders/orders-service.module';
import { OrdersService } from 'src/app/services/order/orders/orders.service';
import { EmptyPlaceholderComponent } from 'src/app/shared-components/empty-placeholder/empty-placeholder.component';

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
  initOrderData$: Observable<OrderData>;
  inputOrderData$: Observable<OrderData>;

  setOrderId$ = new BehaviorSubject<ID>(null);
  orderId$: Observable<ID> = this.setOrderId$.pipe(
    filter((v) => v !== null),
    shareReplay(1)
  );

  destroyRef = inject(DestroyRef);

  constructor(
    private ordersService: OrdersService,
    private orderFormService: OrderFormService,
    private bs: BroadcasterService
  ) {}

  ngOnInit() {
    this.form.controls.pastOrderData.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(this.form.controls.pastOrderData.value),
        tap((pastOrderData: OrderData) => {
          this.setOrderId$.next(pastOrderData?.id);
        })
      )
      .subscribe();

    this.ordersData$ = this.ordersService.getUniqueOrdersData(this.limit).pipe(shareReplay(1));

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
      map(([invoice, deliveryAddress]) => this.createOrderData(invoice, deliveryAddress)),
      take(1)
    );

    const invoice$: Observable<Partial<Invoice>> = concat(
      defer(() => storeInvoice$),
      this.form.controls.invoice.valueChanges as Observable<Partial<Invoice>>
    ).pipe(distinctUntilChanged());
    const deliveryAddress$: Observable<Partial<DeliveryAddress>> = concat(
      defer(() => storeDeliveryAddress$),
      this.form.controls.deliveryAddress.valueChanges as Observable<Partial<DeliveryAddress>>
    ).pipe(distinctUntilChanged());

    const userInputOrderData$: Observable<OrderData> = combineLatest([invoice$, deliveryAddress$]).pipe(
      skip(1),
      distinctUntilChanged(),
      map(() =>
        this.createOrderData(
          this.form.controls.invoice.value as Partial<Invoice>,
          this.form.controls.deliveryAddress.value as Partial<DeliveryAddress>
        )
      ),
      tap((inputOrderData) => {
        this.setOrderId$.next('new');

        this.orderFormService.updateOrderFormPastOrderData(this.form, inputOrderData);

        this.orderFormService.updateStore('invoice', { invoice: { ...inputOrderData.invoice } });
        this.orderFormService.updateStore('deliveryAddress', {
          deliveryAddress: { ...inputOrderData.deliveryAddress },
        });
      })
    );
    userInputOrderData$.subscribe();

    this.inputOrderData$ = concat(
      defer(() => initOrderData$),
      userInputOrderData$
    ).pipe(shareReplay(1));

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

  private createOrderData(invoice: Partial<Invoice>, deliveryAddress: Partial<DeliveryAddress>): OrderData {
    const inputOrderData: OrderData = {
      id: 'new',
      invoice: { ...JSON.parse(JSON.stringify(initInvoice)), ...invoice },
      deliveryAddress: { ...JSON.parse(JSON.stringify(initDeliveryAddress)), ...deliveryAddress },
    };

    return inputOrderData;
  }
}
