( function () {
	// Generate some tests based on the test suite data and HTML from PHP version.
	var theme, klassName, test;

	/* global testSuiteConfigs, testSuitePHPOutput */
	for ( theme in testSuitePHPOutput ) {
		for ( klassName in testSuitePHPOutput[ theme ] ) {
			for ( test in testSuitePHPOutput[ theme ][ klassName ] ) {
				testSuitePHPOutput[ theme ][ klassName ][ test ] =
					$.parseHTML( testSuitePHPOutput[ theme ][ klassName ][ test ] );
			}
		}
	}

	window.makeJSPHPTests(
		testSuiteConfigs,
		testSuitePHPOutput
	);

}() );
