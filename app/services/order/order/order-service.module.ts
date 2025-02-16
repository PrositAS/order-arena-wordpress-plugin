import { NgModule } from '@angular/core';
import { TranslatedSnackBarServiceModule } from '../../translated-snack-bar/translated-snack-bar-service.module';
import { OrderService } from './order.service';

@NgModule({
  imports: [TranslatedSnackBarServiceModule],
  providers: [OrderService],
})
export class OrderServiceModule {}
