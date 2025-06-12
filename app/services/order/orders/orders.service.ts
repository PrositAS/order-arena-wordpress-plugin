import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import * as moment from 'moment';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { CollectionMeta } from 'src/@types/order-arena-user-portal/CollectionMeta';
import { Order, OrderCollection } from 'src/@types/order-arena-user-portal/Order';
import { OrderData } from 'src/@types/order-arena-user-portal/order-form/Order';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { AuthService } from 'src/app/@core/auth.service';
import { BroadcasterService, EVENTS } from 'src/app/@core/broadcaster.service';
import {
  limitedOrdersQuery,
  ordersQuery,
  resetOrdersAction,
  setOrdersAction,
  updateOrdersAction,
} from 'src/app/@core/store/actions/orders';
import { OrderMapperService } from '../order-mapper/order-mapper.service';

@Injectable()
export class OrdersService {
  size = 5;

  constructor(
    private ngrx: Store<UPState>,
    private bs: BroadcasterService,
    private authService: AuthService,
    private orderMapperService: OrderMapperService,
    private http: Apollo
  ) {
    this.bs
      .on(EVENTS.LOGIN)
      .pipe(
        switchMap((loggedIn) =>
          loggedIn ? this.getOrdersPage() : of(this.ngrx.dispatch(resetOrdersAction()))
        )
      )
      .subscribe();

    this.bs
      .on(EVENTS.ORDER_REQUEST_COMPLETED)
      .pipe(tap(() => this.getOrdersPage()))
      .subscribe();
  }

  get orders(): Observable<Order[]> {
    return this.ngrx.pipe(select((store) => store.orders));
  }

  getOrders(limit: number = null): Observable<Order[]> {
    return this.authService.loggedIn.pipe(
      switchMap((loggedIn) =>
        loggedIn
          ? this.orders.pipe(switchMap((orders) => (orders ? of(orders) : this.getOrdersPage())))
          : of([] as Order[])
      ),
      map((orders) => (orders ? (!!orders.length && limit !== null ? orders.slice(0, limit) : orders) : []))
    );
  }

  getOrdersData(limit: number = null): Observable<OrderData[]> {
    return this.getOrders(limit).pipe(
      map((orders) =>
        orders ? orders.map((order) => this.orderMapperService.mapPastOrderToOrderData(order)) : []
      )
    );
  }

  getUniqueOrdersData(limit: number = undefined): Observable<OrderData[]> {
    return this.getOrders().pipe(
      map((orders) =>
        orders
          .reduce((uniqueOrders: Order[], order) => {
            const uniqueOrderAddress = !uniqueOrders.find(
              (uo) => order.orderAddress?.id === uo.orderAddress?.id
            );

            if (!uniqueOrderAddress) {
              uniqueOrders.push(order);
            } else {
              const { id: oInvoiceId, ...oInvoice } = order.invoice;
              const oInvoiceData: string = JSON.stringify(oInvoice);

              const uniqueInvoiceAddress = !uniqueOrders.find((uo) => {
                const { id: uoInvoiceId, ...uoInvoice } = uo.invoice;
                const uoInvoiceData: string = JSON.stringify(uoInvoice);

                return uoInvoiceData === oInvoiceData;
              });

              if (uniqueInvoiceAddress) {
                uniqueOrders.push(order);
              }
            }

            return uniqueOrders;
          }, [])
          .sort((a, b) => moment(a.orderSchedule?.serveAt).diff(moment(b.orderSchedule?.serveAt)))
          .map((order) => this.orderMapperService.mapPastOrderToOrderData(order))
          .slice(0, limit)
      )
    );
  }

  /** STORE ACTIONS */

  queryOrders(): Observable<Order[]> {
    return this.http
      .query<{ orders: { collection: Order[] } }>({
        query: ordersQuery,
      })
      .pipe(
        take(1),
        map((result) => result.data.orders.collection || []),
        tap((orders) => this.ngrx.dispatch(setOrdersAction(orders)))
      );
  }

  getOrdersPage(page = 1, size = this.size): Observable<Order[]> {
    return this.queryOrdersPage(page, size).pipe(map((result) => result.collection || []));
  }

  getOrdersMeta(page = 1, size = this.size): Observable<CollectionMeta> {
    return this.queryOrdersPage(page, size).pipe(map((result) => result.meta || null));
  }

  queryOrdersPage(page = 1, size = this.size): Observable<OrderCollection> {
    if (page === 1) {
      this.ngrx.dispatch(resetOrdersAction());
    }

    return this.http
      .query<{ orders: OrderCollection }>({
        query: limitedOrdersQuery,
        variables: { page: { number: page, size: size } },
      })
      .pipe(
        take(1),
        map((result) => result.data.orders),
        tap((orders) => {
          this.ngrx.dispatch(updateOrdersAction(orders.collection || []));
        })
      );
  }
}
