<?php

/*
 * Plugin Name: Order Arena
 * Plugin URI: https://prosit.no/
 * Description: The ultimate WordPress plugin designed to showcase your catering menu and streamline order requests effortlessly. Whether you're a restaurant, event planner, or caterer, Order Arena offers a comprehensive solution to present your menu attractively and manage customer orders efficiently.
 * Version: <%= htmlWebpackPlugin.options.version %>
 * Author: Prosit.no
 * Author URI: https://prosit.no
 * License: GPLv2 or later
 * Text Domain: order-arena
 */

if (!defined('ABSPATH')) {
	exit;
}

define('OAUP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('OAUP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OAUP_PLUGIN_FILE', __FILE__);

if (!function_exists('get_plugin_data')) {
	require_once(ABSPATH . 'wp-admin/includes/plugin.php');
}

define('OAUP_PLUGIN_VERSION', get_plugin_data(OAUP_PLUGIN_FILE)['Version']);

require  plugin_dir_path(__FILE__) . 'vendor/autoload.php';

require_once plugin_dir_path(__FILE__) . 'php/Settings/order-arena-settings.php';

OAUP\Initializer\Main::init();
