<?php
	define( 'OOUI_DEMOS', true );

	$autoload = __DIR__ . '/vendor/autoload.php';
	if ( !file_exists( $autoload ) ) {
		echo '<p>Did you forget to run <code>composer install</code>?</p>';
		exit();
	}
	require_once $autoload;
	require_once 'classes/ButtonStyleShowcaseWidget.php';
	require_once 'classes/LinkedFieldsetLayout.php';

	// @codingStandardsIgnoreStart MediaWiki.WhiteSpace.SpaceBeforeSingleLineComment.NewLineComment
	$themes = [
		'wikimediaui' => 'WikimediaUI', // Do not change this line or you'll break `grunt add-theme`
		'apex' => 'Apex',
	];
	// @codingStandardsIgnoreEnd MediaWiki.WhiteSpace.SpaceBeforeSingleLineComment.NewLineComment
	$theme = ( isset( $_GET['theme'] ) && isset( $themes[ $_GET['theme'] ] ) )
		? $_GET['theme'] : 'wikimediaui';
	$themeClass = 'OOUI\\' . $themes[ $theme ] . 'Theme';
	OOUI\Theme::setSingleton( new $themeClass() );

	$direction = ( isset( $_GET['direction'] ) && $_GET['direction'] === 'rtl' ) ? 'rtl' : 'ltr';
	$directionSuffix = $direction === 'rtl' ? '.rtl' : '';
	OOUI\Element::setDefaultDir( $direction );

	// We will require_once a file by this name later, so this validation is important
	$pages = [
		'widgets',
		'layouts'
	];
	$page = ( isset( $_GET['page'] ) && in_array( $_GET['page'], $pages ) )
		? $_GET['page'] : 'widgets';

	$query = [
		'page' => $page,
		'theme' => $theme,
		'direction' => $direction,
	];

	// Stylesheets to load
	$urls = [];
	$urls[] = "oojs-ui-core-$theme$directionSuffix.css";
	$urls[] = "oojs-ui-widgets-$theme$directionSuffix.css";
	$urls[] = "oojs-ui-images-$theme$directionSuffix.css";
?>
<!DOCTYPE html>
<html lang="en" dir="<?php echo $direction; ?>">
<head>
	<meta charset="UTF-8">
	<title>OOUI Widget Demo</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php
		foreach ( $urls as $url ) {
			echo '<link rel="stylesheet" href="dist/' . htmlspecialchars( $url ) . '">' . "\n";
		}
	?>
	<link rel="stylesheet" href="styles/demo<?php echo $directionSuffix; ?>.css">
	<link rel="stylesheet" href="classes/ButtonStyleShowcaseWidget.css">
</head>
<body class="oo-ui-<?php echo $direction; ?> oo-ui-theme-<?php echo $theme ?>">
	<div class="demo-root">
		<div class="demo-header" role="banner">
			<h1>OOUI</h1>
			<h2>Demos <span>– Rapidly create web-applications in JS or PHP. Cross-browser, i18n
				and a11y ready.</span></h2>
			<div class="demo-menu" role="navigation">
				<?php
					echo new OOUI\ButtonGroupWidget( [
						'infusable' => true,
						'items' => array_map( function ( $theme, $themeLabel ) use ( $query ) {
							return new OOUI\ButtonWidget( [
								'label' => $themeLabel,
								'href' => '?' . http_build_query( array_merge( $query, [ 'theme' => $theme ] ) ),
								'active' => $query['theme'] === $theme,
							] );
						}, array_keys( $themes ), array_values( $themes ) ),
					] );
					echo new OOUI\ButtonGroupWidget( [
						'infusable' => true,
						'items' => [
							new OOUI\ButtonWidget( [
								'icon' => 'textDirLTR',
								'href' => '?' . http_build_query( array_merge( $query, [ 'direction' => 'ltr' ] ) ),
								'active' => $query['direction'] === 'ltr',
								'title' => 'Switch to left-to-right direction demo',
							] ),
							new OOUI\ButtonWidget( [
								'icon' => 'textDirRTL',
								'href' => '?' . http_build_query( array_merge( $query, [ 'direction' => 'rtl' ] ) ),
								'active' => $query['direction'] === 'rtl',
								'title' => 'Switch to right-to-left direction demo',
							] ),
						]
					] );
					echo new OOUI\ButtonGroupWidget( [
						'infusable' => true,
						'items' => [
							new OOUI\ButtonWidget( [
								'label' => 'JS',
								'href' => '.?' . http_build_query( $query )
							] ),
							new OOUI\ButtonWidget( [
								'label' => 'PHP',
								'href' => '?' . http_build_query( $query ),
								'active' => true,
							] ),
						]
					] );
					echo new OOUI\ButtonGroupWidget( [
						'infusable' => true,
						'items' => [
							new OOUI\ButtonWidget( [
								'label' => 'Desktop',
								'active' => true,
								'disabled' => true,
							] ),
							new OOUI\ButtonWidget( [
								'label' => 'Mobile',
								'disabled' => true,
							] ),
						],
					] );
					echo new OOUI\ButtonWidget( [
						'infusable' => true,
						'classes' => [ 'demo-menuLink', 'demo-menuLink-docs' ],
						'label' => 'Docs',
						'icon' => 'journal',
						'href' => '../php/',
						'framed' => false,
						'flags' => [ 'progressive' ],
					] );
					echo new OOUI\ButtonWidget( [
						'infusable' => true,
						'classes' => [ 'demo-menuLink', 'demo-menuLink-tutorials' ],
						'label' => 'Tutorials',
						'icon' => 'book',
						'href' => 'tutorials/index.html',
						'framed' => false,
						'flags' => [ 'progressive' ],
						'rel' => []
					] );
					echo new OOUI\ButtonWidget( [
						'infusable' => true,
						'classes' => [ 'demo-menu-infuse' ],
						'disabled' => true,
						'label' => 'Infuse',
					] );
				?>
			</div>
			<?php
				$items = [];
				foreach ( $pages as $p ) {
					$items[] = new OOUI\TabOptionWidget( [
						'label' => new OOUI\HtmlSnippet(
							'<a href="?' . http_build_query( array_merge( $query, [ 'page' => $p ] ) ) . '">' .
								ucfirst( $p ) .
							'</a>'
						),
						'selected' => $page === $p,
					] );
				}
				foreach ( [ 'Dialogs', 'Icons', 'Toolbars' ] as $p ) {
					$items[] = new OOUI\TabOptionWidget( [
						'label' => $p,
						'disabled' => true,
					] );
				}
				// Add items after constructor, so disabled state is not reset
				echo ( new OOUI\TabSelectWidget( [
					'classes' => [ 'demo-pageSelect' ],
					'framed' => false,
				] ) )->addItems( $items );
			?>
		</div>
		<?php
			// $page is validated above
			require_once "pages/$page.php";
		?>
	</div>

	<!-- Demonstrate JavaScript "infusion" of PHP widgets -->
	<script src="node_modules/jquery/dist/jquery.js"></script>
	<script src="node_modules/oojs/dist/oojs.jquery.js"></script>
	<script src="dist/oojs-ui-core.js"></script>
	<script src="dist/oojs-ui-widgets.js"></script>
	<script src="dist/oojs-ui-<?php echo $theme; ?>.js"></script>
	<script>window.Demo = {};</script>
	<script src="classes/ButtonStyleShowcaseWidget.js"></script>
	<script src="classes/LinkedFieldsetLayout.js"></script>
	<script src="infusion.js"></script>
</body>
</html>
