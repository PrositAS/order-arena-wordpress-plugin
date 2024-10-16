<?php

namespace OA\Initializer;

class Templates {
	public static $templates = array(
		'oa-checkout-page-template.php' => 'OA Checkout Page Template',
		'oa-equipment-page-template.php' => 'OA Equipment Page Template',
		'oa-menu-page-template.php' => 'OA Menu Page Template',
		'oa-profile-page-template.php' => 'OA Profile Page Template',
		'oa-terms-page-template.php' => 'OA Terms Page Template',
		'oa-venues-page-template.php' => 'OA Venues Page Template',
	);

	public static function register() {
		add_filter('theme_order_arena_page_templates', array(static::class, 'register_templates'), 10, 3);
		add_filter('template_include', array(static::class, 'select_template'), 99);
	}

	public static function register_templates($page_templates, $theme, $post) {
		foreach (self::$templates as $key => $value) {
			$page_templates[$key] = $value;
		}

		return $page_templates;
	}

	public static function select_template($template) {
		global $post;

		if ($post->post_type == 'order_arena_page') {
			$page_template_slug = get_page_template_slug($post->ID);

			if (isset(self::$templates[$page_template_slug])) {
				$template_file = OA_PLUGIN_DIR . 'php/Templates/' . $page_template_slug;

				if (file_exists($template_file)) {
					return $template_file;
				} else {
					return locate_template(array('404.php'));
				}
			}
		}

		return $template;
	}
}
