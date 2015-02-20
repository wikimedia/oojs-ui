<?php

// Quick and dirty autoloader to make it possible to run without Composer.
spl_autoload_register( function ( $class ) {
	$class = preg_replace( '/^OOUI\\\\/', '', $class );
	foreach ( array( 'elements', 'layouts', 'themes', 'widgets', '.' ) as $dir ) {
		$path = "../php/$dir/$class.php";
		if ( file_exists( $path ) ) {
			require_once $path;
			return;
		}
	}
} );

$testSuiteJSON = file_get_contents( 'JSPHP-suite.json' );
$testSuite = json_decode( $testSuiteJSON, true );
$testSuiteOutput = array();

// Keep synchronized with tests/index.php
$themes = array( 'ApexTheme', 'MediaWikiTheme' );
foreach ( $themes as $theme ) {
	$class = "OOUI\\" . $theme;
	OOUI\Theme::setSingleton( new $class() );
	foreach ( $testSuite as $className => $tests ) {
		foreach ( $tests as $test ) {
			$class = "OOUI\\" . $test['class'];
			$instance = new $class( $test['config'] );
			$testSuiteOutput[$theme][$className][] = "$instance";
		}
	}
}

$testSuiteOutputJSON = json_encode( $testSuiteOutput, JSON_PRETTY_PRINT );

echo "var testSuiteConfigs = $testSuiteJSON;\n\n";
echo "var testSuitePHPOutput = $testSuiteOutputJSON;\n\n";
echo file_get_contents( 'JSPHP.test.karma.js' );
