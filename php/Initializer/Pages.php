<?php

namespace OAUP\Initializer;

class Pages {
	private static $pages = array(
		'checkout',
		'equipment',
		'menu',
		'profile',
		'terms',
		'venues'
	);

	public static function register() {
		add_action('init', array(static::class, 'register_page_type'));
	}

	public static function register_page_type() {
		register_post_type('order_arena_page', array(
			'labels' => array(
				'description' => __('Pages from Order Arena Plugin', 'order-arena'),
				'name' => __('Order Arena Pages', 'order-arena'),
				'singular_name' => __('Order Arena Page', 'order-arena'),
				'add_new' => __('Add New Order Arena Page', 'order-arena'),
				'add_new_item' => __('Add New Order Arena Page', 'order-arena'),
				'edit_item' => __('Edit Order Arena Page', 'order-arena'),
				'new_item' => __('New Order Arena Page', 'order-arena'),
				'view_item' => __('View Order Arena Page', 'order-arena'),
				'view_items' => __('View Order Arena Pages', 'order-arena'),
				'search_items' => __('Search Order Arena Pages', 'order-arena'),
				'all_items' => __('All Order Arena Pages', 'order-arena'),
				'not_found' => __('No Order Arena Pages found', 'order-arena'),
				'archives' => __('Order Arena Pages', 'order-arena'),
				'attributes' => __('Order Arena Page Attributes', 'order-arena'),
				'insert_into_item' => __('Insert into Order Arena Page', 'order-arena'),
				'uploaded_to_this_item' => __('Uploaded to this Order Arena Page', 'order-arena'),
				'featured_image' => __('Order Arena Page Image', 'order-arena'),
				'remove_featured_image' => __('Remove Order Arena Page Image', 'order-arena'),
				'use_featured_image' => __('Use Order Arena Page Image', 'order-arena'),
			),
			'has_archive' => true,
			'rewrite' => array(
				'slug' => 'oa',
				'with_front' => false
			),
			'public' => true,
			'hierarchical' => false,
			'publicly_queryable' => true,
			'show_ui' => true,
			'show_in_menu' => true,
			'show_in_rest' => false,
			'menu_position' => 6,
			'menu_icon' => 'dashicons-food',
			// 'menu_icon' => 'data:image/svg+xml;base64,' . base64_encode('<svg width="20" height="20" viewBox="0 0 20 20"><path fill="black" d="m -58.712847,225.95973 c -0.12936,-0.12935 -0.23519,-1.79623 -0.23519,-3.70417 v -3.46898 l 42.42153,-0.0248 c 23.3318403,-0.0136 42.73903,-0.15535 43.12708,-0.31491 0.83833,-0.34471 0.93997,-0.291 -3.3839,-1.78822 -5.27244,-1.82568 -9.70953,-5.57092 -12.52012,-10.56794 -1.1358697,-2.0195 -1.5391997,-2.45689 -2.2640297,-2.45521 -0.48507,0.001 -4.8507,0.69984 -9.70139,1.55272 -4.85069,0.85287 -8.9269603,1.44359 -9.0583703,1.31271 -0.1314,-0.13088 -1.20846,-5.79422 -2.39345,-12.58519 -1.18499,-6.79097 -2.23912,-12.62503 -2.34249,-12.96458 -0.1194,-0.39219 -0.53313,-0.61326 -1.13433,-0.6061 -0.52049,0.006 -12.13824,1.97218 -25.81719,4.36887 -13.67896,2.39668 -24.98318,4.25571 -25.1205,4.13116 -0.43991,-0.39901 -1.80055,-8.89648 -1.47297,-9.19906 0.46895,-0.43318 69.7476903,-12.39079 70.0480803,-12.09039 0.35904,0.35903 1.83977,8.87637 1.58708,9.12906 -0.11232,0.11231 -1.91858,0.51147 -4.01391997,0.88703 -2.09535003,0.37556 -3.95319003,0.82582 -4.12854003,1.00058 -0.41528,0.41388 2.24246,15.80556 2.8308,16.3939 0.6139,0.6139 9.25302,-0.90012 9.85812,-1.72765 0.22941,-0.31373 0.52425,-1.37811 0.6552,-2.36528 0.34689,-2.61504 1.73786,-6.04184 3.5727797,-8.80196 7.84091,-11.7944 24.55869,-13.63867 34.86731,-3.84649 1.40959,1.33898 3.13488,3.43383 3.88644,4.71893 0.74334,1.27107 1.5314,2.45754 1.75124,2.63662 0.25289,0.206 8.82247,-1.14176 23.33027,-3.66921 12.6118,-2.19714 45.393677,-7.90323 72.848617,-12.68019 27.45494,-4.77697 50.09582,-8.87648 50.3131,-9.11004 0.2173,-0.23355 0.58785,-1.45652 0.82346,-2.7177 0.90162,-4.82589 3.82204,-9.96624 7.50824,-13.21566 2.15553,-1.90013 6.57963,-4.18056 9.61771,-4.95755 2.80426,-0.71719 8.33713,-0.71161 11.17084,0.0112 4.05334,1.03398 7.24564,2.87457 10.37741,5.98329 1.56805,1.55652 3.37259,3.75496 4.01005,4.88543 0.63746,1.13046 1.38096,2.14058 1.6523,2.24469 0.27133,0.10412 2.59431,-0.18583 5.1622,-0.64431 4.5013,-0.80369 4.67265,-0.8662 4.77449,-1.74143 0.10252,-0.88134 -12.08839,-71.7038 -12.44076,-72.273985 -0.55801,-0.902825 -62.77672,-51.71947 -63.4281,-51.80437 -0.43429,-0.0566 -23.57017,3.863191 -51.41316,8.710647 -27.842997,4.847456 -73.086747,12.710105 -100.541677,17.472552 -27.4549297,4.762447 -50.31493,8.787077 -50.8,8.943623 -0.80954,0.261258 -0.87295,0.432089 -0.77245,2.080763 l 0.10951,1.796137 -3.10812,0.567767 c -4.37867,0.799888 -6.4595,1.056531 -6.4595,0.796724 0,-0.123021 -0.4923,-3.017798 -1.09399,-6.432839 -0.60171,-3.41504 -0.9589,-6.332053 -0.79375,-6.482257 0.16513,-0.150201 17.76274,-3.304879 39.1058003,-7.010389 C 23.601963,42.627759 72.559093,34.113653 111.05251,27.413035 c 41.63396,-7.24729 70.14652,-12.05887 70.37916,-11.87671 0.40278,0.31534 68.71154,56.484571 68.97985,56.721061 0.33221,0.29279 15.10025,86.047844 14.86271,86.304814 -0.14087,0.15239 -4.5638,1.03407 -9.82877,1.9593 -5.265,0.92522 -9.65547,1.76497 -9.75659,1.86611 -0.10112,0.10113 -0.40465,1.44195 -0.67445,2.97959 -1.59755,9.10457 -8.27331,16.41487 -17.02861,18.64721 -2.77429,0.70736 -8.49873,0.71753 -11.25207,0.02 -3.01532,-0.7639 -7.44646,-3.04734 -9.60363,-4.94889 -1.95419,-1.72261 -4.52872,-5.08949 -5.5753,-7.29112 -0.34182,-0.71907 -0.81563,-1.3819 -1.05286,-1.47295 -0.23728,-0.091 -4.02188,0.46 -8.41027,1.22454 -4.38837,0.76454 -37.11411,6.46158 -72.72381,12.66008 -35.609727,6.19851 -64.898417,11.36486 -65.085987,11.48079 -0.18756,0.11591 -0.34103,0.65224 -0.34103,1.19185 0,1.83534 -1.38729,6.41342 -2.71546,8.96105 -0.9051,1.73611 -2.21994,3.43449 -4.15502,5.36705 -3.06287,3.05889 -5.5133,4.55831 -9.53368,5.83365 -3.08274,0.9779 -3.28984,1.09892 -2.44603,1.42936 0.37517,0.14691 50.94922,0.27829 112.386767,0.29192 101.52011,0.0225 111.72416,0.0757 111.91876,0.58282 0.27803,0.72449 0.27803,5.56781 0,6.2923 -0.19481,0.50769 -14.53737,0.558 -159.044,0.558 -87.356417,0 -158.935687,-0.10583 -159.065037,-0.23518 z m 94.66204,-16.89408 c 4.51551,-1.78219 7.87886,-5.34404 9.22211,-9.7664 2.42065,-7.96947 -1.95213,-16.15762 -9.95976,-18.64987 -8.58861,-2.67308 -17.52976,2.92813 -19.07698,11.95083 -1.26091,7.35301 3.52482,14.72482 10.95725,16.87829 2.12847,0.6167 6.80057,0.39893 8.85738,-0.41285 z M 227.3683,175.69239 c 5.14114,-1.89184 8.68603,-6.17034 9.70806,-11.71718 1.77549,-9.63589 -7.18402,-18.68213 -16.9673,-17.13161 -7.36209,1.1668 -12.70984,7.31313 -12.70984,14.60779 0,4.56644 1.46251,7.96909 4.76948,11.09671 4.11364,3.89049 9.91206,5.08999 15.1996,3.14429 z m -343.28807,1.05061 c -0.78392,-3.20061 -1.44316,-8.43564 -1.09541,-8.69868 0.21339,-0.16139 38.072723,-6.84312 84.131853,-14.84828 59.67103,-10.37093 83.81511,-14.43958 83.99167,-14.1539 0.37269,0.60303 1.57393,8.80117 1.32593,9.04916 -0.11838,0.11839 -6.05877,1.23282 -13.20086,2.4765 -7.14209,1.24369 -44.4974897,7.73757 -83.012,14.43085 -38.51452,6.69327 -70.457093,12.25816 -70.983503,12.36642 -0.78952,0.16238 -0.99222,0.0534 -1.15768,-0.62207 z m 72.335353,-33.53906 c -0.35634,-1.15152 -1.57369,-8.88043 -1.42252,-9.0316 0.29504,-0.29504 72.56048,-12.79899 72.76848,-12.59099 0.40034,0.40035 1.75545,8.84549 1.46825,9.15028 -0.20382,0.21632 -70.95314,12.79765 -72.57848,12.90662 -0.0546,0.004 -0.16068,-0.19178 -0.23573,-0.43431 z m -47.99066,-13.05277 c -0.49654,-1.46612 -1.51522,-8.59677 -1.26401,-8.84797 0.35808,-0.35809 87.4720903,-15.56429 87.7237403,-15.31263 0.30232,0.30232 1.70553,9.04483 1.48684,9.26353 -0.19521,0.1952 -86.3506103,15.31821 -87.3451803,15.33184 -0.24863,0.004 -0.51925,-0.19224 -0.60139,-0.43477 z m 132.52072,-2.58354 c -2.50676,-1.05402 -2.57302,-5.1541 -0.0986,-6.10196 0.50764,-0.19447 2.1136,-0.54855 3.56881,-0.78686 4.35925,-0.71389 4.10877,-0.46106 4.39555,-4.43696 0.53692,-7.44375 2.11148,-13.1819 5.38149,-19.611738 5.86456,-11.531505 15.70589,-19.999219 28.49935,-24.521515 l 2.82223,-0.997608 -0.11033,-3.155953 c -0.0957,-2.738366 -0.002,-3.365312 0.70556,-4.738161 1.10578,-2.144398 2.78019,-2.83124 4.69129,-1.92437 1.66939,0.792181 2.8255,2.560987 3.56012,5.446855 0.32105,1.261179 0.74131,2.392453 0.93393,2.513941 0.19262,0.121484 1.34505,0.141029 2.56096,0.04343 5.549577,-0.445466 15.493607,1.431631 21.654117,4.087577 12.16045,5.242655 21.92741,15.238894 26.31668,26.934462 0.34121,0.90916 0.81239,1.72671 1.04708,1.81677 0.2347,0.0901 2.08233,-0.13982 4.10587,-0.51084 4.18208,-0.76678 5.28926,-0.56382 6.16524,1.13017 1.10934,2.1452 0.14877,4.56322 -2.01472,5.07173 -0.62111,0.14599 -108.436187,19.39195 -112.360317,20.05734 -0.42018,0.0712 -1.24112,-0.0711 -1.82431,-0.31631 z m -118.53304,-25.4383 c -0.42687,-2.460653 -0.65421,-4.592793 -0.50519,-4.738086 0.34056,-0.332044 81.9300903,-14.550604 82.1623203,-14.318379 0.29774,0.29774 1.66157,9.063079 1.44401,9.280641 -0.23908,0.239088 -80.4513803,14.249744 -81.5810803,14.249744 -0.67681,0 -0.81395,-0.40363 -1.52006,-4.47392 z M 162.84941,92.256139 c -0.26117,-0.433091 -9.19039,-51.974963 -9.03153,-52.132379 0.2513,-0.249019 8.82589,-1.676884 9.00345,-1.499285 0.0968,0.09675 1.83089,9.666815 3.85363,21.266815 2.24467,12.872995 3.84929,21.196977 4.11819,21.363144 0.24225,0.14973 0.75927,0.199826 1.14895,0.111326 3.98632,-0.905362 41.32856,-7.132151 41.53483,-6.9259 0.44823,0.448249 1.78396,8.571497 1.45585,8.854 -0.16587,0.142846 -11.57288,2.204361 -25.34887,4.581136 -13.77595,2.376776 -25.38709,4.400815 -25.80248,4.497862 -0.4154,0.09705 -0.83482,0.04452 -0.93202,-0.116719 z"></path></svg>'),
			'capability_type' => 'page',
			'capabilities' => array(
				'create_posts' => false,
				// NOTE: Rename capabilities to disable them in admin panel
				'delete_posts' => 'delete_order_arena_pages',
				'delete_post' => 'delete_order_arena_page',
				'delete_private_posts' => 'delete_private_order_arena_pages',
				'delete_published_posts' => 'delete_published_order_arena_pages',
				'delete_others_posts' => 'delete_others_order_arena_pages',
			),
			'map_meta_cap' => true,
			'supports' => array(
				'title',
			),
			'can_export' => false
		));
	}

