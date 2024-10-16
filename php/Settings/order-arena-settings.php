<?php

use OA\Settings\OASettings;
use OA\Settings\OASettingsAPI;


if (!defined('ABSPATH')) {
    exit;
}

$oa_settings_api = new OASettingsAPI();
if (is_admin()) {
    $oa_settings = new OASettings();
}
