/**
 * Creates an OO.ui.CheckboxInputWidget object.
 *
 * @class
 * @extends OO.ui.InputWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.CheckboxInputWidget = function OoUiCheckboxInputWidget( config ) {
	config = config || {};

	// Parent constructor
	OO.ui.InputWidget.call( this, config );

	this.value = false;

	// Initialization
	this.$element.addClass( 'oo-ui-checkboxInputWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.CheckboxInputWidget, OO.ui.InputWidget );

/* Events */

/* Methods */

/**
 * Get input element.
 *
 * @returns {jQuery} Input element
 */
OO.ui.CheckboxInputWidget.prototype.getInputElement = function () {
	return this.$( '<input type="checkbox" />' );
};

/**
 * Get checked state of the checkbox
 *
 * @returns {boolean} If the checkbox is checked
 */
OO.ui.CheckboxInputWidget.prototype.getValue = function () {
	return this.value;
};

/**
 * Set value
 */
OO.ui.CheckboxInputWidget.prototype.setValue = function ( value ) {
	if ( this.value !== value ) {
		this.value = !!value;
		this.$element.attr( 'checked', this.value );
		this.emit( 'change', this.value );
	}
};

/**
 * @inheritdoc
 */
OO.ui.CheckboxInputWidget.prototype.onEdit = function () {
	if ( !this.disabled ) {
		// Allow the stack to clear so the value will be updated
		setTimeout( OO.ui.bind( function () {
			this.setValue( this.$input.attr( 'checked' ) );
		}, this ) );
	}
};