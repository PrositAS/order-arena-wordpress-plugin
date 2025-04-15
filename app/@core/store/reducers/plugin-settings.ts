import { PluginSettings } from 'src/app/services/plugin-settings/plugin-settings.service';

export const pluginSettings = (state: PluginSettings = null, { type, payload }): PluginSettings => {
  switch (type) {
    case 'SET_PLUGIN_SETTINGS':
      return payload;

    case 'RESET_PLUGIN_SETTINGS':
      return null;
  }

  return state;
};
