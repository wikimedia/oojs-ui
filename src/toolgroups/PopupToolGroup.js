/**
 * Popup list of tools with an icon and optional label.
 *
 * @abstract
 * @class
 * @extends OO.ui.ToolGroup
 * @mixins OO.ui.IconedElement
 * @mixins OO.ui.IndicatedElement
 * @mixins OO.ui.LabeledElement
 * @mixins OO.ui.TitledElement
 * @mixins OO.ui.ClippableElement
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 */
OO.ui.PopupToolGroup = function OoUiPopupToolGroup( toolbar, config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.PopupToolGroup.super.call( this, toolbar, config );

	// Mixin constructors
	OO.ui.IconedElement.call( this, this.$( '<span>' ), config );
	OO.ui.IndicatedElement.call( this, this.$( '<span>' ), config );
	OO.ui.LabeledElement.call( this, this.$( '<span>' ), config );
	OO.ui.TitledElement.call( this, this.$element, config );
	OO.ui.ClippableElement.call( this, this.$group, config );

	// Properties
	this.active = false;
	this.dragging = false;
	this.onBlurHandler = OO.ui.bind( this.onBlur, this );
	this.$handle = this.$( '<span>' );

	// Events
	this.$handle.on( {
		'mousedown': OO.ui.bind( this.onHandleMouseDown, this ),
		'mouseup': OO.ui.bind( this.onHandleMouseUp, this )
	} );

	// Initialization
	this.$handle
		.addClass( 'oo-ui-popupToolGroup-handle' )
		.append( this.$icon, this.$label, this.$indicator );
	this.$element
		.addClass( 'oo-ui-popupToolGroup' )
		.prepend( this.$handle );
};

/* Setup */

OO.inheritClass( OO.ui.PopupToolGroup, OO.ui.ToolGroup );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.IconedElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.IndicatedElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.LabeledElement );
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
OO.ui.PopupToolGroup.prototype.onMouseUp = function ( e ) {
	if ( !this.disabled && e.which === 1 ) {
		this.setActive( false );
	}
	return OO.ui.ToolGroup.prototype.onMouseUp.call( this, e );
};

/**
 * Handle mouse up events.
 *
 * @param {jQuery.Event} e Mouse up event
 */
OO.ui.PopupToolGroup.prototype.onHandleMouseUp = function () {
	return false;
};

/**
 * Handle mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.PopupToolGroup.prototype.onHandleMouseDown = function ( e ) {
	if ( !this.disabled && e.which === 1 ) {
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
			this.setClipping( true );
			this.$element.addClass( 'oo-ui-popupToolGroup-active' );
			this.getElementDocument().addEventListener( 'mouseup', this.onBlurHandler, true );
		} else {
			this.setClipping( false );
			this.$element.removeClass( 'oo-ui-popupToolGroup-active' );
			this.getElementDocument().removeEventListener( 'mouseup', this.onBlurHandler, true );
		}
	}
};
