import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MomentModule } from 'ngx-moment';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  skip,
  startWith,
  tap,
} from 'rxjs';
import { CollectionMeta } from 'src/@types/order-arena-user-portal/CollectionMeta';
import { Order } from 'src/@types/order-arena-user-portal/Order';
import { User } from 'src/@types/order-arena-user-portal/User';
import { AuthService } from 'src/app/@core/auth.service';
import { BroadcasterService, EVENTS } from 'src/app/@core/broadcaster.service';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { OrdersServiceModule } from 'src/app/services/order/orders/orders-service.module';
import { OrdersService } from 'src/app/services/order/orders/orders.service';
import { EmptyPlaceholderComponent } from 'src/app/shared-components/empty-placeholder/empty-placeholder.component';
import { OrderComponent } from '../order/order.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    MomentModule,

    // Angular Material
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatButtonModule,

    // Prosit
    CmTranslateModule,
    OrdersServiceModule,

    EmptyPlaceholderComponent,
    OrderComponent,
  ],
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  user$: Observable<User>;
  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;

  page = 0;
  totalPages = null;
  size = 5;

  ordersRequestSent$ = new BehaviorSubject<boolean>(false);
  totalOrders$: Observable<number>;

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService,
    private bs: BroadcasterService
  ) {}

  ngOnInit() {
    this.user$ = this.authService.user;
    this.orders$ = this.ordersService.orders.pipe(shareReplay(1));

    this.loadOrdersPage();

    const loadingStart$: Observable<boolean> = merge(
      this.bs.on(EVENTS.LOGIN).pipe(
        distinctUntilChanged(),
        filter((loggedIn) => !!loggedIn)
      ),
      this.bs.on(EVENTS.ORDER_REQUEST_COMPLETED),
      this.ordersRequestSent$
    ).pipe(map(() => true));
    const loadingEnd$: Observable<boolean> = this.orders$.pipe(
      skip(1),
      map(() => false)
    );
    this.loading$ = merge(loadingStart$, loadingEnd$).pipe(
      startWith(true),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  loadOrdersPage() {
    this.ordersRequestSent$.next(true);

    const meta$: Observable<CollectionMeta> = this.ordersService.getOrdersMeta(this.page + 1, this.size).pipe(
      tap((meta) => {
        this.totalPages = meta.totalPages;
        this.page = meta.currentPage;
      }),
      shareReplay(1)
    );

    this.totalOrders$ = meta$.pipe(map((meta) => meta.totalCount));

    meta$.subscribe();
  }
}
