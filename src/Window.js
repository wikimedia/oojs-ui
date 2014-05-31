/**
 * Container for elements in a child frame.
 *
 * There are two ways to specify a title: set the static `title` property or provide a `title`
 * property in the configuration options. The latter will override the former.
 *
 * @abstract
 * @class
 * @extends OO.ui.Element
 * @mixins OO.EventEmitter
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string|Function} [title] Title string or function that returns a string
 * @cfg {string} [icon] Symbolic name of icon
 * @fires initialize
 */
OO.ui.Window = function OoUiWindow( config ) {
	var element = this;
	// Parent constructor
	OO.ui.Window.super.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.visible = false;
	this.opening = null;
	this.closing = null;
	this.opened = null;
	this.title = OO.ui.resolveMsg( config.title || this.constructor.static.title );
	this.icon = config.icon || this.constructor.static.icon;
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
		element.initialize();
		// Undo the visibility: hidden; hack and apply display: none;
		// We can do this safely now that the iframe has initialized
		// (don't do this from within #initialize because it has to happen
		// after the all subclasses have been handled as well).
		element.$element.hide().css( 'visibility', '' );
	} );
};

/* Setup */

OO.inheritClass( OO.ui.Window, OO.ui.Element );
OO.mixinClass( OO.ui.Window, OO.EventEmitter );

/* Events */

/**
 * Open window.
 *
 * Fired after window has been opened.
 *
 * @event open
 * @param {Object} data Window opening data
 */

/**
 * Close window.
 *
 * Fired after window has been closed.
 *
 * @event close
 * @param {Object} data Window closing data
 */

/* Static Properties */

/**
 * Symbolic name of icon.
 *
 * @static
 * @inheritable
 * @property {string}
 */
OO.ui.Window.static.icon = 'window';

/**
 * Window title.
 *
 * Subclasses must implement this property before instantiating the window.
 * Alternatively, override #getTitle with an alternative implementation.
 *
 * @static
 * @abstract
 * @inheritable
 * @property {string|Function} Title string or function that returns a string
 */
OO.ui.Window.static.title = null;

/* Methods */

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
 * @return {boolean} Window is opening
 */
OO.ui.Window.prototype.isOpening = function () {
	return !!this.opening && this.opening.state() !== 'resolved';
};

/**
 * Check if window is closing.
 *
 * @return {boolean} Window is closing
 */
OO.ui.Window.prototype.isClosing = function () {
	return !!this.closing && this.closing.state() !== 'resolved';
};

/**
 * Check if window is opened.
 *
 * @return {boolean} Window is opened
 */
