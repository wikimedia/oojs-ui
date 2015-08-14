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

	// Properties
	this.inputWidget = inputWidget; // For backwards compatibility
	this.$container = config.$container || this.inputWidget.$element;
	this.onWindowResizeHandler = this.onWindowResize.bind( this );

	// Initialization
	this.$element.addClass( 'oo-ui-floatingMenuSelectWidget' );
	// For backwards compatibility
	this.$element.addClass( 'oo-ui-textInputMenuSelectWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.FloatingMenuSelectWidget, OO.ui.MenuSelectWidget );

// For backwards compatibility
OO.ui.TextInputMenuSelectWidget = OO.ui.FloatingMenuSelectWidget;

/* Methods */

/**
 * Handle window resize event.
 *
 * @private
 * @param {jQuery.Event} e Window resize event
 */
OO.ui.FloatingMenuSelectWidget.prototype.onWindowResize = function () {
	this.position();
};

/**
 * @inheritdoc
 */
OO.ui.FloatingMenuSelectWidget.prototype.toggle = function ( visible ) {
	visible = visible === undefined ? !this.isVisible() : !!visible;

	var change = visible !== this.isVisible();

	if ( change && visible ) {
		// Make sure the width is set before the parent method runs.
		// After this we have to call this.position(); again to actually
		// position ourselves correctly.
		this.position();
	}

	// Parent method
	OO.ui.FloatingMenuSelectWidget.parent.prototype.toggle.call( this, visible );

	if ( change ) {
		if ( this.isVisible() ) {
			this.position();
			$( this.getElementWindow() ).on( 'resize', this.onWindowResizeHandler );
		} else {
			$( this.getElementWindow() ).off( 'resize', this.onWindowResizeHandler );
		}
	}

	return this;
};

/**
 * Position the menu.
 *
 * @private
 * @chainable
 */
OO.ui.FloatingMenuSelectWidget.prototype.position = function () {
	var $container = this.$container,
		pos = OO.ui.Element.static.getRelativePosition( $container, this.$element.offsetParent() );

	// Position under input
	pos.top += $container.height();
	this.$element.css( pos );

	// Set width
	this.setIdealSize( $container.width() );
	// We updated the position, so re-evaluate the clipping state
	this.clip();

	return this;
};
