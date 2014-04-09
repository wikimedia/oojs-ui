/**
 * Menu for a text input widget.
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
	// Parent constructor
	OO.ui.TextInputMenuWidget.super.call( this, config );

	// Properties
	this.input = input;
	this.$container = config.$container || this.input.$element;
	this.onWindowResizeHandler = OO.ui.bind( this.onWindowResize, this );

	// Initialization
	this.$element.addClass( 'oo-ui-textInputMenuWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.TextInputMenuWidget, OO.ui.MenuWidget );

/* Methods */

/**
 * Handle window resize event.
 *
 * @method
 * @param {jQuery.Event} e Window resize event
 */
OO.ui.TextInputMenuWidget.prototype.onWindowResize = function () {
	this.position();
};

/**
 * Shows the menu.
 *
 * @method
 * @chainable
 */
OO.ui.TextInputMenuWidget.prototype.show = function () {
	// Parent method
	OO.ui.MenuWidget.prototype.show.call( this );

	this.position();
	this.$( this.getElementWindow() ).on( 'resize', this.onWindowResizeHandler );
	return this;
};

/**
 * Hides the menu.
 *
 * @method
 * @chainable
 */
OO.ui.TextInputMenuWidget.prototype.hide = function () {
	// Parent method
	OO.ui.MenuWidget.prototype.hide.call( this );

	this.$( this.getElementWindow() ).off( 'resize', this.onWindowResizeHandler );
	return this;
};

/**
 * Positions the menu.
 *
 * @method
 * @chainable
 */
OO.ui.TextInputMenuWidget.prototype.position = function () {
	var frameOffset,
		$container = this.$container,
		dimensions = $container.offset();

	// Position under input
	dimensions.top += $container.height();

	// Compensate for frame position if in a differnt frame
	if ( this.input.$.frame && this.input.$.context !== this.$element[0].ownerDocument ) {
		frameOffset = OO.ui.Element.getRelativePosition(
			this.input.$.frame.$element, this.$element.offsetParent()
		);
		dimensions.left += frameOffset.left;
		dimensions.top += frameOffset.top;
	} else {
		// Fix for RTL (for some reason, no need to fix if the frameoffset is set)
		if ( this.$element.css( 'direction' ) === 'rtl' ) {
			dimensions.right = this.$element.parent().position().left -
				dimensions.width - dimensions.left;
			// Erase the value for 'left':
			delete dimensions.left;
		}
	}

	this.$element.css( dimensions );
	this.setIdealSize( $container.width() );
	return this;
};
