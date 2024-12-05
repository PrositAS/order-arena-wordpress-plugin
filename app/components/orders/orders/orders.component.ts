import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MomentModule } from 'ngx-moment';
import { distinctUntilChanged, filter, map, merge, Observable, shareReplay, startWith } from 'rxjs';
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

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService,
    private bs: BroadcasterService
  ) {}

  ngOnInit() {
    this.user$ = this.authService.user;

    this.orders$ = this.ordersService.queryOrders().pipe(shareReplay(1));

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
