import { NgModule } from '@angular/core';
import { OrderMapperServiceModule } from '../order-mapper/order-mapper-service.module';
import { OrdersService } from './orders.service';

@NgModule({
  imports: [OrderMapperServiceModule],
  providers: [OrdersService],
})
export class OrdersServiceModule {}
