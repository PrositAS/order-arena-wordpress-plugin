<?php

namespace OAUP\Settings;

/**
 * Class handling default values/config for Order Arena Plugin
 */
class OASettingsConfig {
	/**
	 * Settings page name (unique) for Order Arena Plugin.
	 *
	 * @var string $settings_page_name
	 */
	private static $settings_page_name = 'order_arena';

	/**
	 * Option group name (unique) for Order Arena Plugin.
	 *
	 * @var string $option_group_name
	 */
	private static $option_group_name = 'oaup_data';

	/**
	 * Option name for Order Arena Plugin in Wordpress database options table.
	 * 
	 * @var string $option_name
	 */
	private static $option_name = 'oaup_customer_settings';

	/**
	 * Additional settings arguments for Order Arena Plugin.
	 * 
	 * Compatible with params for `register_setting()`
	 * (https://developer.wordpress.org/reference/functions/register_setting/)
	 *
	 * @return array $settings_args
	 * 
	 * Additional parameters for setting:
	 *  - `type (string)` The type of data. Only for REST API
	 *     Values: `'string'`, `'boolean'`, `'integer'`, `'number'`, `'array'`, `'object'`
	 *  - `description (string)` A description of the data. Only for REST API.
	 *  - `sanitize_callback (string)` A callback function that sanitizes the option’s value.
	 *  - `show_in_rest (bool|array)` Whether data associated with this setting should be included in the REST API.
	 *  - `default (mixed)` Default value when calling `get_option()`
	 */
	private static function get_settings_args() {
		$settings_args = array(
			'type' => 'array',
			'description' => __('Settings for Order Arena Plugin', 'order-arena'),
			// NOTE: 'sanitize_callback' => OASettings->sanitize_settings()
			'sanitize_callback' => 'sanitize_settings',
			'show_in_rest' => array(
				'schema' => array(
					'type' => 'array',
					'items' => self::prepare_settings_fields_types(),
				),
			),
			'default' => self::$default_settings
		);

		return $settings_args;
	}

