/**
 * OutlineOptionWidget is an item in an {@link OO.ui.OutlineSelectWidget OutlineSelectWidget}.
 *
 * Currently, this class is only used by {@link OO.ui.BookletLayout booklet layouts}, which contain
 * {@link OO.ui.PageLayout page layouts}. See {@link OO.ui.BookletLayout BookletLayout}
 * for an example.
 *
 * @class
 * @extends OO.ui.DecoratedOptionWidget
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {number} [level=0] Indentation level
 * @cfg {boolean} [movable=false] Allow modification from
 *  {@link OO.ui.OutlineControlsWidget outline controls}.
 * @cfg {boolean} [removable=false]
 */
OO.ui.OutlineOptionWidget = function OoUiOutlineOptionWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.OutlineOptionWidget.super.call( this, config );

	// Properties
	this.movable = !!config.movable;
	this.removable = !!config.removable;

	// Initialization
	this.$element.addClass( 'oo-ui-outlineOptionWidget' );
	this.setLevel( config.level );
};

/* Setup */

OO.inheritClass( OO.ui.OutlineOptionWidget, OO.ui.DecoratedOptionWidget );

/* Static Properties */

/**
 * @static
 * @inheritdoc
 */
OO.ui.OutlineOptionWidget.static.highlightable = true;

/**
 * @static
 * @inheritdoc
 */
OO.ui.OutlineOptionWidget.static.scrollIntoViewOnSelect = true;

/**
 * @static
 * @inheritable
 * @property {string}
 */
OO.ui.OutlineOptionWidget.static.levelClass = 'oo-ui-outlineOptionWidget-level-';

/**
 * @static
 * @inheritable
 * @property {number}
 */
OO.ui.OutlineOptionWidget.static.levels = 3;

/* Methods */

/**
 * Check if item is movable.
 *
 * Movability is used by {@link OO.ui.OutlineControlsWidget outline controls}.
 *
 * @return {boolean} Item is movable
 */
OO.ui.OutlineOptionWidget.prototype.isMovable = function () {
	return this.movable;
};

/**
 * Check if item is removable.
 *
 * Removability is used by {@link OO.ui.OutlineControlsWidget outline controls}.
 *
 * @return {boolean} Item is removable
 */
OO.ui.OutlineOptionWidget.prototype.isRemovable = function () {
	return this.removable;
};

/**
 * Get indentation level.
 *
 * @return {number} Indentation level
 */
OO.ui.OutlineOptionWidget.prototype.getLevel = function () {
	return this.level;
};

/**
 * Set movability.
 *
 * Movability is used by {@link OO.ui.OutlineControlsWidget outline controls}.
 *
 * @param {boolean} movable Item is movable
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.OutlineOptionWidget.prototype.setMovable = function ( movable ) {
	this.movable = !!movable;
	this.updateThemeClasses();
	return this;
};

/**
 * Set removability.
 *
 * Removability is used by {@link OO.ui.OutlineControlsWidget outline controls}.
 *
 * @param {boolean} removable Item is removable
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.OutlineOptionWidget.prototype.setRemovable = function ( removable ) {
	this.removable = !!removable;
	this.updateThemeClasses();
	return this;
};

/**
 * Set indentation level.
 *
 * @param {number} [level=0] Indentation level, in the range of [0,#maxLevel]
 * @chainable
 * @return {OO.ui.Widget} The widget, for chaining
 */
OO.ui.OutlineOptionWidget.prototype.setLevel = function ( level ) {
	if ( this.level === level ) {
		return this;
	}

	var levels = this.constructor.static.levels,
		levelClass = this.constructor.static.levelClass;

	if ( this.level !== undefined ) {
		this.$element.removeClass( levelClass + this.level );
	}
	this.level = level > 0 ? Math.min( level, levels - 1 ) : 0;
	this.$element.addClass( levelClass + this.level );
	this.updateThemeClasses();

	return this;
};
