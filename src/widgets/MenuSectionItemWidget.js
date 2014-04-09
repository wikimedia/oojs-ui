/**
 * Menu section item widget.
 *
 * Use with OO.ui.MenuWidget.
 *
 * @class
 * @extends OO.ui.OptionWidget
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

OO.inheritClass( OO.ui.MenuSectionItemWidget, OO.ui.OptionWidget );

/* Static Properties */

OO.ui.MenuSectionItemWidget.static.selectable = false;

OO.ui.MenuSectionItemWidget.static.highlightable = false;
