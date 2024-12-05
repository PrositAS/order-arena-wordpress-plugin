import { Injectable } from '@angular/core';
import { AsyncValidator, FormControl, ValidationErrors } from '@angular/forms';
import { Moment } from 'moment';
import { combineLatest, map, Observable, of, take } from 'rxjs';
import { OrderTimeService } from 'src/app/services/order/order-form/order-time.service';
import { OrderFormService } from '../order-form.service';

@Injectable({ providedIn: 'root' })
export class DeliveryDateValidator implements AsyncValidator {
  constructor(
    private orderFormService: OrderFormService,
    private orderTimeService: OrderTimeService
  ) {}

  validate(control: FormControl<Moment>): Observable<ValidationErrors | null> {
    const value: Moment = control.value;

    if (!value) {
      return control.touched ? of({ required: true } as ValidationErrors) : of(null);
    }

    if (!value.isValid()) {
      return of({ invalidDate: true } as ValidationErrors);
    }

    return combineLatest([
      this.orderFormService.minDeliveryDate$,
      this.orderFormService.calendarClosedDates$,
    ]).pipe(
      take(1),
      map(([minDeliveryDate, calendarClosedDates]) => {
        return this.orderTimeService.isValidDeliveryDate(value, minDeliveryDate, calendarClosedDates)
          ? null
          : ({ invalidDeliveryDate: true } as ValidationErrors);
      })
    );
  }
}
