<?php

namespace OA\Initializer;

use OA\Settings\OASettingsConfig;

/**
 * Class handling updates inside Order Arena Plugin
 */
class OAUpdater {
	private $option_name = 'oa_version';

	public function __construct() {
		register_activation_hook(OA_PLUGIN_FILE, array($this, 'activate'));
		register_deactivation_hook(OA_PLUGIN_FILE, array($this, 'deactivate'));
		register_uninstall_hook(OA_PLUGIN_FILE, array($this, 'uninstall'));

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

		if (OA_PLUGIN_VERSION && $saved_version !== OA_PLUGIN_VERSION) {
			Pages::refresh_pages();
			$this->update_option(OA_PLUGIN_VERSION);
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
	private function update_option($settings) {
		update_option($this->option_name, $settings);
	}
}
