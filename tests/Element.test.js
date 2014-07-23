QUnit.module( 'Element' );

QUnit.test( 'getDocument', 10, function ( assert ) {
	var frameDoc, frameEl, frameDiv,
		$el = $( '#qunit-fixture' ),
		$div = $( '<div>' ),
		el = document.getElementById( 'qunit-fixture' ),
		div = document.createElement( 'div' ),
		win = window,
		doc = document,
		frame = doc.createElement( 'iframe' );

	el.appendChild( frame );
	frameDoc = ( frame.contentWindow && frame.contentWindow.document ) || frame.contentDocument;
	frameEl = frameDoc.createElement( 'span' );
	frameDoc.documentElement.appendChild( frameEl );
	frameDiv = frameDoc.createElement( 'div' );

	assert.strictEqual( OO.ui.Element.getDocument( $el ), doc, 'jQuery' );
	assert.strictEqual( OO.ui.Element.getDocument( $div ), doc, 'jQuery (detached)' );
	assert.strictEqual( OO.ui.Element.getDocument( el ), doc, 'HTMLElement' );
	assert.strictEqual( OO.ui.Element.getDocument( div ), doc, 'HTMLElement (detached)' );
	assert.strictEqual( OO.ui.Element.getDocument( win ), doc, 'Window' );
	assert.strictEqual( OO.ui.Element.getDocument( doc ), doc, 'HTMLDocument' );

	assert.strictEqual( OO.ui.Element.getDocument( frameEl ), frameDoc, 'HTMLElement (framed)' );
	assert.strictEqual( OO.ui.Element.getDocument( frameDiv ), frameDoc, 'HTMLElement (framed, detached)' );
	assert.strictEqual( OO.ui.Element.getDocument( frameDoc ), frameDoc, 'HTMLDocument (framed)' );

	assert.strictEqual( OO.ui.Element.getDocument( {} ), null, 'Invalid' );
} );

QUnit.test( 'onDOMEvent( "onfocusin" )', 1, function ( assert ) {
	var frameDoc, frameEl,
		log = [],
		frame = document.createElement( 'iframe' );

	function handleParentBodyFocus() {
		log.push('parent-body');
	}
	function handleIframeDocFocus() {
		log.push('iframe-doc');
	}
	function handleIframeInputFocus() {
		log.push('iframe-input');
	}

	$( '#qunit-fixture' ).append( frame );
	frameDoc = ( frame.contentWindow && frame.contentWindow.document ) || frame.contentDocument;
	frameEl = frameDoc.createElement( 'input' );
	frameDoc.documentElement.appendChild( frameEl );

	$( 'body' ).on( 'focusin', handleParentBodyFocus );
	$( frameDoc )
		.on( 'focusin', handleIframeDocFocus );

	$( frameEl ).on( 'focusin', handleIframeInputFocus );
	frameEl.focus();
	$( frameEl ).remove();
	frameEl.focus();

	$( 'body' ).off( 'focusin', handleParentBodyFocus );
	$( frameDoc ).off( 'focusin', handleIframeDocFocus );

	assert.deepEqual( log, [ 'iframe-input', 'iframe-doc' ] );
} );
