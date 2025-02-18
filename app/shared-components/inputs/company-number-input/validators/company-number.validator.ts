import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function companyNumberValidator(): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    if (control) {
      const value: string = control.value;

      if (!value) {
        return control.touched ? ({ required: true } as ValidationErrors) : null;
      }

      if (value.length !== 9) {
        return { invalidCompanyNumberLength: true } as ValidationErrors;
      }

      if (!value.match('^[0-9]{9}$')) {
        return {
          invalidCompanyNumber: {
            value: value,
          },
        } as ValidationErrors;
      }
    }

    return null;
  };
}
