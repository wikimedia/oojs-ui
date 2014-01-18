/**
 * Element with a title.
 *
 * @class
 * @abstract
 *
 * @constructor
 * @param {jQuery} $label Titled node, assigned to #$titled
 * @param {Object} [config] Configuration options
 * @cfg {string} [title=''] Title text
 */
OO.ui.TitledElement = function OoUiTitledElement( $titled, config ) {
	// Config intialization
	config = config || {};

	// Properties
	this.$titled = $titled;

	// Initialization
	this.setTitle( config.title );
};

/* Methods */

/**
 * Set the label.
 *
 * @method
 * @param {string} [value] Title text
 * @chainable
 */
OO.ui.TitledElement.prototype.setTitle = function ( value ) {
	if ( typeof value === 'string' && value.length ) {
		this.$titled.attr( 'title', value );
	} else {
		this.$titled.removeAttr( 'title' );
	}

	return this;
};
