QUnit.module( 'JSPHP' );

( function () {
	// Generate some tests based on the test suite data and HTML from PHP version.
	var theme, klassName,
		themes = {
			ApexTheme: new OO.ui.ApexTheme(),
			MediaWikiTheme: new OO.ui.MediaWikiTheme()
		};

	function unstub( value ) {
		var config;
		if ( typeof value === 'string' && value.substr( 0, 13 ) === '_placeholder_' ) {
			value = JSON.parse( value.substr( 13 ) );
			config = OO.copy( value.config, null, unstub );
			return new OO.ui[ value.class ]( config );
		}
	}

	function makeTest( theme, klassName, tests ) {
		QUnit.test( theme + ': ' + klassName, tests.length * 2, function ( assert ) {
			var test, config, instance, infused, id, fromPhp, i, testName;
			OO.ui.theme = themes[ theme ];
			for ( i = 0; i < tests.length; i++ ) {
				test = tests[ i ];
				// Unstub placeholders
				config = OO.copy( test.config, null, unstub );

				instance = new OO.ui[ test.class ]( config );

				id = 'JSPHPTestSuite_' + theme + klassName + i;
				fromPhp = document.getElementById( id ).firstChild;
				instance.$element.insertBefore( fromPhp );

				testName = JSON.stringify( test.config );
				assert.equalDomElement( instance.$element[ 0 ], fromPhp, testName );

				infused = OO.ui.infuse( fromPhp );

				assert.equalDomElement( instance.$element[ 0 ], infused.$element[ 0 ], testName + ' (infuse)' );
			}
		} );
	}

	// Updating theme classes is normally debounced, we need to do it immediately
	// if we want the tests to be synchronous
	OO.ui.Element.prototype.updateThemeClasses = OO.ui.Element.prototype.debouncedUpdateThemeClasses;

	for ( klassName in OO.ui.JSPHPTestSuite ) {
		for ( theme in themes ) {
			makeTest( theme, klassName, OO.ui.JSPHPTestSuite[ klassName ] );
		}
	}

}() );
