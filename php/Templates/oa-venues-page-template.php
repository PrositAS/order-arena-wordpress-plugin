<?php

use OAUP\Initializer\Templates;

if (!defined('ABSPATH')) {
	exit;
}

Templates::get_template_header();

?>

<up-menu-page id="menu-page" article-type="venue"></up-menu-page>

<?php

Templates::get_template_footer();
