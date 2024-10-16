import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function sameValueValidator(matchingControl: FormControl, matchingControlName = ''): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    if (matchingControl && control.value !== matchingControl.value) {
      return {
        differs: {
          mustMatch: matchingControlName,
        },
      } as ValidationErrors;
    }

    return null;
  };
}
