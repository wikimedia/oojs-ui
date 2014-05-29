/**
 * Element with a button.
 *
 * @abstract
 * @class
 *
 * @constructor
 * @param {jQuery} $button Button node, assigned to #$button
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [frameless] Render button without a frame
 * @cfg {number} [tabIndex=0] Button's tab index, use -1 to prevent tab focusing
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

/* Setup */

OO.initClass( OO.ui.ButtonedElement );

/* Static Properties */

/**
 * Cancel mouse down events.
 *
 * @static
 * @inheritable
 * @property {boolean}
 */
OO.ui.ButtonedElement.static.cancelButtonMouseDownEvents = true;

/* Methods */

/**
 * Handles mouse down events.
 *
 * @param {jQuery.Event} e Mouse down event
 */
OO.ui.ButtonedElement.prototype.onMouseDown = function ( e ) {
	if ( this.isDisabled() || e.which !== 1 ) {
		return false;
	}
	// tabIndex should generally be interacted with via the property, but it's not possible to
	// reliably unset a tabIndex via a property so we use the (lowercase) "tabindex" attribute
	this.tabIndex = this.$button.attr( 'tabindex' );
	this.$button
		// Remove the tab-index while the button is down to prevent the button from stealing focus
		.removeAttr( 'tabindex' )
		.addClass( 'oo-ui-buttonedElement-pressed' );
	// Run the mouseup handler no matter where the mouse is when the button is let go, so we can
	// reliably reapply the tabindex and remove the pressed class
	this.getElementDocument().addEventListener( 'mouseup', this.onMouseUpHandler, true );
	// Prevent change of focus unless specifically configured otherwise
	if ( this.constructor.static.cancelButtonMouseDownEvents ) {
		return false;
	}
};

/**
 * Handles mouse up events.
 *
 * @param {jQuery.Event} e Mouse up event
 */
OO.ui.ButtonedElement.prototype.onMouseUp = function ( e ) {
	if ( this.isDisabled() || e.which !== 1 ) {
		return false;
	}
	this.$button
		// Restore the tab-index after the button is up to restore the button's accesssibility
		.attr( 'tabindex', this.tabIndex )
		.removeClass( 'oo-ui-buttonedElement-pressed' );
	// Stop listening for mouseup, since we only needed this once
	this.getElementDocument().removeEventListener( 'mouseup', this.onMouseUpHandler, true );
};

/**
 * Set active state.
 *
 * @param {boolean} [value] Make button active
 * @chainable
 */
OO.ui.ButtonedElement.prototype.setActive = function ( value ) {
	this.$button.toggleClass( 'oo-ui-buttonedElement-active', !!value );
	return this;
};
