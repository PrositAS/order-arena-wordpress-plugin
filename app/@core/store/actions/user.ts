import gql from 'graphql-tag';
import { User } from 'src/@types/order-arena-user-portal/User';
import { UserRegisterCredentials } from 'src/@types/order-arena-user-portal/UserRegisterCredentials';
import { OnCustomer } from '../fragments/OnCustomer';

export function setUserAction(user: User) {
  return { type: 'SET_USER', payload: user };
}

export function clearUserAction() {
  return { type: 'CLEAR_USER' };
}

export const currentUserQuery = gql`
  query {
    user {
      id
      name
      surname
      email
      customer {
        ...CustomerContent
      }
      roles {
        role
      }
    }
  }
  ${OnCustomer.CustomerContent}
`;

export function registerUserQuery(user: UserRegisterCredentials) {
  return gql`
    mutation registerUser(
      $name: String!
      $surname: String!
      $email: String!
      $phone: String
      $password: String!
      $passwordConfirmation: String!
    ) {
      registerUser(
        name: $name
        surname: $surname
        email: $email
        phone: $phone
        password: $password
        passwordConfirmation: $passwordConfirmation
      ) {
        id
      }
    }
  `;
}

export function setPasswordQuery(password: string, token: string) {
  return gql`
    mutation setPassword($password: String!, $token: String!) {
      setPassword(password: $password, token: $token) {
        email
      }
    }
  `;
}
