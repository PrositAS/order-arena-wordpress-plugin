import { FormControl } from '@angular/forms';

export interface PasswordUpdate {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface PasswordUpdateForm {
  token: FormControl<string>;
  password: FormControl<string>;
  passwordConfirmation: FormControl<string>;
}

export type PasswordUpdateAction = 'set' | 'update';
