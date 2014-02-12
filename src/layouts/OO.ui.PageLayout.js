/**
 * Page within an OO.ui.BookletLayout.
 *
 * @class
 * @extends OO.ui.PanelLayout
 *
 * @constructor
 * @param {string} name Unique symbolic name of page
 * @param {Object} [config] Configuration options
 * @param {string} [icon=''] Symbolic name of icon to display in outline
 * @param {string} [indicator=''] Symbolic name of indicator to display in outline
 * @param {string} [indicatorTitle=''] Description of indicator meaning to display in outline
 * @param {string} [label=''] Label to display in outline
 * @param {number} [level=0] Indentation level of item in outline
 * @param {boolean} [movable=false] Page should be movable using outline controls
 */
OO.ui.PageLayout = function OoUiPageLayout( name, config ) {
	// Configuration initialization
	config = $.extend( { 'scrollable': true }, config );

	// Parent constructor
	OO.ui.PanelLayout.call( this, config );

	// Properties
	this.name = name;
	this.icon = config.icon || '';
	this.indicator = config.indicator || '';
	this.indicatorTitle = OO.ui.resolveMsg( config.indicatorTitle ) || '';
	this.label = OO.ui.resolveMsg( config.label ) || '';
	this.level = config.level || 0;
	this.movable = !!config.movable;

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
 * Get page icon.
 *
 * @returns {string} Symbolic name of icon
 */
OO.ui.PageLayout.prototype.getIcon = function () {
	return this.icon;
};

/**
 * Get page indicator.
 *
 * @returns {string} Symbolic name of indicator
 */
OO.ui.PageLayout.prototype.getIndicator = function () {
	return this.indicator;
};

/**
 * Get page indicator label.
 *
 * @returns {string} Description of indicator meaning
 */
OO.ui.PageLayout.prototype.getIndicatorTitle = function () {
	return this.indicatorTitle;
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
