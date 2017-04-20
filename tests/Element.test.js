QUnit.module( 'Element', {
	setup: function () {
		this.fixture = document.createElement( 'div' );
		document.body.appendChild( this.fixture );

		this.makeFrame = function () {
			var frame = document.createElement( 'iframe' );
			this.fixture.appendChild( frame );
			return ( frame.contentWindow && frame.contentWindow.document ) || frame.contentDocument;
		};
	},
	teardown: function () {
		this.fixture.parentNode.removeChild( this.fixture );
		this.fixture = null;
	}
} );

QUnit.test( 'static.infuse', function ( assert ) {
	function infuse( data ) {
		return OO.ui.Element.static.infuse(
			$( '<div>' ).attr( 'data-ooui', JSON.stringify( data ) )
		);
	}
	assert.ok( infuse( { _: 'OO.ui.TextInputWidget' } ) );
	assert.throws( function () {
		infuse( { _: 'Array' } );
	}, Error );
} );

QUnit.test( 'static.getDocument', function ( assert ) {
	var frameDoc, frameEl, frameDiv,
		el = this.fixture,
		div = document.createElement( 'div' ),
		$el = $( this.fixture ),
		$div = $( '<div>' ),
		win = window,
		doc = document;

	frameDoc = this.makeFrame();
	frameEl = frameDoc.createElement( 'span' );
	frameDoc.documentElement.appendChild( frameEl );
	frameDiv = frameDoc.createElement( 'div' );

	assert.strictEqual( OO.ui.Element.static.getDocument( $el ), doc, 'jQuery' );
	assert.strictEqual( OO.ui.Element.static.getDocument( $div ), doc, 'jQuery (detached)' );
	assert.strictEqual( OO.ui.Element.static.getDocument( el ), doc, 'HTMLElement' );
	assert.strictEqual( OO.ui.Element.static.getDocument( div ), doc, 'HTMLElement (detached)' );
	assert.strictEqual( OO.ui.Element.static.getDocument( win ), doc, 'Window' );
	assert.strictEqual( OO.ui.Element.static.getDocument( doc ), doc, 'HTMLDocument' );

	assert.strictEqual( OO.ui.Element.static.getDocument( frameEl ), frameDoc, 'HTMLElement (framed)' );
	assert.strictEqual( OO.ui.Element.static.getDocument( frameDiv ), frameDoc, 'HTMLElement (framed, detached)' );
	assert.strictEqual( OO.ui.Element.static.getDocument( frameDoc ), frameDoc, 'HTMLDocument (framed)' );

	assert.strictEqual( OO.ui.Element.static.getDocument( {} ), null, 'Invalid' );
} );

QUnit.test( 'getElementDocument', function ( assert ) {
	var el, doc;

	doc = document;
	el = new OO.ui.Element();
	assert.strictEqual( el.getElementDocument(), doc );
} );