	/**
	 * Settings sections for Order Arena Plugin.
	 * 
	 * Compatible with params for `add_settings_section()`
	 * (https://developer.wordpress.org/reference/functions/add_settings_section/)
	 *
	 * @return array $settings_sections
	 * `$key` of `$settings_sections` being `$id`-s of sections `(string)`
	 * 
	 * Section parameters:
	 *  - `title (string)` Formatted title of the section, shown as the heading for the section.
	 *  - `callback (string)` Function that echos out content at the top of the section (between heading and fields).
	 *  - `page (string)` The slug-name of the settings page.
	 */
	private static function get_settings_sections() {
		$settings_sections = array(
			'oaup_settings_colors_primary' => array(
				'title' => __('Primary colors', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_primary_colors_section_template()
				'callback' => 'render_primary_colors_section_template',
				'page' => self::$settings_page_name
			),
			'oaup_settings_colors_accent' => array(
				'title' => __('Accent colors', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_accent_colors_section_template()
				'callback' => 'render_accent_colors_section_template',
				'page' => self::$settings_page_name
			),
			'oaup_settings_colors_warn' => array(
				'title' => __('Warn colors', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_warn_colors_section_template()
				'callback' => 'render_warn_colors_section_template',
				'page' => self::$settings_page_name
			),
			'oaup_settings_image_headers' => array(
				'title' => __('Image headers', 'order-arena'),
				// NOTE: 'callback' => OASettings->renderMainSectionTemplate()
				'callback' => 'render_image_headers_section_template',
				'page' => self::$settings_page_name
			),
		);

		return $settings_sections;
	}

	/**
	 * Settings fields for Order Arena Plugin.
	 * 
	 * Compatible with params for `add_settings_field()` and `register_setting()`
	 * (https://developer.wordpress.org/reference/functions/add_settings_field/)
	 * (https://developer.wordpress.org/reference/functions/register_setting/)
	 *
	 * @return array $settings_fields
	 * `$key` of `$settings_fields` being `$id`-s/`$name`-s of fields `(string)`
	 * 
	 * Setting parameters:
	 *  - `title (string)` Formatted title of the field, shown as the label for the field.
	 *  - `callback (string)` Function that echos out desired form inputs.
	 *     Needs to output the appropriate HTML input and fill it with the old value,
	 *     the saving will be done behind the scenes.
	 *     Field name attribute must match `$option_name` in `reguster_setting()`.
	 *  - `page (string)` The slug-name of the settings page.
	 *  - `section (string)` The slug-name of the section of the settings page.
	 *  - `type (string)` Type of input for sanitize callback
	 *     Values: `'text'`, `'number'`, `'color'`
	 *  - `args (array)` Extra arguments for field callback.
	 * 
	 * `args (array)` parameters:
	 *  - `label_for (string)` When supplied, the setting title will be wrapped
	 *     in a `<label>` element, its `for` attribute populated with this value.
	 *  - `class (string)` CSS Class to be added to the `<tr>` element whe the field is output. 
	 */
	private static function get_settings_fields() {
		$settings_fields = array(
			'oaup_primary_color_lighter' => array(
				'title' => __('Primary color (lighter)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_primary',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_primary_color' => array(
				'title' => __('Primary color', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_primary',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_primary_color_darker' => array(
				'title' => __('Primary color (darker)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_primary',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_primary_contrast_color_lighter' => array(
				'title' => __('Primary contrast color (lighter)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_primary',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_primary_contrast_color' => array(
				'title' => __('Primary contrast color', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_primary',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_primary_contrast_color_darker' => array(
				'title' => __('Primary contrast color (darker)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_primary',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_accent_color_lighter' => array(
				'title' => __('Accent color (lighter)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_accent',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_accent_color' => array(
				'title' => __('Accent color', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_accent',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_accent_color_darker' => array(
				'title' => __('Accent color (darker)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_accent',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_accent_contrast_color_lighter' => array(
				'title' => __('Accent contrast color (lighter)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_accent',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_accent_contrast_color' => array(
				'title' => __('Accent contrast color', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_accent',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_accent_contrast_color_darker' => array(
				'title' => __('Accent contrast color (darker)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_accent',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_warn_color_lighter' => array(
				'title' => __('Warn color (lighter)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_warn',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_warn_color' => array(
				'title' => __('Warn color', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_warn',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_warn_color_darker' => array(
				'title' => __('Warn color (darker)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_warn',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_warn_contrast_color_lighter' => array(
				'title' => __('Warn contrast color (lighter)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_warn',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_warn_contrast_color' => array(
				'title' => __('Warn contrast color', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_warn',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_warn_contrast_color_darker' => array(
				'title' => __('Warn contrast color (darker)', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_color_input_template()
				'callback' => 'render_color_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_colors_warn',
				'type' => 'color',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_menu_image' => array(
				'title' => __('Menu', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_media_input_template()
				'callback' => 'render_media_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_image_headers',
				'type' => 'media',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_order_confirmation_image' => array(
				'title' => __('Order confirmation', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_media_input_template()
				'callback' => 'render_media_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_image_headers',
				'type' => 'media',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
			'oaup_terms_and_conditions_image' => array(
				'title' => __('Terms and conditions', 'order-arena'),
				// NOTE: 'callback' => OASettings->render_media_input_template()
				'callback' => 'render_media_input_template',
				'page' => self::$settings_page_name,
				'section' => 'oaup_settings_image_headers',
				'type' => 'media',
				'args' => array(
					// NOTE: 'label_for' => $key
				)
			),
		);

		return $settings_fields;
	}

	/**
	 * Default settings config for Order Arena Plugin.
	 * - For fields of type `color` use `HEX`
	 * 
	 * @var array $default_settings
	 */
	private static $default_settings = array(
		'oaup_primary_color_lighter' => '#b9bcc0',
		'oaup_primary_color' => '#151e2c',
		'oaup_primary_color_darker' => '#0f1621',
		'oaup_primary_contrast_color_lighter' => '#000000',
		'oaup_primary_contrast_color' => '#ffffff',
		'oaup_primary_contrast_color_darker' => '#ffffff',
		'oaup_accent_color_lighter' => '#ffffff',
		'oaup_accent_color' => '#ffffff',
		'oaup_accent_color_darker' => '#ffffff',
		'oaup_accent_contrast_color_lighter' => '#000000',
		'oaup_accent_contrast_color' => '#000000',
		'oaup_accent_contrast_color_darker' => '#000000',
		'oaup_warn_color_lighter' => '#efc1c0',
		'oaup_warn_color' => '#c8302c',
		'oaup_warn_color_darker' => '#bb2421',
		'oaup_warn_contrast_color_lighter' => '#000000',
		'oaup_warn_contrast_color' => '#ffffff',
		'oaup_warn_contrast_color_darker' => '#ffffff',
		'oaup_menu_image' => '',
		'oaup_order_confirmation_image' => '',
		'oaup_terms_and_conditions_image' => '',
	);

	/**
	 * Top menu config for Order Arena Plugin.
	 * Compatible with params for `add_menu_page()` (https://developer.wordpress.org/reference/functions/add_menu_page/)
	 * 
	 * @return array $top_menu_config
	 *  Keys:
	 *   - `page_title (string)` The text to be displayed in the title tags of the page when the menu is selected.
	 *   - `menu_title (string)` The text to be used for the menu.
	 *   - `capability (string)` The capability required for this menu to be displayed to the user. (https://wordpress.org/documentation/article/roles-and-capabilities/)
	 *   - `menu_slug (string)` The slug name to refer to this menu by. Should be unique for this menu page and only include lowercase alphanumeric, dashes, and underscores characters to be compatible with sanitize_key().
	 *   - `callback (callable)` Optional. The function to be called to output the content for this page. Default: `''`.
	 *   - `icon_url (string)` Optional. The URL to the icon to be used for this menu. Default: `''`.
	 *   - `position (int)` Optional. The position in the menu order this item should appear. Default: `null`.
	 */
	private static function get_top_menu_config() {
		$top_menu_config = array(
			'page_title' => __('Order Arena', 'order-arena'),
			'menu_title' => __('Order Arena Settings', 'order-arena'),
			'capability' => 'manage_options',
			'menu_slug' => self::$settings_page_name,
			// NOTE: 'callback' => OASettings->render_settings_page_template()
			'callback' => 'render_settings_page_template',
			'icon_url' => 'dashicons-admin-generic',
			'position' => null
		);

		return $top_menu_config;
	}

	/**
	 * Get settings page name for Order Arena Plugin.
	 * 
	 * @return string `OASettingsConfig::$settings_page_name`
	 */
	public static function get_settings_page_name() {
		return self::$settings_page_name;
	}

	/**
	 * Get option group name for Order Arena Plugin.
	 * 
	 * @return string `OASettingsConfig::$option_group_name`
	 */
	public static function get_option_group_name() {
		return self::$option_group_name;
	}

	/**
	 * Get option name in Wordpress database for Order Arena Plugin.
	 * 
	 * @return string `OASettingsConfig::$option_name`
	 */
	public static function get_option_name() {
		return self::$option_name;
	}

	/**
	 * Get additional setting args for Order Arena Plugin.
	 * 
	 * @param OASettings $settings_instance
	 * 
	 * @return array `OASettingsConfig::get_settings_args()` (prepared)
	 */
	public static function get_prepared_settings_args($settings_instance) {
		$args = self::get_settings_args();
		$args['sanitize_callback'] = [$settings_instance, $args['sanitize_callback']];

		return $args;
	}

	/**
	 * Get settings sections for Order Arena Plugin.
	 * 
	 * @param OASettings|null $settings_instance
	 * 
	 * @return array `OASettingsConfig::get_settings_sections()` (prepared)
	 */
	public static function get_prepared_settings_sections($settings_instance = null) {
		$sections = self::get_settings_sections();
		foreach ($sections as $name => $params) {
			$sections[$name] = self::prepare_settings_section($params, $settings_instance);
		}

		return $sections;
	}

	/**
	 * Get settings section for Order Arena Plugin.
	 * 
	 * @param string $name
	 * @param OASettings|null $settings_instance
	 * 
	 * @return array|null `OASettingsConfig::get_settings_sections()[$name]` (prepared)
	 */
	public static function get_settings_section($name, $settings_instance = null) {
		if ($name && isset(self::get_settings_sections()[$name])) {
			return self::prepare_settings_section(self::get_settings_sections()[$name], $settings_instance);
		}

		return null;
	}

	/**
	 * Prepare params of settings section for Order Arena Plugin.
	 *
	 * @param array $params
	 * @param OASettings|null $settings_instance
	 * 
	 * @return array `$section` of `OASettingsConfig::get_settings_sections()` (prepared)
	 */
	private static function prepare_settings_section($params, $settings_instance = null) {
		if ($settings_instance && array_key_exists('callback', $params) && !empty($params['callback'])) {
			$params['callback'] = [$settings_instance, $params['callback']];
		}

		return $params;
	}

	/**
	 * Get settings fields for Order Arena Plugin.
	 * 
	 * @param OASettings|null $settings_instance
	 * 
	 * @return array `OASettingsConfig::get_settings_fields()` (prepared)
	 */
	public static function get_prepared_settings_fields($settings_instance = null) {
		$settings = self::get_settings_fields();
		foreach ($settings as $name => $params) {
			$settings[$name] = self::prepare_settings_field($name, $params, $settings_instance);
		}

		return $settings;
	}

	/**
	 * Get setting field for Order Arena Plugin.
	 * 
	 * @param string $name
	 * @param OASettings $settings_instance
	 * 
	 * @return array|null `OASettingsConfig::get_settings_fields()[$name]` (prepared)
	 */
	public static function get_setting_field($name, $settings_instance = null) {
		if ($name && isset(self::get_settings_fields()[$name])) {
			return self::prepare_settings_field($name, self::get_settings_fields()[$name], $settings_instance);
		}

		return null;
	}

	/**
	 * Prepare Order Arena Plugin setting field.
	 *
	 * @param string $name
	 * @param array $params
	 * @param OASettings|null $settings_instance
	 * 
	 * @return array `OASettingsConfig::get_settings_fields()[$name]` (prepared)
	 */
	private static function prepare_settings_field($name, $params, $settings_instance = null) {
		if ($settings_instance && array_key_exists('callback', $params) && !empty($params['callback'])) {
			$params['callback'] = [$settings_instance, $params['callback']];
		}
		$params['args']['label_for'] = $name;

		return $params;
	}

	private static function prepare_settings_fields_types() {
		$fields = array_keys(self::get_settings_fields());

		return array_combine($fields, array_map(array(__CLASS__, 'get_settings_field_type'), $fields));
	}

	private static function get_settings_field_type($name) {
		if ($name && isset(self::get_settings_fields()[$name]) && isset(self::get_settings_fields()[$name]['type'])) {
			switch (self::get_settings_fields()[$name]['type']) {
				case 'color':
				case 'media':
					return 'string';
				default:
					return self::get_settings_fields()[$name]['type'];
			}
		}

		return 'string';
	}

	/**
	 * Get default settings for Order Arena Plugin.
	 * 
	 * @return array `OASettingsConfig::$default_settings`
	 */
	public static function get_default_settings() {
		return self::$default_settings;
	}

	/**
	 * Get default setting for Order Arena Plugin.
	 * 
	 * @param string $name
	 * 
	 * @return array|null `OASettingsConfig::$default_settings[$name]`
	 */
	public static function get_default_setting($name) {
		if ($name && isset(self::$default_settings[$name])) {
			return self::$default_settings[$name];
		}

		return null;
	}

	/**
	 * Get Order Arena Plugin Top menu config.
	 * 
	 * @param OASettings|null $settings_instance
	 * 
	 * @return array `OASettingsConfig::get_top_menu_config() (prepared)`
	 */
	public static function get_prepared_top_menu_config($settings_instance = null) {
		return self::prepare_top_menu_config($settings_instance);
	}

	/**
	 * Get Order Arena Plugin Top menu config value.
	 * 
	 * @param string|null $key of `OASettingsConfig::get_top_menu_config()`
	 * @param OASettings|null $settings_instance
	 * 
	 * @return string|int|null `OASettingsConfig::get_top_menu_config()[$key]` (prepared)
	 */
	public static function get_prepared_top_menu_config_param($key = null, $settings_instance = null) {
		$config = self::prepare_top_menu_config($settings_instance);
		if ($key && isset($config[$key])) {
			return $config[$key];
		}

		return null;
	}

	/**
	 * Prepare Order Arena Plugin Top menu config
	 * 
	 * @param OASettings|null $settings_instance
	 * 
	 * @return array `OASettingsConfig::get_top_menu_config()` (prepared)
	 */
	private static function prepare_top_menu_config($settings_instance = null) {
		$config = self::get_top_menu_config();
		if ($settings_instance && isset($config['callback'])) {
			$config['callback'] = [$settings_instance, $config['callback']];
		}

		return $config;
	}
}
