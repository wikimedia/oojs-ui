( function () {
	// Generate some tests based on the test suite data and HTML from PHP version.
	var theme, klassName, i, outputs = {};

	for ( theme in { ApexTheme: 1, WikimediaUITheme: 1 } ) {
		outputs[ theme ] = {};
		for ( klassName in OO.ui.JSPHPTestSuite ) {
			outputs[ theme ][ klassName ] = [];
			for ( i in OO.ui.JSPHPTestSuite[ klassName ].tests ) {
				outputs[ theme ][ klassName ][ i ] =
					document.getElementById( 'JSPHPTestSuite_' + theme + klassName + i ).childNodes;
			}
		}
	}

	window.makeJSPHPTests(
		OO.ui.JSPHPTestSuite,
		outputs
	);

}() );
