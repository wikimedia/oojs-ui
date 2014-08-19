/**
 * Embedded iframe with the same styles as its parent.
 *
 * @class
 * @extends OO.ui.Element
 * @mixins OO.EventEmitter
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.Frame = function OoUiFrame( config ) {
	// Parent constructor
	OO.ui.Frame.super.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.loading = null;
	this.config = config;
	this.dir = null;

	// Initialize
	this.$element
		.addClass( 'oo-ui-frame' )
		.attr( { frameborder: 0, scrolling: 'no' } );

};

/* Setup */

OO.inheritClass( OO.ui.Frame, OO.ui.Element );
OO.mixinClass( OO.ui.Frame, OO.EventEmitter );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.Frame.static.tagName = 'iframe';

/* Events */

/**
 * @event load
 */

/* Static Methods */

/**
 * Transplant the CSS styles from as parent document to a frame's document.
 *
 * This loops over the style sheets in the parent document, and copies their nodes to the
 * frame's document. It then polls the document to see when all styles have loaded, and once they
 * have, resolves the promise.
 *
 * If the styles still haven't loaded after a long time (5 seconds by default), we give up waiting
 * and resolve the promise anyway. This protects against cases like a display: none; iframe in
 * Firefox, where the styles won't load until the iframe becomes visible.
 *
 * For details of how we arrived at the strategy used in this function, see #load.
 *
 * @static
 * @inheritable
 * @param {HTMLDocument} parentDoc Document to transplant styles from
 * @param {HTMLDocument} frameDoc Document to transplant styles to
 * @param {number} [timeout=5000] How long to wait before giving up (in ms). If 0, never give up.
 * @return {jQuery.Promise} Promise resolved when styles have loaded
 */
OO.ui.Frame.static.transplantStyles = function ( parentDoc, frameDoc, timeout ) {
	var i, numSheets, styleNode, styleText, newNode, timeoutID, pollNodeId, $pendingPollNodes,
		$pollNodes = $( [] ),
		// Fake font-family value
		fontFamily = 'oo-ui-frame-transplantStyles-loaded',
		deferred = $.Deferred();

	for ( i = 0, numSheets = parentDoc.styleSheets.length; i < numSheets; i++ ) {
		styleNode = parentDoc.styleSheets[i].ownerNode;
		if ( styleNode.disabled ) {
			continue;
		}

		if ( styleNode.nodeName.toLowerCase() === 'link' ) {
			// External stylesheet; use @import
			styleText = '@import url(' + styleNode.href + ');';
		} else {
			// Internal stylesheet; just copy the text
			styleText = styleNode.textContent;
		}

		// Create a node with a unique ID that we're going to monitor to see when the CSS
		// has loaded
		pollNodeId = 'oo-ui-frame-transplantStyles-loaded-' + i;
		$pollNodes = $pollNodes.add( $( '<div>', frameDoc )
			.attr( 'id', pollNodeId )
			.appendTo( frameDoc.body )
		);

		// Add #pollNodeId { font-family: ... } to the end of the stylesheet / after the @import
		// The font-family rule will only take effect once the @import finishes
		styleText += '\n' + '#' + pollNodeId + ' { font-family: ' + fontFamily + '; }';

		// Add our modified CSS as a <style> tag
		newNode = frameDoc.createElement( 'style' );
		newNode.textContent = styleText;
		frameDoc.head.appendChild( newNode );
	}

	// Poll every 100ms until all external stylesheets have loaded
	$pendingPollNodes = $pollNodes;
	timeoutID = setTimeout( function pollExternalStylesheets() {
		while (
			$pendingPollNodes.length > 0 &&
			$pendingPollNodes.eq( 0 ).css( 'font-family' ) === fontFamily
		) {
			$pendingPollNodes = $pendingPollNodes.slice( 1 );
		}

		if ( $pendingPollNodes.length === 0 ) {
			// We're done!
			if ( timeoutID !== null ) {
				timeoutID = null;
				$pollNodes.remove();
				deferred.resolve();
			}
		} else {
			timeoutID = setTimeout( pollExternalStylesheets, 100 );
		}
	}, 100 );
	// ...but give up after a while
	if ( timeout !== 0 ) {
		setTimeout( function () {
			if ( timeoutID ) {
				clearTimeout( timeoutID );
				timeoutID = null;
				$pollNodes.remove();
				deferred.reject();
			}
		}, timeout || 5000 );
	}

	return deferred.promise();
};

