/**
 * A window is a container for elements that are in a child frame. They are used with
 * a window manager (OO.ui.WindowManager), which is used to open and close the window and control
 * its presentation. The size of a window is specified using a symbolic name (e.g., ‘small’,
 * ‘medium’, ‘large’), which is interpreted by the window manager. If the requested size is not
 * recognized, the window manager will choose a sensible fallback.
 *
 * The lifecycle of a window has three primary stages (opening, opened, and closing) in which
 * different processes are executed:
 *
 * **opening**: The opening stage begins when the window manager's
 * {@link OO.ui.WindowManager#openWindow openWindow} or the window's {@link OO.ui.Window#open open} methods are
 * used, and the window manager begins to open the window.
 *
 * - {@link OO.ui.Window#getSetupProcess getSetupProcess} method is called and its result executed
 * - {@link OO.ui.Window#getReadyProcess getReadyProcess} method is called and its result executed
 *
 * **opened**: The window is now open
 *
 * **closing**: The closing stage begins when the window manager's
 * {@link OO.ui.WindowManager#closeWindow closeWindow}
 * or the window's {@link OO.ui.Window#close close} methods are used, and the window manager begins to close the
 * window.
 *
 * - {@link OO.ui.Window#getHoldProcess getHoldProcess} method is called and its result executed
 * - {@link OO.ui.Window#getTeardownProcess getTeardownProcess} method is called and its result executed. The window is now closed
 *
 * Each of the window's processes (setup, ready, hold, and teardown) can be extended in subclasses
 * by overriding the window's #getSetupProcess, #getReadyProcess, #getHoldProcess and
 * #getTeardownProcess methods. Note that each {@link OO.ui.Process process} is executed in series,
 * so asynchronous processing can complete. Always assume window processes are executed
 * asynchronously.
 *
 * For more information, please see the [OOUI documentation on MediaWiki][1].
 *
 * [1]: https://www.mediawiki.org/wiki/OOUI/Windows
 *
 * @abstract
 * @class
 * @extends OO.ui.Element
 * @mixes OO.EventEmitter
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {string} [config.size] Symbolic name of the dialog size: `small`, `medium`, `large`, `larger` or
 *  `full`.  If omitted, the value of the {@link OO.ui.Window.static.size static size} property will be used.
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
	this.size = config.size || this.constructor.static.size;
	this.$frame = $( '<div>' );
	/**
	 * Overlay element to use for the `$overlay` configuration option of widgets that support it.
	 * Things put inside it are overlaid on top of the window and are not bound to its dimensions.
	 * See <https://www.mediawiki.org/wiki/OOUI/Concepts#Overlays>.
	 *
	 *     MyDialog.prototype.initialize = function () {
	 *       ...
	 *       const popupButton = new OO.ui.PopupButtonWidget( {
	 *         $overlay: this.$overlay,
	 *         label: 'Popup button',
	 *         popup: {
	 *           $content: $( '<p>Popup content.</p><p>More content.</p><p>Yet more content.</p>' ),
	 *           padded: true
	 *         }
	 *       } );
	 *       ...
	 *     };
	 *
	 * @property {jQuery}
	 */
	this.$overlay = $( '<div>' );
	this.$content = $( '<div>' );
	/**
	 * Set focus traps
	 *
	 * It is considered best practice to trap focus in a loop within a modal dialog, even
	 * though with 'inert' support we could allow focus to break out to the browser chrome.
	 *
	 * - https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html#kbd_label
	 * - https://allyjs.io/tutorials/accessible-dialog.html#reacting-to-kbdtabkbd-and-kbdshift-tabkbd
	 * - https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role#focus_management
	 */
	this.$focusTrapBefore = $( '<div>' ).addClass( 'oo-ui-window-focusTrap' ).prop( 'tabIndex', 0 );
	this.$focusTrapAfter = this.$focusTrapBefore.clone();
	this.$focusTraps = this.$focusTrapBefore.add( this.$focusTrapAfter );

	// Initialization
	this.$overlay.addClass( 'oo-ui-window-overlay' );
	this.$content
		.addClass( 'oo-ui-window-content' )
		.attr( 'tabindex', -1 );
	this.$frame
		.addClass( 'oo-ui-window-frame' )
		.append( this.$focusTrapBefore, this.$content, this.$focusTrapAfter );
	this.$element
		.addClass( 'oo-ui-window' )
		.append( this.$frame, this.$overlay );

	// Initially hidden - using #toggle may cause errors if subclasses override toggle with methods
	// that reference properties not initialized at that time of parent class construction
	// TODO: Find a better way to handle post-constructor setup
	this.visible = false;
	this.$element.addClass( 'oo-ui-element-hidden' );
};

