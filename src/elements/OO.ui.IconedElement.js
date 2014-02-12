/**
 * Element containing an icon.
 *
 * @class
 * @abstract
 *
 * @constructor
 * @param {jQuery} $icon Icon node, assigned to #$icon
 * @param {Object} [config] Configuration options
 * @cfg {Object|string} [icon=''] Symbolic icon name, or map of icon names keyed by language ID;
 *  use the 'default' key to specify the icon to be used when there is no icon in the user's
 *  language
 */
OO.ui.IconedElement = function OoUiIconedElement( $icon, config ) {
	// Config intialization
	config = config || {};

	// Properties
	this.$icon = $icon;
	this.icon = null;

	// Initialization
	this.$icon.addClass( 'oo-ui-iconedElement-icon' );
	this.setIcon( config.icon || this.constructor.static.indicator  );
};

/* Static Properties */

OO.ui.IconedElement.static = {};

/**
 * Icon.
 *
 * Value should be the unique portion of an icon CSS class name, such as 'up' for 'oo-ui-icon-up'.
 *
 * For i18n purposes, this property can be an object containing a `default` icon name property and
 * additional icon names keyed by language code.
 *
 * Example of i18n icon definition:
 *     { 'default': 'bold-a', 'en': 'bold-b', 'de': 'bold-f' }
 *
 * @static
 * @inheritable
 * @property {Object|string} Symbolic icon name, or map of icon names keyed by language ID;
 *  use the 'default' key to specify the icon to be used when there is no icon in the user's
 *  language
 */
OO.ui.IconedElement.static.icon = null;

/* Methods */

/**
 * Set icon.
 *
 * @method
 * @param {Object|string} icon Symbolic icon name, or map of icon names keyed by language ID;
 *  use the 'default' key to specify the icon to be used when there is no icon in the user's
 *  language
 * @chainable
 */
OO.ui.IconedElement.prototype.setIcon = function ( icon ) {
	icon = OO.isPlainObject( icon ) ? OO.ui.getLocalValue( icon, null, 'default' ) : icon;

	if ( this.icon ) {
		this.$icon.removeClass( 'oo-ui-icon-' + this.icon );
	}
	if ( typeof icon === 'string' ) {
		icon = icon.trim();
		if ( icon.length ) {
			this.$icon.addClass( 'oo-ui-icon-' + icon );
			this.icon = icon;
		}
	}
	this.$element.toggleClass( 'oo-ui-iconedElement', !!this.icon );

	return this;
};

/**
 * Get icon.
 *
 * @method
 * @returns {string} Icon
 */
OO.ui.IconedElement.prototype.getIcon = function () {
	return this.icon;
};
