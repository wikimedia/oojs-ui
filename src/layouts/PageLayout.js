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
	OO.ui.PageLayout.super.call( this, config );

	// Properties
	this.name = name;
	this.outlineItem = config.outlineItem || null;
	this.active = false;

	// Initialization
	this.$element.addClass( 'oo-ui-pageLayout' );
};

/* Inheritance */

OO.inheritClass( OO.ui.PageLayout, OO.ui.PanelLayout );

/* Events */

/**
 * @event active
 * @param {boolean} active Page is active
 */

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
 * Check if page is active.
 *
 * @returns {boolean} Page is active
 */
OO.ui.PageLayout.prototype.isActive = function () {
	return this.active;
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

/**
 * Set page active state.
 *
 * @param {boolean} Page is active
 * @fires active
 */
OO.ui.PageLayout.prototype.setActive = function ( active ) {
	active = !!active;

	if ( active !== this.active ) {
		this.active = active;
		this.$element.toggleClass( 'oo-ui-pageLayout-active', active );
		this.emit( 'active', this.active );
	}
};
