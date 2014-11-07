/**
 * Container for elements in a child frame.
 *
 * Use together with OO.ui.WindowManager.
 *
 * @abstract
 * @class
 * @extends OO.ui.Element
 * @mixins OO.EventEmitter
 *
 * When a window is opened, the setup and ready processes are executed. Similarly, the hold and
 * teardown processes are executed when the window is closed.
 *
 * - {@link OO.ui.WindowManager#openWindow} or {@link #open} methods are used to start opening
 * - Window manager begins opening window
 * - {@link #getSetupProcess} method is called and its result executed
 * - {@link #getReadyProcess} method is called and its result executed
 * - Window is now open
 *
 * - {@link OO.ui.WindowManager#closeWindow} or {@link #close} methods are used to start closing
 * - Window manager begins closing window
 * - {@link #getHoldProcess} method is called and its result executed
 * - {@link #getTeardownProcess} method is called and its result executed
 * - Window is now closed
 *
 * Each process (setup, ready, hold and teardown) can be extended in subclasses by overriding
 * {@link #getSetupProcess}, {@link #getReadyProcess}, {@link #getHoldProcess} and
 * {@link #getTeardownProcess} respectively. Each process is executed in series, so asynchonous
 * processing can complete. Always assume window processes are executed asychronously. See
 * OO.ui.Process for more details about how to work with processes. Some events, as well as the
 * #open and #close methods, provide promises which are resolved when the window enters a new state.
 *
 * Sizing of windows is specified using symbolic names which are interpreted by the window manager.
 * If the requested size is not recognized, the window manager will choose a sensible fallback.
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [size] Symbolic name of dialog size, `small`, `medium`, `large` or `full`; omit to
 *   use #static-size
 */
OO.ui.Window = function OoUiWindow( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.Window.super.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.manager = null;
	this.initialized = false;
	this.visible = false;
	this.opening = null;
	this.closing = null;
	this.opened = null;
	this.timing = null;
	this.loading = null;
	this.size = config.size || this.constructor.static.size;
	this.$frame = this.$( '<div>' );
	this.$overlay = this.$( '<div>' );

	// Initialization
	this.$element
		.addClass( 'oo-ui-window' )
		.append( this.$frame, this.$overlay );
	this.$frame.addClass( 'oo-ui-window-frame' );
	this.$overlay.addClass( 'oo-ui-window-overlay' );

	// NOTE: Additional intitialization will occur when #setManager is called
};

/* Setup */

OO.inheritClass( OO.ui.Window, OO.ui.Element );
OO.mixinClass( OO.ui.Window, OO.EventEmitter );

/* Static Properties */

/**
 * Symbolic name of size.
 *
 * Size is used if no size is configured during construction.
 *
 * @static
 * @inheritable
 * @property {string}
 */
OO.ui.Window.static.size = 'medium';

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
OO.ui.Window.static.transplantStyles = function ( parentDoc, frameDoc, timeout ) {
	var i, numSheets, styleNode, styleText, newNode, timeoutID, pollNodeId, $pendingPollNodes,
		$pollNodes = $( [] ),
		// Fake font-family value
		fontFamily = 'oo-ui-frame-transplantStyles-loaded',
		nextIndex = parentDoc.oouiFrameTransplantStylesNextIndex || 0,
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
			// For IE10 we need to fall back to .cssText, BUT that's undefined in
			// other browsers, so fall back to '' rather than 'undefined'
			styleText = styleNode.textContent || parentDoc.styleSheets[i].cssText || '';
		}

		// Create a node with a unique ID that we're going to monitor to see when the CSS
		// has loaded
		if ( styleNode.oouiFrameTransplantStylesId ) {
			// If we're nesting transplantStyles operations and this node already has
			// a CSS rule to wait for loading, reuse it
			pollNodeId = styleNode.oouiFrameTransplantStylesId;
		} else {
			// Otherwise, create a new ID
			pollNodeId = 'oo-ui-frame-transplantStyles-loaded-' + nextIndex;
			nextIndex++;

			// Add #pollNodeId { font-family: ... } to the end of the stylesheet / after the @import
			// The font-family rule will only take effect once the @import finishes
			styleText += '\n' + '#' + pollNodeId + ' { font-family: ' + fontFamily + '; }';
		}

		// Create a node with id=pollNodeId
		$pollNodes = $pollNodes.add( $( '<div>', frameDoc )
			.attr( 'id', pollNodeId )
			.appendTo( frameDoc.body )
		);

		// Add our modified CSS as a <style> tag
		newNode = frameDoc.createElement( 'style' );
		newNode.textContent = styleText;
		newNode.oouiFrameTransplantStylesId = pollNodeId;
		frameDoc.head.appendChild( newNode );
	}
	frameDoc.oouiFrameTransplantStylesNextIndex = nextIndex;

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
 * Handle mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.Window.prototype.onMouseDown = function ( e ) {
	// Prevent clicking on the click-block from stealing focus
	if ( e.target === this.$element[0] ) {
		return false;
	}
};

