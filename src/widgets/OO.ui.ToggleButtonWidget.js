/**
 * @class
 * @extends OO.ui.PushButtonWidget
 * @mixins OO.ui.ToggleWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [value=false] Initial value
 * @cfg {string} [onLabel='On'] Label for on state
 * @cfg {string} [offLabel='Off'] Label for off state
 */
OO.ui.ToggleButtonWidget = function OoUiToggleButtonWidget( config ) {
	// Parent constructor
	OO.ui.PushButtonWidget.call( this, config );

	// Mixin constructors
	OO.ui.ToggleWidget.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-toggleButtonWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.ToggleButtonWidget, OO.ui.PushButtonWidget );

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
		this.setLabel( value ? this.$onLabel : this.$offLabel );
	}

	// Parent method
	OO.ui.ToggleWidget.prototype.setValue.call( this, value );

	return this;
};
