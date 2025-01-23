<?php

use OAUP\Settings\OASettings;
use OAUP\Settings\OASettingsAPI;

if (!defined('ABSPATH')) {
	exit;
}

$oa_settings_api = new OASettingsAPI();
if (is_admin()) {
	$oa_settings = new OASettings();
}
