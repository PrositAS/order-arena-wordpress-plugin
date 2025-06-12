<?php

namespace OAUP\Initializer;

/**
 * Utils Class for Order Arena Plugin
 */
class OAUtils {

	/**
	 * Get the current version of the plugin
	 * or define it if needed
	 * 
	 * Warining: Must me used after `init` action
	 * due to `_load_textdomain_just_in_time` error.
	 * `get_plugin_data` triggers loading text domain.
	 *
	 * @return string
	 */
	public static function get_plugin_current_version() {
		if (!defined('OAUP_PLUGIN_VERSION')) {
			if (!function_exists('get_plugin_data')) {
				require_once(ABSPATH . 'wp-admin/includes/plugin.php');
			}

			define('OAUP_PLUGIN_VERSION', get_plugin_data(OAUP_PLUGIN_FILE)['Version'] ?? false);
		}

		return OAUP_PLUGIN_VERSION;
	}
}
