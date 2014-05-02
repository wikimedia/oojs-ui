/**
 * Switch that slides on and off.
 *
 * @abstract
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.ToggleWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [value=false] Initial value
 */
OO.ui.ToggleSwitchWidget = function OoUiToggleSwitchWidget( config ) {
	// Parent constructor
	OO.ui.ToggleSwitchWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ToggleWidget.call( this, config );

	// Properties
	this.dragging = false;
	this.dragStart = null;
	this.sliding = false;
	this.$glow = this.$( '<span>' );
	this.$grip = this.$( '<span>' );

	// Events
	this.$element.on( 'click', OO.ui.bind( this.onClick, this ) );

	// Initialization
	this.$glow.addClass( 'oo-ui-toggleSwitchWidget-glow' );
	this.$grip.addClass( 'oo-ui-toggleSwitchWidget-grip' );
	this.$element
		.addClass( 'oo-ui-toggleSwitchWidget' )
		.append( this.$glow, this.$grip );
};

/* Setup */

OO.inheritClass( OO.ui.ToggleSwitchWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.ToggleSwitchWidget, OO.ui.ToggleWidget );

/* Methods */

/**
 * Handle mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.ToggleSwitchWidget.prototype.onClick = function ( e ) {
	if ( !this.isDisabled() && e.which === 1 ) {
		this.setValue( !this.value );
	}
};
