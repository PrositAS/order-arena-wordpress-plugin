<?php


namespace OA\Initializer;

class QueryVars implements Initializer {

	static public function register() {
		add_action('query_vars', function ($query_vars) {
			return self::oa_query_vars($query_vars);
		});

		add_action('parse_request', function (&$wp) {
			self::oa_parse_request($wp);
		});
	}

	private static function oa_query_vars($query_vars) {
		$query_vars[] = 'i18n';
		return $query_vars;
	}

	private static function oa_parse_request(&$wp) {
		if (array_key_exists('i18n', $wp->query_vars)) {
			include(OA_PLUGIN_DIR . '/assets/i18n/' . $wp->query_vars['i18n'] . '.json');
			exit();
		}
	}
}
