import { Customer } from './Customer';
import { Role } from './Role';

export interface User {
  id?: number;
  email: string;
  name?: string;
  roles?: Role[];
  surname?: string;
  customer?: Customer;
}

export interface UserAuth {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
  user_roles: string[];
  user_access: string[];
}
