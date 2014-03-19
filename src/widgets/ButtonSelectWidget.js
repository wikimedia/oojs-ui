/**
 * Create an OO.ui.ButtonSelect object.
 *
 * @class
 * @extends OO.ui.SelectWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.ButtonSelectWidget = function OoUiButtonSelectWidget( config ) {
	// Parent constructor
	OO.ui.ButtonSelectWidget.super.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonSelectWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.ButtonSelectWidget, OO.ui.SelectWidget );
