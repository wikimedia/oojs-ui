/**
 * Container for content that is overlaid and positioned absolutely.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.LabeledElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {number} [width=320] Width of popup in pixels
 * @cfg {number} [height] Height of popup, omit to use automatic height
 * @cfg {boolean} [anchor=true] Show anchor pointing to origin of popup
 * @cfg {string} [align='center'] Alignment of popup to origin
 * @cfg {jQuery} [$container] Container to prevent popup from rendering outside of
 * @cfg {jQuery} [$content] Content to append to the popup's body
 * @cfg {boolean} [autoClose=false] Popup auto-closes when it loses focus
 * @cfg {jQuery} [$autoCloseIgnore] Elements to not auto close when clicked
 * @cfg {boolean} [head] Show label and close button at the top
 * @cfg {boolean} [padded] Add padding to the body
 */
OO.ui.PopupWidget = function OoUiPopupWidget( config ) {
	// Config intialization
	config = config || {};

	// Parent constructor
	OO.ui.PopupWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.LabeledElement.call( this, this.$( '<div>' ), config );
	OO.ui.ClippableElement.call( this, this.$( '<div>' ), config );

	// Properties
	this.visible = false;
	this.$popup = this.$( '<div>' );
	this.$head = this.$( '<div>' );
	this.$body = this.$clippable;
	this.$anchor = this.$( '<div>' );
	this.$container = config.$container || this.$( 'body' );
	this.autoClose = !!config.autoClose;
	this.$autoCloseIgnore = config.$autoCloseIgnore;
	this.transitionTimeout = null;
	this.anchor = null;
	this.width = config.width !== undefined ? config.width : 320;
	this.height = config.height !== undefined ? config.height : null;
	this.align = config.align || 'center';
	this.closeButton = new OO.ui.ButtonWidget( { $: this.$, framed: false, icon: 'close' } );
	this.onMouseDownHandler = OO.ui.bind( this.onMouseDown, this );

	// Events
	this.closeButton.connect( this, { click: 'onCloseButtonClick' } );

	// Initialization
	this.toggleAnchor( config.anchor === undefined || config.anchor );
	this.$body.addClass( 'oo-ui-popupWidget-body' );
	this.$anchor.addClass( 'oo-ui-popupWidget-anchor' );
	this.$head
		.addClass( 'oo-ui-popupWidget-head' )
		.append( this.$label, this.closeButton.$element );
	if ( !config.head ) {
		this.$head.hide();
	}
	this.$popup
		.addClass( 'oo-ui-popupWidget-popup' )
		.append( this.$head, this.$body );
	this.$element
		.hide()
		.addClass( 'oo-ui-popupWidget' )
		.append( this.$popup, this.$anchor );
	// Move content, which was added to #$element by OO.ui.Widget, to the body
	if ( config.$content instanceof jQuery ) {
		this.$body.append( config.$content );
	}
	if ( config.padded ) {
		this.$body.addClass( 'oo-ui-popupWidget-body-padded' );
	}
};

/* Setup */

OO.inheritClass( OO.ui.PopupWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.PopupWidget, OO.ui.LabeledElement );
OO.mixinClass( OO.ui.PopupWidget, OO.ui.ClippableElement );

/* Events */

/**
 * @event hide
 */

/**
 * @event show
 */

/* Methods */

/**
 * Handles mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.PopupWidget.prototype.onMouseDown = function ( e ) {
	if (
		this.isVisible() &&
		!$.contains( this.$element[0], e.target ) &&
		( !this.$autoCloseIgnore || !this.$autoCloseIgnore.has( e.target ).length )
	) {
		this.toggle( false );
	}
};

/**
 * Bind mouse down listener.
 */
OO.ui.PopupWidget.prototype.bindMouseDownListener = function () {
	// Capture clicks outside popup
	this.getElementWindow().addEventListener( 'mousedown', this.onMouseDownHandler, true );
};

/**
 * Handles close button click events.
 */
OO.ui.PopupWidget.prototype.onCloseButtonClick = function () {
	if ( this.isVisible() ) {
		this.toggle( false );
	}
};

/**
 * Unbind mouse down listener.
 */
