/**
 * Layout with an HTML form.
 *
 * @class
 * @extends OO.ui.Layout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.FormLayout = function OoUiFormLayout( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.FormLayout.super.call( this, config );

	// Events
	this.$element.on( 'submit', this.onFormSubmit.bind( this ) );

	// Initialization
	this.$element.addClass( 'oo-ui-formLayout' );
};

/* Setup */

OO.inheritClass( OO.ui.FormLayout, OO.ui.Layout );

/* Events */

/**
 * @event submit
 */

/* Static Properties */

OO.ui.FormLayout.static.tagName = 'form';

/* Methods */

/**
 * Handle form submit events.
 *
 * @param {jQuery.Event} e Submit event
 * @fires submit
 */
OO.ui.FormLayout.prototype.onFormSubmit = function () {
	this.emit( 'submit' );
	return false;
};
