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

define('GRAPHQL_URL', 'https://api.orderarena.com/graphql');
define('OA_PLUGIN_URL', plugin_dir_url(__FILE__));
define('OA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OA_PLUGIN_FILE', __FILE__);

require  plugin_dir_path(__FILE__) . 'vendor/autoload.php';

require_once plugin_dir_path(__FILE__) . 'php/Settings/order-arena-settings.php';

use OA\Initializer as OA;

OA\Main::init();
