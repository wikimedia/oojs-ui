/**
 * Collection of windows.
 *
 * @class
 * @extends OO.ui.Element
 * @mixins OO.EventEmitter
 *
 * Managed windows are mutually exclusive. If a window is opened while there is a current window
 * already opening or opened, the current window will be closed without data. Empty closing data
 * should always result in the window being closed without causing constructive or destructive
 * action.
 *
 * As a window is opened and closed, it passes through several stages and the manager emits several
 * corresponding events.
 *
 * - {@link #openWindow} or {@link OO.ui.Window#open} methods are used to start opening
 * - {@link #event-opening} is emitted with `opening` promise
 * - {@link #getSetupDelay} is called the returned value is used to time a pause in execution
 * - {@link OO.ui.Window#getSetupProcess} method is called on the window and its result executed
 * - `setup` progress notification is emitted from opening promise
 * - {@link #getReadyDelay} is called the returned value is used to time a pause in execution
 * - {@link OO.ui.Window#getReadyProcess} method is called on the window and its result executed
 * - `ready` progress notification is emitted from opening promise
 * - `opening` promise is resolved with `opened` promise
 * - Window is now open
 *
 * - {@link #closeWindow} or {@link OO.ui.Window#close} methods are used to start closing
 * - `opened` promise is resolved with `closing` promise
 * - {@link #event-opening} is emitted with `closing` promise
 * - {@link #getHoldDelay} is called the returned value is used to time a pause in execution
 * - {@link OO.ui.Window#getHoldProcess} method is called on the window and its result executed
 * - `hold` progress notification is emitted from opening promise
 * - {@link #getTeardownDelay} is called the returned value is used to time a pause in execution
 * - {@link OO.ui.Window#getTeardownProcess} method is called on the window and its result executed
 * - `teardown` progress notification is emitted from opening promise
 * - Closing promise is resolved
 * - Window is now closed
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {OO.Factory} [factory] Window factory to use for automatic instantiation
 * @cfg {boolean} [modal=true] Prevent interaction outside the dialog
 */
OO.ui.WindowManager = function OoUiWindowManager( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.WindowManager.super.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.factory = config.factory;
	this.modal = config.modal === undefined || !!config.modal;
	this.windows = {};
	this.opening = null;
	this.opened = null;
	this.closing = null;
	this.size = null;
	this.currentWindow = null;
	this.$ariaHidden = null;
	this.requestedSize = null;
	this.onWindowResizeTimeout = null;
	this.onWindowResizeHandler = OO.ui.bind( this.onWindowResize, this );
	this.afterWindowResizeHandler = OO.ui.bind( this.afterWindowResize, this );
	this.onWindowMouseWheelHandler = OO.ui.bind( this.onWindowMouseWheel, this );
	this.onDocumentKeyDownHandler = OO.ui.bind( this.onDocumentKeyDown, this );

	// Events
	this.$element.on( 'mousedown', false );

	// Initialization
	this.$element
		.addClass( 'oo-ui-windowManager' )
		.toggleClass( 'oo-ui-windowManager-modal', this.modal );
};

/* Setup */

OO.inheritClass( OO.ui.WindowManager, OO.ui.Element );
OO.mixinClass( OO.ui.WindowManager, OO.EventEmitter );

/* Events */

/**
 * Window is opening.
 *
 * Fired when the window begins to be opened.
 *
 * @event opening
 * @param {OO.ui.Window} win Window that's being opened
 * @param {jQuery.Promise} opening Promise resolved when window is opened; when the promise is
 *   resolved the first argument will be a promise which will be resolved when the window begins
 *   closing, the second argument will be the opening data; progress notifications will be fired on
 *   the promise for `setup` and `ready` when those processes are completed respectively.
 * @param {Object} data Window opening data
 */

/**
 * Window is closing.
 *
 * Fired when the window begins to be closed.
 *
 * @event closing
 * @param {OO.ui.Window} win Window that's being closed
 * @param {jQuery.Promise} opening Promise resolved when window is closed; when the promise
 *   is resolved the first argument will be a the closing data; progress notifications will be fired
 *   on the promise for `hold` and `teardown` when those processes are completed respectively.
 * @param {Object} data Window closing data
 */

/* Static Properties */

/**
 * Map of symbolic size names and CSS properties.
 *
 * @static
 * @inheritable
 * @property {Object}
 */
OO.ui.WindowManager.static.sizes = {
	'small': {
		'width': 300
	},
	'medium': {
		'width': 500
	},
	'large': {
		'width': 700
	},
	'full': {
		// These can be non-numeric because they are never used in calculations
		'width': '100%',
		'height': '100%'
	}
};

/**
 * Symbolic name of default size.
 *
 * Default size is used if the window's requested size is not recognized.
 *
 * @static
 * @inheritable
 * @property {string}
 */
