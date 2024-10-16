import { FormControl } from '@angular/forms';

export interface TimeForm {
  hours: FormControl<number>;
  minutes: FormControl<number>;
}

export type TimePart = 'hours' | 'minutes';