/* Setup */

OO.inheritClass( OO.ui.Window, OO.ui.Element );
OO.mixinClass( OO.ui.Window, OO.EventEmitter );

/* Static Properties */

/**
 * Symbolic name of the window size: `small`, `medium`, `large`, `larger` or `full`.
 *
 * The static size is used if no #size is configured during construction.
 *
 * @static
 * @property {string}
 */
OO.ui.Window.static.size = 'medium';

/* Methods */

/**
 * Handle mouse down events.
 *
 * @private
 * @param {jQuery.Event} e Mouse down event
 * @return {OO.ui.Window} The window, for chaining
 */
OO.ui.Window.prototype.onMouseDown = function ( e ) {
	// Prevent clicking on the click-block from stealing focus
	if ( e.target === this.$element[ 0 ] ) {
		return false;
	}
};

/**
 * Check if the window has been initialized.
 *
 * Initialization occurs when a window is added to a manager.
 *
 * @return {boolean} Window has been initialized
 */
OO.ui.Window.prototype.isInitialized = function () {
	return !!this.manager;
};

/**
 * Check if the window is visible.
 *
 * @return {boolean} Window is visible
 */
OO.ui.Window.prototype.isVisible = function () {
	return this.visible;
};

/**
 * Check if the window is opening.
 *
 * This method is a wrapper around the window manager's
 * {@link OO.ui.WindowManager#isOpening isOpening} method.
 *
 * @return {boolean} Window is opening
 */
OO.ui.Window.prototype.isOpening = function () {
	return this.manager.isOpening( this );
};

/**
 * Check if the window is closing.
 *
 * This method is a wrapper around the window manager's
 * {@link OO.ui.WindowManager#isClosing isClosing} method.
 *
 * @return {boolean} Window is closing
 */
OO.ui.Window.prototype.isClosing = function () {
	return this.manager.isClosing( this );
};

/**
 * Check if the window is opened.
 *
 * This method is a wrapper around the window manager's
 * {@link OO.ui.WindowManager#isOpened isOpened} method.
 *
 * @return {boolean} Window is opened
 */
OO.ui.Window.prototype.isOpened = function () {
	return this.manager.isOpened( this );
};

/**
 * Get the window manager.
 *
 * All windows must be attached to a window manager, which is used to open
 * and close the window and control its presentation.
 *
 * @return {OO.ui.WindowManager} Manager of window
 */
OO.ui.Window.prototype.getManager = function () {
	return this.manager;
};

/**
 * Get the symbolic name of the window size (e.g., `small` or `medium`).
 *
 * @return {string} Symbolic name of the size: `small`, `medium`, `large`, `larger`, `full`
 */
OO.ui.Window.prototype.getSize = function () {
	const viewport = OO.ui.Element.static.getDimensions( this.getElementWindow() );
	const sizes = this.manager.constructor.static.sizes;
	let size = this.size;

	if ( !sizes[ size ] ) {
		size = this.manager.constructor.static.defaultSize;
	}
	if ( size !== 'full' && viewport.rect.right - viewport.rect.left < sizes[ size ].width ) {
		size = 'full';
	}

	return size;
};

/**
 * Get the size properties associated with the current window size
 *
 * @return {Object} Size properties
 */
OO.ui.Window.prototype.getSizeProperties = function () {
	return this.manager.constructor.static.sizes[ this.getSize() ];
};

