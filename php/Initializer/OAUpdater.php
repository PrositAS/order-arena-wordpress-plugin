<?php

namespace OAUP\Initializer;

use OAUP\Settings\OASettingsConfig;

/**
 * Class handling updates inside Order Arena Plugin
 */
class OAUpdater {
	private $option_name = 'oaup_version';

	public function __construct() {
		register_activation_hook(OAUP_PLUGIN_FILE, array($this, 'activate'));
		register_deactivation_hook(OAUP_PLUGIN_FILE, array($this, 'deactivate'));
		register_uninstall_hook(OAUP_PLUGIN_FILE, array($this, 'uninstall'));

		add_action('plugins_loaded', array($this, 'update_plugin'), 99);
	}

	public function activate() {
		Pages::register_page_type();
		flush_rewrite_rules();

		Pages::register_pages();
	}

	public function deactivate() {
		delete_option($this->option_name);
		flush_rewrite_rules();
	}

	public function uninstall() {
		Pages::unregister_pages();

		delete_option($this->option_name);
		delete_option(OASettingsConfig::get_option_name());
	}

	/**
	 * Compare Order Arena Plugin versions and make updates if needed.
	 *
	 * @return void
	 */
	public function update_plugin() {
		$saved_version = $this->get_saved_version();

		if (OAUP_PLUGIN_VERSION && $saved_version !== OAUP_PLUGIN_VERSION) {
			Pages::refresh_pages();

			// TODO: remove on next release. This is to remove previous plugin options with old option name from the WP db. 
			$previous_settings_option = get_option('oa_customer_settings');
			if ($previous_settings_option) {
				delete_option('oa_customer_settings');
			}

			$this->update_option(OAUP_PLUGIN_VERSION);
		}
	}

	/**
	 * Get saved Order Arena Plugin version.
	 * 
	 * @return string
	 */
	private function get_saved_version() {
		$saved_version = get_option($this->option_name, null);

		if ($saved_version === null) {
			add_option($this->option_name, null);
		}

		return $saved_version;
	}

	/**
	 * Update Order Arena Plugin version in Wordpress database option.
	 *
	 * @return void
	 */
	private function update_option($version) {
		update_option($this->option_name, $version);
	}
}
