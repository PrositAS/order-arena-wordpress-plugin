import { Time } from '@angular/common';
import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DeliveryTime } from 'src/@types/order-arena-user-portal/order-form/DeliveryTime';
import { OrderTimeService } from '../order-time.service';

export function deliveryStartValidator(orderTimeService: OrderTimeService): ValidatorFn {
  return (control: FormControl<Time>): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return control.touched ? ({ required: true } as ValidationErrors) : null;
    }

    if (orderTimeService.isEmptyTime(value)) {
      return { required: true } as ValidationErrors;
    }

    if (!orderTimeService.isValidTime(value)) {
      return { invalidTime: true } as ValidationErrors;
    }

    const deliveryTime: Partial<DeliveryTime> = {
      ...(control.parent.value as Partial<DeliveryTime>),
      deliveryStart: value,
    };
    return orderTimeService.isValidDeliveryStartMoment(deliveryTime)
      ? null
      : ({
          invalidDeliveryStart: { value: { deliveryTime } },
        } as ValidationErrors);
  };
}