/**
 * Check if window has been initialized.
 *
 * @return {boolean} Window has been initialized
 */
OO.ui.Window.prototype.isInitialized = function () {
	return this.initialized;
};

/**
 * Check if window is visible.
 *
 * @return {boolean} Window is visible
 */
OO.ui.Window.prototype.isVisible = function () {
	return this.visible;
};

/**
 * Check if window is loading.
 *
 * @return {boolean} Window is loading
 */
OO.ui.Window.prototype.isLoading = function () {
	return this.loading && this.loading.state() === 'pending';
};

/**
 * Check if window is loaded.
 *
 * @return {boolean} Window is loaded
 */
OO.ui.Window.prototype.isLoaded = function () {
	return this.loading && this.loading.state() === 'resolved';
};

/**
 * Check if window is opening.
 *
 * This is a wrapper around OO.ui.WindowManager#isOpening.
 *
 * @return {boolean} Window is opening
 */
OO.ui.Window.prototype.isOpening = function () {
	return this.manager.isOpening( this );
};

/**
 * Check if window is closing.
 *
 * This is a wrapper around OO.ui.WindowManager#isClosing.
 *
 * @return {boolean} Window is closing
 */
OO.ui.Window.prototype.isClosing = function () {
	return this.manager.isClosing( this );
};

/**
 * Check if window is opened.
 *
 * This is a wrapper around OO.ui.WindowManager#isOpened.
 *
 * @return {boolean} Window is opened
 */
OO.ui.Window.prototype.isOpened = function () {
	return this.manager.isOpened( this );
};

/**
 * Get the window manager.
 *
 * @return {OO.ui.WindowManager} Manager of window
 */
OO.ui.Window.prototype.getManager = function () {
	return this.manager;
};

/**
 * Get the window size.
 *
 * @return {string} Symbolic size name, e.g. 'small', 'medium', 'large', 'full'
 */
OO.ui.Window.prototype.getSize = function () {
	return this.size;
};

/**
 * Get the height of the dialog contents.
 *
 * @return {number} Content height
 */
OO.ui.Window.prototype.getContentHeight = function () {
	// Temporarily resize the frame so getBodyHeight() can use scrollHeight measurements
	var bodyHeight, oldHeight = this.$frame[0].style.height;
	this.$frame[0].style.height = '1px';
	bodyHeight = this.getBodyHeight();
	this.$frame[0].style.height = oldHeight;

	return Math.round(
		// Add buffer for border
		( this.$frame.outerHeight() - this.$frame.innerHeight() ) +
		// Use combined heights of children
		( this.$head.outerHeight( true ) + bodyHeight + this.$foot.outerHeight( true ) )
	);
};

/**
 * Get the height of the dialog contents.
 *
 * When this function is called, the dialog will temporarily have been resized
 * to height=1px, so .scrollHeight measurements can be taken accurately.
 *
 * @return {number} Height of content
 */
OO.ui.Window.prototype.getBodyHeight = function () {
	return this.$body[0].scrollHeight;
};

/**
 * Get the directionality of the frame
 *
 * @return {string} Directionality, 'ltr' or 'rtl'
 */
OO.ui.Window.prototype.getDir = function () {
	return this.dir;
};

/**
 * Get a process for setting up a window for use.
 *
 * Each time the window is opened this process will set it up for use in a particular context, based
 * on the `data` argument.
 *
 * When you override this method, you can add additional setup steps to the process the parent
 * method provides using the 'first' and 'next' methods.
 *
 * @abstract
 * @param {Object} [data] Window opening data
 * @return {OO.ui.Process} Setup process
 */
OO.ui.Window.prototype.getSetupProcess = function () {
	return new OO.ui.Process();
};

