import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const phoneReg = /^(0047|\+47|47)?([2-9]\d{7}|[2-9]\d{4})$/;

export function trimPhone(phone: string) {
  return phone ? phone.trim().replace(/[^\d+]/g, '') : '';
}

export function phoneValidator(): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    if (control) {
      const value: string = control.value;

      if (!value) {
        return control.touched ? ({ required: true } as ValidationErrors) : null;
      }

      const length: number = value.length;
      if (length < 5 || length > 16) {
        return { invalidPhoneLength: true } as ValidationErrors;
      }

      if (!phoneReg.test(trimPhone(value))) {
        return {
          invalidPhone: {
            value: value,
          },
        } as ValidationErrors;
      }
    }

    return null;
  };
}
