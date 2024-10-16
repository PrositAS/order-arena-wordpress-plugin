import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MomentModule } from 'ngx-moment';
import { OrderDataModule } from 'src/app/pipes/order/order-data/order-data.module';
import { CmTranslateServiceModule } from 'src/app/services/cm-translate/cm-translate-service.module';
import { OrderArticlesServiceModule } from 'src/app/services/order-articles/order-articles-service.module';
import { OrderMapperServiceModule } from 'src/app/services/order/order-mapper/order-mapper-service.module';
import { OrderServiceModule } from 'src/app/services/order/order/order-service.module';
import { EmptyPlaceholderComponent } from 'src/app/shared-components/empty-placeholder/empty-placeholder.component';
import { CmTranslateModule } from '../../pipes/cm-translate/cm-translate.module';
import { OrdersServiceModule } from '../../services/order/orders/orders-service.module';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    MomentModule,

    // Angular Material
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,

    // Prosit
    CmTranslateModule,
    CmTranslateServiceModule,
    OrderDataModule,
    OrdersServiceModule,
    OrderMapperServiceModule,
    OrderServiceModule,
    OrderArticlesServiceModule,

    EmptyPlaceholderComponent,
  ],
  declarations: [OrdersComponent, OrderComponent],
  exports: [OrdersComponent],
  bootstrap: [OrdersComponent],
})
export class OrdersModule {}
