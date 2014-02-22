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
	OO.ui.Element.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.factory = factory;

	/**
	 * List of all windows associated with this window set
	 * @property {OO.ui.Window[]}
	 */
	this.windowList = [];

	/**
	 * Mapping of OO.ui.Window objects created by name from the #factory.
	 * @property {Object}
	 */
	this.windows = {};
	this.currentWindow = null;

	// Initialization
	this.$element.addClass( 'oo-ui-windowSet' );
};

/* Inheritance */

OO.inheritClass( OO.ui.WindowSet, OO.ui.Element );

OO.mixinClass( OO.ui.WindowSet, OO.EventEmitter );

/* Events */

/**
 * @event opening
 * @param {OO.ui.Window} win Window that's being opened
 * @param {Object} config Window opening information
 */

/**
 * @event open
 * @param {OO.ui.Window} win Window that's been opened
 * @param {Object} config Window opening information
 */

/**
 * @event closing
 * @param {OO.ui.Window} win Window that's being closed
 * @param {Object} config Window closing information
 */

/**
 * @event close
 * @param {OO.ui.Window} win Window that's been closed
 * @param {Object} config Window closing information
 */

/* Methods */

/**
 * Handle a window that's being opened.
 *
 * @method
 * @param {OO.ui.Window} win Window that's being opened
 * @param {Object} [config] Window opening information
 * @fires opening
 */
OO.ui.WindowSet.prototype.onWindowOpening = function ( win, config ) {
	if ( this.currentWindow && this.currentWindow !== win ) {
		this.currentWindow.close();
	}
	this.currentWindow = win;
	this.emit( 'opening', win, config );
};

/**
 * Handle a window that's been opened.
 *
 * @method
 * @param {OO.ui.Window} win Window that's been opened
 * @param {Object} [config] Window opening information
 * @fires open
 */
OO.ui.WindowSet.prototype.onWindowOpen = function ( win, config ) {
	this.emit( 'open', win, config );
};

/**
 * Handle a window that's being closed.
 *
 * @method
 * @param {OO.ui.Window} win Window that's being closed
 * @param {Object} [config] Window closing information
 * @fires closing
 */
OO.ui.WindowSet.prototype.onWindowClosing = function ( win, config ) {
	this.currentWindow = null;
	this.emit( 'closing', win, config );
};

/**
 * Handle a window that's been closed.
 *
 * @method
 * @param {OO.ui.Window} win Window that's been closed
 * @param {Object} [config] Window closing information
 * @fires close
 */
OO.ui.WindowSet.prototype.onWindowClose = function ( win, config ) {
	this.emit( 'close', win, config );
};

/**
 * Get the current window.
 *
 * @method
 * @returns {OO.ui.Window} Current window
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
		win = this.windows[name] = this.factory.create( name, this, { '$': this.$ } );
		this.addWindow( win );
	}
	return this.windows[name];
};

/**
 * Add a given window to this window set.
 *
 * Connects event handlers and attaches it to the DOM. Calling
 * OO.ui.Window#open will not work until the window is added to the set.
 *
 * @param {OO.ui.Window} win
 */
OO.ui.WindowSet.prototype.addWindow = function ( win ) {
	if ( this.windowList.indexOf( win ) !== -1 ) {
		// Already set up
		return;
	}
	this.windowList.push( win );

	win.connect( this, {
		'opening': [ 'onWindowOpening', win ],
		'open': [ 'onWindowOpen', win ],
		'closing': [ 'onWindowClosing', win ],
		'close': [ 'onWindowClose', win ]
	} );
	this.$element.append( win.$element );
};
