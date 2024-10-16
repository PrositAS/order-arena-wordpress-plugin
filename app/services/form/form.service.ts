import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { camelToSnakeCase } from 'src/app/@core/utils';

@Injectable()
export class FormService {
  getErrorKey(control: AbstractControl): string {
    const errorKey: string = this.getError(control);

    return errorKey && errorKey.length > 0 ? `ERROR_${camelToSnakeCase(errorKey)}` : 'ERROR';
  }

  private getError(control: AbstractControl): string {
    const errors = control && control.invalid && control.errors ? Object.keys(control.errors) : [];

    return errors && errors.length > 0 ? errors[0] : '';
  }
}