/**
 * Get a process for readying a window for use.
 *
 * Each time the window is open and setup, this process will ready it up for use in a particular
 * context, based on the `data` argument.
 *
 * When you override this method, you can add additional setup steps to the process the parent
 * method provides using the 'first' and 'next' methods.
 *
 * @abstract
 * @param {Object} [data] Window opening data
 * @return {OO.ui.Process} Setup process
 */
OO.ui.Window.prototype.getReadyProcess = function () {
	return new OO.ui.Process();
};

/**
 * Get a process for holding a window from use.
 *
 * Each time the window is closed, this process will hold it from use in a particular context, based
 * on the `data` argument.
 *
 * When you override this method, you can add additional setup steps to the process the parent
 * method provides using the 'first' and 'next' methods.
 *
 * @abstract
 * @param {Object} [data] Window closing data
 * @return {OO.ui.Process} Hold process
 */
OO.ui.Window.prototype.getHoldProcess = function () {
	return new OO.ui.Process();
};

/**
 * Get a process for tearing down a window after use.
 *
 * Each time the window is closed this process will tear it down and do something with the user's
 * interactions within the window, based on the `data` argument.
 *
 * When you override this method, you can add additional teardown steps to the process the parent
 * method provides using the 'first' and 'next' methods.
 *
 * @abstract
 * @param {Object} [data] Window closing data
 * @return {OO.ui.Process} Teardown process
 */
OO.ui.Window.prototype.getTeardownProcess = function () {
	return new OO.ui.Process();
};

/**
 * Toggle visibility of window.
 *
 * If the window is isolated and hasn't fully loaded yet, the visiblity property will be used
 * instead of display.
 *
 * @param {boolean} [show] Make window visible, omit to toggle visibility
 * @fires toggle
 * @chainable
 */
OO.ui.Window.prototype.toggle = function ( show ) {
	show = show === undefined ? !this.visible : !!show;

	if ( show !== this.isVisible() ) {
		this.visible = show;

		if ( this.isolated && !this.isLoaded() ) {
			// Hide the window using visibility instead of display until loading is complete
			// Can't use display: none; because that prevents the iframe from loading in Firefox
			this.$element.css( 'visibility', show ? 'visible' : 'hidden' );
		} else {
			this.$element.toggle( show ).css( 'visibility', '' );
		}
		this.emit( 'toggle', show );
	}

	return this;
};

/**
 * Set the window manager.
 *
 * This must be called before initialize. Calling it more than once will cause an error.
 *
 * @param {OO.ui.WindowManager} manager Manager for this window
 * @throws {Error} If called more than once
 * @chainable
 */
OO.ui.Window.prototype.setManager = function ( manager ) {
	if ( this.manager ) {
		throw new Error( 'Cannot set window manager, window already has a manager' );
	}

	// Properties
	this.manager = manager;
	this.isolated = manager.shouldIsolate();

	// Initialization
	if ( this.isolated ) {
		this.$iframe = this.$( '<iframe>' );
		this.$iframe.attr( { frameborder: 0, scrolling: 'no' } );
		this.$frame.append( this.$iframe );
		this.$ = function () {
			throw new Error( 'this.$() cannot be used until the frame has been initialized.' );
		};
		// WARNING: Do not use this.$ again until #initialize is called
	} else {
		this.$content = this.$( '<div>' );
		this.$document = $( this.getElementDocument() );
		this.$content.addClass( 'oo-ui-window-content' );
		this.$frame.append( this.$content );
	}
	this.toggle( false );

	// Figure out directionality:
	this.dir = OO.ui.Element.getDir( this.$iframe || this.$content ) || 'ltr';

	return this;
};

/**
 * Set the window size.
 *
 * @param {string} size Symbolic size name, e.g. 'small', 'medium', 'large', 'full'
 * @chainable
 */
OO.ui.Window.prototype.setSize = function ( size ) {
	this.size = size;
	this.manager.updateWindowSize( this );
	return this;
};

/**
 * Set window dimensions.
 *
 * Properties are applied to the frame container.
 *
 * @param {Object} dim CSS dimension properties
 * @param {string|number} [dim.width] Width
 * @param {string|number} [dim.minWidth] Minimum width
 * @param {string|number} [dim.maxWidth] Maximum width
 * @param {string|number} [dim.width] Height, omit to set based on height of contents
 * @param {string|number} [dim.minWidth] Minimum height
 * @param {string|number} [dim.maxWidth] Maximum height
 * @chainable
 */
