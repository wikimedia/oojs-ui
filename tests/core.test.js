QUnit.module( 'core' );

/**
 * @note: Keep tests in sync with phpunit/TagTest.php
 */
QUnit.test( 'isSafeUrl', 13, function ( assert ) {
	/* jshint scripturl:true */
	assert.notOk( OO.ui.isSafeUrl( 'javascript:evil();' ) );
	assert.notOk( OO.ui.isSafeUrl( 'foo:bar' ) );
	assert.notOk( OO.ui.isSafeUrl( 'relative.html' ) );
	assert.ok( OO.ui.isSafeUrl( '' ) );
	assert.ok( OO.ui.isSafeUrl( 'http://example.com/' ) );
	assert.ok( OO.ui.isSafeUrl( '//example.com/' ) );
	assert.ok( OO.ui.isSafeUrl( '/' ) );
	assert.notOk( OO.ui.isSafeUrl( '..' ) );
	assert.ok( OO.ui.isSafeUrl( '?foo=bar' ) );
	assert.ok( OO.ui.isSafeUrl( '#top' ) );
	assert.ok( OO.ui.isSafeUrl( '/relative' ) );
	assert.ok( OO.ui.isSafeUrl( './relative' ) );
	assert.ok( OO.ui.isSafeUrl( '/wiki/Extra:Colon' ) );
} );

QUnit.test( 'isFocusableElement', 10, function ( assert ) {
	var i, $html, result,
		cases = [
			{
				msg: 'Plain DIV',
				html: '<div>foo</div>',
				expected: false
			},
			{
				msg: 'Tabindexed span',
				html: '<span tabindex="3">foo</span>',
				expected: true
			},
			{
				msg: 'Hidden element',
				html: '<div tabindex="3" style="display:none;">foo</div>',
				expected: false
			},
			{
				msg: 'Invalid tabindex',
				html: '<div tabindex="wat">foo</div>',
				expected: false
			},
			{
				msg: 'Empty tabindex',
				html: '<div tabindex="">foo</div>',
				expected: false
			},
			{
				msg: 'Text input',
				html: '<input type="text">',
				expected: true
			},
			{
				msg: 'Disabled text input',
				html: '<input type="text" disabled="disabled">',
				expected: false
			},
			{
				msg: 'Link',
				html: '<a href="Foo">Bar</a>',
				expected: true
			},
			{
				msg: 'Link with empty href',
				html: '<a href="">Bar</a>',
				expected: true
			},
			{
				msg: 'Link without href',
				html: '<a>Bar</a>',
				expected: false
			},
			{
				msg: 'Link without href but with tabindex',
				html: '<a tabindex="0">Bar</a>',
				expected: true
			},
			{
				msg: 'Link with negative tabindex',
				html: '<a href="foo" tabindex="-1">Bar</a>',
				expected: true
			}
		];

	QUnit.expect( cases.length );
	for ( i = 0; i < cases.length; i++ ) {
		$html = $( cases[ i ].html ).appendTo( 'body' );
		result = OO.ui.isFocusableElement( cases[ i ].selector ? $html.find( cases[ i ].selector ) : $html );
		assert.strictEqual( result, cases[ i ].expected, cases[ i ].msg );
		$html.remove();
	}
} );

