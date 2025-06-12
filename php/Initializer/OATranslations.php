<?php

namespace OAUP\Initializer;

use WP_REST_Response;
use WP_REST_Server;
use WP_Error;
use WP_Filesystem_Direct;
use WP_REST_Request;

/**
 * Class handling rest API endpoint for Order Arena Plugin translations
 */
class OATranslations {
	static $namespace = 'order_arena';

	public static function register() {
		add_action('init', array(static::class, 'load_plugin_textdomain'));

		add_action('rest_api_init', array(static::class, 'register_translations_endpoints'));
	}

	public static function load_plugin_textdomain() {
		load_plugin_textdomain('order-arena', false, dirname(plugin_basename(OAUP_PLUGIN_FILE)) . '/languages');
	}

	/** 
	 * Get Order Arena Plugin (Angular) translations from assets/i18n directory.
	 */
	public static function get_translations(WP_REST_Request $request) {
		if (! class_exists('WP_Filesystem_Direct')) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-base.php';
			require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-direct.php';
		}

		$WP_Filesystem_Direct = new WP_Filesystem_Direct(false);

		$path = OAUP_PLUGIN_DIR . 'assets/i18n/' . $request->get_param('lang') . '.json';
		$contents = json_decode($WP_Filesystem_Direct->get_contents($path));

		if (!$WP_Filesystem_Direct->exists($path) || $contents === false) {
			return new WP_Error('no_order_arena_user_portal_translations', 'No order arena translations found.', array('status' => 404));
		}

		$response = new WP_REST_Response($contents, 200, ['Content-Type' => 'application/json']);

		return $response;
	}

	/**
	 * Register Order Arena Plugin translations endpoint for Angular plugin.
	 */
	public static function register_translations_endpoints() {
		register_rest_route(self::$namespace . '/api', '/translations/(?P<lang>[\w-]+)', array(
			'methods' => WP_REST_Server::READABLE,
			'callback' => [self::class, 'get_translations'],
			// NOTE: intentionally public as it's used for Angular app translations source
			'permission_callback' => '__return_true',
		));
	}
}
