import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import * as moment from 'moment';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Order } from 'src/@types/order-arena-user-portal/Order';
import { OrderData } from 'src/@types/order-arena-user-portal/order-form/Order';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { AuthService } from 'src/app/@core/auth.service';
import { BroadcasterService, EVENTS } from 'src/app/@core/broadcaster.service';
import { ordersQuery, resetOrdersAction, setOrdersAction } from 'src/app/@core/store/actions/orders';
import { OrderMapperService } from '../order-mapper/order-mapper.service';

@Injectable()
export class OrdersService {
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
        switchMap((loggedIn) => (loggedIn ? this.queryOrders() : of(this.ngrx.dispatch(resetOrdersAction()))))
      )
      .subscribe();

    this.bs
      .on(EVENTS.COMPLETE_ORDER)
      .pipe(tap(() => this.queryOrders()))
      .subscribe();
  }

  get orders(): Observable<Order[]> {
    return this.ngrx.pipe(select((store) => store.orders));
  }

  getOrders(limit: number = null): Observable<Order[]> {
    return this.authService.loggedIn.pipe(
      switchMap((loggedIn) =>
        loggedIn
          ? this.orders.pipe(switchMap((orders) => (orders ? of(orders) : this.queryOrders())))
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
            const uniqueOrderAddress: boolean = !uniqueOrders.find(
              (uo) => order.orderAddress?.id === uo.orderAddress?.id
            );

            if (!uniqueOrderAddress) {
              uniqueOrders.push(order);
            } else {
              const { id: oInvoiceId, ...oInvoice } = order.invoice;
              const oInvoiceData: string = JSON.stringify(oInvoice);

              const uniqueInvoiceAddress: boolean = !uniqueOrders.find((uo) => {
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
}