/**
 * Disable transitions on window's frame for the duration of the callback function, then enable them
 * back.
 *
 * @private
 * @param {Function} callback Function to call while transitions are disabled
 */
OO.ui.Window.prototype.withoutSizeTransitions = function ( callback ) {
	// Temporarily resize the frame so getBodyHeight() can use scrollHeight measurements.
	// Disable transitions first, otherwise we'll get values from when the window was animating.
	// We need to build the transition CSS properties using these specific properties since
	// Firefox doesn't return anything useful when asked just for 'transition'.
	const oldTransition = this.$frame.css( 'transition-property' ) + ' ' +
		this.$frame.css( 'transition-duration' ) + ' ' +
		this.$frame.css( 'transition-timing-function' ) + ' ' +
		this.$frame.css( 'transition-delay' );

	this.$frame.css( 'transition', 'none' );
	callback();

	// Force reflow to make sure the style changes done inside callback
	// really are not transitioned
	this.$frame.height();
	this.$frame.css( 'transition', oldTransition );
};

/**
 * Get the height of the full window contents (i.e., the window head, body and foot together).
 *
 * What constitutes the head, body, and foot varies depending on the window type.
 * A {@link OO.ui.MessageDialog message dialog} displays a title and message in its body,
 * and any actions in the foot. A {@link OO.ui.ProcessDialog process dialog} displays a title
 * and special actions in the head, and dialog content in the body.
 *
 * To get just the height of the dialog body, use the #getBodyHeight method.
 *
 * @return {number} The height of the window contents (the dialog head, body and foot) in pixels
 */
OO.ui.Window.prototype.getContentHeight = function () {
	const win = this;
	const body = this.$body[ 0 ];
	const frame = this.$frame[ 0 ];

	let bodyHeight;
	// Temporarily resize the frame so getBodyHeight() can use scrollHeight measurements.
	// Disable transitions first, otherwise we'll get values from when the window was animating.
	this.withoutSizeTransitions( () => {
		const oldHeight = frame.style.height;
		const oldPosition = body.style.position;
		const scrollTop = body.scrollTop;
		frame.style.height = '1px';
		// Force body to resize to new width
		body.style.position = 'relative';
		bodyHeight = win.getBodyHeight();
		frame.style.height = oldHeight;
		body.style.position = oldPosition;
		body.scrollTop = scrollTop;
	} );

	return (
		// Add buffer for border
		( this.$frame.outerHeight() - this.$frame.innerHeight() ) +
		// Use combined heights of children
		( this.$head.outerHeight( true ) + bodyHeight + this.$foot.outerHeight( true ) )
	);
};

/**
 * Get the height of the window body.
 *
 * To get the height of the full window contents (the window body, head, and foot together),
 * use #getContentHeight.
 *
 * When this function is called, the window will temporarily have been resized
 * to height=1px, so .scrollHeight measurements can be taken accurately.
 *
 * @return {number} Height of the window body in pixels
 */
OO.ui.Window.prototype.getBodyHeight = function () {
	return this.$body[ 0 ].scrollHeight;
};

/**
 * Get the directionality of the frame (right-to-left or left-to-right).
 *
 * @return {string} Directionality: `'ltr'` or `'rtl'`
 */
OO.ui.Window.prototype.getDir = function () {
	return OO.ui.Element.static.getDir( this.$content ) || 'ltr';
};

/**
 * Get the 'setup' process.
 *
 * The setup process is used to set up a window for use in a particular context, based on the `data`
 * argument. This method is called during the opening phase of the window’s lifecycle (before the
 * opening animation). You can add elements to the window in this process or set their default
 * values.
 *
 * Override this method to add additional steps to the ‘setup’ process the parent method provides
 * using the {@link OO.ui.Process#first first} and {@link OO.ui.Process#next next} methods
 * of OO.ui.Process.
 *
 * To add window content that persists between openings, you may wish to use the #initialize method
 * instead.
 *
 * @param {Object} [data] Window opening data
 * @return {OO.ui.Process} Setup process
 */
