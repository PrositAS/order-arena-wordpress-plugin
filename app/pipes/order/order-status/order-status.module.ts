/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { NgModule } from '@angular/core';
import { OrderStatusPipe } from './order-status.pipe';

@NgModule({
  declarations: [OrderStatusPipe],
  exports: [OrderStatusPipe],
})
export class OrderStatusPipeModule {}