OO.ui.Window.prototype.setDimensions = function ( dim ) {
	// Apply width before height so height is not based on wrapping content using the wrong width
	this.$frame.css( {
		width: dim.width || '',
		minWidth: dim.minWidth || '',
		maxWidth: dim.maxWidth || ''
	} );
	this.$frame.css( {
		height: ( dim.height !== undefined ? dim.height : this.getContentHeight() ) || '',
		minHeight: dim.minHeight || '',
		maxHeight: dim.maxHeight || ''
	} );
	return this;
};

/**
 * Initialize window contents.
 *
 * The first time the window is opened, #initialize is called when it's safe to begin populating
 * its contents. See #getSetupProcess for a way to make changes each time the window opens.
 *
 * Once this method is called, this.$ can be used to create elements within the frame.
 *
 * @throws {Error} If not attached to a manager
 * @chainable
 */
OO.ui.Window.prototype.initialize = function () {
	if ( !this.manager ) {
		throw new Error( 'Cannot initialize window, must be attached to a manager' );
	}

	// Properties
	this.$head = this.$( '<div>' );
	this.$body = this.$( '<div>' );
	this.$foot = this.$( '<div>' );
	this.$innerOverlay = this.$( '<div>' );

	// Events
	this.$element.on( 'mousedown', this.onMouseDown.bind( this ) );

	// Initialization
	this.$head.addClass( 'oo-ui-window-head' );
	this.$body.addClass( 'oo-ui-window-body' );
	this.$foot.addClass( 'oo-ui-window-foot' );
	this.$innerOverlay.addClass( 'oo-ui-window-inner-overlay' );
	this.$content.append( this.$head, this.$body, this.$foot, this.$innerOverlay );

	return this;
};

/**
 * Open window.
 *
 * This is a wrapper around calling {@link OO.ui.WindowManager#openWindow} on the window manager.
 * To do something each time the window opens, use #getSetupProcess or #getReadyProcess.
 *
 * @param {Object} [data] Window opening data
 * @return {jQuery.Promise} Promise resolved when window is opened; when the promise is resolved the
 *   first argument will be a promise which will be resolved when the window begins closing
 */
OO.ui.Window.prototype.open = function ( data ) {
	return this.manager.openWindow( this, data );
};

/**
 * Close window.
 *
 * This is a wrapper around calling OO.ui.WindowManager#closeWindow on the window manager.
 * To do something each time the window closes, use #getHoldProcess or #getTeardownProcess.
 *
 * @param {Object} [data] Window closing data
 * @return {jQuery.Promise} Promise resolved when window is closed
 */
OO.ui.Window.prototype.close = function ( data ) {
	return this.manager.closeWindow( this, data );
};

/**
 * Setup window.
 *
 * This is called by OO.ui.WindowManager durring window opening, and should not be called directly
 * by other systems.
 *
 * @param {Object} [data] Window opening data
 * @return {jQuery.Promise} Promise resolved when window is setup
 */
OO.ui.Window.prototype.setup = function ( data ) {
	var win = this,
		deferred = $.Deferred();

	this.$element.show();
	this.visible = true;
	this.getSetupProcess( data ).execute().done( function () {
		// Force redraw by asking the browser to measure the elements' widths
		win.$element.addClass( 'oo-ui-window-setup' ).width();
		win.$content.addClass( 'oo-ui-window-content-setup' ).width();
		deferred.resolve();
	} );

	return deferred.promise();
};

/**
 * Ready window.
 *
 * This is called by OO.ui.WindowManager durring window opening, and should not be called directly
 * by other systems.
 *
 * @param {Object} [data] Window opening data
 * @return {jQuery.Promise} Promise resolved when window is ready
 */
OO.ui.Window.prototype.ready = function ( data ) {
	var win = this,
		deferred = $.Deferred();

	this.$content.focus();
	this.getReadyProcess( data ).execute().done( function () {
		// Force redraw by asking the browser to measure the elements' widths
		win.$element.addClass( 'oo-ui-window-ready' ).width();
		win.$content.addClass( 'oo-ui-window-content-ready' ).width();
		deferred.resolve();
	} );

	return deferred.promise();
};

/**
 * Hold window.
 *
 * This is called by OO.ui.WindowManager durring window closing, and should not be called directly
 * by other systems.
 *
 * @param {Object} [data] Window closing data
 * @return {jQuery.Promise} Promise resolved when window is held
 */
