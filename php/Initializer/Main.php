<?php

namespace OAUP\Initializer;

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
		wp_enqueue_script('oaup-runtime', OAUP_PLUGIN_URL . 'runtime.js', array(), OAUP_PLUGIN_VERSION, false);
		wp_enqueue_script('oaup-polyfills', OAUP_PLUGIN_URL . 'polyfills.js', array(), OAUP_PLUGIN_VERSION, false);
		wp_enqueue_script('oaup-main', OAUP_PLUGIN_URL . 'main.js', array('oaup-runtime', 'oaup-polyfills'), OAUP_PLUGIN_VERSION, false);

		wp_enqueue_style('oaup-styles', OAUP_PLUGIN_URL . 'styles.css', array(), OAUP_PLUGIN_VERSION);
	}

	public static function add_body_classes($classes) {
		$classes[] = 'mat-typography';

		return $classes;
	}
}
