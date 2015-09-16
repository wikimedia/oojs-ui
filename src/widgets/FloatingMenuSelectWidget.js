/**
 * FloatingMenuSelectWidget is a menu that will stick under a specified
 * container, even when it is inserted elsewhere in the document (for example,
 * in a OO.ui.Window's $overlay). This is sometimes necessary to prevent the
 * menu from being clipped too aggresively.
 *
 * The menu's position is automatically calculated and maintained when the menu
 * is toggled or the window is resized.
 *
 * See OO.ui.ComboBoxWidget for an example of a widget that uses this class.
 *
 * @class
 * @extends OO.ui.MenuSelectWidget
 * @mixins OO.ui.mixin.FloatableElement
 *
 * @constructor
 * @param {OO.ui.Widget} [inputWidget] Widget to provide the menu for.
 *   Deprecated, omit this parameter and specify `$container` instead.
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$container=inputWidget.$element] Element to render menu under
 */
OO.ui.FloatingMenuSelectWidget = function OoUiFloatingMenuSelectWidget( inputWidget, config ) {
	// Allow 'inputWidget' parameter and config for backwards compatibility
	if ( OO.isPlainObject( inputWidget ) && config === undefined ) {
		config = inputWidget;
		inputWidget = config.inputWidget;
	}

	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.FloatingMenuSelectWidget.parent.call( this, config );

	// Properties (must be set before mixin constructors)
	this.inputWidget = inputWidget; // For backwards compatibility
	this.$container = config.$container || this.inputWidget.$element;

	// Mixins constructors
	OO.ui.mixin.FloatableElement.call( this, $.extend( {}, config, { $floatableContainer: this.$container } ) );

	// Initialization
	this.$element.addClass( 'oo-ui-floatingMenuSelectWidget' );
	// For backwards compatibility
	this.$element.addClass( 'oo-ui-textInputMenuSelectWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.FloatingMenuSelectWidget, OO.ui.MenuSelectWidget );
OO.mixinClass( OO.ui.FloatingMenuSelectWidget, OO.ui.mixin.FloatableElement );

// For backwards compatibility
OO.ui.TextInputMenuSelectWidget = OO.ui.FloatingMenuSelectWidget;

/* Methods */

/**
 * @inheritdoc
 */
OO.ui.FloatingMenuSelectWidget.prototype.toggle = function ( visible ) {
	var change;
	visible = visible === undefined ? !this.isVisible() : !!visible;
	change = visible !== this.isVisible();

	if ( change && visible ) {
		// Make sure the width is set before the parent method runs.
		this.setIdealSize( this.$container.width() );
	}

	// Parent method
	// This will call this.clip(), which is nonsensical since we're not positioned yet...
	OO.ui.FloatingMenuSelectWidget.parent.prototype.toggle.call( this, visible );

	if ( change ) {
		this.togglePositioning( this.isVisible() );
	}

	return this;
};
