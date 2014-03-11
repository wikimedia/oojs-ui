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
	// Parent constructor
	OO.ui.InputWidget.call( this, config );

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
	value = !!value;
	if ( this.value !== value ) {
		this.value = value;
		this.$input.prop( 'checked', this.value );
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
			this.setValue( this.$input.prop( 'checked' ) );
		}, this ) );
	}
};
