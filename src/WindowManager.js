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
 * - {@link #event-closing} is emitted with `closing` promise
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
 * @cfg {boolean} [isolate] Configure managed windows to isolate their content using inline frames
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
	this.isolate = !!config.isolate;
	this.windows = {};
	this.opening = null;
	this.opened = null;
	this.closing = null;
	this.preparingToOpen = null;
	this.preparingToClose = null;
	this.size = null;
	this.currentWindow = null;
	this.$ariaHidden = null;
	this.requestedSize = null;
	this.onWindowResizeTimeout = null;
	this.onWindowResizeHandler = this.onWindowResize.bind( this );
	this.afterWindowResizeHandler = this.afterWindowResize.bind( this );
	this.onWindowMouseWheelHandler = this.onWindowMouseWheel.bind( this );
	this.onDocumentKeyDownHandler = this.onDocumentKeyDown.bind( this );

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

/**
 * Window was resized.
 *
 * @event resize
 * @param {OO.ui.Window} win Window that was resized
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
	small: {
		width: 300
	},
	medium: {
		width: 500
	},
	large: {
		width: 700
	},
	full: {
		// These can be non-numeric because they are never used in calculations
		width: '100%',
		height: '100%'
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
OO.ui.WindowManager.prototype.onWindowMouseWheel = function ( e ) {
	// Kill all events in the parent window if the child window is isolated,
	// or if the event didn't come from the child window
	return !( this.shouldIsolate() || !$.contains( this.getCurrentWindow().$frame[0], e.target ) );
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
			// Kill all events in the parent window if the child window is isolated,
			// or if the event didn't come from the child window
			return !( this.shouldIsolate() || !$.contains( this.getCurrentWindow().$frame[0], e.target ) );
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
 * Check if window contents should be isolated.
 *
 * Window content isolation is done using inline frames.
 *
 * @return {boolean} Window contents should be isolated
 */
OO.ui.WindowManager.prototype.shouldIsolate = function () {
	return this.isolate;
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
 * @return {jQuery.Promise} Promise resolved with matching window, or rejected with an OO.ui.Error
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
				win = this.factory.create( name, this, { $: this.$ } );
				this.addWindows( [ win ] );
				deferred.resolve( win );
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
	} else if ( this.preparingToOpen || this.opening || this.opened ) {
		opening.reject( new OO.ui.Error(
			'Cannot open window: another window is opening or open'
		) );
	}

	// Window opening
	if ( opening.state() !== 'rejected' ) {
		if ( !win.getManager() ) {
			win.setManager( this );
		}
		preparing.push( win.load() );

		if ( this.closing ) {
			// If a window is currently closing, wait for it to complete
			preparing.push( this.closing );
		}

		this.preparingToOpen = $.when.apply( $, preparing );
		// Ensure handlers get called after preparingToOpen is set
		this.preparingToOpen.done( function () {
			if ( manager.modal ) {
				manager.toggleGlobalEvents( true );
				manager.toggleAriaIsolation( true );
			}
			manager.currentWindow = win;
			manager.opening = opening;
			manager.preparingToOpen = null;
			manager.emit( 'opening', win, opening, data );
			setTimeout( function () {
				win.setup( data ).then( function () {
					manager.updateWindowSize( win );
					manager.opening.notify( { state: 'setup' } );
					setTimeout( function () {
						win.ready( data ).then( function () {
							manager.opening.notify( { state: 'ready' } );
							manager.opening = null;
							manager.opened = $.Deferred();
							opening.resolve( manager.opened.promise(), data );
						} );
					}, manager.getReadyDelay() );
				} );
			}, manager.getSetupDelay() );
		} );
	}

	return opening.promise();
};

/**
 * Close a window.
 *
 * @param {OO.ui.Window|string} win Window object or symbolic name of window to close
 * @param {Object} [data] Window closing data
 * @return {jQuery.Promise} Promise resolved when window is done closing; see {@link #event-closing}
 *   for more details about the `closing` promise
 * @throws {Error} If no window by that name is being managed
 * @fires closing
 */
