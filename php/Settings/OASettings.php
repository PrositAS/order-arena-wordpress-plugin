<?php

namespace OAUP\Settings;

use OAUP\Settings\OASettingsConfig;

/**
 * Class handling default values/config for Order Arena Plugin
 */
class OASettings {
	private $settings;

	private $settings_page_name;
	private $option_group_name;
	private $option_name;
	private $setting_args;
	private $settings_sections;
	private $settings_fields;
	private $default_settings;
	private $top_menu_config;

	public function __construct() {
		$this->prepare_config();

		add_action('admin_menu', array($this, 'add_settings_page_top_menu'));
		add_action('admin_init', array($this, 'init_settings'));
		add_action('admin_enqueue_scripts', array($this, 'enqueue_media_scripts'));
		register_uninstall_hook(OAUP_PLUGIN_FILE, array($this, 'destroy_settings'));
	}

	/**
	 * Prepare values from OASettingsConfig.
	 * 
	 * Prepare callbacks and fill with OASettingsConfig static values.
	 *
	 * @return void
	 */
	private function prepare_config() {
		$this->settings_page_name = OASettingsConfig::get_settings_page_name();
		$this->option_group_name = OASettingsConfig::get_option_group_name();
		$this->option_name = OASettingsConfig::get_option_name();
		$this->setting_args = OASettingsConfig::get_prepared_settings_args($this);
		$this->settings_sections = OASettingsConfig::get_prepared_settings_sections($this);
		$this->settings_fields = OASettingsConfig::get_prepared_settings_fields($this);
		$this->default_settings = OASettingsConfig::get_default_settings();
		$this->top_menu_config = OASettingsConfig::get_prepared_top_menu_config($this);
	}

	/**
	 * Enqueue media scripts for media library integration in Order Arena Plugin settings page.
	 *
	 * @param string $hook_suffix
	 * 
	 * @return void
	 */
	public function enqueue_media_scripts(string $hook_suffix) {
		if ($hook_suffix === 'toplevel_page_' . $this->settings_page_name) {
			wp_enqueue_media();
			wp_enqueue_script('oaup-media-input-scripts', OAUP_PLUGIN_URL . 'php/Settings/oa-media-input.js', array('jquery', 'wp-i18n'), OAUP_PLUGIN_VERSION, true);
			wp_set_script_translations('oaup-media-input-scripts', 'order-arena');
		}
	}

	/**
	 * Register Order Arena Plugin settings page in Top menu.
	 * 
	 * @return void
	 */
	public function add_settings_page_top_menu() {
		add_menu_page(
			$this->top_menu_config['page_title'],
			$this->top_menu_config['menu_title'],
			$this->top_menu_config['capability'],
			$this->top_menu_config['menu_slug'],
			$this->top_menu_config['callback'],
			$this->top_menu_config['icon_url'],
			$this->top_menu_config['position']
		);
	}

	/**
	 * Handle Order Arena Plugin settings.
	 * 
	 * - Restrict acces if user cannot make changes to admin.
	 * - Init setting and resol
	 * 
	 * @return void
	 */
	public function init_settings() {
		$this->init_setting();

		if (!current_user_can('manage_options')) {
			return;
		}

		$this->add_sections();
		$this->add_fields();
	}

	/**
	 * Init Order Arena Plugin setting.
	 * 
	 * - Add default OA settings to database if they're not available.
	 * - Resolve OA settings compatibility with default OA settings.
	 *
	 * @return void
	 */
	private function init_setting() {
		$this->settings = get_option($this->option_name, []);
		if ($this->settings === []) {
			add_option($this->option_name, $this->default_settings);
		}
		$this->resolve_settings_compatibility();

		register_setting($this->option_group_name, $this->option_name, $this->setting_args);
	}

	/**
	 * Restore Order Arena Plugin setting to defaults.
	 *
	 * @return void
	 */
	private function restore_default_settings() {
		$this->update_option($this->default_settings);
	}

	/**
	 * Restore Order Arena Plugin setting of $key to default value.
	 *
	 * @param string $key
	 * 
	 * @return void
	 */
	private function restore_setting($key) {
		if (isset($this->default_settings[$key]) && isset($this->settings[$key])) {
			$this->settings[$key] = $this->default_settings[$key];

			$this->update_option($this->settings);
		}
	}

	/**
	 * Resolve Order Arena Plugin settings compatibility with default OA settings.
	 * 
	 * If there are new/additional settings available in default settings configuration,
	 * update the OA settings in Wordpress database option.
	 *
	 * @return array $resolvedSettings
	 */
	private function resolve_settings_compatibility() {
		$resolvedSettings = $this->settings;

		if (is_array($resolvedSettings)) {
			foreach ($this->default_settings as $key => $value) {
				if (!isset($resolvedSettings[$key])) {
					$resolvedSettings[$key] = $value;
				}
			}
		} else {
			$resolvedSettings = $this->default_settings;
		}

		if (count(array_diff_assoc($resolvedSettings, $this->settings))) {
			$this->settings = $resolvedSettings;
			$this->update_option($resolvedSettings);
		}

		return $resolvedSettings;
	}

	/**
	 * Delete Order Arena Plugin settings from Wordpress database.
	 *
	 * @return void
	 */
	public function destroy_settings() {
		delete_option($this->option_name);
	}

	/**
	 * Add sections to Order Arena Plugin setting.
	 *
	 * @return void
	 */
	private function add_sections() {
		foreach ($this->settings_sections as $name => $params) {
			add_settings_section($name, $params['title'], $params['callback'], $params['page']);
		}
	}

