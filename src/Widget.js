/**
 * User interface control.
 *
 * @abstract
 * @class
 * @extends OO.ui.Element
 * @mixins OO.EventEmitter
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [disabled=false] Disable
 */
OO.ui.Widget = function OoUiWidget( config ) {
	// Initialize config
	config = $.extend( { disabled: false }, config );

	// Parent constructor
	OO.ui.Widget.super.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.visible = true;
	this.disabled = null;
	this.wasDisabled = null;

	// Initialization
	this.$element.addClass( 'oo-ui-widget' );
	this.setDisabled( !!config.disabled );
};

/* Setup */

OO.inheritClass( OO.ui.Widget, OO.ui.Element );
OO.mixinClass( OO.ui.Widget, OO.EventEmitter );

/* Events */

/**
 * @event disable
 * @param {boolean} disabled Widget is disabled
 */

/**
 * @event toggle
 * @param {boolean} visible Widget is visible
 */

/* Methods */

/**
 * Check if the widget is disabled.
 *
 * @return {boolean} Button is disabled
 */
OO.ui.Widget.prototype.isDisabled = function () {
	return this.disabled;
};

/**
 * Check if widget is visible.
 *
 * @return {boolean} Widget is visible
 */
OO.ui.Widget.prototype.isVisible = function () {
	return this.visible;
};

/**
 * Set the disabled state of the widget.
 *
 * This should probably change the widgets' appearance and prevent it from being used.
 *
 * @param {boolean} disabled Disable widget
 * @chainable
 */
OO.ui.Widget.prototype.setDisabled = function ( disabled ) {
	var isDisabled;

	this.disabled = !!disabled;
	isDisabled = this.isDisabled();
	if ( isDisabled !== this.wasDisabled ) {
		this.$element.toggleClass( 'oo-ui-widget-disabled', isDisabled );
		this.$element.toggleClass( 'oo-ui-widget-enabled', !isDisabled );
		this.$element.attr( 'aria-disabled', isDisabled.toString() );
		this.emit( 'disable', isDisabled );
		this.updateThemeClasses();
	}
	this.wasDisabled = isDisabled;

	return this;
};

/**
 * Toggle visibility of widget.
 *
 * @param {boolean} [show] Make widget visible, omit to toggle visibility
 * @fires visible
 * @chainable
 */
OO.ui.Widget.prototype.toggle = function ( show ) {
	show = show === undefined ? !this.visible : !!show;

	if ( show !== this.isVisible() ) {
		this.visible = show;
		this.$element.toggle( show );
		this.emit( 'toggle', show );
	}

	return this;
};

/**
 * Update the disabled state, in case of changes in parent widget.
 *
 * @chainable
 */
OO.ui.Widget.prototype.updateDisabled = function () {
	this.setDisabled( this.disabled );
	return this;
};
