/**
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

	// Initialization
	this.$element.addClass( 'oo-ui-toggleButtonWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.ToggleButtonWidget, OO.ui.ButtonWidget );

OO.mixinClass( OO.ui.ToggleButtonWidget, OO.ui.ToggleWidget );

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.ToggleButtonWidget.prototype.onClick = function () {
	if ( !this.disabled ) {
		this.setValue( !this.value );
	}

	// Parent method
	return OO.ui.ButtonWidget.prototype.onClick.call( this );
};

/**
 * @inheritdoc
 */
OO.ui.ToggleButtonWidget.prototype.setValue = function ( value ) {
	value = !!value;
	if ( value !== this.value ) {
		this.setActive( value );
	}

	// Parent method
	OO.ui.ToggleWidget.prototype.setValue.call( this, value );

	return this;
};
