QUnit.module( 'Element', {
	beforeEach: function () {
		this.fixture = document.createElement( 'div' );
		document.body.appendChild( this.fixture );

		this.makeFrame = function () {
			var frame = document.createElement( 'iframe' );
			this.fixture.appendChild( frame );
			return ( frame.contentWindow && frame.contentWindow.document ) || frame.contentDocument;
		};
	},
	afterEach: function () {
		this.fixture.parentNode.removeChild( this.fixture );
		this.fixture = null;
	}
} );

QUnit.test( 'static.infuse', function ( assert ) {
	var
		$textInputWidget = $( $.parseHTML( '<div aria-disabled=\'false\' id=\'ooui-php-1\' class=\'oo-ui-widget oo-ui-widget-enabled oo-ui-inputWidget oo-ui-textInputWidget oo-ui-textInputWidget-type-text oo-ui-textInputWidget-php\' data-ooui=\'{"_":"OO.ui.TextInputWidget"}\'><input type=\'text\' tabindex=\'0\' aria-disabled=\'false\' value=\'\' class=\'oo-ui-inputWidget-input\' /><span class=\'oo-ui-iconElement-icon\'></span><span class=\'oo-ui-indicatorElement-indicator\'></span></div>' ) ),
		$fakeWidget = $( $.parseHTML( '<div data-ooui=\'{"_":"Array"}\'></div>' ) );
	assert.ok( OO.ui.Element.static.infuse( $textInputWidget ) );
	assert.throws( function () {
		OO.ui.Element.static.infuse( $fakeWidget );
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
