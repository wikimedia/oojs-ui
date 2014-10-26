QUnit.module( 'JSPHP' );

( function () {
	var suite, klassName;
	function expandClass( klass ) {
		return OO.ui[klass];
	}

	// Generate some tests based on the test suite data and HTML from PHP version.
	suite = OO.ui.JSPHPTestSuite;
	for ( klassName in suite ) {
		/*jshint loopfunc:true */
		( function ( klassName ) {
			QUnit.test( klassName, suite[klassName].length, function ( assert ) {
				var test, klass, instance, id, fromPhp, i, testName;
				for ( i = 0; i < suite[klassName].length; i++ ) {
					test = suite[klassName][i];
					klass = expandClass( test.class );
					// jscs:disable requireCapitalizedConstructors
					instance = new klass( test.config );

					id = 'JSPHPTestSuite_' + klassName + i;
					fromPhp = document.getElementById( id );
					fromPhp.removeAttribute( 'id' );
					instance.$element.insertBefore( fromPhp );

					// Updating theme classes is normally debounced, we need to do it immediately
					instance.debouncedUpdateThemeClasses();

					testName = JSON.stringify( test.config );
					assert.equalDomElement( instance.$element[0], fromPhp, testName );
				}
			} );
		} )( klassName );
	}
} )();
