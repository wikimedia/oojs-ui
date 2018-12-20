( function () {

	function unstub( value ) {
		var config;
		if ( typeof value === 'string' && value.substr( 0, 13 ) === '_placeholder_' ) {
			value = JSON.parse( value.substr( 13 ) );
			config = OO.copy( value.config, null, unstub );
			return new OO.ui[ value.class ]( config );
		}
	}

	function makeJSPHPTest( className, test, infuseOnly, testSuitePHPOutput, i ) {
		var themes = {
			ApexTheme: new OO.ui.ApexTheme(),
			WikimediaUITheme: new OO.ui.WikimediaUITheme()
		};

		// eslint-disable-next-line qunit/require-expect, no-loop-func
		QUnit.test( JSON.stringify( test.config ), function ( assert ) {
			var config, instance, infused, $fromPhp, theme;

			// Unstub placeholders
			config = OO.copy( test.config, null, unstub );

			for ( theme in themes ) {
				OO.ui.theme = themes[ theme ];

				instance = new OO.ui[ test.class ]( config );
				$fromPhp = $( testSuitePHPOutput[ theme ][ className ][ i ] );

				$( '#qunit-fixture' ).append( instance.$element, $fromPhp );

				if ( !infuseOnly ) {
					assert.equalDomElement( instance.$element[ 0 ], $fromPhp[ 0 ], theme );
				}

				infused = OO.ui.infuse( $fromPhp[ 0 ] );

				assert.equalDomElement( instance.$element[ 0 ], infused.$element[ 0 ], theme + ' (infuse)' );
			}

			if ( i % 20 === 0 ) {
				// Make this test async to allow the browser to respond. Running code in a single thread
				// for several seconds/minutes causes Karma timeouts when the browser becomes uninteractive.
				// This slows down the tests though, so only do it every 20 tests (arbitrarily chosen).
				assert.async()();
			}
		} );
	}

	window.makeJSPHPTests = function ( testSuiteConfigs, testSuitePHPOutput ) {
		var className, i, tests, infuseOnly;

		for ( className in testSuiteConfigs ) {
			QUnit.module( 'JSPHP: ' + className );

			tests = testSuiteConfigs[ className ].tests;
			infuseOnly = testSuiteConfigs[ className ].infuseonly;

			for ( i = 0; i < tests.length; i++ ) {
				makeJSPHPTest( className, tests[ i ], infuseOnly, testSuitePHPOutput, i );
			}
		}
	};

}() );
