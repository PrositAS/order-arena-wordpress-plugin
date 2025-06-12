import gql from 'graphql-tag';
import { SaasSettings } from 'src/@types/order-arena-user-portal/SaasSettings';

export type SettingsAction = {
  type: string;
  payload?: SaasSettings;
};

export function setSettingsAction(settings: SaasSettings): SettingsAction {
  return {
    type: 'SET_SETTINGS',
    payload: settings,
  };
}

export function resetSettingsAction(): SettingsAction {
  return {
    type: 'RESET_SETTINGS',
  };
}

export const settingsQuery = gql`
  query {
    settings {
      customerEditOrderDaysBeforeClosing
      contactPhone
      contactEmail
      contactPerson
      contactUrl
      terms
      minTimespanForDelivery
    }
  }
`;