OO.ui.WindowManager.static.defaultSize = 'medium';

/* Methods */

/**
 * Handle window resize events.
 *
 * @param {jQuery.Event} e Window resize event
 */
OO.ui.WindowManager.prototype.onWindowResize = function () {
	clearTimeout( this.onWindowResizeTimeout );
	this.onWindowResizeTimeout = setTimeout( this.afterWindowResizeHandler, 200 );
};

/**
 * Handle window resize events.
 *
 * @param {jQuery.Event} e Window resize event
 */
OO.ui.WindowManager.prototype.afterWindowResize = function () {
	if ( this.currentWindow ) {
		this.updateWindowSize( this.currentWindow );
	}
};

/**
 * Handle window mouse wheel events.
 *
 * @param {jQuery.Event} e Mouse wheel event
 */
OO.ui.WindowManager.prototype.onWindowMouseWheel = function () {
	return false;
};

/**
 * Handle document key down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.WindowManager.prototype.onDocumentKeyDown = function ( e ) {
	switch ( e.which ) {
		case OO.ui.Keys.PAGEUP:
		case OO.ui.Keys.PAGEDOWN:
		case OO.ui.Keys.END:
		case OO.ui.Keys.HOME:
		case OO.ui.Keys.LEFT:
		case OO.ui.Keys.UP:
		case OO.ui.Keys.RIGHT:
		case OO.ui.Keys.DOWN:
			// Prevent any key events that might cause scrolling
			return false;
	}
};

/**
 * Check if window is opening.
 *
 * @return {boolean} Window is opening
 */
OO.ui.WindowManager.prototype.isOpening = function ( win ) {
	return win === this.currentWindow && !!this.opening && this.opening.state() === 'pending';
};

/**
 * Check if window is closing.
 *
 * @return {boolean} Window is closing
 */
OO.ui.WindowManager.prototype.isClosing = function ( win ) {
	return win === this.currentWindow && !!this.closing && this.closing.state() === 'pending';
};

/**
 * Check if window is opened.
 *
 * @return {boolean} Window is opened
 */
OO.ui.WindowManager.prototype.isOpened = function ( win ) {
	return win === this.currentWindow && !!this.opened && this.opened.state() === 'pending';
};

/**
 * Check if a window is being managed.
 *
 * @param {OO.ui.Window} win Window to check
 * @return {boolean} Window is being managed
 */
OO.ui.WindowManager.prototype.hasWindow = function ( win ) {
	var name;

	for ( name in this.windows ) {
		if ( this.windows[name] === win ) {
			return true;
		}
	}

	return false;
};

/**
 * Get the number of milliseconds to wait between beginning opening and executing setup process.
 *
 * @param {OO.ui.Window} win Window being opened
 * @param {Object} [data] Window opening data
 * @return {number} Milliseconds to wait
 */
OO.ui.WindowManager.prototype.getSetupDelay = function () {
	return 0;
};

/**
 * Get the number of milliseconds to wait between finishing setup and executing ready process.
 *
 * @param {OO.ui.Window} win Window being opened
 * @param {Object} [data] Window opening data
 * @return {number} Milliseconds to wait
 */
OO.ui.WindowManager.prototype.getReadyDelay = function () {
	return 0;
};

/**
 * Get the number of milliseconds to wait between beginning closing and executing hold process.
 *
 * @param {OO.ui.Window} win Window being closed
 * @param {Object} [data] Window closing data
 * @return {number} Milliseconds to wait
 */
OO.ui.WindowManager.prototype.getHoldDelay = function () {
	return 0;
};

/**
 * Get the number of milliseconds to wait between finishing hold and executing teardown process.
 *
 * @param {OO.ui.Window} win Window being closed
 * @param {Object} [data] Window closing data
 * @return {number} Milliseconds to wait
 */
OO.ui.WindowManager.prototype.getTeardownDelay = function () {
	return this.modal ? 250 : 0;
};

/**
 * Get managed window by symbolic name.
 *
 * If window is not yet instantiated, it will be instantiated and added automatically.
 *
 * @param {string} name Symbolic window name
 * @return {jQuery.Promise} Promise resolved when window is ready to be accessed; when resolved the
 *   first argument is an OO.ui.Window; when rejected the first argument is an OO.ui.Error
 * @throws {Error} If the symbolic name is unrecognized by the factory
 * @throws {Error} If the symbolic name unrecognized as a managed window
 */
