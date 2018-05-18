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

QUnit.test( 'static.infuse (infusing already infused nodes)', function ( assert ) {
	var a, b, $node, fixture = this.fixture;

	function reset() {
		// ( new OOUI\FieldLayout( new OOUI\ButtonWidget( [ 'id' => 'button' ] ), [ 'id' => 'field' ] ) )->setInfusable( true )
		var html = '<div id=\'field\' class=\'oo-ui-layout oo-ui-fieldLayout oo-ui-fieldLayout-align-left\' data-ooui=\'{"_":"OO.ui.FieldLayout","fieldWidget":{"tag":"button"},"align":"left","errors":[],"notices":[],"$overlay":true}\'><div class=\'oo-ui-fieldLayout-body\'><span class=\'oo-ui-fieldLayout-header\'><label class=\'oo-ui-labelElement-label\'></label></span><span class=\'oo-ui-fieldLayout-field\'><span id=\'button\' aria-disabled=\'false\' class=\'oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-framed oo-ui-buttonWidget\' data-ooui=\'{"_":"OO.ui.ButtonWidget"}\'><a role=\'button\' tabindex=\'0\' aria-disabled=\'false\' rel=\'nofollow\' class=\'oo-ui-buttonElement-button\'><span class=\'oo-ui-iconElement-icon\'></span><span class=\'oo-ui-labelElement-label\'></span><span class=\'oo-ui-indicatorElement-indicator\'></span></a></span></span></div></div>';
		$( fixture ).empty().append( html );
	}

	// Infuse a widget, then the same widget (by id)
	reset();
	a = OO.ui.infuse( 'button' );
	b = OO.ui.infuse( 'button' );
	assert.ok( a instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.ok( b instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.strictEqual( a, b, 'Both infuse() calls returned the same widget instance' );

	// Infuse a widget, then the same widget (by node)
	reset();
	$node = $( '#button' );
	a = OO.ui.infuse( 'button' );
	b = OO.ui.infuse( $node );
	assert.ok( a instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.ok( b instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.strictEqual( a, b, 'Both infuse() calls returned the same widget instance' );

	// Infuse a field, then its widget (by id)
	reset();
	a = OO.ui.infuse( 'field' );
	b = OO.ui.infuse( 'button' );
	assert.ok( a instanceof OO.ui.FieldLayout, 'infuse() returned a FieldLayout' );
	assert.ok( b instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.strictEqual( a.fieldWidget, b, 'Both infuse() calls returned the same widget instance' );

	// Infuse a field, then its widget (by node)
	reset();
	$node = $( '#button' );
	a = OO.ui.infuse( 'field' );
	b = OO.ui.infuse( $node );
	assert.ok( a instanceof OO.ui.FieldLayout, 'infuse() returned a FieldLayout' );
	assert.ok( b instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.strictEqual( a.fieldWidget, b, 'Both infuse() calls returned the same widget instance' );

	// Infuse a widget, then its field (by id)
	reset();
	a = OO.ui.infuse( 'button' );
	b = OO.ui.infuse( 'field' );
	assert.ok( a instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.ok( b instanceof OO.ui.FieldLayout, 'infuse() returned a FieldLayout' );
	assert.strictEqual( b.fieldWidget, a, 'Both infuse() calls returned the same widget instance' );

	// Infuse a widget, then its field (by node)
	reset();
	$node = $( '#field' );
	a = OO.ui.infuse( 'button' );
	b = OO.ui.infuse( $node );
	assert.ok( a instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.ok( b instanceof OO.ui.FieldLayout, 'infuse() returned a FieldLayout' );
	assert.strictEqual( b.fieldWidget, a, 'Both infuse() calls returned the same widget instance' );

	// Infuse a widget with extra config
	reset();
	a = OO.ui.infuse( $( '#button' ), { flags: [ 'extra' ] } );
	assert.deepEqual( a.getFlags(), [ 'extra' ], 'infuse with extra config' );
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
