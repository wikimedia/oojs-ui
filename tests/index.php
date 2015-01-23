<?php
	$autoload = '../vendor/autoload.php';
	if ( !file_exists( $autoload ) ) {
		trigger_error(
			'<h1>Did you forget to run <code>composer install</code>?</h1>'
		);
		exit();
	}
	require_once $autoload;

	$testSuiteJSON = file_get_contents( 'JSPHP-suite.json' );
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
	<script>
		QUnit.config.requireExpects = true;
	</script>
	<!-- Dependencies -->
	<script src="../lib/jquery.js"></script>
	<script src="../lib/oojs.jquery.js"></script>
	<!-- Source code -->
	<script src="../dist/oojs-ui.js"></script>
	<script src="../dist/oojs-ui-mediawiki.js"></script>
	<!-- Test suites -->
	<script src="./Element.test.js"></script>
	<script src="./Process.test.js"></script>
	<script src="./elements/FlaggedElement.test.js"></script>
	<!-- JS/PHP comparison tests -->
	<script>OO.ui.JSPHPTestSuite = <?php echo $testSuiteJSON; ?></script>
	<script src="./JSPHP.test.js"></script>
</head>
<body>
	<div id="JSPHPTestSuite" style="display: none;">
		<?php
			function expandClass( $class ) {
				return "OOUI\\" . $class;
			}

			OOUI\Theme::setSingleton( new OOUI\MediaWikiTheme() );
			foreach ( $testSuite as $className => $tests ) {
				foreach ( $tests as $index => $test ) {
					$class = expandClass( $test['class'] );
					$instance = new $class( $test['config'] );
					echo "<div id='JSPHPTestSuite_$className$index'>$instance</div>\n";
				}
			}
		?>
	</div>
	<div id="qunit"></div>
	<div id="qunit-fixture"></div>
</body>
</html>
