/**
 * Set of mutually exclusive windows.
 *
 * @class
 * @extends OO.ui.Element
 * @mixins OO.EventEmitter
 *
 * @constructor
 * @param {OO.Factory} factory Window factory
 * @param {Object} [config] Configuration options
 */
OO.ui.WindowSet = function OoUiWindowSet( factory, config ) {
	// Parent constructor
	OO.ui.WindowSet.super.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.factory = factory;

	/**
	 * List of all windows associated with this window set.
	 *
	 * @property {OO.ui.Window[]}
	 */
	this.windowList = [];

	/**
	 * Mapping of OO.ui.Window objects created by name from the #factory.
	 *
	 * @property {Object}
	 */
	this.windows = {};
	this.currentWindow = null;

	// Initialization
	this.$element.addClass( 'oo-ui-windowSet' );
};

/* Setup */

OO.inheritClass( OO.ui.WindowSet, OO.ui.Element );
OO.mixinClass( OO.ui.WindowSet, OO.EventEmitter );

/* Events */

/**
 * @event setup
 * @param {OO.ui.Window} win Window that's been setup
 * @param {Object} config Window opening information
 */

/**
 * @event ready
 * @param {OO.ui.Window} win Window that's ready
 * @param {Object} config Window opening information
 */

/**
 * @event teardown
 * @param {OO.ui.Window} win Window that's been torn down
 * @param {Object} config Window closing information
 */

/* Methods */

/**
 * Handle a window setup event.
 *
 * @param {OO.ui.Window} win Window that's been setup
 * @param {Object} [config] Window opening information
 * @fires setup
 */
OO.ui.WindowSet.prototype.onWindowSetup = function ( win, config ) {
	if ( this.currentWindow && this.currentWindow !== win ) {
		this.currentWindow.close();
	}
	this.currentWindow = win;
	this.emit( 'setup', win, config );
};

/**
 * Handle a window ready event.
 *
 * @param {OO.ui.Window} win Window that's ready
 * @param {Object} [config] Window opening information
 * @fires ready
 */
OO.ui.WindowSet.prototype.onWindowReady = function ( win, config ) {
	this.emit( 'ready', win, config );
};

/**
 * Handle a window teardown event.
 *
 * @param {OO.ui.Window} win Window that's been torn down
 * @param {Object} [config] Window closing information
 * @fires teardown
 */
OO.ui.WindowSet.prototype.onWindowTeardown = function ( win, config ) {
	this.currentWindow = null;
	this.emit( 'teardown', win, config );
};

/**
 * Get the current window.
 *
 * @return {OO.ui.Window|null} Current window or null if none open
 */
OO.ui.WindowSet.prototype.getCurrentWindow = function () {
	return this.currentWindow;
};

/**
 * Return a given window.
 *
 * @param {string} name Symbolic name of window
 * @return {OO.ui.Window} Window with specified name
 */
OO.ui.WindowSet.prototype.getWindow = function ( name ) {
	var win;

	if ( !this.factory.lookup( name ) ) {
		throw new Error( 'Unknown window: ' + name );
	}
	if ( !( name in this.windows ) ) {
		win = this.windows[name] = this.createWindow( name );
		this.addWindow( win );
	}
	return this.windows[name];
};

/**
 * Create a window for use in this window set.
 *
 * @param {string} name Symbolic name of window
 * @return {OO.ui.Window} Window with specified name
 */
OO.ui.WindowSet.prototype.createWindow = function ( name ) {
	return this.factory.create( name, { '$': this.$ } );
};

/**
 * Add a given window to this window set.
 *
 * Connects event handlers and attaches it to the DOM. Calling
 * OO.ui.Window#open will not work until the window is added to the set.
 *
 * @param {OO.ui.Window} win Window to add
 */
OO.ui.WindowSet.prototype.addWindow = function ( win ) {
	if ( this.windowList.indexOf( win ) !== -1 ) {
		// Already set up
		return;
	}
	this.windowList.push( win );

	win.connect( this, {
		'setup': [ 'onWindowSetup', win ],
		'ready': [ 'onWindowReady', win ],
		'teardown': [ 'onWindowTeardown', win ]
	} );
	this.$element.append( win.$element );
};
