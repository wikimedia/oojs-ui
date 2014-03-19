/**
 * Create an OO.ui.OutlineWidget object.
 *
 * @class
 * @extends OO.ui.SelectWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.OutlineWidget = function OoUiOutlineWidget( config ) {
	// Config intialization
	config = config || {};

	// Parent constructor
	OO.ui.OutlineWidget.super.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-outlineWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.OutlineWidget, OO.ui.SelectWidget );
