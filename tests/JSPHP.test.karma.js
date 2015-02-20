QUnit.module( 'JSPHP' );

( function () {
	// Generate some tests based on the test suite data and HTML from PHP version.
	var theme, klassName,
		themes = {
			ApexTheme: new OO.ui.ApexTheme(),
			MediaWikiTheme: new OO.ui.MediaWikiTheme()
		};

	function makeTest( theme, klassName, tests, output ) {
		QUnit.test( theme + ': ' + klassName, tests.length, function ( assert ) {
			var test, instance, $fromPhp, i, testName;
			OO.ui.theme = themes[ theme ];
			for ( i = 0; i < tests.length; i++ ) {
				test = tests[ i ];

				instance = new OO.ui[ test.class ]( test.config );
				$fromPhp = $( $.parseHTML( output[ i ] ) );

				$( '#qunit-fixture' ).append( instance.$element, $fromPhp );

				// Updating theme classes is normally debounced, we need to do it immediately
				instance.debouncedUpdateThemeClasses();

				testName = JSON.stringify( test.config );
				assert.equalDomElement( instance.$element[ 0 ], $fromPhp[ 0 ], testName, true );
			}
		} );
	}

	/*global testSuiteConfigs, testSuitePHPOutput */
	for ( klassName in testSuiteConfigs ) {
		for ( theme in themes ) {
			makeTest(
				theme,
				klassName,
				testSuiteConfigs[ klassName ],
				testSuitePHPOutput[ theme ][ klassName ]
			);
		}
	}

} )();
