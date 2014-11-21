/**
 * Select widget containing radio button options.
 *
 * Use together with OO.ui.RadioOptionWidget.
 *
 * @class
 * @extends OO.ui.SelectWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.RadioSelectWidget = function OoUiRadioSelectWidget( config ) {
	// Parent constructor
	OO.ui.RadioSelectWidget.super.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-radioSelectWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.RadioSelectWidget, OO.ui.SelectWidget );
