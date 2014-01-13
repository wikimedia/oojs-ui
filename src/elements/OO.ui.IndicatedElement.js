/**
 * Element containing an indicator.
 *
 * @class
 * @abstract
 *
 * @constructor
 * @param {jQuery} $indicator Indicator node, assigned to #$indicator
 * @param {Object} [config] Configuration options
 * @cfg {string} [indicator=''] Symbolic indicator name
 */
OO.ui.IndicatedElement = function OoUiIndicatedElement( $indicator, config ) {
	// Config intialization
	config = config || {};

	// Properties
	this.$indicator = $indicator;
	this.indicator = null;

	// Initialization
	this.$indicator.addClass( 'oo-ui-indicatedElement-indicator' );
	this.setIndicator( config.indicator );
};

/* Methods */

/**
 * Set the indicator.
 *
 * @method
 * @param {string} [value] Symbolic name of indicator to use
 * @chainable
 */
OO.ui.IndicatedElement.prototype.setIndicator = function ( value ) {
	if ( this.indicator ) {
		this.$indicator.removeClass( 'oo-ui-indicator-' + this.indicator );
		this.indicator = null;
	}
	if ( typeof value === 'string' ) {
		value = value.trim();
		if ( value.length ) {
			this.$indicator.addClass( 'oo-ui-indicator-' + value );
			this.indicator = value;
		}
	}
	this.$element.toggleClass( 'oo-ui-indicatedElement', !!this.indicator );

	return this;
};
