/**
 * Element containing an indicator.
 *
 * Indicators are graphics, smaller than normal text. They can be used to describe unique status or
 * behavior. Indicators should only be used in exceptional cases; such as a button that opens a menu
 * instead of performing an action directly, or an item in a list which has errors that need to be
 * resolved.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {jQuery} $indicator Indicator node, assigned to #$indicator
 * @param {Object} [config] Configuration options
 * @cfg {string} [indicator] Symbolic indicator name
 * @cfg {string} [indicatorTitle] Indicator title text or a function that return text
 */
OO.ui.IndicatedElement = function OoUiIndicatedElement( $indicator, config ) {
	// Config intialization
	config = config || {};

	// Properties
	this.$indicator = $indicator;
	this.indicator = null;
	this.indicatorLabel = null;

	// Initialization
	this.$indicator.addClass( 'oo-ui-indicatedElement-indicator' );
	this.setIndicator( config.indicator || this.constructor.static.indicator );
	this.setIndicatorTitle( config.indicatorTitle  || this.constructor.static.indicatorTitle );
};

/* Setup */

OO.initClass( OO.ui.IndicatedElement );

/* Static Properties */

/**
 * indicator.
 *
 * @static
 * @inheritable
 * @property {string|null} Symbolic indicator name or null for no indicator
 */
OO.ui.IndicatedElement.static.indicator = null;

/**
 * Indicator title.
 *
 * @static
 * @inheritable
 * @property {string|Function|null} Indicator title text, a function that return text or null for no
 *  indicator title
 */
OO.ui.IndicatedElement.static.indicatorTitle = null;

/* Methods */

/**
 * Set indicator.
 *
 * @param {string|null} indicator Symbolic name of indicator to use or null for no indicator
 * @chainable
 */
OO.ui.IndicatedElement.prototype.setIndicator = function ( indicator ) {
	if ( this.indicator ) {
		this.$indicator.removeClass( 'oo-ui-indicator-' + this.indicator );
		this.indicator = null;
	}
	if ( typeof indicator === 'string' ) {
		indicator = indicator.trim();
		if ( indicator.length ) {
			this.$indicator.addClass( 'oo-ui-indicator-' + indicator );
			this.indicator = indicator;
		}
	}
	this.$element.toggleClass( 'oo-ui-indicatedElement', !!this.indicator );

	return this;
};

/**
 * Set indicator label.
 *
 * @param {string|Function|null} indicator Indicator title text, a function that return text or null
 *  for no indicator title
 * @chainable
 */
OO.ui.IndicatedElement.prototype.setIndicatorTitle = function ( indicatorTitle ) {
	this.indicatorTitle = indicatorTitle = OO.ui.resolveMsg( indicatorTitle );

	if ( typeof indicatorTitle === 'string' && indicatorTitle.length ) {
		this.$indicator.attr( 'title', indicatorTitle );
	} else {
		this.$indicator.removeAttr( 'title' );
	}

	return this;
};

/**
 * Get indicator.
 *
 * @return {string} title Symbolic name of indicator
 */
OO.ui.IndicatedElement.prototype.getIndicator = function () {
	return this.indicator;
};

/**
 * Get indicator title.
 *
 * @return {string} Indicator title text
 */
OO.ui.IndicatedElement.prototype.getIndicatorTitle = function () {
	return this.indicatorTitle;
};
