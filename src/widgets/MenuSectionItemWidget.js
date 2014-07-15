/**
 * Section to group one or more items in a OO.ui.MenuWidget.
 *
 * @class
 * @extends OO.ui.DecoratedOptionWidget
 *
 * @constructor
 * @param {Mixed} data Item data
 * @param {Object} [config] Configuration options
 */
OO.ui.MenuSectionItemWidget = function OoUiMenuSectionItemWidget( data, config ) {
	// Parent constructor
	OO.ui.MenuSectionItemWidget.super.call( this, data, config );

	// Initialization
	this.$element.addClass( 'oo-ui-menuSectionItemWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.MenuSectionItemWidget, OO.ui.DecoratedOptionWidget );

/* Static Properties */

OO.ui.MenuSectionItemWidget.static.selectable = false;

OO.ui.MenuSectionItemWidget.static.highlightable = false;
