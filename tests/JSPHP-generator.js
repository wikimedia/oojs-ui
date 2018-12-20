( function () {
	function unstub( value ) {
		var config;
		if ( typeof value === 'string' && value.substr( 0, 13 ) === '_placeholder_' ) {
			value = JSON.parse( value.substr( 13 ) );
			config = OO.copy( value.config, null, unstub );
			return new OO.ui[ value.class ]( config );
		}
	}

	window.makeJSPHPTests = function ( testSuiteConfigs, testSuitePHPOutput ) {
		var className, theme, tests, infuseOnly,
			themes = {
				ApexTheme: new OO.ui.ApexTheme(),
				WikimediaUITheme: new OO.ui.WikimediaUITheme()
			};

		for ( className in testSuiteConfigs ) {
			tests = testSuiteConfigs[ className ].tests;
			infuseOnly = testSuiteConfigs[ className ].infuseonly;

			for ( theme in themes ) {
				// eslint-disable-next-line qunit/require-expect, no-loop-func
				QUnit.test( theme + ': ' + className, function ( className, theme, tests, infuseOnly, assert ) {
					var test, config, instance, infused, $fromPhp, i, testName;

					assert.expect( tests.length * ( infuseOnly ? 1 : 2 ) );

					OO.ui.theme = themes[ theme ];
					for ( i = 0; i < tests.length; i++ ) {
						test = tests[ i ];
						// Unstub placeholders
						config = OO.copy( test.config, null, unstub );

						instance = new OO.ui[ test.class ]( config );
						$fromPhp = $( testSuitePHPOutput[ theme ][ className ][ i ] );

						$( '#qunit-fixture' ).append( instance.$element, $fromPhp );

						testName = JSON.stringify( test.config );
						if ( !infuseOnly ) {
							assert.equalDomElement( instance.$element[ 0 ], $fromPhp[ 0 ], testName );
						}

						infused = OO.ui.infuse( $fromPhp[ 0 ] );

						assert.equalDomElement( instance.$element[ 0 ], infused.$element[ 0 ], testName + ' (infuse)' );
					}
				}.bind( this, className, theme, tests, infuseOnly ) );
			}
		}
	};

}() );
