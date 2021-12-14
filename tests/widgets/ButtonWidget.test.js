( function () {
	QUnit.module( 'ButtonWidget' );

	QUnit.test( 'test NoFollow in constructor', function ( assert ) {
		var widget = new OO.ui.ButtonWidget( {
			noFollow: true
		} );

		assert.strictEqual(
			widget.getNoFollow(),
			true,
			'NoFollow is true when rel has not been explicitly set'
		);

		assert.deepEqual(
			widget.getRel(),
			[ 'nofollow' ],
			'rel contains nofollow'
		);
	} );

	QUnit.test( 'test rel in constructor', function ( assert ) {
		var widget = new OO.ui.ButtonWidget( {
			noFollow: true,
			rel: []
		} );

		assert.strictEqual(
			widget.getNoFollow(),
			false,
			'noFollow is false when rel has been explicitly set'
		);

		assert.deepEqual(
			widget.getRel(),
			[],
			'rel does not contain nofollow'
		);
	} );

	QUnit.test( 'rel overrides noFollow', function ( assert ) {
		var widget = new OO.ui.ButtonWidget( {
			noFollow: false,
			rel: [ 'nofollow' ]
		} );

		assert.strictEqual(
			widget.getNoFollow(),
			true,
			'noFollow is true when rel contains nofollow'
		);

		assert.deepEqual(
			widget.getRel(),
			[ 'nofollow' ],
			'rel contains nofollow'
		);
	} );

	QUnit.test( 'setNoFollow keeps other rel elements when setting nofollow', function ( assert ) {
		var widget = new OO.ui.ButtonWidget( {
			noFollow: false,
			rel: [ 'noreferrer' ]
		} );

		assert.deepEqual(
			widget.getRel(),
			[ 'noreferrer' ],
			'rel contains noreferrer only'
		);

		widget.setNoFollow( true );

		assert.deepEqual(
			widget.getRel(),
			[ 'noreferrer', 'nofollow' ],
			'rel contains nofollow and noreferrer'
		);
	} );

	QUnit.test( 'setNoFollow keeps other rel elements when removing nofollow', function ( assert ) {
		var widget = new OO.ui.ButtonWidget( {
			rel: [ 'noreferrer', 'nofollow' ]
		} );

		widget.setNoFollow( false );

		assert.deepEqual(
			widget.getRel(),
			[ 'noreferrer' ],
			'rel contains only noreferrer'
		);
	} );

	QUnit.test( 'setRel when called with the same object reference', function ( assert ) {
		var rel = [],
			widget = new OO.ui.ButtonWidget( { rel: rel } );

		rel.push( 'nofollow' );
		widget.setRel( rel );

		assert.true( widget.getNoFollow(), 'nofollow state got updated' );
		assert.strictEqual( widget.$button.attr( 'rel' ), 'nofollow', 'rel attribute got updated' );
	} );
}() );
