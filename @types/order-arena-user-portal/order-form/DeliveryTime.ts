import { Time } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Moment } from 'moment';

export interface DeliveryTime {
  date: Moment;
  deliveryStart: Time;
  deliveryEnd: Time;
  eatingTime: Time;
}

export interface DeliveryTimeForm {
  date: FormControl<Moment>;
  deliveryStart: FormControl<Time>;
  deliveryEnd: FormControl<Time>;
  eatingTime: FormControl<Time>;
}
