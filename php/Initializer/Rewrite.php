<?php

namespace OAUP\Initializer;

class Rewrite implements Initializer {

	private const TAGS = array(
		'i18n' => '([^&]+)',
	);

	static public function register() {
		add_action('init', function () {
			self::add_rewrite_tags();
			self::add_rewrite_rules();
		});
	}

	static private function add_rewrite_tags() {
		foreach (self::TAGS as $TAG => $value) {
			add_rewrite_tag("%$TAG%", $value);
		}
	}

	static private function add_rewrite_rules() {
		add_rewrite_rule('^assets/i18n/(.+)\.json$', 'index.php?i18n=$matches[1]', 'top');
	}
}
