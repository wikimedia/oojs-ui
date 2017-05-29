/**
 * Widgets are compositions of one or more OOjs UI elements that users can both view
 * and interact with. All widgets can be configured and modified via a standard API,
 * and their state can change dynamically according to a model.
 *
 * @abstract
 * @class
 * @extends OO.ui.Element
 * @mixins OO.EventEmitter
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [disabled=false] Disable the widget. Disabled widgets cannot be used and their
 *  appearance reflects this state.
 */
OO.ui.Widget = function OoUiWidget( config ) {
	// Initialize config
	config = $.extend( { disabled: false }, config );

	// Parent constructor
	OO.ui.Widget.parent.call( this, config );

	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
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
 *
 * A 'disable' event is emitted when the disabled state of the widget changes
 * (i.e. on disable **and** enable).
 *
 * @param {boolean} disabled Widget is disabled
 */

/**
 * @event toggle
 *
 * A 'toggle' event is emitted when the visibility of the widget changes.
 *
 * @param {boolean} visible Widget is visible
 */

/* Methods */

/**
 * Check if the widget is disabled.
 *
 * @return {boolean} Widget is disabled
 */
OO.ui.Widget.prototype.isDisabled = function () {
	return this.disabled;
};

/**
 * Set the 'disabled' state of the widget.
 *
 * When a widget is disabled, it cannot be used and its appearance is updated to reflect this state.
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
 * Update the disabled state, in case of changes in parent widget.
 *
 * @chainable
 */
OO.ui.Widget.prototype.updateDisabled = function () {
	this.setDisabled( this.disabled );
	return this;
};

/**
 * Get an ID of a labelable node which is part of this widget, if any, to be used for `<label for>`
 * value.
 *
 * If this function returns null, the widget should have a meaningful #simulateLabelClick method
 * instead.
 *
 * @return {string|null} The ID of the labelable element
 */
OO.ui.Widget.prototype.getInputId = function () {
	return null;
};

/**
 * Simulate the behavior of clicking on a label (a HTML `<label>` element) bound to this input.
 * HTML only allows `<label>` to act on specific "labelable" elements; complex widgets might need to
 * override this method to provide intuitive, accessible behavior.
 *
 * By default, this does nothing. OO.ui.mixin.TabIndexedElement overrides it for focusable widgets.
 * Individual widgets may override it too.
 *
 * This method is called by OO.ui.LabelWidget and OO.ui.FieldLayout. It should not be called
 * directly.
 */
OO.ui.Widget.prototype.simulateLabelClick = function () {
};
