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
		register_uninstall_hook(OAUP_PLUGIN_FILE, array(__CLASS__, 'uninstall'));

		add_action('admin_init', array($this, 'update_plugin'));
	}

	/**
	 * Activate Order Arena Plugin
	 * 
	 * Register page type and necessary pages.
	 *
	 * @return void
	 */
	public function activate() {
		Pages::register_page_type();
		flush_rewrite_rules();

		Pages::register_pages();
	}

	/**
	 * Deactivate Order Arena Plugin
	 * 
	 * Clear version in the database
	 * but keep posts and settings.
	 *
	 * @return void
	 */
	public function deactivate() {
		delete_option($this->option_name);
		flush_rewrite_rules();
	}

	/**
	 * Uninstall Order Arena Plugin
	 * 
	 * Remove registered pages and delete database options
	 * storing plugin version and settings.
	 *
	 * @return void
	 */
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
		$plugin_version = OAUtils::get_plugin_current_version();

		if ($plugin_version && $saved_version !== $plugin_version) {
			Pages::refresh_pages();

			// TODO: remove on next release. This is to remove previous plugin options with old option name from the WP db. 
			$previous_settings_option = get_option('oa_customer_settings');
			if ($previous_settings_option) {
				delete_option('oa_customer_settings');
			}

			$this->update_option($plugin_version);
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
