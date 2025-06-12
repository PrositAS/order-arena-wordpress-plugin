import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { BasketServiceModule } from '../../basket/basket-service.module';
import { SaasClosedModule } from '../../saas-closed/saas-closed.module';
import { SaasSettingsServiceModule } from '../../saas-settings/saas-settings.module';
import { OrderMapperServiceModule } from '../order-mapper/order-mapper-service.module';
import { OrderServiceModule } from '../order/order-service.module';
import { OrdersServiceModule } from '../orders/orders-service.module';
import { OrderFormService } from './order-form.service';
import { OrderTimeService } from './order-time.service';

@NgModule({
  imports: [
    MomentModule,

    OrderServiceModule,
    OrdersServiceModule,
    OrderMapperServiceModule,
    BasketServiceModule,
    SaasSettingsServiceModule,
    SaasClosedModule,
  ],
  providers: [OrderFormService, OrderTimeService],
})
export class OrderFormServiceModule {}
