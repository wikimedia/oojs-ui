/**
 * Menu for a text input widget.
 *
 * This menu is specially designed to be positioned beneath the text input widget. Even if the input
 * is in a different frame, the menu's position is automatically calculated and maintained when the
 * menu is toggled or the window is resized.
 *
 * @class
 * @extends OO.ui.MenuWidget
 *
 * @constructor
 * @param {OO.ui.TextInputWidget} input Text input widget to provide menu for
 * @param {Object} [config] Configuration options
 * @cfg {jQuery} [$container=input.$element] Element to render menu under
 */
OO.ui.TextInputMenuWidget = function OoUiTextInputMenuWidget( input, config ) {
	// Configuration intialization
	config = config || {};

	// Parent constructor
	OO.ui.TextInputMenuWidget.super.call( this, config );

	// Properties
	this.input = input;
	this.$container = config.$container || this.input.$element;
	this.onWindowResizeHandler = this.onWindowResize.bind( this );

	// Initialization
	this.$element.addClass( 'oo-ui-textInputMenuWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.TextInputMenuWidget, OO.ui.MenuWidget );

/* Methods */

/**
 * Handle window resize event.
 *
 * @param {jQuery.Event} e Window resize event
 */
OO.ui.TextInputMenuWidget.prototype.onWindowResize = function () {
	this.position();
};

/**
 * @inheritdoc
 */
OO.ui.TextInputMenuWidget.prototype.toggle = function ( visible ) {
	visible = visible === undefined ? !this.isVisible() : !!visible;

	var change = visible !== this.isVisible();

	if ( change && visible ) {
		// Make sure the width is set before the parent method runs.
		// After this we have to call this.position(); again to actually
		// position ourselves correctly.
		this.position();
	}

	// Parent method
	OO.ui.TextInputMenuWidget.super.prototype.toggle.call( this, visible );

	if ( change ) {
		if ( this.isVisible() ) {
			this.position();
			this.$( this.getElementWindow() ).on( 'resize', this.onWindowResizeHandler );
		} else {
			this.$( this.getElementWindow() ).off( 'resize', this.onWindowResizeHandler );
		}
	}

	return this;
};

/**
 * Position the menu.
 *
 * @chainable
 */
OO.ui.TextInputMenuWidget.prototype.position = function () {
	var $container = this.$container,
		pos = OO.ui.Element.getRelativePosition( $container, this.$element.offsetParent() );

	// Position under input
	pos.top += $container.height();
	this.$element.css( pos );

	// Set width
	this.setIdealSize( $container.width() );
	// We updated the position, so re-evaluate the clipping state
	this.clip();

	return this;
};