QUnit.test( 'debounce', 4, function ( assert ) {
	var f,
		log = [],
		testTimer = new OO.ui.TestTimer(),
		setTimeoutReal = window.setTimeout,
		clearTimeoutReal = window.clearTimeout;
	window.setTimeout = testTimer.setTimeout.bind( testTimer );
	window.clearTimeout = testTimer.clearTimeout.bind( testTimer );
	try {
		f = OO.ui.debounce( log.push.bind( log ), 50 );
		f( 1 );
		testTimer.runPending( 20 );
		log.push( 'a' );
		f( 2 );
		testTimer.runPending( 20 );
		log.push( 'b' );
		f( 3 );
		testTimer.runPending( 20 );
		log.push( 'c' );
		f( 4 );
		testTimer.runPending( 20 );
		log.push( 'd' );
		testTimer.runPending( 20 );
		log.push( 'e' );
		testTimer.runPending( 20 );
		log.push( 'f' );
		testTimer.runPending( 20 );
		assert.deepEqual( log, [ 'a', 'b', 'c', 'd', 'e', 4, 'f' ], 'debounce 50 ms' );

		log = [];
		f = OO.ui.debounce( log.push.bind( log ), 50, true );
		f( 1 );
		testTimer.runPending( 20 );
		log.push( 'a' );
		f( 2 );
		testTimer.runPending( 20 );
		log.push( 'b' );
		f( 3 );
		testTimer.runPending( 20 );
		log.push( 'c' );
		f( 4 );
		testTimer.runPending( 20 );
		log.push( 'd' );
		testTimer.runPending( 20 );
		log.push( 'e' );
		testTimer.runPending( 20 );
		log.push( 'f' );
		testTimer.runPending( 20 );
		assert.deepEqual( log, [ 1, 'a', 'b', 'c', 'd', 'e', 'f' ], 'debounce 50 ms immediate' );

		log = [];
		f = OO.ui.debounce( log.push.bind( log ), 0 );
		f( 1 );
		log.push( 'a' );
		f( 2 );
		log.push( 'b' );
		testTimer.runPending();
		f( 3 );
		log.push( 'c' );
		testTimer.runPending();
		log.push( 'd' );
		assert.deepEqual( log, [ 'a', 'b', 1, 'c', 3, 'd' ], 'debounce 0 ms' );
		testTimer.runPending();

		log = [];
		f = OO.ui.debounce( log.push.bind( log ), 0, true );
		f( 1 );
		log.push( 'a' );
		f( 2 );
		log.push( 'b' );
		testTimer.runPending();
		f( 3 );
		log.push( 'c' );
		testTimer.runPending();
		log.push( 'd' );
		assert.deepEqual( log, [ 1, 'a', 'b', 3, 'c', 'd' ], 'debounce 0 ms immediate' );
		testTimer.runPending();

	} finally {
		window.setTimeout = setTimeoutReal;
		window.clearTimeout = clearTimeoutReal;
	}
} );

QUnit.test( 'throttle', 2, function ( assert ) {
	var f,
		log = [],
		testTimer = new OO.ui.TestTimer(),
		setTimeoutReal = window.setTimeout,
		clearTimeoutReal = window.clearTimeout;
	window.setTimeout = testTimer.setTimeout.bind( testTimer );
	window.clearTimeout = testTimer.clearTimeout.bind( testTimer );
	try {
		f = OO.ui.throttle( log.push.bind( log ), 50 );
		f( 1 ); // runs
		testTimer.runPending( 20 );
		log.push( 'a' );
		f( 2 ); // throttled
		testTimer.runPending( 30 );
		log.push( 'b' );
		f( 3 ); // throttled
		log.push( 'c' );
		testTimer.runPending( 30 ); // call happens
		log.push( 'd' );
		f( 4 ); // throttled
		testTimer.runPending( 20 );
		log.push( 'e' );
		testTimer.runPending( 20 );
		log.push( 'f' );
		testTimer.runPending( 20 ); // call happens
		log.push( 'g' );
		testTimer.runPending( 20 );
		assert.deepEqual( log, [ 1, 'a', 'b', 'c', 3, 'd', 'e', 'f', 4, 'g' ], 'throttle 50 ms' );

		log = [];
		f = OO.ui.throttle( log.push.bind( log ), 0 );
		f( 1 );
		log.push( 'a' );
		f( 2 );
		log.push( 'b' );
		testTimer.runPending();
		f( 3 );
		log.push( 'c' );
		testTimer.runPending();
		log.push( 'd' );
		assert.deepEqual( log, [ 1, 'a', 2, 'b', 3, 'c', 'd' ], 'throttle 0 ms' );
		testTimer.runPending();

	} finally {
		window.setTimeout = setTimeoutReal;
		window.clearTimeout = clearTimeoutReal;
	}
} );
