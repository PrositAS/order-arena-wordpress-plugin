import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, filter, map, merge, Observable, shareReplay, startWith } from 'rxjs';
import { Order } from 'src/@types/order-arena-user-portal/Order';
import { User } from 'src/@types/order-arena-user-portal/User';
import { AuthService } from 'src/app/@core/auth.service';
import { BroadcasterService, EVENTS } from 'src/app/@core/broadcaster.service';
import { OrdersService } from 'src/app/services/order/orders/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  user$: Observable<User>;
  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService,
    private bs: BroadcasterService
  ) {}

  ngOnInit() {
    this.user$ = this.authService.user;

    this.orders$ = this.ordersService.getOrders().pipe(shareReplay(1));

    const loadingStart$: Observable<boolean> = merge(
      this.bs.on(EVENTS.LOGIN).pipe(
        distinctUntilChanged(),
        filter((loggedIn) => !!loggedIn)
      ),
      this.bs.on(EVENTS.COMPLETE_ORDER)
    ).pipe(map(() => true));
    const loadingEnd$: Observable<boolean> = this.orders$.pipe(map(() => false));
    this.loading$ = merge(loadingStart$, loadingEnd$).pipe(startWith(true), shareReplay(1));
  }
}
