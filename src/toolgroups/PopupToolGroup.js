/**
 * Popup list of tools with an icon and optional label.
 *
 * @abstract
 * @class
 * @extends OO.ui.ToolGroup
 * @mixins OO.ui.IconElement
 * @mixins OO.ui.IndicatorElement
 * @mixins OO.ui.LabelElement
 * @mixins OO.ui.TitledElement
 * @mixins OO.ui.ClippableElement
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 * @cfg {string} [header] Text to display at the top of the pop-up
 */
OO.ui.PopupToolGroup = function OoUiPopupToolGroup( toolbar, config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.PopupToolGroup.super.call( this, toolbar, config );

	// Mixin constructors
	OO.ui.IconElement.call( this, config );
	OO.ui.IndicatorElement.call( this, config );
	OO.ui.LabelElement.call( this, config );
	OO.ui.TitledElement.call( this, config );
	OO.ui.ClippableElement.call( this, $.extend( {}, config, { $clippable: this.$group } ) );

	// Properties
	this.active = false;
	this.dragging = false;
	this.onBlurHandler = this.onBlur.bind( this );
	this.$handle = this.$( '<span>' );

	// Events
	this.$handle.on( {
		'mousedown touchstart': this.onHandlePointerDown.bind( this ),
		'mouseup touchend': this.onHandlePointerUp.bind( this )
	} );

	// Initialization
	this.$handle
		.addClass( 'oo-ui-popupToolGroup-handle' )
		.append( this.$icon, this.$label, this.$indicator );
	// If the pop-up should have a header, add it to the top of the toolGroup.
	// Note: If this feature is useful for other widgets, we could abstract it into an
	// OO.ui.HeaderedElement mixin constructor.
	if ( config.header !== undefined ) {
		this.$group
			.prepend( this.$( '<span>' )
				.addClass( 'oo-ui-popupToolGroup-header' )
				.text( config.header )
			);
	}
	this.$element
		.addClass( 'oo-ui-popupToolGroup' )
		.prepend( this.$handle );
};

/* Setup */

OO.inheritClass( OO.ui.PopupToolGroup, OO.ui.ToolGroup );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.IconElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.IndicatorElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.LabelElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.TitledElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.ClippableElement );

/* Static Properties */

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.setDisabled = function () {
	// Parent method
	OO.ui.PopupToolGroup.super.prototype.setDisabled.apply( this, arguments );

	if ( this.isDisabled() && this.isElementAttached() ) {
		this.setActive( false );
	}
};

/**
 * Handle focus being lost.
 *
 * The event is actually generated from a mouseup, so it is not a normal blur event object.
 *
 * @param {jQuery.Event} e Mouse up event
 */
OO.ui.PopupToolGroup.prototype.onBlur = function ( e ) {
	// Only deactivate when clicking outside the dropdown element
	if ( this.$( e.target ).closest( '.oo-ui-popupToolGroup' )[0] !== this.$element[0] ) {
		this.setActive( false );
	}
};

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.onPointerUp = function ( e ) {
	// e.which is 0 for touch events, 1 for left mouse button
	// Only close toolgroup when a tool was actually selected
	// FIXME: this duplicates logic from the parent class
	if ( !this.isDisabled() && e.which <= 1 && this.pressed && this.pressed === this.getTargetTool( e ) ) {
		this.setActive( false );
	}
	return OO.ui.PopupToolGroup.super.prototype.onPointerUp.call( this, e );
};

/**
 * Handle mouse up events.
 *
 * @param {jQuery.Event} e Mouse up event
 */
OO.ui.PopupToolGroup.prototype.onHandlePointerUp = function () {
	return false;
};

/**
 * Handle mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.PopupToolGroup.prototype.onHandlePointerDown = function ( e ) {
	// e.which is 0 for touch events, 1 for left mouse button
	if ( !this.isDisabled() && e.which <= 1 ) {
		this.setActive( !this.active );
	}
	return false;
};

/**
 * Switch into active mode.
 *
 * When active, mouseup events anywhere in the document will trigger deactivation.
 */
OO.ui.PopupToolGroup.prototype.setActive = function ( value ) {
	value = !!value;
	if ( this.active !== value ) {
		this.active = value;
		if ( value ) {
			this.getElementDocument().addEventListener( 'mouseup', this.onBlurHandler, true );

			// Try anchoring the popup to the left first
			this.$element.addClass( 'oo-ui-popupToolGroup-active oo-ui-popupToolGroup-left' );
			this.toggleClipping( true );
			if ( this.isClippedHorizontally() ) {
				// Anchoring to the left caused the popup to clip, so anchor it to the right instead
				this.toggleClipping( false );
				this.$element
					.removeClass( 'oo-ui-popupToolGroup-left' )
					.addClass( 'oo-ui-popupToolGroup-right' );
				this.toggleClipping( true );
			}
		} else {
			this.getElementDocument().removeEventListener( 'mouseup', this.onBlurHandler, true );
			this.$element.removeClass(
				'oo-ui-popupToolGroup-active oo-ui-popupToolGroup-left  oo-ui-popupToolGroup-right'
			);
			this.toggleClipping( false );
		}
	}
};
