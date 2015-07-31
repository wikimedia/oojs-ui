QUnit.module( 'core' );

/**
 * @note: Keep URL protocol whitelist tests in sync with phpunit/TagTest.php
 */
QUnit.test( 'isSafeUrl', 10, function ( assert ) {
	/*jshint scripturl:true*/
	assert.notOk( OO.ui.isSafeUrl( 'javascript:evil()' ) );
	assert.ok( OO.ui.isSafeUrl( 'relative.html' ) );
	assert.ok( OO.ui.isSafeUrl( 'http://example.com' ) );
	assert.ok( OO.ui.isSafeUrl( '//example.com' ) );
	assert.ok( OO.ui.isSafeUrl( '/' ) );
	assert.ok( OO.ui.isSafeUrl( '..' ) );
	assert.ok( OO.ui.isSafeUrl( '?foo=bar' ) );
	assert.ok( OO.ui.isSafeUrl( '#top' ) );
	assert.ok( OO.ui.isSafeUrl( '/relative' ) );
	assert.ok( OO.ui.isSafeUrl( '/wiki/Extra:Colon' ) );
} );