OO.ui.Window.prototype.hold = function ( data ) {
	var win = this,
		deferred = $.Deferred();

	this.getHoldProcess( data ).execute().done( function () {
		// Get the focused element within the window's content
		var $focus = win.$content.find( OO.ui.Element.getDocument( win.$content ).activeElement );

		// Blur the focused element
		if ( $focus.length ) {
			$focus[0].blur();
		}

		// Force redraw by asking the browser to measure the elements' widths
		win.$element.removeClass( 'oo-ui-window-ready' ).width();
		win.$content.removeClass( 'oo-ui-window-content-ready' ).width();
		deferred.resolve();
	} );

	return deferred.promise();
};

/**
 * Teardown window.
 *
 * This is called by OO.ui.WindowManager durring window closing, and should not be called directly
 * by other systems.
 *
 * @param {Object} [data] Window closing data
 * @return {jQuery.Promise} Promise resolved when window is torn down
 */
OO.ui.Window.prototype.teardown = function ( data ) {
	var win = this,
		deferred = $.Deferred();

	this.getTeardownProcess( data ).execute().done( function () {
		// Force redraw by asking the browser to measure the elements' widths
		win.$element.removeClass( 'oo-ui-window-load oo-ui-window-setup' ).width();
		win.$content.removeClass( 'oo-ui-window-content-setup' ).width();
		win.$element.hide();
		win.visible = false;
		deferred.resolve();
	} );

	return deferred.promise();
};

/**
 * Load the frame contents.
 *
 * Once the iframe's stylesheets are loaded the returned promise will be resolved. Calling while
 * loading will return a promise but not trigger a new loading cycle. Calling after loading is
 * complete will return a promise that's already been resolved.
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
 * The workaround is to change all `<link href="...">` tags to `<style>@import url(...)</style>`
 * tags. Because `@import` is blocking, Chrome won't add the stylesheet to document.styleSheets
 * until the `@import` has finished, and Firefox won't allow .cssRules to be accessed until the
 * `@import` has finished. And because the contents of the `<style>` tag are from the same origin,
 * accessing .cssRules is allowed.
 *
 * However, now that we control the styles we're injecting, we might as well do away with
 * browser-specific polling hacks like document.styleSheets and .cssRules, and instead inject
 * `<style>@import url(...); #foo { font-family: someValue; }</style>`, then create `<div id="foo">`
 * and wait for its font-family to change to someValue. Because `@import` is blocking, the
 * font-family rule is not applied until after the `@import` finishes.
 *
 * All this stylesheet injection and polling magic is in #transplantStyles.
 *
 * @return {jQuery.Promise} Promise resolved when loading is complete
 */
OO.ui.Window.prototype.load = function () {
	var sub, doc, loading,
		win = this;

	this.$element.addClass( 'oo-ui-window-load' );

	// Non-isolated windows are already "loaded"
	if ( !this.loading && !this.isolated ) {
		this.loading = $.Deferred().resolve();
		this.initialize();
		// Set initialized state after so sub-classes aren't confused by it being set by calling
		// their parent initialize method
		this.initialized = true;
	}

	// Return existing promise if already loading or loaded
	if ( this.loading ) {
		return this.loading.promise();
	}

	// Load the frame
	loading = this.loading = $.Deferred();
	sub = this.$iframe.prop( 'contentWindow' );
	doc = sub.document;

	// Initialize contents
	doc.open();
	doc.write(
		'<!doctype html>' +
		'<html>' +
			'<body class="oo-ui-window-isolated oo-ui-' + this.dir + '"' +
				' style="direction:' + this.dir + ';" dir="' + this.dir + '">' +
				'<div class="oo-ui-window-content"></div>' +
			'</body>' +
		'</html>'
	);
	doc.close();

	// Properties
	this.$ = OO.ui.Element.getJQuery( doc, this.$iframe );
	this.$content = this.$( '.oo-ui-window-content' ).attr( 'tabIndex', 0 );
	this.$document = this.$( doc );

	// Initialization
	this.constructor.static.transplantStyles( this.getElementDocument(), this.$document[0] )
		.always( function () {
			// Initialize isolated windows
			win.initialize();
			// Set initialized state after so sub-classes aren't confused by it being set by calling
			// their parent initialize method
			win.initialized = true;
			// Undo the visibility: hidden; hack and apply display: none;
			// We can do this safely now that the iframe has initialized
			// (don't do this from within #initialize because it has to happen
			// after the all subclasses have been handled as well).
			win.toggle( win.isVisible() );

			loading.resolve();
		} );

	return loading.promise();
};
