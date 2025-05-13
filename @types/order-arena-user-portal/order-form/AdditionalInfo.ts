import { FormControl } from '@angular/forms';

export interface AdditionalInfo {
  doDeliveryInfo: boolean;
  deliveryInfo: string;
  guests: number;
  notes: string;
}

export interface AdditionalInfoForm {
  doDeliveryInfo: FormControl<boolean>;
  deliveryInfo: FormControl<string>;
  guests: FormControl<number>;
  notes: FormControl<string>;
}
