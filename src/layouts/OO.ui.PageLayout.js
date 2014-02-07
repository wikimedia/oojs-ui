/**
 * Page within an OO.ui.BookletLayout.
 *
 * @class
 * @extends OO.ui.PanelLayout
 *
 * @constructor
 * @param {string} name Unique symbolic name of page
 * @param {Object} [config] Configuration options
 * @param {string} [outlineItem] Outline item widget
 */
OO.ui.PageLayout = function OoUiPageLayout( name, config ) {
	// Configuration initialization
	config = $.extend( { 'scrollable': true }, config );

	// Parent constructor
	OO.ui.PanelLayout.call( this, config );

	// Properties
	this.name = name;
	this.outlineItem = config.outlineItem || null;

	// Initialization
	this.$element.addClass( 'oo-ui-pageLayout' );
};

/* Inheritance */

OO.inheritClass( OO.ui.PageLayout, OO.ui.PanelLayout );

/* Methods */

/**
 * Get page name.
 *
 * @returns {string} Symbolic name of page
 */
OO.ui.PageLayout.prototype.getName = function () {
	return this.name;
};

/**
 * Get outline item.
 *
 * @returns {OO.ui.OutlineItemWidget|null} Outline item widget
 */
OO.ui.PageLayout.prototype.getOutlineItem = function () {
	return this.outlineItem;
};

/**
 * Get outline item.
 *
 * @param {OO.ui.OutlineItemWidget|null} outlineItem Outline item widget, null to clear
 * @chainable
 */
OO.ui.PageLayout.prototype.setOutlineItem = function ( outlineItem ) {
	this.outlineItem = outlineItem;
	return this;
};
