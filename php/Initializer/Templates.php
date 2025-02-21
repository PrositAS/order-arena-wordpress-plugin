<?php

namespace OAUP\Initializer;

class Templates {
	private static function get_templates() {
		$templates = array(
			'oa-checkout-page-template.php' => __('OA Checkout Page Template', 'order-arena'),
			'oa-equipment-page-template.php' => __('OA Equipment Page Template', 'order-arena'),
			'oa-menu-page-template.php' => __('OA Menu Page Template', 'order-arena'),
			'oa-profile-page-template.php' => __('OA Profile Page Template', 'order-arena'),
			'oa-terms-page-template.php' => __('OA Terms Page Template', 'order-arena'),
			'oa-venues-page-template.php' => __('OA Venues Page Template', 'order-arena'),
		);

		return $templates;
	}

	public static function register() {
		add_filter('body_class', array(static::class, 'add_oaup_body_class'), 99);
		add_filter('theme_order_arena_page_templates', array(static::class, 'register_templates'), 10, 3);
		add_filter('template_include', array(static::class, 'select_template'), 99);
	}

	public static function add_oaup_body_class($classes) {
		global $post;

		if ($post->post_type == 'order_arena_page') {
			$classes[] = 'oaup-body';
		}

		return $classes;
	}

	public static function register_templates($page_templates, $theme, $post) {
		foreach (self::get_templates() as $key => $value) {
			$page_templates[$key] = $value;
		}

		return $page_templates;
	}

	public static function select_template($template) {
		global $post;

		if ($post->post_type == 'order_arena_page') {
			$page_template_slug = get_page_template_slug($post->ID);

			if (isset(self::get_templates()[$page_template_slug])) {
				$template_file = OAUP_PLUGIN_DIR . 'php/Templates/' . $page_template_slug;

				if (file_exists($template_file)) {
					return $template_file;
				} else {
					return locate_template(array('404.php'));
				}
			}
		}

		return $template;
	}

	public static function get_template_header() {
		locate_template(array('header.php', 'header.html'), true, false);
	}
}
