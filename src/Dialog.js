/**
 * Modal dialog window.
 *
 * @abstract
 * @class
 * @extends OO.ui.Window
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [footless] Hide foot
 * @cfg {string} [size='large'] Symbolic name of dialog size, `small`, `medium` or `large`
 */
OO.ui.Dialog = function OoUiDialog( config ) {
	// Configuration initialization
	config = $.extend( { 'size': 'large' }, config );

	// Parent constructor
	OO.ui.Dialog.super.call( this, config );

	// Properties
	this.visible = false;
	this.footless = !!config.footless;
	this.size = null;
	this.pending = 0;
	this.onWindowMouseWheelHandler = OO.ui.bind( this.onWindowMouseWheel, this );
	this.onDocumentKeyDownHandler = OO.ui.bind( this.onDocumentKeyDown, this );

	// Events
	this.$element.on( 'mousedown', false );

	// Initialization
	this.$element.addClass( 'oo-ui-dialog' );
	this.setSize( config.size );
};

/* Setup */

OO.inheritClass( OO.ui.Dialog, OO.ui.Window );

/* Static Properties */

/**
 * Symbolic name of dialog.
 *
 * @abstract
 * @static
 * @inheritable
 * @property {string}
 */
OO.ui.Dialog.static.name = '';

/**
 * Map of symbolic size names and CSS classes.
 *
 * @static
 * @inheritable
 * @property {Object}
 */
OO.ui.Dialog.static.sizeCssClasses = {
	'small': 'oo-ui-dialog-small',
	'medium': 'oo-ui-dialog-medium',
	'large': 'oo-ui-dialog-large'
};

/* Methods */

/**
 * Handle close button click events.
 */
OO.ui.Dialog.prototype.onCloseButtonClick = function () {
	this.close( { 'action': 'cancel' } );
};

/**
 * Handle window mouse wheel events.
 *
 * @param {jQuery.Event} e Mouse wheel event
 */
OO.ui.Dialog.prototype.onWindowMouseWheel = function () {
	return false;
};

/**
 * Handle document key down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.Dialog.prototype.onDocumentKeyDown = function ( e ) {
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
 * Handle frame document key down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.Dialog.prototype.onFrameDocumentKeyDown = function ( e ) {
	if ( e.which === OO.ui.Keys.ESCAPE ) {
		this.close( { 'action': 'cancel' } );
		return false;
	}
};

/**
 * Set dialog size.
 *
 * @param {string} [size='large'] Symbolic name of dialog size, `small`, `medium` or `large`
 */
OO.ui.Dialog.prototype.setSize = function ( size ) {
	var name, state, cssClass,
		sizeCssClasses = OO.ui.Dialog.static.sizeCssClasses;

	if ( !sizeCssClasses[size] ) {
		size = 'large';
	}
	this.size = size;
	for ( name in sizeCssClasses ) {
		state = name === size;
		cssClass = sizeCssClasses[name];
		this.$element.toggleClass( cssClass, state );
	}
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.initialize = function () {
	// Parent method
	OO.ui.Dialog.super.prototype.initialize.call( this );

	// Properties
	this.closeButton = new OO.ui.ButtonWidget( {
		'$': this.$,
		'frameless': true,
		'icon': 'close',
		'title': OO.ui.msg( 'ooui-dialog-action-close' )
	} );

	// Events
	this.closeButton.connect( this, { 'click': 'onCloseButtonClick' } );
	this.frame.$document.on( 'keydown', OO.ui.bind( this.onFrameDocumentKeyDown, this ) );

	// Initialization
	this.frame.$content.addClass( 'oo-ui-dialog-content' );
	if ( this.footless ) {
		this.frame.$content.addClass( 'oo-ui-dialog-content-footless' );
	}
	this.closeButton.$element.addClass( 'oo-ui-window-closeButton' );
	this.$head.append( this.closeButton.$element );
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.getSetupProcess = function ( data ) {
	return OO.ui.Dialog.super.prototype.getSetupProcess.call( this, data )
		.next( function () {
			// Prevent scrolling in top-level window
			this.$( window ).on( 'mousewheel', this.onWindowMouseWheelHandler );
			this.$( document ).on( 'keydown', this.onDocumentKeyDownHandler );
		}, this );
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.getTeardownProcess = function ( data ) {
	return OO.ui.Dialog.super.prototype.getTeardownProcess.call( this, data )
		.first( function () {
			// Wait for closing transition
			return OO.ui.Process.static.delay( 250 );
		}, this )
		.next( function () {
			// Allow scrolling in top-level window
			this.$( window ).off( 'mousewheel', this.onWindowMouseWheelHandler );
			this.$( document ).off( 'keydown', this.onDocumentKeyDownHandler );
		}, this );
};

/**
 * Check if input is pending.
 *
 * @return {boolean}
 */
OO.ui.Dialog.prototype.isPending = function () {
	return !!this.pending;
};

/**
 * Increase the pending stack.
 *
 * @chainable
 */
OO.ui.Dialog.prototype.pushPending = function () {
	if ( this.pending === 0 ) {
		this.frame.$content.addClass( 'oo-ui-dialog-pending' );
		this.$head.addClass( 'oo-ui-texture-pending' );
		this.$foot.addClass( 'oo-ui-texture-pending' );
	}
	this.pending++;

	return this;
};

/**
 * Reduce the pending stack.
 *
 * Clamped at zero.
 *
 * @chainable
 */
OO.ui.Dialog.prototype.popPending = function () {
	if ( this.pending === 1 ) {
		this.frame.$content.removeClass( 'oo-ui-dialog-pending' );
		this.$head.removeClass( 'oo-ui-texture-pending' );
		this.$foot.removeClass( 'oo-ui-texture-pending' );
	}
	this.pending = Math.max( 0, this.pending - 1 );

	return this;
};
