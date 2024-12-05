import { NgModule } from '@angular/core';
import { OrderArticlesServiceModule } from '../order-articles/order-articles-service.module';
import { OrderMapperServiceModule } from '../order/order-mapper/order-mapper-service.module';
import { BasketService } from './basket.service';

@NgModule({
  imports: [OrderArticlesServiceModule, OrderMapperServiceModule],
  providers: [BasketService],
})
export class BasketServiceModule {}
