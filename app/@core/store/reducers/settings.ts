import { SaasSettings } from 'src/@types/order-arena-user-portal/SaasSettings';
import { SettingsAction } from '../actions/settings';

export const settings = (state: SaasSettings = null, action: SettingsAction): SaasSettings => {
  switch (action.type) {
    case 'SET_SETTINGS':
      return action.payload;

    case 'CLEAR_SETTINGS':
      return null;
  }

  return state;
};
