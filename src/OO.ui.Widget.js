/**
 * User interface control.
 *
 * @class
 * @abstract
 * @extends OO.ui.Element
 * @mixin OO.EventEmitter
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [disabled=false] Disable
 */
OO.ui.Widget = function OoUiWidget( config ) {
	// Initialize config
	config = $.extend( { 'disabled': false }, config );

	// Parent constructor
	OO.ui.Element.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.disabled = null;
	this.wasDisabled = null;

	// Initialization
	this.$element.addClass( 'oo-ui-widget' );
	this.setDisabled( !!config.disabled );
};

/* Inheritance */

OO.inheritClass( OO.ui.Widget, OO.ui.Element );

OO.mixinClass( OO.ui.Widget, OO.EventEmitter );

/* Events */

/**
 * @event disable
 * @param {boolean} disabled Widget is disabled
 */

/* Methods */

/**
 * Check if the widget is disabled.
 *
 * @method
 * @param {boolean} Button is disabled
 */
OO.ui.Widget.prototype.isDisabled = function () {
	return this.disabled;
};

/**
 * Update the disabled state, in case of changes in parent widget.
 *
 * @method
 * @chainable
 */
OO.ui.Widget.prototype.updateDisabled = function () {
	this.setDisabled( this.disabled );
	return this;
};

/**
 * Set the disabled state of the widget.
 *
 * This should probably change the widgets's appearance and prevent it from being used.
 *
 * @method
 * @param {boolean} disabled Disable widget
 * @chainable
 */
OO.ui.Widget.prototype.setDisabled = function ( disabled ) {
	var isDisabled;

	this.disabled = !!disabled;
	isDisabled = this.isDisabled();
	if ( isDisabled !== this.wasDisabled ) {
		this.$element.toggleClass( 'oo-ui-widget-disabled', isDisabled );
		this.emit( 'disable', isDisabled );
	}
	this.wasDisabled = isDisabled;
	return this;
};
