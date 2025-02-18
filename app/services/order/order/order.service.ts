import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { map, Observable, of, tap } from 'rxjs';
import { Order } from 'src/@types/order-arena-user-portal/order-form/Order';
import { OrderRequest } from 'src/@types/order-arena-user-portal/OrderRequest';
import { OrderFormPostData } from 'src/@types/order-arena-user-portal/params/PostOrder';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { BroadcasterService, EVENTS } from 'src/app/@core/broadcaster.service';
import {
  completeOrderAction,
  orderRequestMutation,
  resetOrderAction,
  resetOrderAdditionalInfoAction,
  resetOrderDeliveryAddressAction,
  resetOrderDeliveryTimeAction,
  resetOrderInvoiceAction,
  resetOrderIsPickupAction,
  setOrderAction,
  updateOrderAction,
  updateOrderAdditionalInfoAction,
  updateOrderDeliveryAddressAction,
  updateOrderDeliveryTimeAction,
  updateOrderInvoiceAction,
  updateOrderIsPickupAction,
  updateOrderPastOrderDataAction,
  updateOrderUserAction,
} from 'src/app/@core/store/actions/order';
import { isNullOrUndefined } from 'src/app/@core/utils';
import { TranslatedSnackBarService } from '../../translated-snack-bar/translated-snack-bar.service';

@Injectable()
export class OrderService {
  constructor(
    private ngrx: Store<UPState>,
    private bs: BroadcasterService,
    private http: Apollo,
    private translatedSnackBarService: TranslatedSnackBarService
  ) {}

  get order$(): Observable<Order> {
    return this.ngrx.pipe(select((store) => store.order));
  }

  setStoreOrder(order: Order) {
    this.ngrx.dispatch(setOrderAction(order));
  }

  updateStoreOrder(formName: string = null, order: Partial<Order> = null) {
    if (order) {
      if (formName === null) {
        this.ngrx.dispatch(updateOrderAction(order));
      }

      if (!isNullOrUndefined(order[formName])) {
        switch (formName) {
          case 'user':
            this.ngrx.dispatch(updateOrderUserAction(order.user));
            break;
          case 'isPickup':
            this.ngrx.dispatch(updateOrderIsPickupAction(order.isPickup));
            break;
          case 'pastOrderData':
            this.ngrx.dispatch(updateOrderPastOrderDataAction(order.pastOrderData));
          case 'invoice':
            this.ngrx.dispatch(updateOrderInvoiceAction(order.invoice));
            break;
          case 'deliveryAddress':
            this.ngrx.dispatch(updateOrderDeliveryAddressAction(order.deliveryAddress));
            break;
          case 'deliveryTime':
            this.ngrx.dispatch(updateOrderDeliveryTimeAction(order.deliveryTime));
            break;
          case 'additionalInfo':
            this.ngrx.dispatch(updateOrderAdditionalInfoAction(order.additionalInfo));
            break;
        }
      }
    }
  }

  // NOTE: might be useful later
  resetStoreOrder(formName: string = null) {
    if (formName === null) {
      this.ngrx.dispatch(resetOrderAction());
    }

    switch (formName) {
      case 'isPickup':
        this.ngrx.dispatch(resetOrderIsPickupAction());
        break;
      case 'invoice':
        this.ngrx.dispatch(resetOrderInvoiceAction());
        break;
      case 'deliveryAddress':
        this.ngrx.dispatch(resetOrderDeliveryAddressAction());
        break;
      case 'deliveryTime':
        this.ngrx.dispatch(resetOrderDeliveryTimeAction());
        break;
      case 'additionalInfo':
        this.ngrx.dispatch(resetOrderAdditionalInfoAction());
        break;
    }
  }

  completeOrder(orderRequestData: OrderFormPostData): Observable<OrderRequest> {
    if (orderRequestData) {
      return this.http
        .mutate({
          mutation: orderRequestMutation,
          variables: { order: JSON.stringify(orderRequestData) },
        })
        .pipe(
          map((result: ApolloQueryResult<{ createOrderByCustomer: OrderRequest }>) =>
            !result.errors || !result.errors?.length ? result.data.createOrderByCustomer : null
          ),
          tap((orderRequest: OrderRequest) => {
            if (orderRequest) {
              this.ngrx.dispatch(completeOrderAction());
              this.bs.emit(EVENTS.COMPLETE_ORDER, () => orderRequest);
            } else {
              this.translatedSnackBarService.open('ORDER_REQUEST_FAILED', 'OK');
            }
          })
        );
    }

    return of(null);
  }
}