OO.ui.PopupWidget.prototype.unbindMouseDownListener = function () {
	this.getElementWindow().removeEventListener( 'mousedown', this.onMouseDownHandler, true );
};

/**
 * Set whether to show a anchor.
 *
 * @param {boolean} [show] Show anchor, omit to toggle
 */
OO.ui.PopupWidget.prototype.toggleAnchor = function ( show ) {
	show = show === undefined ? !this.anchored : !!show;

	if ( this.anchored !== show ) {
		if ( show ) {
			this.$element.addClass( 'oo-ui-popupWidget-anchored' );
		} else {
			this.$element.removeClass( 'oo-ui-popupWidget-anchored' );
		}
		this.anchored = show;
	}
};

/**
 * Check if showing a anchor.
 *
 * @return {boolean} anchor is visible
 */
OO.ui.PopupWidget.prototype.hasAnchor = function () {
	return this.anchor;
};

/**
 * @inheritdoc
 */
OO.ui.PopupWidget.prototype.toggle = function ( show ) {
	show = show === undefined ? !this.isVisible() : !!show;

	var change = show !== this.isVisible();

	// Parent method
	OO.ui.PopupWidget.super.prototype.toggle.call( this, show );

	if ( change ) {
		if ( show ) {
			this.setClipping( true );
			if ( this.autoClose ) {
				this.bindMouseDownListener();
			}
			this.updateDimensions();
		} else {
			this.setClipping( false );
			if ( this.autoClose ) {
				this.unbindMouseDownListener();
			}
		}
	}

	return this;
};

/**
 * Set the size of the popup.
 *
 * Changing the size may also change the popup's position depending on the alignment.
 *
 * @param {number} width Width
 * @param {number} height Height
 * @param {boolean} [transition=false] Use a smooth transition
 * @chainable
 */
OO.ui.PopupWidget.prototype.setSize = function ( width, height, transition ) {
	this.width = width;
	this.height = height !== undefined ? height : null;
	if ( this.isVisible() ) {
		this.updateDimensions( transition );
	}
};

/**
 * Update the size and position.
 *
 * Only use this to keep the popup properly anchored. Use #setSize to change the size, and this will
 * be called automatically.
 *
 * @param {boolean} [transition=false] Use a smooth transition
 * @chainable
 */
OO.ui.PopupWidget.prototype.updateDimensions = function ( transition ) {
	var widget = this,
		padding = 10,
		originOffset = Math.round( this.$element.offset().left ),
		containerLeft = Math.round( this.$container.offset().left ),
		containerWidth = this.$container.innerWidth(),
		containerRight = containerLeft + containerWidth,
		popupOffset = this.width * ( { left: 0, center: -0.5, right: -1 } )[this.align],
		anchorWidth = this.$anchor.width(),
		popupLeft = popupOffset - padding,
		popupRight = popupOffset + padding + this.width + padding,
		overlapLeft = ( originOffset + popupLeft ) - containerLeft,
		overlapRight = containerRight - ( originOffset + popupRight );

	// Prevent transition from being interrupted
	clearTimeout( this.transitionTimeout );
	if ( transition ) {
		// Enable transition
		this.$element.addClass( 'oo-ui-popupWidget-transitioning' );
	}

	if ( overlapRight < 0 ) {
		popupOffset += overlapRight;
	} else if ( overlapLeft < 0 ) {
		popupOffset -= overlapLeft;
	}

	// Adjust offset to avoid anchor being rendered too close to the edge
	if ( this.align === 'right' ) {
		popupOffset += anchorWidth;
	} else if ( this.align === 'left' ) {
		popupOffset -= anchorWidth;
	}

	// Position body relative to anchor and resize
	this.$popup.css( {
		left: popupOffset,
		width: this.width,
		height: this.height !== null ? this.height : 'auto'
	} );

	if ( transition ) {
		// Prevent transitioning after transition is complete
		this.transitionTimeout = setTimeout( function () {
			widget.$element.removeClass( 'oo-ui-popupWidget-transitioning' );
		}, 200 );
	} else {
		// Prevent transitioning immediately
		this.$element.removeClass( 'oo-ui-popupWidget-transitioning' );
	}

	return this;
};