OO.ui.Window.prototype.getSetupProcess = function () {
	return new OO.ui.Process();
};

/**
 * Get the ‘ready’ process.
 *
 * The ready process is used to ready a window for use in a particular context, based on the `data`
 * argument. This method is called during the opening phase of the window’s lifecycle, after the
 * window has been {@link OO.ui.Window#getSetupProcess setup} (after the opening animation). You can focus
 * elements in the window in this process, or open their dropdowns.
 *
 * Override this method to add additional steps to the ‘ready’ process the parent method
 * provides using the {@link OO.ui.Process#first first} and {@link OO.ui.Process#next next}
 * methods of OO.ui.Process.
 *
 * @param {Object} [data] Window opening data
 * @return {OO.ui.Process} Ready process
 */
OO.ui.Window.prototype.getReadyProcess = function () {
	return new OO.ui.Process();
};

/**
 * Get the 'hold' process.
 *
 * The hold process is used to keep a window from being used in a particular context, based on the
 * `data` argument. This method is called during the closing phase of the window’s lifecycle (before
 * the closing animation). You can close dropdowns of elements in the window in this process, if
 * they do not get closed automatically.
 *
 * Override this method to add additional steps to the 'hold' process the parent method provides
 * using the {@link OO.ui.Process#first first} and {@link OO.ui.Process#next next} methods
 * of OO.ui.Process.
 *
 * @param {Object} [data] Window closing data
 * @return {OO.ui.Process} Hold process
 */
OO.ui.Window.prototype.getHoldProcess = function () {
	return new OO.ui.Process();
};

/**
 * Get the ‘teardown’ process.
 *
 * The teardown process is used to teardown a window after use. During teardown, user interactions
 * within the window are conveyed and the window is closed, based on the `data` argument. This
 * method is called during the closing phase of the window’s lifecycle (after the closing
 * animation). You can remove elements in the window in this process or clear their values.
 *
 * Override this method to add additional steps to the ‘teardown’ process the parent method provides
 * using the {@link OO.ui.Process#first first} and {@link OO.ui.Process#next next} methods
 * of OO.ui.Process.
 *
 * @param {Object} [data] Window closing data
 * @return {OO.ui.Process} Teardown process
 */
OO.ui.Window.prototype.getTeardownProcess = function () {
	return new OO.ui.Process();
};

/**
 * Set the window manager.
 *
 * This will cause the window to initialize. Calling it more than once will cause an error.
 *
 * @param {OO.ui.WindowManager} manager Manager for this window
 * @throws {Error} An error is thrown if the method is called more than once
 * @chainable
 * @return {OO.ui.Window} The window, for chaining
 */
OO.ui.Window.prototype.setManager = function ( manager ) {
	if ( this.manager ) {
		throw new Error( 'Cannot set window manager, window already has a manager' );
	}

	this.manager = manager;

	this.initialize();

	return this;
};

/**
 * Set the window size by symbolic name (e.g., 'small' or 'medium')
 *
 * @param {string} size Symbolic name of size: `small`, `medium`, `large`, `larger` or
 *  `full`
 * @chainable
 * @return {OO.ui.Window} The window, for chaining
 */
OO.ui.Window.prototype.setSize = function ( size ) {
	this.size = size;
	this.updateSize();
	return this;
};

/**
 * Update the window size.
 *
 * @throws {Error} An error is thrown if the window is not attached to a window manager
 * @chainable
 * @return {OO.ui.Window} The window, for chaining
 */
OO.ui.Window.prototype.updateSize = function () {
	if ( !this.manager ) {
		throw new Error( 'Cannot update window size, must be attached to a manager' );
	}

	this.manager.updateWindowSize( this );

	return this;
};

