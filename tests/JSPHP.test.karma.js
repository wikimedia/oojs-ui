QUnit.module( 'JSPHP' );

( function () {
	// Generate some tests based on the test suite data and HTML from PHP version.
	var theme, klassName,
		themes = {
			ApexTheme: new OO.ui.ApexTheme(),
			WikimediaUITheme: new OO.ui.WikimediaUITheme()
		};

	function unstub( value ) {
		var config;
		if ( typeof value === 'string' && value.substr( 0, 13 ) === '_placeholder_' ) {
			value = JSON.parse( value.substr( 13 ) );
			config = OO.copy( value.config, null, unstub );
			return new OO.ui[ value.class ]( config );
		}
	}

	function makeTest( theme, klassName, infuseOnly, tests, output ) {
		// eslint-disable-next-line qunit/require-expect
		QUnit.test( theme + ': ' + klassName, function ( assert ) {
			var test, config, instance, infused, $fromPhp, i, testName;

			assert.expect( tests.length * ( infuseOnly ? 1 : 2 ) );

			OO.ui.theme = themes[ theme ];
			for ( i = 0; i < tests.length; i++ ) {
				test = tests[ i ];
				// Unstub placeholders
				config = OO.copy( test.config, null, unstub );

				instance = new OO.ui[ test.class ]( config );
				$fromPhp = $( $.parseHTML( output[ i ] ) );

				$( 'body' ).append( instance.$element, $fromPhp );

				testName = JSON.stringify( test.config );
				if ( !infuseOnly ) {
					assert.equalDomElement( instance.$element[ 0 ], $fromPhp[ 0 ], testName );
				}

				infused = OO.ui.infuse( $fromPhp[ 0 ] );

				assert.equalDomElement( instance.$element[ 0 ], infused.$element[ 0 ], testName + ' (infuse)' );
				instance.$element.add( infused.$element ).detach();
			}
		} );
	}

	// Updating theme classes is normally debounced, but we need to do it immediately
	// if we want the tests to be synchronous
	OO.ui.Theme.prototype.queueUpdateElementClasses = OO.ui.Theme.prototype.updateElementClasses;

	// Various things end up in the default overlay when infusing, but that's annoying
	// because we need to compare them, so let's prevent that
	OO.ui.getDefaultOverlay = function () {
		return null;
	};

	/* global testSuiteConfigs, testSuitePHPOutput */
	for ( klassName in testSuiteConfigs ) {
		for ( theme in themes ) {
			makeTest(
				theme,
				klassName,
				testSuiteConfigs[ klassName ].infuseonly,
				testSuiteConfigs[ klassName ].tests,
				testSuitePHPOutput[ theme ][ klassName ]
			);
		}
	}

}() );
