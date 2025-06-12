import { FormControl } from '@angular/forms';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserCredentialsForm {
  username: FormControl<string>;
  password: FormControl<string>;
}
