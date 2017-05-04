/**
 * FloatingMenuSelectWidget was a menu that would stick under a specified
 * container, even when it is inserted elsewhere in the document.
 * This functionality is now included in MenuSelectWidget, and FloatingMenuSelectWidget
 * is preserved for backwards-compatibility.
 *
 * @class
 * @extends OO.ui.MenuSelectWidget
 * @deprecated since v0.21.3, use MenuSelectWidget instead.
 *
 * @constructor
 * @param {OO.ui.Widget} [inputWidget] Widget to provide the menu for.
 *   Deprecated, omit this parameter and specify `$container` instead.
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$container=inputWidget.$element] Element to render menu under
 */
OO.ui.FloatingMenuSelectWidget = function OoUiFloatingMenuSelectWidget( inputWidget, config ) {
	OO.ui.warnDeprecation( 'FloatingMenuSelectWidget is deprecated. Use the MenuSelectWidget instead.' );

	// Allow 'inputWidget' parameter and config for backwards compatibility
	if ( OO.isPlainObject( inputWidget ) && config === undefined ) {
		config = inputWidget;
		inputWidget = config.inputWidget;
	}

	// Configuration initialization
	config = config || {};

	// Properties
	this.inputWidget = inputWidget; // For backwards compatibility
	this.$container = config.$floatableContainer || config.$container || this.inputWidget.$element;

	// Parent constructor
	OO.ui.FloatingMenuSelectWidget.parent.call( this, $.extend( {}, config, { $floatableContainer: this.$container } ) );

	// Initialization
	this.$element.addClass( 'oo-ui-floatingMenuSelectWidget' );
	// For backwards compatibility
	this.$element.addClass( 'oo-ui-textInputMenuSelectWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.FloatingMenuSelectWidget, OO.ui.MenuSelectWidget );
