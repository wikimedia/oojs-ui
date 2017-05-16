<?php
	$autoload = '../vendor/autoload.php';
	if ( !file_exists( $autoload ) ) {
		echo '<h1>Did you forget to run <code>composer install</code>?</h1>';
		exit;
	}
	require_once $autoload;

	$testSuiteFile = 'JSPHP-suite.json';
	if ( !file_exists( $testSuiteFile ) ) {
		echo '<h1>Did you forget to run <code>grunt test</code>?</h1>';
		exit;
	}
	$testSuiteJSON = file_get_contents( $testSuiteFile );
	$testSuite = json_decode( $testSuiteJSON, true );
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
	<meta charset="UTF-8">
	<title>OOjs UI Test Suite</title>
	<link rel="stylesheet" href="../node_modules/qunitjs/qunit/qunit.css">
	<script src="../node_modules/qunitjs/qunit/qunit.js"></script>
	<script src="./QUnit.assert.equalDomElement.js"></script>
	<!-- Dependencies -->
	<script src="../node_modules/jquery/dist/jquery.js"></script>
	<script src="../node_modules/oojs/dist/oojs.jquery.js"></script>
	<!-- Source code -->
	<script src="../dist/oojs-ui-core.js"></script>
	<script src="../dist/oojs-ui-widgets.js"></script>
	<script src="../dist/oojs-ui-windows.js"></script>
	<script src="../dist/oojs-ui-toolbars.js"></script>
	<script src="../dist/oojs-ui-apex.js"></script>
	<script src="../dist/oojs-ui-wikimediaui.js"></script>
	<script src="./TestTimer.js"></script>
	<!-- Test suites -->
	<script src="./core.test.js"></script>
	<script src="./Element.test.js"></script>
	<script src="./Process.test.js"></script>
	<script src="./mixins/FlaggedElement.test.js"></script>
	<script src="./widgets/TagMultiselectWidget.test.js"></script>
	<script src="./widgets/MenuTagMultiselectWidget.test.js"></script>
	<script src="./widgets/NumberInputWidget.test.js"></script>
	<!-- JS/PHP comparison tests -->
	<script>OO.ui.JSPHPTestSuite = <?php echo $testSuiteJSON; ?></script>
	<script src="./JSPHP.test.standalone.js"></script>
</head>
<body>
	<div id="JSPHPTestSuite" style="display: none;">
		<?php
			// @codingStandardsIgnoreStart
			function new_OOUI( $class, $config = [] ) {
				// @codingStandardsIgnoreEnd
				$class = "OOUI\\" . $class;
				return new $class( $config );
			}
			// @codingStandardsIgnoreStart
			function unstub( &$value ) {
				// @codingStandardsIgnoreEnd
				if ( is_string( $value ) && substr( $value, 0, 13 ) === '_placeholder_' ) {
					$value = json_decode( substr( $value, 13 ), true );
					if ( isset( $value['config'] ) && is_array( $value['config'] ) ) {
						array_walk_recursive( $value['config'], 'unstub' );
					}
					$value = new_OOUI( $value['class'], $value['config'] );
				}
			}
			// Keep synchronized with bin/generate-JSPHP-for-karma.php
			$themes = [ 'ApexTheme', 'WikimediaUITheme' ];
			foreach ( $themes as $theme ) {
				OOUI\Theme::setSingleton( new_OOUI( $theme ) );
				foreach ( $testSuite as $className => $tests ) {
					foreach ( $tests['tests'] as $index => $test ) {
						// Unstub placeholders
						$config = $test['config'];
						array_walk_recursive( $config, 'unstub' );
						$config['infusable'] = true;
						$instance = new_OOUI( $test['class'], $config );
						$output = "$instance";
						// HACK: OO.ui.infuse() expects to find this element somewhere on the page
						if ( $instance instanceof OOUI\LabelWidget && isset( $config['input'] ) ) {
							$output .= $config['input'];
						}
						echo "<div id='JSPHPTestSuite_$theme$className$index'>$output</div>\n";
					}
				}
			}
		?>
	</div>
	<div id="qunit"></div>
	<div id="qunit-fixture"></div>
</body>
</html>
