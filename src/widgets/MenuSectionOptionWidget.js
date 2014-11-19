/**
 * Section to group one or more items in a OO.ui.MenuSelectWidget.
 *
 * @class
 * @extends OO.ui.DecoratedOptionWidget
 *
 * @constructor
 * @param {Mixed} data Item data
 * @param {Object} [config] Configuration options
 */
OO.ui.MenuSectionOptionWidget = function OoUiMenuSectionOptionWidget( data, config ) {
	// Parent constructor
	OO.ui.MenuSectionOptionWidget.super.call( this, data, config );

	// Initialization
	this.$element.addClass( 'oo-ui-menuSectionOptionWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.MenuSectionOptionWidget, OO.ui.DecoratedOptionWidget );

/* Static Properties */

OO.ui.MenuSectionOptionWidget.static.selectable = false;

OO.ui.MenuSectionOptionWidget.static.highlightable = false;
