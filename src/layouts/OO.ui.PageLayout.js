/**
 * Page within an OO.ui.BookletLayout.
 *
 * @class
 * @extends OO.ui.PanelLayout
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @param {string} [icon=''] Symbolic name of icon to display in outline
 * @param {string} [label=''] Label to display in outline
 * @param {number} [level=0] Indentation level of item in outline
 * @param {boolean} [movable=false] Page should be movable using outline controls
 */
OO.ui.PageLayout = function OoUiPageLayout( config ) {
	// Configuration initialization
	config = $.extend( { 'scrollable': true }, config );

	// Parent constructor
	OO.ui.PanelLayout.call( this, config );

	// Properties
	this.icon = config.icon || '';
	this.label = config.label || '';
	this.level = config.level || 0;
	this.movable = !!config.movable;
};

/* Inheritance */

OO.inheritClass( OO.ui.PageLayout, OO.ui.PanelLayout );

/* Methods */

/**
 * Get page icon.
 *
 * @returns {string} Symbolic name of icon
 */
OO.ui.PageLayout.prototype.getIcon = function () {
	return this.icon;
};

/**
 * Get page label.
 *
 * @returns {string} Label text
 */
OO.ui.PageLayout.prototype.getLabel = function () {
	return this.label;
};

/**
 * Get outline item indentation level.
 *
 * @returns {number} Indentation level
 */
OO.ui.PageLayout.prototype.getLevel = function () {
	return this.level;
};

/**
 * Check if page is movable using outline controls.
 *
 * @returns {boolean} Page is movable
 */
OO.ui.PageLayout.prototype.isMovable = function () {
	return this.movable;
};
