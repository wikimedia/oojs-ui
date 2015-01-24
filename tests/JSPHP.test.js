QUnit.module( 'JSPHP' );

( function () {
	// Generate some tests based on the test suite data and HTML from PHP version.

	function expandClass( klass ) {
		return OO.ui[ klass ];
	}

	function makeTest( klassName, suite ) {
		QUnit.test( klassName, suite[ klassName ].length, function ( assert ) {
			var test, klass, instance, id, fromPhp, i, testName;
			for ( i = 0; i < suite[ klassName ].length; i++ ) {
				test = suite[ klassName ][ i ];
				klass = expandClass( test.class );
				// jscs:disable requireCapitalizedConstructors
				instance = new klass( test.config );

				id = 'JSPHPTestSuite_' + klassName + i;
				fromPhp = document.getElementById( id ).firstChild;
				instance.$element.insertBefore( fromPhp );

				// Updating theme classes is normally debounced, we need to do it immediately
				instance.debouncedUpdateThemeClasses();

				testName = JSON.stringify( test.config );
				assert.equalDomElement( instance.$element[ 0 ], fromPhp, testName );
			}
		} );
	}

	for ( var klassName in OO.ui.JSPHPTestSuite ) {
		makeTest( klassName, OO.ui.JSPHPTestSuite );
	}
} )();
