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
 * @param {OO.ui.WindowManager} manager Manager of window
 * @param {Object} [config] Configuration options
 * @cfg {string} [size] Symbolic name of dialog size, `small`, `medium`, `large` or `full`; omit to
 *   use #static-size
 * @fires initialize
 */
OO.ui.Window = function OoUiWindow( manager, config ) {
	var win = this;

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.Window.super.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	if ( !( manager instanceof OO.ui.WindowManager ) ) {
		throw new Error( 'Cannot construct window: window must have a manager' );
	}

	// Properties
	this.manager = manager;
	this.initialized = false;
	this.visible = false;
	this.opening = null;
	this.closing = null;
	this.opened = null;
	this.timing = null;
	this.size = config.size || this.constructor.static.size;
	this.frame = new OO.ui.Frame( { '$': this.$ } );
	this.$frame = this.$( '<div>' );
	this.$ = function () {
		throw new Error( 'this.$() cannot be used until the frame has been initialized.' );
	};

	// Initialization
	this.$element
		.addClass( 'oo-ui-window' )
		// Hide the window using visibility: hidden; while the iframe is still loading
		// Can't use display: none; because that prevents the iframe from loading in Firefox
		.css( 'visibility', 'hidden' )
		.append( this.$frame );
	this.$frame
		.addClass( 'oo-ui-window-frame' )
		.append( this.frame.$element );

	// Events
	this.frame.on( 'load', function () {
		win.initialize();
		win.initialized = true;
		// Undo the visibility: hidden; hack and apply display: none;
		// We can do this safely now that the iframe has initialized
		// (don't do this from within #initialize because it has to happen
		// after the all subclasses have been handled as well).
		win.$element.hide().css( 'visibility', '' );
	} );
};

/* Setup */

OO.inheritClass( OO.ui.Window, OO.ui.Element );
OO.mixinClass( OO.ui.Window, OO.EventEmitter );

/* Events */

/**
 * @event resize
 * @param {string} size Symbolic size name, e.g. 'small', 'medium', 'large', 'full'
 */

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

/* Methods */

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
 * Get the window frame.
 *
 * @return {OO.ui.Frame} Frame of window
 */
OO.ui.Window.prototype.getFrame = function () {
	return this.frame;
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
	return Math.round(
		// Add buffer for border
		( ( this.$frame.outerHeight() - this.$frame.innerHeight() ) * 2 ) +
		// Height of contents
		( this.$head.outerHeight( true ) + this.getBodyHeight() + this.$foot.outerHeight( true ) )
	);
};

/**
 * Get the height of the dialog contents.
 *
 * @return {number} Height of content
 */
OO.ui.Window.prototype.getBodyHeight = function () {
	return this.$body[0].scrollHeight;
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
		'width': dim.width || '',
		'min-width': dim.minWidth || '',
		'max-width': dim.maxWidth || ''
	} );
	this.$frame.css( {
		'height': ( dim.height !== undefined ? dim.height : this.getContentHeight() ) || '',
		'min-height': dim.minHeight || '',
		'max-height': dim.maxHeight || ''
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
 * @chainable
 */
OO.ui.Window.prototype.initialize = function () {
	// Properties
	this.$ = this.frame.$;
	this.$head = this.$( '<div>' );
	this.$body = this.$( '<div>' );
	this.$foot = this.$( '<div>' );
	this.$overlay = this.$( '<div>' );

	// Initialization
	this.$head.addClass( 'oo-ui-window-head' );
	this.$body.addClass( 'oo-ui-window-body' );
	this.$foot.addClass( 'oo-ui-window-foot' );
	this.$overlay.addClass( 'oo-ui-window-overlay' );
	this.frame.$content
		.addClass( 'oo-ui-window-content' )
		.append( this.$head, this.$body, this.$foot, this.$overlay );

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
 * Load window.
 *
 * This is called by OO.ui.WindowManager durring window adding, and should not be called directly
 * by other systems.
 *
 * @return {jQuery.Promise} Promise resolved when window is loaded
 */
OO.ui.Window.prototype.load = function () {
	return this.frame.load();
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
		win.manager.updateWindowSize( win );
		// Force redraw by asking the browser to measure the elements' widths
		win.$element.addClass( 'oo-ui-window-setup' ).width();
		win.frame.$content.addClass( 'oo-ui-window-content-setup' ).width();
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

	this.frame.$content.focus();
	this.getReadyProcess( data ).execute().done( function () {
		// Force redraw by asking the browser to measure the elements' widths
		win.$element.addClass( 'oo-ui-window-ready' ).width();
		win.frame.$content.addClass( 'oo-ui-window-content-ready' ).width();
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
		win.frame.$content.find( ':focus' ).blur();
		// Force redraw by asking the browser to measure the elements' widths
		win.$element.removeClass( 'oo-ui-window-ready' ).width();
		win.frame.$content.removeClass( 'oo-ui-window-content-ready' ).width();
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
		win.$element.removeClass( 'oo-ui-window-setup' ).width();
		win.frame.$content.removeClass( 'oo-ui-window-content-setup' ).width();
		win.$element.hide();
		win.visible = false;
		deferred.resolve();
	} );

	return deferred.promise();
};
