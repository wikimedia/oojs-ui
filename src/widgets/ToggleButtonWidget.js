/**
 * Button that toggles on and off.
 *
 * @class
 * @extends OO.ui.ButtonWidget
 * @mixins OO.ui.ToggleWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [value=false] Initial value
 */
OO.ui.ToggleButtonWidget = function OoUiToggleButtonWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.ToggleButtonWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.ToggleWidget.call( this, config );

	// Events
	this.connect( this, { click: 'onAction' } );

	// Initialization
	this.$element.addClass( 'oo-ui-toggleButtonWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.ToggleButtonWidget, OO.ui.ButtonWidget );
OO.mixinClass( OO.ui.ToggleButtonWidget, OO.ui.ToggleWidget );

/* Methods */

/**
 * Handle the button action being triggered.
 */
OO.ui.ToggleButtonWidget.prototype.onAction = function () {
	this.setValue( !this.value );
};

/**
 * @inheritdoc
 */
OO.ui.ToggleButtonWidget.prototype.setValue = function ( value ) {
	value = !!value;
	if ( value !== this.value ) {
		this.$button.attr( 'aria-pressed', value.toString() );
		this.setActive( value );
	}

	// Parent method (from mixin)
	OO.ui.ToggleWidget.prototype.setValue.call( this, value );

	return this;
};
