/**
 * Element containing an icon.
 *
 * Icons are graphics, about the size of normal text. They can be used to aid the user in locating
 * a control or convey information in a more space efficient way. Icons should rarely be used
 * without labels; such as in a toolbar where space is at a premium or within a context where the
 * meaning is very clear to the user.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$icon] Icon node, assigned to #$icon, omit to use a generated `<span>`
 * @cfg {Object|string} [icon=''] Symbolic icon name, or map of icon names keyed by language ID;
 *  use the 'default' key to specify the icon to be used when there is no icon in the user's
 *  language
 * @cfg {string} [iconTitle] Icon title text or a function that returns text
 */
OO.ui.IconElement = function OoUiIconElement( config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$icon = null;
	this.icon = null;
	this.iconTitle = null;

	// Initialization
	this.setIcon( config.icon || this.constructor.static.icon );
	this.setIconTitle( config.iconTitle || this.constructor.static.iconTitle );
	this.setIconElement( config.$icon || this.$( '<span>' ) );
};

/* Setup */

OO.initClass( OO.ui.IconElement );

/* Static Properties */

/**
 * Icon.
 *
 * Value should be the unique portion of an icon CSS class name, such as 'up' for 'oo-ui-icon-up'.
 *
 * For i18n purposes, this property can be an object containing a `default` icon name property and
 * additional icon names keyed by language code.
 *
 * Example of i18n icon definition:
 *     { default: 'bold-a', en: 'bold-b', de: 'bold-f' }
 *
 * @static
 * @inheritable
 * @property {Object|string} Symbolic icon name, or map of icon names keyed by language ID;
 *  use the 'default' key to specify the icon to be used when there is no icon in the user's
 *  language
 */
OO.ui.IconElement.static.icon = null;

/**
 * Icon title.
 *
 * @static
 * @inheritable
 * @property {string|Function|null} Icon title text, a function that returns text or null for no
 *  icon title
 */
OO.ui.IconElement.static.iconTitle = null;

/* Methods */

/**
 * Set the icon element.
 *
 * If an element is already set, it will be cleaned up before setting up the new element.
 *
 * @param {jQuery} $icon Element to use as icon
 */
OO.ui.IconElement.prototype.setIconElement = function ( $icon ) {
	if ( this.$icon ) {
		this.$icon
			.removeClass( 'oo-ui-iconElement-icon oo-ui-icon-' + this.icon )
			.removeAttr( 'title' );
	}

	this.$icon = $icon
		.addClass( 'oo-ui-iconElement-icon' )
		.toggleClass( 'oo-ui-icon-' + this.icon, !!this.icon );
	if ( this.iconTitle !== null ) {
		this.$icon.attr( 'title', this.iconTitle );
	}
};

/**
 * Set icon name.
 *
 * @param {Object|string|null} icon Symbolic icon name, or map of icon names keyed by language ID;
 *  use the 'default' key to specify the icon to be used when there is no icon in the user's
 *  language, use null to remove icon
 * @chainable
 */
OO.ui.IconElement.prototype.setIcon = function ( icon ) {
	icon = OO.isPlainObject( icon ) ? OO.ui.getLocalValue( icon, null, 'default' ) : icon;
	icon = typeof icon === 'string' && icon.trim().length ? icon.trim() : null;

	if ( this.icon !== icon ) {
		if ( this.$icon ) {
			if ( this.icon !== null ) {
				this.$icon.removeClass( 'oo-ui-icon-' + this.icon );
			}
			if ( icon !== null ) {
				this.$icon.addClass( 'oo-ui-icon-' + icon );
			}
		}
		this.icon = icon;
	}

	this.$element.toggleClass( 'oo-ui-iconElement', !!this.icon );
	this.updateThemeClasses();

	return this;
};

/**
 * Set icon title.
 *
 * @param {string|Function|null} icon Icon title text, a function that returns text or null
 *  for no icon title
 * @chainable
 */
OO.ui.IconElement.prototype.setIconTitle = function ( iconTitle ) {
	iconTitle = typeof iconTitle === 'function' ||
		( typeof iconTitle === 'string' && iconTitle.length ) ?
			OO.ui.resolveMsg( iconTitle ) : null;

	if ( this.iconTitle !== iconTitle ) {
		this.iconTitle = iconTitle;
		if ( this.$icon ) {
			if ( this.iconTitle !== null ) {
				this.$icon.attr( 'title', iconTitle );
			} else {
				this.$icon.removeAttr( 'title' );
			}
		}
	}

	return this;
};

/**
 * Get icon name.
 *
 * @return {string} Icon name
 */
OO.ui.IconElement.prototype.getIcon = function () {
	return this.icon;
};

/**
 * Get icon title.
 *
 * @return {string} Icon title text
 */
OO.ui.IconElement.prototype.getIconTitle = function () {
	return this.iconTitle;
};