/**
 * Set window dimensions. This method is called by the {@link OO.ui.WindowManager window manager}
 * when the window is opening. In general, setDimensions should not be called directly.
 *
 * To set the size of the window, use the #setSize method.
 *
 * @param {Object} dim CSS dimension properties
 * @param {string|number} [dim.width=''] Width
 * @param {string|number} [dim.minWidth=''] Minimum width
 * @param {string|number} [dim.maxWidth=''] Maximum width
 * @param {string|number} [dim.height] Height, omit to set based on height of contents
 * @param {string|number} [dim.minHeight=''] Minimum height
 * @param {string|number} [dim.maxHeight=''] Maximum height
 * @chainable
 * @return {OO.ui.Window} The window, for chaining
 */
OO.ui.Window.prototype.setDimensions = function ( dim ) {
	const win = this,
		styleObj = this.$frame[ 0 ].style;

	let height;
	// Calculate the height we need to set using the correct width
	if ( dim.height === undefined ) {
		this.withoutSizeTransitions( () => {
			const oldWidth = styleObj.width;
			win.$frame.css( 'width', dim.width || '' );
			height = win.getContentHeight();
			styleObj.width = oldWidth;
		} );
	} else {
		height = dim.height;
	}

	this.$frame.css( {
		width: dim.width || '',
		minWidth: dim.minWidth || '',
		maxWidth: dim.maxWidth || '',
		height: height || '',
		minHeight: dim.minHeight || '',
		maxHeight: dim.maxHeight || ''
	} );

	return this;
};

/**
 * Initialize window contents.
 *
 * Before the window is opened for the first time, #initialize is called so that content that
 * persists between openings can be added to the window.
 *
 * To set up a window with new content each time the window opens, use #getSetupProcess.
 *
 * @throws {Error} An error is thrown if the window is not attached to a window manager
 * @chainable
 * @return {OO.ui.Window} The window, for chaining
 */
OO.ui.Window.prototype.initialize = function () {
	if ( !this.manager ) {
		throw new Error( 'Cannot initialize window, must be attached to a manager' );
	}

	// Properties
	this.$head = $( '<div>' );
	this.$body = $( '<div>' );
	this.$foot = $( '<div>' );
	this.$document = $( this.getElementDocument() );

	// Events
	this.$element.on( 'mousedown', this.onMouseDown.bind( this ) );
	this.$focusTraps.on( 'focus', this.onFocusTrapFocused.bind( this ) );

	// Initialization
	this.$head.addClass( 'oo-ui-window-head' );
	this.$body.addClass( 'oo-ui-window-body' );
	this.$foot.addClass( 'oo-ui-window-foot' );
	this.$content.append( this.$head, this.$body, this.$foot );

	return this;
};

/**
 * Called when someone tries to focus the hidden element at the end of the dialog.
 * Sends focus back to the start of the dialog.
 *
 * @param {jQuery.Event} event Focus event
 */
OO.ui.Window.prototype.onFocusTrapFocused = function ( event ) {
	const backwards = this.$focusTrapBefore.is( event.target );
	this.focus( backwards );
};

/**
 * Focus the window
 *
 * @param {boolean} [focusLast=false] Focus the last focusable element in the window, instead of the first
 * @chainable
 * @return {OO.ui.Window} The window, for chaining
 */
OO.ui.Window.prototype.focus = function ( focusLast ) {
	const element = OO.ui.findFocusable( this.$content, !!focusLast );
	if ( element ) {
		// There's a focusable element inside the content, at the front or
		// back depending on which focus trap we hit; select it.
		element.focus();
	} else {
		// There's nothing focusable inside the content. As a fallback,
		// this.$content is focusable, and focusing it will keep our focus
		// properly trapped. It's not a *meaningful* focus, since it's just
		// the content-div for the Window, but it's better than letting focus
		// escape into the page.
		this.$content.trigger( 'focus' );
	}
	return this;
};

/**
 * Open the window.
 *
 * This method is a wrapper around a call to the window
 * manager’s {@link OO.ui.WindowManager#openWindow openWindow} method.
 *
 * To customize the window each time it opens, use #getSetupProcess or #getReadyProcess.
 *
 * @param {Object} [data] Window opening data
 * @return {OO.ui.WindowInstance} See OO.ui.WindowManager#openWindow
 * @throws {Error} An error is thrown if the window is not attached to a window manager
 */