OO.ui.Window.prototype.isOpened = function () {
	return !!this.opened && this.opened.state() !== 'resolved';
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
 * Get the title of the window.
 *
 * @return {string} Title text
 */
OO.ui.Window.prototype.getTitle = function () {
	return this.title;
};

/**
 * Get the window icon.
 *
 * @return {string} Symbolic name of icon
 */
OO.ui.Window.prototype.getIcon = function () {
	return this.icon;
};

/**
 * Set the size of window frame.
 *
 * @param {number} [width=auto] Custom width
 * @param {number} [height=auto] Custom height
 * @chainable
 */
OO.ui.Window.prototype.setSize = function ( width, height ) {
	if ( !this.frame.$content ) {
		return;
	}

	this.frame.$element.css( {
		'width': width === undefined ? 'auto' : width,
		'height': height === undefined ? 'auto' : height
	} );

	return this;
};

/**
 * Set the title of the window.
 *
 * @param {string|Function} title Title text or a function that returns text
 * @chainable
 */
OO.ui.Window.prototype.setTitle = function ( title ) {
	this.title = OO.ui.resolveMsg( title );
	if ( this.$title ) {
		this.$title.text( title );
	}
	return this;
};

/**
 * Set the icon of the window.
 *
 * @param {string} icon Symbolic name of icon
 * @chainable
 */
OO.ui.Window.prototype.setIcon = function ( icon ) {
	if ( this.$icon ) {
		this.$icon.removeClass( 'oo-ui-icon-' + this.icon );
	}
	this.icon = icon;
	if ( this.$icon ) {
		this.$icon.addClass( 'oo-ui-icon-' + this.icon );
	}

	return this;
};

/**
 * Set the position of window to fit with contents.
 *
 * @param {string} left Left offset
 * @param {string} top Top offset
 * @chainable
 */
OO.ui.Window.prototype.setPosition = function ( left, top ) {
	this.$element.css( { 'left': left, 'top': top } );
	return this;
};

/**
 * Set the height of window to fit with contents.
 *
 * @param {number} [min=0] Min height
 * @param {number} [max] Max height (defaults to content's outer height)
 * @chainable
 */
OO.ui.Window.prototype.fitHeightToContents = function ( min, max ) {
	var height = this.frame.$content.outerHeight();

	this.frame.$element.css(
		'height', Math.max( min || 0, max === undefined ? height : Math.min( max, height ) )
	);

	return this;
};

/**
 * Set the width of window to fit with contents.
 *
 * @param {number} [min=0] Min height
 * @param {number} [max] Max height (defaults to content's outer width)
 * @chainable
 */
OO.ui.Window.prototype.fitWidthToContents = function ( min, max ) {
	var width = this.frame.$content.outerWidth();

	this.frame.$element.css(
		'width', Math.max( min || 0, max === undefined ? width : Math.min( max, width ) )
	);

	return this;
};

/**
 * Initialize window contents.
 *
 * The first time the window is opened, #initialize is called when it's safe to begin populating
 * its contents. See #setup for a way to make changes each time the window opens.
 *
 * Once this method is called, this.$$ can be used to create elements within the frame.
 *
 * @chainable
 */
OO.ui.Window.prototype.initialize = function () {
	// Properties
	this.$ = this.frame.$;
	this.$title = this.$( '<div class="oo-ui-window-title"></div>' )
		.text( this.title );
	this.$icon = this.$( '<div class="oo-ui-window-icon"></div>' )
		.addClass( 'oo-ui-icon-' + this.icon );
	this.$head = this.$( '<div class="oo-ui-window-head"></div>' );
	this.$body = this.$( '<div class="oo-ui-window-body"></div>' );
	this.$foot = this.$( '<div class="oo-ui-window-foot"></div>' );
	this.$overlay = this.$( '<div class="oo-ui-window-overlay"></div>' );

	// Initialization
	this.frame.$content.append(
		this.$head.append( this.$icon, this.$title ),
		this.$body,
		this.$foot,
		this.$overlay
	);

	return this;
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
 * Open window.
 *
 * Do not override this method. Use #getSetupProcess to do something each time the window closes.
 *
 * @param {Object} [data] Window opening data
 * @fires initialize
 * @fires opening
 * @fires open
 * @fires ready
 * @return {jQuery.Promise} Promise resolved when window is opened; when the promise is resolved the
 *   first argument will be a promise which will be resolved when the window begins closing
 */
OO.ui.Window.prototype.open = function ( data ) {
	// Return existing promise if already opening or open
	if ( this.opening ) {
		return this.opening.promise();
	}

	// Open the window
	this.opening = $.Deferred();
	this.frame.load().done( OO.ui.bind( function () {
		this.$element.show();
		this.visible = true;
		this.emit( 'opening', data );
		this.getSetupProcess( data ).execute().done( OO.ui.bind( function () {
			this.emit( 'open', data );
			setTimeout( OO.ui.bind( function () {
				// Focus the content div (which has a tabIndex) to inactivate
				// (but not clear) selections in the parent frame.
				// Must happen after 'open' is emitted (to ensure it is visible)
				// but before 'ready' is emitted (so subclasses can give focus to something
				// else)
				this.frame.$content.focus();
				this.getReadyProcess( data ).execute().done( OO.ui.bind( function () {
					this.emit( 'ready', data );
					this.opened = $.Deferred();
					this.opening.resolve( this.opened.promise() );
					// Now that we are totally done opening, it's safe to allow closing
					this.closing = null;
				}, this ) );
			}, this ) );
		}, this ) );
	}, this ) );

	return this.opening.promise();
};

/**
 * Close window.
 *
 * Do not override this method. Use #getTeardownProcess to do something each time the window closes.
 *
 * @param {Object} [data] Window closing data
 * @fires closing
 * @fires close
 * @return {jQuery.Promise} Promise resolved when window is closed
 */
OO.ui.Window.prototype.close = function ( data ) {
	// Return existing promise if already closing or closed
	if ( this.closing ) {
		return this.closing.promise();
	}

	// Close the window
	// This.closing needs to exist before we emit the closing event so that handlers can call
	// window.close() and trigger the safety check above
	this.closing = $.Deferred();
	this.frame.$content.find( ':focus' ).blur();
	this.emit( 'closing', data );
	this.getTeardownProcess( data ).execute().done( OO.ui.bind( function () {
		// To do something different with #opened, resolve/reject #opened in the teardown process
		if ( this.opened.state() === 'pending' ) {
			this.opened.resolve();
		}
		this.emit( 'close', data );
		this.$element.hide();
		this.visible = false;
		this.closing.resolve();
		// Now that we are totally done closing, it's safe to allow opening
		this.opening = null;
	}, this ) );

	return this.closing.promise();
};