	public static function register_pages() {
		foreach (self::$pages as $page) {
			$post = get_page_by_path($page, OBJECT, 'order_arena_page');
			$page_template_slug = self::get_page_template_slug($page);

			if (!$post || $post->page_template != $page_template_slug || $post->post_status != 'publish') {
				$post_id = $post ? $post->ID : 0;
				$post_title = $post ? ($post->post_name == strtolower($post->post_title) ? null : $post->post_title) : null;

				self::register_page($page, $page_template_slug, $post_id, $post_title);
			}
		}
	}

	public static function unregister_pages() {
		$posts = get_posts(array('post_type' => 'order_arena_page'));

		foreach ($posts as $post) {
			wp_delete_post($post->ID, true);
		}
	}

	public static function unregister_old_pages() {
		$posts = get_posts(array('post_type' => 'order_arena_page'));

		foreach ($posts as $post) {
			if (!in_array($post->post_name, self::$pages)) {
				wp_delete_post($post->ID, true);
			}
		}
	}

	public static function refresh_pages() {
		self::register_pages();
		self::unregister_old_pages();
	}

	private static function get_page_template_slug($page) {
		if ($page && in_array($page, self::$pages)) {
			$page_template_slug = 'oa-' . $page . '-page-template.php';

			if (self::page_template_exists($page_template_slug)) {
				return $page_template_slug;
			}
		}

		return null;
	}

	private static function page_template_exists($page_template_slug) {
		return $page_template_slug && file_exists(OAUP_PLUGIN_DIR . 'php/Templates/' . $page_template_slug);
	}

	private static function register_page($page_name, $page_template_slug, $post_id = 0, $post_title = null) {
		if ($page_name && in_array($page_name, self::$pages) && self::page_template_exists($page_template_slug)) {
			$postarr = array(
				'id' => $post_id,
				'post_type' => 'order_arena_page',
				'post_title' => $post_title ?: ucfirst($page_name),
				'post_name' => $page_name,
				'post_status' => 'publish',
				'comment_status' => 'closed',
				'page_template' => $page_template_slug,
			);

			return wp_insert_post($postarr);
		}

		return false;
	}
}