OO.ui.WindowManager.prototype.closeWindow = function ( win, data ) {
	var manager = this,
		preparing = [],
		closing = $.Deferred(),
		opened;

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
	} else if ( this.preparingToClose || this.closing ) {
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

		this.preparingToClose = $.when.apply( $, preparing );
		// Ensure handlers get called after preparingToClose is set
		this.preparingToClose.done( function () {
			manager.closing = closing;
			manager.preparingToClose = null;
			manager.emit( 'closing', win, closing, data );
			opened = manager.opened;
			manager.opened = null;
			opened.resolve( closing.promise(), data );
			setTimeout( function () {
				win.hold( data ).then( function () {
					closing.notify( { state: 'hold' } );
					setTimeout( function () {
						win.teardown( data ).then( function () {
							closing.notify( { state: 'teardown' } );
							if ( manager.modal ) {
								manager.toggleGlobalEvents( false );
								manager.toggleAriaIsolation( false );
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

	return closing.promise();
};

/**
 * Add windows.
 *
 * @param {Object.<string,OO.ui.Window>|OO.ui.Window[]} windows Windows to add
 * @throws {Error} If one of the windows being added without an explicit symbolic name does not have
 *   a statically configured symbolic name
 */
OO.ui.WindowManager.prototype.addWindows = function ( windows ) {
	var i, len, win, name, list;

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
	}
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
	var i, len, win, name, cleanupWindow,
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
		cleanupWindow = cleanup.bind( null, name, win );
		promises.push( this.closeWindow( name ).then( cleanupWindow, cleanupWindow ) );
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

	this.emit( 'resize', win );

	return this;
};

/**
 * Bind or unbind global events for scrolling.
 *
 * @param {boolean} [on] Bind global events
 * @chainable
 */
OO.ui.WindowManager.prototype.toggleGlobalEvents = function ( on ) {
	on = on === undefined ? !!this.globalEvents : !!on;

	if ( on ) {
		if ( !this.globalEvents ) {
			this.$( this.getElementDocument() ).on( {
				// Prevent scrolling by keys in top-level window
				keydown: this.onDocumentKeyDownHandler
			} );
			this.$( this.getElementWindow() ).on( {
				// Prevent scrolling by wheel in top-level window
				mousewheel: this.onWindowMouseWheelHandler,
				// Start listening for top-level window dimension changes
				'orientationchange resize': this.onWindowResizeHandler
			} );
			this.globalEvents = true;
		}
	} else if ( this.globalEvents ) {
		// Unbind global events
		this.$( this.getElementDocument() ).off( {
			// Allow scrolling by keys in top-level window
			keydown: this.onDocumentKeyDownHandler
		} );
		this.$( this.getElementWindow() ).off( {
			// Allow scrolling by wheel in top-level window
			mousewheel: this.onWindowMouseWheelHandler,
			// Stop listening for top-level window dimension changes
			'orientationchange resize': this.onWindowResizeHandler
		} );
		this.globalEvents = false;
	}

	return this;
};

/**
 * Toggle screen reader visibility of content other than the window manager.
 *
 * @param {boolean} [isolate] Make only the window manager visible to screen readers
 * @chainable
 */
OO.ui.WindowManager.prototype.toggleAriaIsolation = function ( isolate ) {
	isolate = isolate === undefined ? !this.$ariaHidden : !!isolate;

	if ( isolate ) {
		if ( !this.$ariaHidden ) {
			// Hide everything other than the window manager from screen readers
			this.$ariaHidden = $( 'body' )
				.children()
				.not( this.$element.parentsUntil( 'body' ).last() )
				.attr( 'aria-hidden', '' );
		}
	} else if ( this.$ariaHidden ) {
		// Restore screen reader visibility
		this.$ariaHidden.removeAttr( 'aria-hidden' );
		this.$ariaHidden = null;
	}

	return this;
};

/**
 * Destroy window manager.
 *
 * Windows will not be closed, only removed from the DOM.
 */
OO.ui.WindowManager.prototype.destroy = function () {
	this.toggleGlobalEvents( false );
	this.toggleAriaIsolation( false );
	this.$element.remove();
};
