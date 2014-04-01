/**
 * Creates an OO.ui.MenuItemWidget object.
 *
 * @class
 * @extends OO.ui.OptionWidget
 *
 * @constructor
 * @param {Mixed} data Item data
 * @param {Object} [config] Configuration options
 */
OO.ui.MenuItemWidget = function OoUiMenuItemWidget( data, config ) {
	// Configuration initialization
	config = $.extend( { 'icon': 'check' }, config );

	// Parent constructor
	OO.ui.MenuItemWidget.super.call( this, data, config );

	// Initialization
	this.$element.addClass( 'oo-ui-menuItemWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.MenuItemWidget, OO.ui.OptionWidget );