OO.ui.WindowManager.prototype.getWindow = function ( name ) {
	var deferred = $.Deferred(),
		win = this.windows[name];

	if ( !( win instanceof OO.ui.Window ) ) {
		if ( this.factory ) {
			if ( !this.factory.lookup( name ) ) {
				deferred.reject( new OO.ui.Error(
					'Cannot auto-instantiate window: symbolic name is unrecognized by the factory'
				) );
			} else {
				win = this.factory.create( name, this, { '$': this.$ } );
				this.addWindows( [ win ] ).then(
					OO.ui.bind( deferred.resolve, deferred, win ),
					deferred.reject
				);
			}
		} else {
			deferred.reject( new OO.ui.Error(
				'Cannot get unmanaged window: symbolic name unrecognized as a managed window'
			) );
		}
	} else {
		deferred.resolve( win );
	}

	return deferred.promise();
};

/**
 * Get current window.
 *
 * @return {OO.ui.Window|null} Currently opening/opened/closing window
 */
OO.ui.WindowManager.prototype.getCurrentWindow = function () {
	return this.currentWindow;
};

/**
 * Open a window.
 *
 * @param {OO.ui.Window|string} win Window object or symbolic name of window to open
 * @param {Object} [data] Window opening data
 * @return {jQuery.Promise} Promise resolved when window is done opening; see {@link #event-opening}
 *   for more details about the `opening` promise
 * @fires opening
 */
OO.ui.WindowManager.prototype.openWindow = function ( win, data ) {
	var manager = this,
		preparing = [],
		opening = $.Deferred();

	// Argument handling
	if ( typeof win === 'string' ) {
		return this.getWindow( win ).then( function ( win ) {
			return manager.openWindow( win, data );
		} );
	}

	// Error handling
	if ( !this.hasWindow( win ) ) {
		opening.reject( new OO.ui.Error(
			'Cannot open window: window is not attached to manager'
		) );
	}

	// Window opening
	if ( opening.state() !== 'rejected' ) {
		// Begin loading the window if it's not loaded already - may take noticable time and we want
		// too do this in paralell with any preparatory actions
		preparing.push( win.load() );

		if ( this.opening || this.opened ) {
			// If a window is currently opening or opened, close it first
			preparing.push( this.closeWindow( this.currentWindow ) );
		} else if ( this.closing ) {
			// If a window is currently closing, wait for it to complete
			preparing.push( this.closing );
		}

		$.when.apply( $, preparing ).done( function () {
			if ( manager.modal ) {
				manager.$( manager.getElementDocument() ).on( {
					// Prevent scrolling by keys in top-level window
					'keydown': manager.onDocumentKeyDownHandler
				} );
				manager.$( manager.getElementWindow() ).on( {
					// Prevent scrolling by wheel in top-level window
					'mousewheel': manager.onWindowMouseWheelHandler,
					// Start listening for top-level window dimension changes
					'orientationchange resize': manager.onWindowResizeHandler
				} );
				// Hide other content from screen readers
				manager.$ariaHidden = $( 'body' )
					.children()
					.not( manager.$element.parentsUntil( 'body' ).last() )
					.attr( 'aria-hidden', '' );
			}
			manager.currentWindow = win;
			manager.opening = opening;
			manager.emit( 'opening', win, opening, data );
			manager.updateWindowSize( win );
			setTimeout( function () {
				win.setup( data ).then( function () {
					manager.opening.notify( { 'state': 'setup' } );
					setTimeout( function () {
						win.ready( data ).then( function () {
							manager.opening.notify( { 'state': 'ready' } );
							manager.opening = null;
							manager.opened = $.Deferred();
							opening.resolve( manager.opened.promise(), data );
						} );
					}, manager.getReadyDelay() );
				} );
			}, manager.getSetupDelay() );
		} );
	}

	return opening;
};

/**
 * Close a window.
 *
 * @param {OO.ui.Window|string} win Window object or symbolic name of window to close
 * @param {Object} [data] Window closing data
 * @return {jQuery.Promise} Promise resolved when window is done opening; see {@link #event-closing}
 *   for more details about the `closing` promise
 * @throws {Error} If no window by that name is being managed
 * @fires closing
 */
