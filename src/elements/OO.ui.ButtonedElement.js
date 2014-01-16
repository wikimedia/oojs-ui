/**
 * Element with a button.
 *
 * @class
 * @abstract
 *
 * @constructor
 * @param {jQuery} $button Button node, assigned to #$button
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [frameless] Render button without a frame
 * @cfg {number} [tabIndex] Button's tab index
 */
OO.ui.ButtonedElement = function OoUiButtonedElement( $button, config ) {
	// Configuration initialization
	config = config || {};

	// Properties
	this.$button = $button;
	this.tabIndex = null;
	this.active = false;
	this.onMouseUpHandler = OO.ui.bind( this.onMouseUp, this );

	// Events
	this.$button.on( 'mousedown', OO.ui.bind( this.onMouseDown, this ) );

	// Initialization
	this.$element.addClass( 'oo-ui-buttonedElement' );
	this.$button
		.addClass( 'oo-ui-buttonedElement-button' )
		.attr( 'role', 'button' )
		.prop( 'tabIndex', config.tabIndex || 0 );
	if ( config.frameless ) {
		this.$element.addClass( 'oo-ui-buttonedElement-frameless' );
	} else {
		this.$element.addClass( 'oo-ui-buttonedElement-framed' );
	}
};

/* Methods */

/**
 * Handles mouse down events.
 *
 * @method
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.ButtonedElement.prototype.onMouseDown = function () {
	this.tabIndex = this.$button.attr( 'tabIndex' );
	// Remove the tab-index while the button is down to prevent the button from stealing focus
	this.$button.removeAttr( 'tabIndex' );
	this.getElementDocument().addEventListener( 'mouseup', this.onMouseUpHandler, true );
};

/**
 * Handles mouse up events.
 *
 * @method
 * @param {jQuery.Event} e Mouse up event
 */
OO.ui.ButtonedElement.prototype.onMouseUp = function () {
	// Restore the tab-index after the button is up to restore the button's accesssibility
	this.$button.attr( 'tabIndex', this.tabIndex );
	this.getElementDocument().removeEventListener( 'mouseup', this.onMouseUpHandler, true );
};

/**
 * Set active state.
 *
 * @method
 * @param {boolean} [value] Make button active
 * @chainable
 */
OO.ui.ButtonedElement.prototype.setActive = function ( value ) {
	this.$element.toggleClass( 'oo-ui-buttonedElement-active', !!value );
	return this;
};
