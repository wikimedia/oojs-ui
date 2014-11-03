/**
 * Structured list of items.
 *
 * Use with OO.ui.OutlineItemWidget.
 *
 * @class
 * @extends OO.ui.SelectWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
OO.ui.OutlineWidget = function OoUiOutlineWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.OutlineWidget.super.call( this, config );

	// Initialization
	this.$element.addClass( 'oo-ui-outlineWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.OutlineWidget, OO.ui.SelectWidget );
