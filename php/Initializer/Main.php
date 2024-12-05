<?php

namespace OA\Initializer;

class Main {
	public static function init() {
		add_filter('body_class', array(static::class, 'add_body_classes'));
		add_action('wp_enqueue_scripts', array(static::class, 'enqueue_scripts_and_styles'));

		Templates::register();
		Pages::register();
		Rewrite::register();
		QueryVars::register();

		new OAUpdater();
	}

	public static function enqueue_scripts_and_styles() {
		wp_enqueue_script('oa-runtime', OA_PLUGIN_URL . 'runtime.js', array(), OA_PLUGIN_VERSION, false);
		wp_enqueue_script('oa-polyfills', OA_PLUGIN_URL . 'polyfills.js', array(), OA_PLUGIN_VERSION, false);
		wp_enqueue_script('oa-main', OA_PLUGIN_URL . 'main.js', array('oa-runtime', 'oa-polyfills'), OA_PLUGIN_VERSION, false);

		wp_enqueue_style('oa-styles', OA_PLUGIN_URL . 'styles.css', array(), OA_PLUGIN_VERSION);
	}

	public static function add_body_classes($classes) {
		$classes[] = 'mat-typography';

		return $classes;
	}
}