OO.ui.WindowManager.prototype.closeWindow = function ( win, data ) {
	var manager = this,
		preparing = [],
		closing = $.Deferred(),
		opened = this.opened;

	// Argument handling
	if ( typeof win === 'string' ) {
		win = this.windows[win];
	} else if ( !this.hasWindow( win ) ) {
		win = null;
	}

	// Error handling
	if ( !win ) {
		closing.reject( new OO.ui.Error(
			'Cannot close window: window is not attached to manager'
		) );
	} else if ( win !== this.currentWindow ) {
		closing.reject( new OO.ui.Error(
			'Cannot close window: window already closed with different data'
		) );
	} else if ( this.closing ) {
		closing.reject( new OO.ui.Error(
			'Cannot close window: window already closing with different data'
		) );
	}

	// Window closing
	if ( closing.state() !== 'rejected' ) {
		if ( this.opening ) {
			// If the window is currently opening, close it when it's done
			preparing.push( this.opening );
		}

		// Close the window
		$.when.apply( $, preparing ).done( function () {
			manager.closing = closing;
			manager.emit( 'closing', win, closing, data );
			manager.opened = null;
			opened.resolve( closing.promise(), data );
			setTimeout( function () {
				win.hold( data ).then( function () {
					closing.notify( { 'state': 'hold' } );
					setTimeout( function () {
						win.teardown( data ).then( function () {
							closing.notify( { 'state': 'teardown' } );
							if ( manager.modal ) {
								manager.$( manager.getElementDocument() ).off( {
									// Allow scrolling by keys in top-level window
									'keydown': manager.onDocumentKeyDownHandler
								} );
								manager.$( manager.getElementWindow() ).off( {
									// Allow scrolling by wheel in top-level window
									'mousewheel': manager.onWindowMouseWheelHandler,
									// Stop listening for top-level window dimension changes
									'orientationchange resize': manager.onWindowResizeHandler
								} );
							}
							// Restore screen reader visiblity
							if ( manager.$ariaHidden ) {
								manager.$ariaHidden.removeAttr( 'aria-hidden' );
								manager.$ariaHidden = null;
							}
							manager.closing = null;
							manager.currentWindow = null;
							closing.resolve( data );
						} );
					}, manager.getTeardownDelay() );
				} );
			}, manager.getHoldDelay() );
		} );
	}

	return closing;
};

/**
 * Add windows.
 *
 * If the window manager is attached to the DOM then windows will be automatically loaded as they
 * are added.
 *
 * @param {Object.<string,OO.ui.Window>|OO.ui.Window[]} windows Windows to add
 * @return {jQuery.Promise} Promise resolved when all windows are added
 * @throws {Error} If one of the windows being added without an explicit symbolic name does not have
 *   a statically configured symbolic name
 */
OO.ui.WindowManager.prototype.addWindows = function ( windows ) {
	var i, len, win, name, list,
		promises = [];

	if ( $.isArray( windows ) ) {
		// Convert to map of windows by looking up symbolic names from static configuration
		list = {};
		for ( i = 0, len = windows.length; i < len; i++ ) {
			name = windows[i].constructor.static.name;
			if ( typeof name !== 'string' ) {
				throw new Error( 'Cannot add window' );
			}
			list[name] = windows[i];
		}
	} else if ( $.isPlainObject( windows ) ) {
		list = windows;
	}

	// Add windows
	for ( name in list ) {
		win = list[name];
		this.windows[name] = win;
		this.$element.append( win.$element );

		if ( this.isElementAttached() ) {
			promises.push( win.load() );
		}
	}

	return $.when.apply( $, promises );
};

/**
 * Remove windows.
 *
 * Windows will be closed before they are removed.
 *
 * @param {string} name Symbolic name of window to remove
 * @return {jQuery.Promise} Promise resolved when window is closed and removed
 * @throws {Error} If windows being removed are not being managed
 */
OO.ui.WindowManager.prototype.removeWindows = function ( names ) {
	var i, len, win, name,
		manager = this,
		promises = [],
		cleanup = function ( name, win ) {
			delete manager.windows[name];
			win.$element.detach();
		};

	for ( i = 0, len = names.length; i < len; i++ ) {
		name = names[i];
		win = this.windows[name];
		if ( !win ) {
			throw new Error( 'Cannot remove window' );
		}
		promises.push( this.closeWindow( name ).then( OO.ui.bind( cleanup, null, name, win ) ) );
	}

	return $.when.apply( $, promises );
};

/**
 * Remove all windows.
 *
 * Windows will be closed before they are removed.
 *
 * @return {jQuery.Promise} Promise resolved when all windows are closed and removed
 */
OO.ui.WindowManager.prototype.clearWindows = function () {
	return this.removeWindows( Object.keys( this.windows ) );
};

/**
 * Set dialog size.
 *
 * Fullscreen mode will be used if the dialog is too wide to fit in the screen.
 *
 * @chainable
 */
OO.ui.WindowManager.prototype.updateWindowSize = function ( win ) {
	// Bypass for non-current, and thus invisible, windows
	if ( win !== this.currentWindow ) {
		return;
	}

	var viewport = OO.ui.Element.getDimensions( win.getElementWindow() ),
		sizes = this.constructor.static.sizes,
		size = win.getSize();

	if ( !sizes[size] ) {
		size = this.constructor.static.defaultSize;
	}
	if ( size !== 'full' && viewport.rect.right - viewport.rect.left < sizes[size].width ) {
		size = 'full';
	}

	this.$element.toggleClass( 'oo-ui-windowManager-fullscreen', size === 'full' );
	this.$element.toggleClass( 'oo-ui-windowManager-floating', size !== 'full' );
	win.setDimensions( sizes[size] );

	return this;
};
