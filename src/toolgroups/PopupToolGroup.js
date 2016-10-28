/**
 * PopupToolGroup is an abstract base class used by both {@link OO.ui.MenuToolGroup MenuToolGroup}
 * and {@link OO.ui.ListToolGroup ListToolGroup} to provide a popup--an overlaid menu or list of tools with an
 * optional icon and label. This class can be used for other base classes that also use this functionality.
 *
 * @abstract
 * @class
 * @extends OO.ui.ToolGroup
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.IndicatorElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.TitledElement
 * @mixins OO.ui.mixin.ClippableElement
 * @mixins OO.ui.mixin.TabIndexedElement
 *
 * @constructor
 * @param {OO.ui.Toolbar} toolbar
 * @param {Object} [config] Configuration options
 * @cfg {string} [header] Text to display at the top of the popup
 */
OO.ui.PopupToolGroup = function OoUiPopupToolGroup( toolbar, config ) {
	// Allow passing positional parameters inside the config object
	if ( OO.isPlainObject( toolbar ) && config === undefined ) {
		config = toolbar;
		toolbar = config.toolbar;
	}

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.PopupToolGroup.parent.call( this, toolbar, config );

	// Properties
	this.active = false;
	this.dragging = false;
	this.onBlurHandler = this.onBlur.bind( this );
	this.$handle = $( '<span>' );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.IndicatorElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, config );
	OO.ui.mixin.ClippableElement.call( this, $.extend( {}, config, { $clippable: this.$group } ) );
	OO.ui.mixin.TabIndexedElement.call( this, $.extend( {}, config, { $tabIndexed: this.$handle } ) );

	// Events
	this.$handle.on( {
		keydown: this.onHandleMouseKeyDown.bind( this ),
		keyup: this.onHandleMouseKeyUp.bind( this ),
		mousedown: this.onHandleMouseKeyDown.bind( this ),
		mouseup: this.onHandleMouseKeyUp.bind( this )
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
			.prepend( $( '<span>' )
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
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.IndicatorElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.TitledElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.ClippableElement );
OO.mixinClass( OO.ui.PopupToolGroup, OO.ui.mixin.TabIndexedElement );

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.setDisabled = function () {
	// Parent method
	OO.ui.PopupToolGroup.parent.prototype.setDisabled.apply( this, arguments );

	if ( this.isDisabled() && this.isElementAttached() ) {
		this.setActive( false );
	}
};

/**
 * Handle focus being lost.
 *
 * The event is actually generated from a mouseup/keyup, so it is not a normal blur event object.
 *
 * @protected
 * @param {MouseEvent|KeyboardEvent} e Mouse up or key up event
 */
OO.ui.PopupToolGroup.prototype.onBlur = function ( e ) {
	// Only deactivate when clicking outside the dropdown element
	if ( $( e.target ).closest( '.oo-ui-popupToolGroup' )[ 0 ] !== this.$element[ 0 ] ) {
		this.setActive( false );
	}
};

/**
 * @inheritdoc
 */
OO.ui.PopupToolGroup.prototype.onMouseKeyUp = function ( e ) {
	// Only close toolgroup when a tool was actually selected
	if (
		!this.isDisabled() && this.pressed && this.pressed === this.getTargetTool( e ) &&
		( e.which === OO.ui.MouseButtons.LEFT || e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		this.setActive( false );
	}
	return OO.ui.PopupToolGroup.parent.prototype.onMouseKeyUp.call( this, e );
};

/**
 * Handle mouse up and key up events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse up or key up event
 */
OO.ui.PopupToolGroup.prototype.onHandleMouseKeyUp = function ( e ) {
	if (
		!this.isDisabled() &&
		( e.which === OO.ui.MouseButtons.LEFT || e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		return false;
	}
};

/**
 * Handle mouse down and key down events.
 *
 * @protected
 * @param {jQuery.Event} e Mouse down or key down event
 */
OO.ui.PopupToolGroup.prototype.onHandleMouseKeyDown = function ( e ) {
	if (
		!this.isDisabled() &&
		( e.which === OO.ui.MouseButtons.LEFT || e.which === OO.ui.Keys.SPACE || e.which === OO.ui.Keys.ENTER )
	) {
		this.setActive( !this.active );
		return false;
	}
};

/**
 * Switch into 'active' mode.
 *
 * When active, the popup is visible. A mouseup event anywhere in the document will trigger
 * deactivation.
 *
 * @param {boolean} value The active state to set
 */
OO.ui.PopupToolGroup.prototype.setActive = function ( value ) {
	var containerWidth, containerLeft;
	value = !!value;
	if ( this.active !== value ) {
		this.active = value;
		if ( value ) {
			this.getElementDocument().addEventListener( 'mouseup', this.onBlurHandler, true );
			this.getElementDocument().addEventListener( 'keyup', this.onBlurHandler, true );

			this.$clippable.css( 'left', '' );
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
			if ( this.isClippedHorizontally() ) {
				// Anchoring to the right also caused the popup to clip, so just make it fill the container
				containerWidth = this.$clippableScrollableContainer.width();
				containerLeft = this.$clippableScrollableContainer.offset().left;

				this.toggleClipping( false );
				this.$element.removeClass( 'oo-ui-popupToolGroup-right' );

				this.$clippable.css( {
					left: -( this.$element.offset().left - containerLeft ),
					width: containerWidth
				} );
			}
		} else {
			this.getElementDocument().removeEventListener( 'mouseup', this.onBlurHandler, true );
			this.getElementDocument().removeEventListener( 'keyup', this.onBlurHandler, true );
			this.$element.removeClass(
				'oo-ui-popupToolGroup-active oo-ui-popupToolGroup-left  oo-ui-popupToolGroup-right'
			);
			this.toggleClipping( false );
		}
	}
};
