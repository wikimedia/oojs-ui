QUnit.module( 'core' );

/**
 * @note: Keep tests in sync with phpunit/TagTest.php
 */
QUnit.test( 'isSafeUrl', 13, function ( assert ) {
	/*jshint scripturl:true*/
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

QUnit.asyncTest( 'debounce', 4, function ( assert ) {
	var
		realSetTimeout = window.setTimeout,
		ourSetTimeout = function () {
			setTimeoutCalled++;
			return realSetTimeout.apply( window, arguments );
		},
		funCalled,
		setTimeoutCalled,
		fun = function () {
			funCalled++;
		},
		cases = [
			function () {
				var fun50 = OO.ui.debounce( fun, 50 );
				funCalled = 0;
				setTimeoutCalled = 0;
				window.setTimeout = ourSetTimeout;
				fun50();
				fun50();
				window.setTimeout = realSetTimeout;
				setTimeout( function () {
					assert.strictEqual( setTimeoutCalled, 2, 'wait=50: setTimeout was called twice' );
					assert.strictEqual( funCalled, 1, 'wait=50: debounced function was executed once' );
					maybeFinishTest();
				}, 100 );
			},
			function () {
				var fun0 = OO.ui.debounce( fun );
				funCalled = 0;
				setTimeoutCalled = 0;
				window.setTimeout = ourSetTimeout;
				fun0();
				fun0();
				window.setTimeout = realSetTimeout;
				setTimeout( function () {
					assert.strictEqual( setTimeoutCalled, 1, 'wait=0: setTimeout was called once' );
					assert.strictEqual( funCalled, 1, 'wait=0: debounced function was executed once' );
					maybeFinishTest();
				}, 100 );
			}
		],
		casesDone = 0,
		maybeFinishTest = function () {
			if ( casesDone === 2 ) {
				QUnit.start();
			} else {
				cases[ casesDone ]();
				casesDone++;
			}
		};

	maybeFinishTest();
} );
