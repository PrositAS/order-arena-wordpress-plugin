<?php

namespace OAUP\Settings;

use OAUP\Settings\OASettingsConfig;

use WP_REST_Response;
use WP_REST_Server;
use WP_Error;
use WP_REST_Request;

/**
 * Class handling rest API endpoint for Order Arena Plugin settings
 */
class OASettingsAPI {
	private $settings;

	private $namespace;
	private $option_name;

	public function __construct() {
		add_action('rest_api_init', array($this, 'register_settings_endpoint'));
	}

	/**
	 * Prepare values from OASettingsConfig.
	 * 
	 * Prepare callbacks and fill with OASettingsConfig static values.
	 *
	 * @return void
	 */
	private function prepare_config() {
		$this->namespace = OASettingsConfig::get_settings_page_name();
		$this->option_name = OASettingsConfig::get_option_name();
	}

	/**
	 * Get Order Arena Plugin settings from database.
	 */
	public function get_settings(WP_REST_Request $request) {
		$this->settings = get_option($this->option_name, []);

		if (!is_array($this->settings) || count($this->settings) === 0) {
			return new WP_Error('no_order_arena_user_portal_settings', 'No order arena settings found.', array('status' => 404));
		}

		$response = new WP_REST_Response($this->settings, 200, ['Content-Type' => 'application/json']);

		return $response;
	}

	/**
	 * Register Order Arena Plugin endpoint for fetching settings from database.
	 */
	public function register_settings_endpoint() {
		$this->prepare_config();

		register_rest_route($this->namespace . '/api', '/settings', array(
			'methods' => WP_REST_Server::READABLE,
			'callback' => [$this, 'get_settings'],
			// NOTE: intentionally public for Angular app color scheme settings
			'permission_callback' => '__return_true',
		));
	}
}
