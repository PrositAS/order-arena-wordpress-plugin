<?php

/*
 * Plugin Name: Order Arena
 * Plugin URI: https://prosit.no/
 * Description: The ultimate WordPress plugin designed to showcase your catering menu and streamline order requests effortlessly. Whether you're a restaurant, event planner, or caterer, Order Arena offers a comprehensive solution to present your menu attractively and manage customer orders efficiently.
 * Version: <%= htmlWebpackPlugin.options.version %>
 * Requires at least: 5.9
 * Requires PHP: 7.0
 * Author: Prosit.no
 * Author URI: https://prosit.no
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: order-arena
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
	exit;
}

define('OAUP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('OAUP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OAUP_PLUGIN_FILE', __FILE__);
// NOTE: OAUP_PLUGIN_VERSION defined using OAUtils in Main on init action
// (to avoid triggering translation domain to early, due to calling get_plugin_data())

require plugin_dir_path(__FILE__) . 'vendor/autoload.php';

require_once plugin_dir_path(__FILE__) . 'php/Settings/order-arena-settings.php';

OAUP\Initializer\Main::init();
