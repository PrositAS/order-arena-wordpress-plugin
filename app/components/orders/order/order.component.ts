import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MomentModule } from 'ngx-moment';
import { Order as PastOrder } from 'src/@types/order-arena-user-portal/Order';
import { OrderLogAction } from 'src/@types/order-arena-user-portal/OrderLogAction';
import { User } from 'src/@types/order-arena-user-portal/User';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { CmTranslateServiceModule } from 'src/app/services/cm-translate/cm-translate-service.module';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    MomentModule,

    // Angular Material
    MatExpansionModule,

    // Prosit
    CmTranslateModule,
    CmTranslateServiceModule,

    OrderSummaryComponent,
  ],
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @Input() order: PastOrder;
  @Input() index: number;
  @Input() user: User = null;

  orderTime: Moment = null;

  constructor(public cmTranslateService: CmTranslateService) {}

  ngOnInit() {
    if (this.order) {
      const orderTimeAction: OrderLogAction = this.order.actionsCompleted.find(
        (action) => action.name === 'Received' || action.name === 'Confirmed'
      );
      this.orderTime = orderTimeAction ? moment(orderTimeAction.changedAt) : null;
    }
  }
}
