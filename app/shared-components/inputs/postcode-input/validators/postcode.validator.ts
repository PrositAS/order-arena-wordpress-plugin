import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function postcodeValidator(): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    if (control) {
      const value: string = control.value;

      if (!value) {
        return control.touched ? ({ required: true } as ValidationErrors) : null;
      }

      if (value.length !== 4) {
        return { invalidPostcodeLength: true } as ValidationErrors;
      }

      if (!value.match('^[0-9]{4}$')) {
        return {
          invalidPostcode: {
            value: value,
          },
        } as ValidationErrors;
      }
    }
  };
}
