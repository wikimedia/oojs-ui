QUnit.module( 'JSPHP' );

( function () {
	// Generate some tests based on the test suite data and HTML from PHP version.
	var theme, klassName,
		themes = {
			ApexTheme: new OO.ui.ApexTheme(),
			MediaWikiTheme: new OO.ui.MediaWikiTheme()
		};

	function makeTest( theme, klassName, tests ) {
		QUnit.test( theme + ': ' + klassName, tests.length, function ( assert ) {
			var test, instance, id, fromPhp, i, testName;
			OO.ui.theme = themes[ theme ];
			for ( i = 0; i < tests.length; i++ ) {
				test = tests[ i ];

				instance = new OO.ui[ test.class ]( test.config );

				id = 'JSPHPTestSuite_' + theme + klassName + i;
				fromPhp = document.getElementById( id ).firstChild;
				instance.$element.insertBefore( fromPhp );

				// Updating theme classes is normally debounced, we need to do it immediately
				instance.debouncedUpdateThemeClasses();

				testName = JSON.stringify( test.config );
				assert.equalDomElement( instance.$element[ 0 ], fromPhp, testName );
			}
		} );
	}

	for ( klassName in OO.ui.JSPHPTestSuite ) {
		for ( theme in themes ) {
			makeTest( theme, klassName, OO.ui.JSPHPTestSuite[ klassName ] );
		}
	}

} )();