/* Methods */

/**
 * Load the frame contents.
 *
 * Once the iframe's stylesheets are loaded, the `load` event will be emitted and the returned
 * promise will be resolved. Calling while loading will return a promise but not trigger a new
 * loading cycle. Calling after loading is complete will return a promise that's already been
 * resolved.
 *
 * Sounds simple right? Read on...
 *
 * When you create a dynamic iframe using open/write/close, the window.load event for the
 * iframe is triggered when you call close, and there's no further load event to indicate that
 * everything is actually loaded.
 *
 * In Chrome, stylesheets don't show up in document.styleSheets until they have loaded, so we could
 * just poll that array and wait for it to have the right length. However, in Firefox, stylesheets
 * are added to document.styleSheets immediately, and the only way you can determine whether they've
 * loaded is to attempt to access .cssRules and wait for that to stop throwing an exception. But
 * cross-domain stylesheets never allow .cssRules to be accessed even after they have loaded.
 *
 * The workaround is to change all `<link href="...">` tags to `<style>@import url(...)</style>` tags.
 * Because `@import` is blocking, Chrome won't add the stylesheet to document.styleSheets until
 * the `@import` has finished, and Firefox won't allow .cssRules to be accessed until the `@import`
 * has finished. And because the contents of the `<style>` tag are from the same origin, accessing
 * .cssRules is allowed.
 *
 * However, now that we control the styles we're injecting, we might as well do away with
 * browser-specific polling hacks like document.styleSheets and .cssRules, and instead inject
 * `<style>@import url(...); #foo { font-family: someValue; }</style>`, then create `<div id="foo">`
 * and wait for its font-family to change to someValue. Because `@import` is blocking, the font-family
 * rule is not applied until after the `@import` finishes.
 *
 * All this stylesheet injection and polling magic is in #transplantStyles.
 *
 * @return {jQuery.Promise} Promise resolved when loading is complete
 * @fires load
 */
OO.ui.Frame.prototype.load = function () {
	var win, doc,
		frame = this;

	// Return existing promise if already loading or loaded
	if ( this.loading ) {
		return this.loading.promise();
	}

	// Load the frame
	this.loading = $.Deferred();

	win = this.$element.prop( 'contentWindow' );
	doc = win.document;

	// Cache directionality
	this.dir = OO.ui.Element.getDir( this.$element ) || 'ltr';

	// Initialize contents
	doc.open();
	// The following classes can be used here:
	// oo-ui-ltr
	// oo-ui-rtl
	doc.write(
		'<!doctype html>' +
		'<html>' +
			'<body class="oo-ui-frame-content oo-ui-' + this.getDir() + '" dir="' + this.getDir() + '">' +
			'</body>' +
		'</html>'
	);
	doc.close();

	// Properties
	this.$ = OO.ui.Element.getJQuery( doc, this );
	this.$content = this.$( '.oo-ui-frame-content' ).attr( 'tabIndex', 0 );
	this.$document = this.$( doc );

	// Initialization
	this.constructor.static.transplantStyles( this.getElementDocument(), this.$document[0] )
		.always( function () {
			frame.emit( 'load' );
			frame.loading.resolve();
		} );

	return this.loading.promise();
};

/**
 * Set the size of the frame.
 *
 * @param {number} width Frame width in pixels
 * @param {number} height Frame height in pixels
 * @chainable
 */
OO.ui.Frame.prototype.setSize = function ( width, height ) {
	this.$element.css( { width: width, height: height } );
	return this;
};

/**
 * Get the directionality of the frame
 *
 * @return {string} Directionality, 'ltr' or 'rtl'
 */
OO.ui.Frame.prototype.getDir = function () {
	return this.dir;
};