OO.ui.Window.prototype.open = function ( data ) {
	if ( !this.manager ) {
		throw new Error( 'Cannot open window, must be attached to a manager' );
	}

	return this.manager.openWindow( this, data );
};

/**
 * Close the window.
 *
 * This method is a wrapper around a call to the window
 * manager’s {@link OO.ui.WindowManager#closeWindow closeWindow} method.
 *
 * The window's #getHoldProcess and #getTeardownProcess methods are called during the closing
 * phase of the window’s lifecycle and can be used to specify closing behavior each time
 * the window closes.
 *
 * @param {Object} [data] Window closing data
 * @return {OO.ui.WindowInstance} See OO.ui.WindowManager#closeWindow
 * @throws {Error} An error is thrown if the window is not attached to a window manager
 */
OO.ui.Window.prototype.close = function ( data ) {
	if ( !this.manager ) {
		throw new Error( 'Cannot close window, must be attached to a manager' );
	}

	return this.manager.closeWindow( this, data );
};

/**
 * Setup window.
 *
 * This is called by OO.ui.WindowManager during window opening (before the animation), and should
 * not be called directly by other systems.
 *
 * @param {Object} [data] Window opening data
 * @return {jQuery.Promise} Promise resolved when window is setup
 */
OO.ui.Window.prototype.setup = function ( data ) {
	const win = this;

	this.toggle( true );

	return this.getSetupProcess( data ).execute().then( () => {
		win.updateSize();
		// Force redraw by asking the browser to measure the elements' widths
		win.$element.addClass( 'oo-ui-window-active oo-ui-window-setup' ).width();
		win.$content.addClass( 'oo-ui-window-content-setup' ).width();
	} );
};

/**
 * Ready window.
 *
 * This is called by OO.ui.WindowManager during window opening (after the animation), and should not
 * be called directly by other systems.
 *
 * @param {Object} [data] Window opening data
 * @return {jQuery.Promise} Promise resolved when window is ready
 */
OO.ui.Window.prototype.ready = function ( data ) {
	const win = this;

	this.$content.trigger( 'focus' );
	return this.getReadyProcess( data ).execute().then( () => {
		// Force redraw by asking the browser to measure the elements' widths
		win.$element.addClass( 'oo-ui-window-ready' ).width();
		win.$content.addClass( 'oo-ui-window-content-ready' ).width();
	} );
};

/**
 * Hold window.
 *
 * This is called by OO.ui.WindowManager during window closing (before the animation), and should
 * not be called directly by other systems.
 *
 * @param {Object} [data] Window closing data
 * @return {jQuery.Promise} Promise resolved when window is held
 */
OO.ui.Window.prototype.hold = function ( data ) {
	const win = this;

	return this.getHoldProcess( data ).execute().then( () => {
		// Get the focused element within the window's content
		const $focus = win.$content.find(
			OO.ui.Element.static.getDocument( win.$content ).activeElement
		);

		// Blur the focused element
		if ( $focus.length ) {
			$focus[ 0 ].blur();
		}

		// Force redraw by asking the browser to measure the elements' widths
		win.$element.removeClass( 'oo-ui-window-ready oo-ui-window-setup' ).width();
		win.$content.removeClass( 'oo-ui-window-content-ready oo-ui-window-content-setup' ).width();
	} );
};

/**
 * Teardown window.
 *
 * This is called by OO.ui.WindowManager during window closing (after the animation), and should not
 * be called directly by other systems.
 *
 * @param {Object} [data] Window closing data
 * @return {jQuery.Promise} Promise resolved when window is torn down
 */
OO.ui.Window.prototype.teardown = function ( data ) {
	const win = this;

	return this.getTeardownProcess( data ).execute().then( () => {
		// Force redraw by asking the browser to measure the elements' widths
		win.$element.removeClass( 'oo-ui-window-active' ).width();

		win.toggle( false );
	} );
};
