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
 *  use the 'default' key to specify the icon to be used when there is no icon in the user's language.
 */
OO.ui.IconedElement = function OoUiIconedElement( $icon, config ) {
	// Config intialization
	config = config || {};

	// Properties
	this.$icon = $icon;
	this.icon = null;

	// Initialization
	this.$icon.addClass( 'oo-ui-iconedElement-icon' );
	this.setIcon( config.icon );
};

/* Methods */

/**
 * Set the icon.
 *
 * @method
 * @param {Object|string} [value] Symbolic name of icon to use
 * @chainable
 */
OO.ui.IconedElement.prototype.setIcon = function ( value ) {
	var icon = OO.isPlainObject( value ) ? OO.ui.getLocalValue( value, null, 'default' ) : value;

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
