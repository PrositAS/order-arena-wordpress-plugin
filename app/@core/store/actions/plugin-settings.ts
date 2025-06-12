import { PluginSettings } from 'src/app/services/plugin-settings/plugin-settings.service';

export function setPluginSettingsAction(pluginSettings: PluginSettings) {
  return {
    type: 'SET_PLUGIN_SETTINGS',
    payload: pluginSettings,
  };
}

export function resetPluginSettingsAction() {
  return {
    type: 'RESET_PLUGIN_SETTINGS',
  };
}
