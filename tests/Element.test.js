/* eslint-disable no-jquery/no-global-selector, no-jquery/no-parse-html-literal */
QUnit.module( 'Element', {
	beforeEach: function () {
		this.fixture = document.createElement( 'div' );
		document.body.appendChild( this.fixture );

		this.makeFrame = function ( src, onload ) {
			var frame = document.createElement( 'iframe' );
			frame.onload = onload;
			frame.src = src;
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
		$unknownTypeWidget = $( $.parseHTML( '<div data-ooui=\'{"_":"Array"}\'></div>' ) ),
		$nonExistentTypeWidget = $( $.parseHTML( '<div data-ooui=\'{"_":"FOO.bar.FakeWidget"}\'></div>' ) ),
		$invalidJsonWidget = $( $.parseHTML( '<div data-ooui=\'{{\'></div>' ) ),
		$emptyTypeWidget = $( $.parseHTML( '<div data-ooui=\'{}\'></div>' ) ),
		$nonWidget = $( $.parseHTML( '<div></div>' ) ),
		$emptyCollection = $(),
		$unmatchedSelector = $( '#there-is.no-spoon' ),
		$moreThanOneInCollection = $( '<div aria-disabled=\'false\' id=\'ooui-php-1\' class=\'oo-ui-widget oo-ui-widget-enabled oo-ui-inputWidget oo-ui-textInputWidget oo-ui-textInputWidget-type-text oo-ui-textInputWidget-php\' data-ooui=\'{"_":"OO.ui.TextInputWidget"}\'><input type=\'text\' tabindex=\'0\' aria-disabled=\'false\' value=\'\' class=\'oo-ui-inputWidget-input\' /><span class=\'oo-ui-iconElement-icon\'></span><span class=\'oo-ui-indicatorElement-indicator\'></span></div><div aria-disabled=\'false\' id=\'ooui-php-2\' class=\'oo-ui-widget oo-ui-widget-enabled oo-ui-inputWidget oo-ui-textInputWidget oo-ui-textInputWidget-type-text oo-ui-textInputWidget-php\' data-ooui=\'{"_":"OO.ui.TextInputWidget"}\'><input type=\'text\' tabindex=\'0\' aria-disabled=\'false\' value=\'\' class=\'oo-ui-inputWidget-input\' /><span class=\'oo-ui-iconElement-icon\'></span><span class=\'oo-ui-indicatorElement-indicator\'></span></div>' );

	assert.true( OO.ui.Element.static.infuse( $textInputWidget ) instanceof OO.ui.TextInputWidget );
	assert.throws( function () {
		OO.ui.Element.static.infuse( $unknownTypeWidget );
	}, /Error: Unknown widget type/ );
	assert.throws( function () {
		OO.ui.Element.static.infuse( $nonExistentTypeWidget );
	}, /Error: Unknown widget type/ );
	assert.throws( function () {
		OO.ui.Element.static.infuse( $invalidJsonWidget );
	}, /Error: No valid infusion data found: undefined/ );
	assert.throws( function () {
		OO.ui.Element.static.infuse( $emptyTypeWidget );
	}, /Error: No valid infusion data found: undefined/ );
	assert.throws( function () {
		OO.ui.Element.static.infuse( $nonWidget );
	}, /Error: No infusion data found: undefined/ );
	assert.throws( function () {
		OO.ui.Element.static.infuse( $emptyCollection );
	}, /Error: Widget not found/ );
	assert.throws( function () {
		OO.ui.Element.static.infuse( $unmatchedSelector );
	}, /Error: Widget not found/ );
	assert.throws( function () {
		OO.ui.Element.static.infuse( $moreThanOneInCollection );
	}, /Error: Collection contains more than one element/ );
} );

QUnit.test( 'static.infuse (infusing already infused nodes)', function ( assert ) {
	var a, b, fixture = this.fixture;

	function reset() {
		// ( new OOUI\FieldLayout(
		//     new OOUI\ButtonWidget( [ 'id' => 'button' ] ),
		//     [ 'id' => 'field' ]
		// ) )->setInfusable( true )
		var html = '<div id=\'field\' class=\'oo-ui-layout oo-ui-fieldLayout oo-ui-fieldLayout-align-left\' data-ooui=\'{"_":"OO.ui.FieldLayout","fieldWidget":{"tag":"button"},"align":"left","errors":[],"notices":[],"$overlay":true}\'><div class=\'oo-ui-fieldLayout-body\'><span class=\'oo-ui-fieldLayout-header\'><label class=\'oo-ui-labelElement-label\'></label></span><span class=\'oo-ui-fieldLayout-field\'><span id=\'button\' aria-disabled=\'false\' class=\'oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-framed oo-ui-buttonWidget\' data-ooui=\'{"_":"OO.ui.ButtonWidget"}\'><a role=\'button\' tabindex=\'0\' aria-disabled=\'false\' rel=\'nofollow\' class=\'oo-ui-buttonElement-button\'><span class=\'oo-ui-iconElement-icon\'></span><span class=\'oo-ui-labelElement-label\'></span><span class=\'oo-ui-indicatorElement-indicator\'></span></a></span></span></div></div>';
		$( fixture ).empty().append( html );
	}

	// Infuse a widget, then the same widget with jQuery
	reset();
	a = OO.ui.infuse( document.getElementById( 'button' ) );
	b = OO.ui.infuse( $( '#button' ) );
	assert.true( a instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.true( b instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.strictEqual( a, b, 'Both infuse() calls returned the same widget instance' );

	// Infuse a field, then its widget
	reset();
	a = OO.ui.infuse( document.getElementById( 'field' ) );
	b = OO.ui.infuse( document.getElementById( 'button' ) );
	assert.true( a instanceof OO.ui.FieldLayout, 'infuse() returned a FieldLayout' );
	assert.true( b instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.strictEqual( a.fieldWidget, b, 'Both infuse() calls returned the same widget instance' );

	// Infuse a widget, then its field
	reset();
	a = OO.ui.infuse( document.getElementById( 'button' ) );
	b = OO.ui.infuse( document.getElementById( 'field' ) );
	assert.true( a instanceof OO.ui.ButtonWidget, 'infuse() returned a ButtonWidget' );
	assert.true( b instanceof OO.ui.FieldLayout, 'infuse() returned a FieldLayout' );
	assert.strictEqual( b.fieldWidget, a, 'Both infuse() calls returned the same widget instance' );

	// Infuse a widget with extra config
	reset();
	a = OO.ui.infuse( document.getElementById( 'button' ), { flags: [ 'extra' ] } );
	assert.deepEqual( a.getFlags(), [ 'extra' ], 'infuse with extra config' );
} );

QUnit.test( 'static.getClosestScrollableContainer', function ( assert ) {
	var fixture = this.fixture,
		div = document.createElement( 'div' ),
		getRootScrollableElement = OO.ui.Element.static.getRootScrollableElement;

	fixture.appendChild( div );

	// Chrome<=60: <body> is root scrollable
	// Chrome>60, Firefox: <html> is root scrollable
	[ 'body', 'documentElement' ].forEach( function ( root ) {
		var rootElement = document[ root ];
		OO.ui.Element.static.getRootScrollableElement = function () {
			return rootElement;
		};
		[ 'scroll', 'visible' ].forEach( function ( overflow ) {
			var msg = 'root=' + root + ', body overflow=' + overflow;
			document.body.style.overflowY = overflow;
			assert.strictEqual(
				OO.ui.Element.static.getClosestScrollableContainer( fixture ),
				rootElement,
				msg + ', fixture'
			);
			assert.strictEqual(
				OO.ui.Element.static.getClosestScrollableContainer( div ),
				rootElement,
				msg + ', div'
			);
			assert.strictEqual(
				OO.ui.Element.static.getClosestScrollableContainer( document.body ),
				rootElement,
				msg + ', body'
			);
			assert.strictEqual(
				OO.ui.Element.static.getClosestScrollableContainer( document.documentElement ),
				rootElement,
				msg + ', html'
			);

			fixture.style.overflowY = 'scroll';
			assert.strictEqual(
				OO.ui.Element.static.getClosestScrollableContainer( div ),
				fixture,
				msg + ', fixture overflow, div'
			);
			fixture.style.overflowY = '';

			document.body.style.overflowY = '';
		} );
	} );

	// Restore
	OO.ui.Element.static.getRootScrollableElement = getRootScrollableElement;
	fixture.removeChild( div );
} );

QUnit.test( 'static.getDocument', function ( assert ) {
	var frameDoc, frameEl, frameDiv,
		done = assert.async( 2 ),
		el = this.fixture,
		div = document.createElement( 'div' ),
		$el = $( this.fixture ),
		$div = $( '<div>' ),
		win = window,
		doc = document;

	// Test a cross-origin frame (T258256). 'data:' URLs are always considered cross-origin.
	// This must be the first test case, so that the frame is the first in the document, otherwise
	// it doesn't actually test for the regression.
	this.makeFrame( 'data:text/html,', function () {
		try {
			assert.strictEqual( OO.ui.Element.static.getDocument( win ), doc, 'Window (when a a cross-origin frame exists)' );
		} catch ( err ) {
			assert.true( false, 'Window (when a a cross-origin frame exists)' );
		}
		done();
	} );

	// 'about:blank' is always considered same-origin
	frameDoc = this.makeFrame( 'about:blank' );
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

	done();
} );

QUnit.test( 'getElementDocument', function ( assert ) {
	var el, doc;

	doc = document;
	el = new OO.ui.Element();
	assert.strictEqual( el.getElementDocument(), doc );
} );
