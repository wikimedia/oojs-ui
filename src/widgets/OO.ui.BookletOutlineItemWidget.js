/**
 * Creates an OO.ui.BookletOutlineItemWidget object.
 *
 * @class
 * @extends OO.ui.OutlineItemWidget
 *
 * @constructor
 * @param {Mixed} data Item data
 * @param {Object} [config] Configuration options
 */
OO.ui.BookletOutlineItemWidget = function OoUiBookletOutlineItemWidget( data, page, config ) {
	// Configuration intialization
	config = $.extend( {
		'label': page.getLabel() || data,
		'level': page.getLevel(),
		'icon': page.getIcon(),
		'indicator': page.getIndicator(),
		'indicatorLabel': page.getIndicatorLabel(),
		'movable': page.isMovable()
	}, config );

	// Parent constructor
	OO.ui.OutlineItemWidget.call( this, data, config );

	// Initialization
	this.$element.addClass( 'oo-ui-bookletOutlineItemWidget' );
};

/* Inheritance */

OO.inheritClass( OO.ui.BookletOutlineItemWidget, OO.ui.OutlineItemWidget );
