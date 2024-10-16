<?php

namespace OA\Initializer;

/**
 * Class handling updates inside Order Arena Plugin
 */
class OAUpdater {
	private $option_name = 'oa_version';

	private $saved_version;
	private $current_version;

	public function __construct() {
		if (is_admin()) {
			add_action('plugins_loaded', array($this, 'update_plugin'));
		}
	}

	/**
	 * Compare Order Arena Plugin versions and make updates if needed.
	 *
	 * @return void
	 */
	public function update_plugin() {
		$this->saved_version = get_option($this->option_name, null);
		if ($this->saved_version === null) {
			add_option($this->option_name, null);
		}

		if (!function_exists('get_plugin_data')) {
			require_once(ABSPATH . 'wp-admin/includes/plugin.php');
		}
		$this->current_version = get_plugin_data(OA_PLUGIN_FILE)['Version'];

		if ($this->current_version && $this->saved_version && $this->saved_version !== $this->current_version) {
			Pages::reregister_pages();
			$this->update_option($this->current_version);
		}
	}


	/**
	 * Update Order Arena Plugin version in Wordpress database option.
	 *
	 * @return void
	 */
	public function update_option($settings) {
		update_option($this->option_name, $settings);
	}
}