	/**
	 * Add fields to Order Arena Plugin setting sections.
	 *
	 * @return void
	 */
	private function add_fields() {
		foreach ($this->settings_fields as $name => $params) {
			add_settings_field($name, $params['title'], $params['callback'], $params['page'], $params['section'], $params['args']);
		}
	}

	/**
	 * Update Order Arena Plugin settings in Wordpress database option.
	 *
	 * @return void
	 */
	public function update_option($settings) {
		update_option($this->option_name, $settings);
	}

	/**
	 * Sanitize Order Arena Plugin settings form depending on field type.
	 *
	 * @param array $input
	 * 
	 * @return array $output
	 */
	public function sanitize_settings($input) {
		$output = array();

		foreach ($input as $key => $value) {
			$type = isset($this->settings_fields[$key]) ? $this->settings_fields[$key]['type'] : 'text';

			switch ($type) {
				case 'text':
					$output[$key] = sanitize_text_field($value);
					break;
				case 'textarea':
					$output[$key] = sanitize_textarea_field($value);
					break;
				case 'color':
					$output[$key] = sanitize_hex_color($value);
					break;
				default:
					$output[$key] = sanitize_text_field($value);
			}
		}

		return $output;
	}

	/**
	 * Render Order Arena Plugin settings page template.
	 *
	 * @return void
	 */
	public function render_settings_page_template() {
		wp_enqueue_media();

		// NOTE: No need to check for nonce as it's handled by WordPress Settings API
		if (isset($_GET['settings-updated'])) {
			add_settings_error($this->option_name, 'oaup_updated', __('Settings updated!', 'order-arena'), 'success');
		}

		settings_errors($this->option_name);
?>
		<div class="wrap">
			<h1><?php echo esc_html(get_admin_page_title()); ?></h1>
			<form method="post" action="options.php">
				<?php
				settings_fields($this->option_group_name);
				do_settings_sections($this->settings_page_name);
				submit_button();
				?>
			</form>
		</div>
	<?php
	}

	/**
	 * Render `oaup_settings_colors_primary` section template.
	 *
	 * @return void
	 */
	public function render_primary_colors_section_template() {
	?>
		<p>
			<?php __('Primary color palette settings for Order Arena Plugin.', 'order-arena'); ?>
		</p>
	<?php
	}

	/**
	 * Render `oaup_settings_colors_accent` section template.
	 *
	 * @return void
	 */
	public function render_accent_colors_section_template() {
	?>
		<p>
			<?php __('Accent color palette settings for Order Arena Plugin.', 'order-arena'); ?>
		</p>
	<?php
	}

	/**
	 * Render `oaup_settings_colors_warn` section template.
	 *
	 * @return void
	 */
	public function render_warn_colors_section_template() {
	?>
		<p>
			<?php __('Warn color palette settings for Order Arena Plugin.', 'order-arena'); ?>
		</p>
	<?php
	}

	/**
	 * Render `oaup_settings_image_headers` section template.
	 *
	 * @return void
	 */
	public function render_image_headers_section_template() {
	?>
		<p>
			<?php __('Image headers settings for Order Arena Plugin.', 'order-arena'); ?>
		</p>
	<?php
	}

	/**
	 * Render Order Arena Plugin text input template.
	 *
	 * @param array $args
	 * 
	 * @return void
	 */
	public function render_text_input_template(array $args) {
		$id = $args['label_for'];
		$name = $this->option_name . '[' . $id . ']';
		$value = isset($this->settings[$args['label_for']]) ? $this->settings[$args['label_for']] : $this->default_settings[$args['label_for']];
	?>
		<input type="text" id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr($value); ?>">
	<?php
	}

	/**
	 * Render Order Arena Plugin number input template.
	 *
	 * @param array $args
	 * 
	 * @return void
	 */
	public function render_number_input_template(array $args) {
		$id = $args['label_for'];
		$name = $this->option_name . '[' . $id . ']';
		$value = isset($this->settings[$args['label_for']]) ? $this->settings[$args['label_for']] : $this->default_settings[$args['label_for']];
	?>
		<input type="number" id="<?php echo esc_attr($id) ?>" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr($value); ?>">
	<?php
	}

	/**
	 * Render Order Arena Plugin color input template.
	 *
	 * @param array $args
	 * 
	 * @return void
	 */
	public function render_color_input_template(array $args) {
		$id = $args['label_for'];
		$name = $this->option_name . '[' . $id . ']';
		$value = isset($this->settings[$args['label_for']]) ? $this->settings[$args['label_for']] : $this->default_settings[$args['label_for']];
	?>
		<input type="color" id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr($value); ?>">
	<?php
	}

	/**
	 * Render Order Arena Plugin media input template.
	 *
	 * @param array $args
	 * 
	 * @return void
	 */
	public function render_media_input_template(array $args) {
		$id = $args['label_for'];
		$name = $this->option_name . '[' . $id . ']';
		$value = isset($this->settings[$args['label_for']]) ? $this->settings[$args['label_for']] : $this->default_settings[$args['label_for']];
	?>
		<div class="image-preview-wrapper">
			<img id="preview-<?php echo esc_attr($id); ?>" src="<?php echo esc_attr($value); ?>" height="100" style="max-height: 100px;">
		</div>
		<div>
			<input type="text" name="<?php echo esc_attr($name); ?>" id="<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($value); ?>">
			<input type="button" id="upload-btn-<?php echo esc_attr($id); ?>" class="button button-secondary" value="Select Image">
		</div>
<?php
	}
}
