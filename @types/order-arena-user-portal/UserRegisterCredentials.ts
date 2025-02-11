import { FormControl } from '@angular/forms';

export interface UserRegisterCredentials {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
}

export interface UserRegisterCredentialsForm {
  name: FormControl<string>;
  surname: FormControl<string>;
  email: FormControl<string>;
  phone?: FormControl<string>;
  password: FormControl<string>;
  passwordConfirmation: FormControl<string>;
}
